from datetime import datetime

from pymongo import MongoClient

from core.config import settings
from core.logging_config import get_logger


logger = get_logger("Banco de Dados")


def log_banco(mensagem: str) -> None:
    logger.info(mensagem)


def get_database():
    if not settings.mongo_uri:
        log_banco("MONGO_URI não encontrada. O banco rodará desativado.")
        return None

    try:
        t_inicio = datetime.now()

        client = MongoClient(settings.mongo_uri, serverSelectionTimeoutMS=5000)
        log_banco("Iniciando configuração do cliente MongoDB com timeout de 5 segundos.")

        # Força um teste real de conexão.
        client.server_info()

        log_banco("Conexão com o MongoDB Atlas iniciada.")

        nome_do_banco = settings.mongo_db_name
        db = client[nome_do_banco]

        log_banco(f"Banco selecionado: '{nome_do_banco}'.")

        latencia = (datetime.now() - t_inicio).total_seconds()
        log_banco(f"Conectado com sucesso. Latência: {latencia:.3f}s.")

        return db

    except Exception as erro:
        logger.exception("Não foi possível acessar o MongoDB Atlas.")
        log_banco(f"Detalhe técnico do erro: {erro}")
        return None


db = get_database()

colecao_analises = db["historico_analises"] if db is not None else None
colecao_cache_ia = db["cache_ia"] if db is not None else None