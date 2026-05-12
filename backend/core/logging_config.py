import logging
import sys


LOG_FORMAT = "[%(name)s - %(asctime)s] %(levelname)s: %(message)s"
DATE_FORMAT = "%H:%M:%S"


def setup_logging() -> None:
    """
    Configura o logging padrão da aplicação.

    Esta função deve ser chamada uma vez na inicialização do backend/worker.
    Por enquanto, mantém uma configuração simples para desenvolvimento.
    """
    logging.basicConfig(
        level=logging.INFO,
        format=LOG_FORMAT,
        datefmt=DATE_FORMAT,
        stream=sys.stdout,
        force=True,
    )


def get_logger(name: str) -> logging.Logger:
    """
    Retorna um logger nomeado para cada parte da aplicação.

    Exemplos:
    - get_logger("Banco de Dados")
    - get_logger("IA")
    - get_logger("Analisador")
    """
    return logging.getLogger(name)