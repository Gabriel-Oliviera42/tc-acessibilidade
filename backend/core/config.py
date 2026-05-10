import os
from dataclasses import dataclass
from typing import List


def _get_env(name: str, default: str = "") -> str:
    """
    Lê uma variável de ambiente como string.
    Mantém a leitura centralizada para facilitar manutenção futura.
    """
    return os.getenv(name, default).strip()


def _get_env_int(name: str, default: int) -> int:
    """
    Lê uma variável de ambiente como inteiro.
    Se o valor estiver ausente ou inválido, usa o padrão.
    """
    value = os.getenv(name)

    if value is None or value.strip() == "":
        return default

    try:
        return int(value)
    except ValueError:
        return default


def _get_env_list(name: str, default: str) -> List[str]:
    """
    Lê uma variável de ambiente separada por vírgula e transforma em lista.

    Exemplo:
    GEMINI_MODELOS=gemini-2.5-flash,gemini-2.0-flash
    """
    raw_value = os.getenv(name, default)

    return [
        item.strip()
        for item in raw_value.split(",")
        if item.strip()
    ]


@dataclass(frozen=True)
class Settings:
    """
    Configurações centrais do backend.

    Este arquivo deve ser a fonte principal de configurações do projeto.
    A ideia é evitar os.getenv espalhado por vários serviços.
    """

    # Ambiente
    environment: str

    # Redis / Celery
    redis_url: str

    # MongoDB
    mongo_uri: str
    mongo_db_name: str

    # IA
    ai_provider: str
    gemini_api_key: str
    gemini_modelos: List[str]

    # Análise / Playwright
    analysis_timeout_ms: int
    blocked_resource_types: List[str]

    # CORS
    cors_origins: List[str]


settings = Settings(
    environment=_get_env("ENVIRONMENT", "development"),

    redis_url=_get_env("REDIS_URL", "redis://redis:6379/0"),

    mongo_uri=_get_env("MONGO_URI", ""),
    mongo_db_name=_get_env("MONGO_DB_NAME", "waveclone_db"),

    ai_provider=_get_env("AI_PROVIDER", "gemini"),
    gemini_api_key=_get_env("GEMINI_API_KEY", ""),
    gemini_modelos=_get_env_list(
        "GEMINI_MODELOS",
        "gemini-2.5-flash,gemini-2.5-flash-lite,gemini-2.0-flash"
    ),

    analysis_timeout_ms=_get_env_int("ANALYSIS_TIMEOUT_MS", 45000),
    blocked_resource_types=_get_env_list(
        "BLOCKED_RESOURCE_TYPES",
        "image,media,font,websocket"
    ),

    cors_origins=_get_env_list("CORS_ORIGINS", "*"),
)