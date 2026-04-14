import time
import urllib.parse
import json
from datetime import datetime, timezone, timedelta

# ferramenta para abrir um "navegador fantasma" por debaixo dos panos
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
# regras de acessibilidade (WCAG)
from axe_playwright_python.async_playwright import Axe

# conexão com o banco de dados
from database import colecao_analises

# pego o horario de agora com milissegundos
def get_hora_formatada() -> str:
    fuso_br = timezone(timedelta(hours=-3))
    return datetime.now(fuso_br).strftime('%H:%M:%S')[:-3]

# mensagem pronta sem os icones
def log_motor(mensagem: str) -> None:
    print(f"[Analizando - {get_hora_formatada()}] {mensagem}")

# robô de busca
async def executar_analise_completa(url: str):
    tempo_inicio_total = time.time() # Ligo o cronômetro
    

    log_motor("Iniciando Analise")
    log_motor(f"URL Solicitada: {url}")
    
    # verifico se tem http ou https
    parsed_url = urllib.parse.urlparse(url)
    if not parsed_url.scheme in ["http", "https"]:
        log_motor("ABORTADO: Esquema HTTP/HTTPS ausente.")
        return {"error": "A URL fornecida é inválida. Use http:// ou https://"}

    log_motor(f"URL validada. Dominio alvo: {parsed_url.netloc}")

    try:
        # o 'async with' garante que o Playwright será desligado no final
        async with async_playwright() as p:
            t_passo = time.time()
            log_motor("Iniciando Chromium...")
            
            # abro o navegador invisivel
            browser = await p.chromium.launch(
                headless=True,
                args=["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"]
            )
            # finjo ser um usuário de Windows 10
            context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
            page = await context.new_page()
            
            log_motor(f"Navegador isolado com sucesso! (Criado em: {time.time() - t_passo:.3f}s)")
            
            # regra para não baixar imagens, fontes ou videos para economizar
            async def interceptar_rotas(route):
                if route.request.resource_type in ["image", "media", "font", "websocket"]:
                    await route.abort() 
                else:
                    await route.continue_() 
            
            await page.route("**/*", interceptar_rotas)

            t_passo = time.time()
            log_motor("Disparando requisicao ao dominio...")
            
            try:
                # tento entrar no site
                resposta_pagina = await page.goto(url, wait_until="load", timeout=45000)
            except PlaywrightTimeoutError:
                log_motor("TIMEOUT FATAL: Servidor alvo nao carregou em 45s.")
                return {"error": "O site demorou mais de 45 segundos para responder."}
            except Exception as e:
                log_motor(f"FALHA DE REDE: {str(e)}")
                return {"error": f"Não foi possível acessar o site. Detalhe: {str(e)}"}

            status_http = resposta_pagina.status if resposta_pagina else 0
            titulo_pagina = await page.title()
            peso_html_bytes = len(await page.content())
            
            log_motor(f"DOM capturado! Titulo: '{titulo_pagina[:30]}...'")
            log_motor(f"      -> Status HTTP: {status_http} | Tamanho: {peso_html_bytes/1024:.2f} KB (Navegacao: {time.time() - t_passo:.3f}s)")

            t_passo = time.time()
            log_motor("Usando AxeCore e mapeando elementos WCAG...")
            
            # o Axe varre a página
            results = await Axe().run(page)
            log_motor(f"Analise WCAG concluida! (Processamento: {time.time() - t_passo:.3f}s)")
            
            # fecho logo o Chrome para liberar RAM
            t_fechar = time.time()
            await browser.close()
            log_motor(f"Navegador destruido, limpando processo da RAM... ({time.time() - t_fechar:.3f}s)")

            t_passo = time.time()
            log_motor("Mapeando raw JSON para estrutura relacional da API...")
            
            violation_data = results.response.get("violations", [])
            relatorio_limpo = []
            contagem_impacto = {"critical": 0, "serious": 0, "moderate": 0, "minor": 0}
            total_elementos_afetados = 0

            # transformo o relatorio do axe em algo mais limpo
            for erro in violation_data:
                impacto = erro.get("impact", "minor")
                if impacto in contagem_impacto:
                    contagem_impacto[impacto] += 1
                
                for node in erro.get("nodes", []):
                    total_elementos_afetados += 1
                    relatorio_limpo.append({
                        "id": erro["id"],
                        "impacto": node.get("impact", impacto),
                        "descricao": erro.get("description", "Sem descrição"),
                        "ajuda": erro.get("help", "Sem ajuda"),
                        "elemento_html": node.get("html", "N/A"),
                    })
                    
            log_motor(f"Limpeza finalizada: {len(violation_data)} regras violadas / {total_elementos_afetados} elementos afetados. (Tempo: {time.time() - t_passo:.4f}s)")

            t_passo = time.time()
            tempo_total_segundos = time.time() - tempo_inicio_total
            log_motor("Montando BSON para persistencia no Banco de Dados...")
            
            if colecao_analises is not None:
                # documento com o resumo
                documento = {
                    "versao_documento": "1.2",
                    "url_analisada": url,
                    "titulo_pagina": titulo_pagina,
                    "status_http": status_http,
                    "tamanho_pagina_kb": round(peso_html_bytes/1024, 2),
                    "data_hora": datetime.now(timezone(timedelta(hours=-3))),
                    "tempo_total_segundos": round(tempo_total_segundos, 3),
                    "resumo_erros": {
                        "regras_violadas": len(violation_data),
                        "total_elementos": total_elementos_afetados,
                        "gravidade": contagem_impacto
                    }
                }
                
                # simulando o espaco no mongodb
                tamanho_json_bytes = len(json.dumps(documento, default=str).encode('utf-8'))
                log_motor(f"RESUMO: {documento['resumo_erros']}")
                log_motor(f"PESO DO PAYLOAD DE BANCO: ~{tamanho_json_bytes} bytes")
                
                try:
                    t_db = time.time()
                    resultado_db = colecao_analises.insert_one(documento)
                    log_motor(f"Gravado no Mongo! (ID gerado: {resultado_db.inserted_id}) - Ping DB: {time.time() - t_db:.3f}s")
                except Exception as db_err:
                    log_motor(f"FALHA AO GRAVAR NO MONGODB: {db_err}")
            else:
                log_motor("ATENCAO: Banco de dados inativo. O registro sera descartado.")

            log_motor(f"Sucesso! Ciclo encerrado em {tempo_total_segundos:.3f} segundos cravados.")


            # devolvo para o usuario
            return {
                "url": url,
                "titulo": titulo_pagina,
                "total_erros": len(relatorio_limpo),
                "erros": relatorio_limpo
            }

    except Exception as e:
        # caso tenha um erro que não esperemos no motor
        log_motor("ERRO CRITICO NAO TRATADO NO MOTOR")
        log_motor(f"Trace: {str(e)}")
        return {"error": f"Erro interno crítico no motor: {str(e)}"}