import time
from datetime import datetime, timezone, timedelta

from google import genai
from tenacity import (
    retry,
    wait_random_exponential,
    stop_after_attempt,
    retry_if_exception,
)

from core.config import settings
from core.logging_config import get_logger
from database import colecao_cache_ia


logger = get_logger("IA")

API_KEY = settings.gemini_api_key

client = genai.Client(api_key=API_KEY) if API_KEY else None

MODELOS_PERMITIDOS = settings.gemini_modelos

logger.info(f"Modelos configurados: {', '.join(MODELOS_PERMITIDOS)}")


PROMPT_SISTEMA = """
Aja como especialista em WCAG. 

REGRA DE RESPOSTA:
1. Se o usuário relatar um erro ou enviar código, use EXATAMENTE este formato:
### Diagnóstico
(Máx 2 frases explicando o erro)
### Como Corrigir
(Ação direta)
**Código Original:**
```html
(código com erro)
```
**Código Corrigido:**
```html
(código acessível)
```

2. Se for uma dúvida geral ou bate-papo, responda naturalmente de forma clara e concisa, ignorando o formato acima.
"""


def log_IA(mensagem: str) -> None:
    logger.info(mensagem)


def erro_de_limite(exception: Exception) -> bool:
    erro_str = str(exception).lower()
    eh_limite = "429" in erro_str or "quota" in erro_str or "resource_exhausted" in erro_str

    if eh_limite:
        logger.warning("Possível limite de cota/rate limit detectado.")

    return eh_limite


def erro_indisponivel(exception: Exception) -> bool:
    erro_str = str(exception).lower()
    eh_indisponivel = "503" in erro_str or "unavailable" in erro_str

    if eh_indisponivel:
        logger.warning("Modelo temporariamente indisponível/sobrecarregado.")

    return eh_indisponivel


def erro_modelo_invalido(exception: Exception) -> bool:
    erro_str = str(exception).lower()
    eh_invalido = "404" in erro_str or "not_found" in erro_str

    if eh_invalido:
        logger.warning("Modelo inválido ou não disponível nesta API.")

    return eh_invalido


@retry(
    wait=wait_random_exponential(multiplier=2, max=15),
    stop=stop_after_attempt(3),
    retry=retry_if_exception(erro_de_limite),
    reraise=True,
)
async def chamar_api_gemini_async(modelo_escolhido: str, prompt_final: str):
    return await client.aio.models.generate_content(
        model=modelo_escolhido,
        contents=prompt_final,
    )


async def gerar_resposta_chat(mensagem_usuario: str) -> dict:
    log_IA("Iniciando processamento de nova mensagem.")

    if not API_KEY:
        logger.error("Chave da API Gemini ausente.")
        return {
            "status": "erro",
            "mensagem": "Erro interno: Chave da API não configurada.",
        }

    if colecao_cache_ia is not None:
        resposta_salva = colecao_cache_ia.find_one({"mensagem": mensagem_usuario})

        if resposta_salva:
            log_IA("Cache encontrado: resposta recuperada do banco de dados.")
            return {
                "status": "sucesso",
                "modelo_utilizado": "cache_mongodb",
                "dados": resposta_salva["resposta"],
            }

    log_IA("Resposta não encontrada no cache. Preparando chamada à API Gemini.")

    prompt_final = f"{PROMPT_SISTEMA}\n\nMensagem do Usuário/Sistema: {mensagem_usuario}"
    tempo_inicio = time.time()

    falhas_encontradas = []

    for index, modelo_atual in enumerate(MODELOS_PERMITIDOS):
        try:
            log_IA(f"Tentando modelo [{index + 1}/{len(MODELOS_PERMITIDOS)}]: {modelo_atual}.")

            response = await chamar_api_gemini_async(modelo_atual, prompt_final)

            tempo_total = time.time() - tempo_inicio
            log_IA(f"Processamento concluído. Tempo: {tempo_total:.2f}s.")

            if colecao_cache_ia is not None:
                colecao_cache_ia.insert_one({
                    "mensagem": mensagem_usuario,
                    "resposta": response.text,
                    "modelo": modelo_atual,
                    "data_hora": datetime.now(timezone(timedelta(hours=-3))),
                })

            return {
                "status": "sucesso",
                "modelo_utilizado": modelo_atual,
                "dados": response.text,
            }

        except Exception as erro:
            codigo_erro = "desconhecido"

            if erro_de_limite(erro):
                codigo_erro = "429"
            elif erro_indisponivel(erro):
                codigo_erro = "503"
            elif erro_modelo_invalido(erro):
                codigo_erro = "404"

            falhas_encontradas.append(f"{modelo_atual}={codigo_erro}")

            logger.warning(
                f"Falha no modelo {modelo_atual} [{codigo_erro}]: {str(erro)[:100]}"
            )

            if index == len(MODELOS_PERMITIDOS) - 1:
                logger.error(f"Resumo de falhas: {', '.join(falhas_encontradas)}")
                logger.error("Todos os modelos da lista falharam. Abortando operação.")

                return {
                    "status": "erro",
                    "mensagem": "Serviço de IA temporariamente indisponível. Tente mais tarde.",
                }

            log_IA("Passando para o próximo modelo da lista.")

    return {
        "status": "erro",
        "mensagem": "Falha na comunicação com os servidores.",
    }