import asyncio

from celery_app import celery_app
from services.analyzer_service import executar_analise_completa


@celery_app.task(bind=True, name="analisar_site")
def tarefa_analisar_site(self, url: str):
    self.update_state(
        state="PROGRESS",
        meta={
            "etapa": "preparando",
            "codigo_status": "preparando_analise",
            "mensagem": "Preparando a analise de acessibilidade.",
        },
    )

    self.update_state(
        state="PROGRESS",
        meta={
            "etapa": "executando",
            "codigo_status": "executando_analise",
            "mensagem": "Carregando a pagina e verificando acessibilidade.",
        },
    )

    resultado = asyncio.run(executar_analise_completa(url))

    self.update_state(
        state="PROGRESS",
        meta={
            "etapa": "finalizando",
            "codigo_status": "finalizando_relatorio",
            "mensagem": "Finalizando o relatorio da analise.",
        },
    )

    return resultado
