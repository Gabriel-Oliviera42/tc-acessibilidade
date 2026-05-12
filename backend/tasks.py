import asyncio

from celery_app import celery_app
from services.analyzer_service import executar_analise_completa


@celery_app.task(bind=True, name="analisar_site")
def tarefa_analisar_site(self, url: str):
    self.update_state(
        state="PROGRESS",
        meta={
            "etapa": "preparando",
            "mensagem": "Preparando análise de acessibilidade..."
        }
    )

    resultado = asyncio.run(executar_analise_completa(url))

    self.update_state(
        state="PROGRESS",
        meta={
            "etapa": "finalizando",
            "mensagem": "Finalizando relatório..."
        }
    )

    return resultado