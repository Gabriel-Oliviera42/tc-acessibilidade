import json
import time
import urllib.parse
from datetime import datetime, timezone, timedelta

from axe_playwright_python.async_playwright import Axe
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

from core.config import settings
from core.logging_config import get_logger
from database import colecao_analises


logger = get_logger("Analisador")


def log_motor(mensagem: str) -> None:
    logger.info(mensagem)


MENSAGEM_ERRO_ANALISE = (
    "Nao conseguimos concluir a analise deste site agora. "
    "Ele pode estar demorando demais para responder, bloqueando navegadores "
    "automaticos ou exigindo mais recursos do que o servidor disponivel. "
    "Tente novamente mais tarde ou teste outra URL."
)


def montar_erro_analise(codigo: str, mensagem: str, detalhe_tecnico: str = "") -> dict:
    return {
        "status": "erro",
        "codigo_erro": codigo,
        "mensagem": mensagem,
        "error": mensagem,
        "detalhe_tecnico": detalhe_tecnico,
    }


async def executar_analise_completa(url: str):
    tempo_inicio_total = time.time()

    log_motor("Iniciando analise")
    log_motor(f"URL solicitada: {url}")

    parsed_url = urllib.parse.urlparse(url)
    if parsed_url.scheme not in ["http", "https"]:
        log_motor("ABORTADO: esquema HTTP/HTTPS ausente.")
        return montar_erro_analise(
            "url_sem_protocolo",
            "A URL precisa comecar com http:// ou https://.",
        )

    if not parsed_url.netloc:
        log_motor("ABORTADO: dominio ausente ou URL incompleta.")
        return montar_erro_analise(
            "url_incompleta",
            "A URL parece estar incompleta. Confira o endereco e tente novamente.",
        )

    log_motor(f"URL validada. Dominio alvo: {parsed_url.netloc}")

    try:
        async with async_playwright() as p:
            t_passo = time.time()
            log_motor("Iniciando Chromium...")

            browser = await p.chromium.launch(
                headless=True,
                args=["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"],
            )
            context = await browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            )
            page = await context.new_page()

            log_motor(f"Navegador isolado com sucesso! (Criado em: {time.time() - t_passo:.3f}s)")

            async def interceptar_rotas(route):
                if route.request.resource_type in settings.blocked_resource_types:
                    await route.abort()
                else:
                    await route.continue_()

            await page.route("**/*", interceptar_rotas)

            t_passo = time.time()
            log_motor("Disparando requisicao ao dominio...")

            timeout_segundos = settings.analysis_timeout_ms // 1000

            try:
                resposta_pagina = await page.goto(
                    url,
                    wait_until="load",
                    timeout=settings.analysis_timeout_ms,
                )
            except PlaywrightTimeoutError:
                log_motor(f"TIMEOUT FATAL: servidor alvo nao carregou em {timeout_segundos}s.")
                await browser.close()
                return montar_erro_analise(
                    "timeout_carregamento",
                    (
                        f"O site demorou mais de {timeout_segundos} segundos para responder. "
                        "Tente novamente mais tarde ou teste uma URL mais leve."
                    ),
                )
            except Exception as e:
                log_motor(f"FALHA DE REDE: {str(e)}")
                await browser.close()
                return montar_erro_analise(
                    "falha_acesso_site",
                    MENSAGEM_ERRO_ANALISE,
                    str(e),
                )

            status_http = resposta_pagina.status if resposta_pagina else 0
            titulo_pagina = await page.title()
            peso_html_bytes = len(await page.content())

            log_motor(f"DOM capturado! Titulo: '{titulo_pagina[:30]}...'")
            log_motor(
                f"      -> Status HTTP: {status_http} | "
                f"Tamanho: {peso_html_bytes / 1024:.2f} KB "
                f"(Navegacao: {time.time() - t_passo:.3f}s)"
            )

            t_passo = time.time()
            log_motor("Usando AxeCore e mapeando elementos WCAG...")

            try:
                results = await Axe().run(page)
            except Exception as e:
                log_motor(f"FALHA AO EXECUTAR AXECORE: {str(e)}")
                await browser.close()
                return montar_erro_analise(
                    "falha_axecore",
                    "A pagina abriu, mas nao foi possivel concluir a verificacao de acessibilidade.",
                    str(e),
                )

            log_motor(f"Analise WCAG concluida! (Processamento: {time.time() - t_passo:.3f}s)")

            t_fechar = time.time()
            await browser.close()
            log_motor(f"Navegador destruido, limpando processo da RAM... ({time.time() - t_fechar:.3f}s)")

            t_passo = time.time()
            log_motor("Mapeando raw JSON para estrutura relacional da API...")

            violation_data = results.response.get("violations", [])
            relatorio_limpo = []
            contagem_impacto = {"critical": 0, "serious": 0, "moderate": 0, "minor": 0}
            total_elementos_afetados = 0

            for erro in violation_data:
                impacto = erro.get("impact", "minor")
                if impacto in contagem_impacto:
                    contagem_impacto[impacto] += 1

                for node in erro.get("nodes", []):
                    total_elementos_afetados += 1
                    relatorio_limpo.append({
                        "id": erro["id"],
                        "impacto": node.get("impact", impacto),
                        "descricao": erro.get("description", "Sem descricao"),
                        "ajuda": erro.get("help", "Sem ajuda"),
                        "elemento_html": node.get("html", "N/A"),
                    })

            log_motor(
                f"Limpeza finalizada: {len(violation_data)} regras violadas / "
                f"{total_elementos_afetados} elementos afetados. "
                f"(Tempo: {time.time() - t_passo:.4f}s)"
            )

            tempo_total_segundos = time.time() - tempo_inicio_total
            log_motor("Montando BSON para persistencia no Banco de Dados...")

            if colecao_analises is not None:
                documento = {
                    "versao_documento": "1.2",
                    "url_analisada": url,
                    "titulo_pagina": titulo_pagina,
                    "status_http": status_http,
                    "tamanho_pagina_kb": round(peso_html_bytes / 1024, 2),
                    "data_hora": datetime.now(timezone(timedelta(hours=-3))),
                    "tempo_total_segundos": round(tempo_total_segundos, 3),
                    "resumo_erros": {
                        "regras_violadas": len(violation_data),
                        "total_elementos": total_elementos_afetados,
                        "gravidade": contagem_impacto,
                    },
                }

                tamanho_json_bytes = len(json.dumps(documento, default=str).encode("utf-8"))
                log_motor(f"RESUMO: {documento['resumo_erros']}")
                log_motor(f"PESO DO PAYLOAD DE BANCO: ~{tamanho_json_bytes} bytes")

                try:
                    t_db = time.time()
                    resultado_db = colecao_analises.insert_one(documento)
                    log_motor(
                        f"Gravado no Mongo! (ID gerado: {resultado_db.inserted_id}) "
                        f"- Ping DB: {time.time() - t_db:.3f}s"
                    )
                except Exception as db_err:
                    log_motor(f"FALHA AO GRAVAR NO MONGODB: {db_err}")
            else:
                log_motor("ATENCAO: Banco de dados inativo. O registro sera descartado.")

            log_motor(f"Sucesso! Ciclo encerrado em {tempo_total_segundos:.3f} segundos.")

            return {
                "status": "sucesso",
                "url": url,
                "titulo": titulo_pagina,
                "total_erros": len(relatorio_limpo),
                "erros": relatorio_limpo,
            }

    except Exception as e:
        log_motor("ERRO CRITICO NAO TRATADO NO MOTOR")
        log_motor(f"Trace: {str(e)}")
        return montar_erro_analise(
            "erro_interno_motor",
            "Ocorreu um erro interno durante a analise. Tente novamente mais tarde.",
            str(e),
        )
