import asyncio
from celery_app import celery_app
from services.analyzer_service import executar_analise_completa

@celery_app.task(bind=True, name="analisar_site")
def tarefa_analisar_site(self, url: str):
    # O worker chama seu analyzer_service daqui!
    resultado = asyncio.run(executar_analise_completa(url))
    return resultado