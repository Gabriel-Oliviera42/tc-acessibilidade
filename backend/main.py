from celery.result import AsyncResult
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from core.config import settings
from core.logging_config import setup_logging
from services.ai_service import gerar_resposta_chat
from tasks import tarefa_analisar_site


setup_logging()

app = FastAPI(title="Motor de Acessibilidade e IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MensagemChat(BaseModel):
    mensagem: str


class AnaliseRequest(BaseModel):
    url: str


def resposta_status(
    estado: str,
    codigo_status: str,
    mensagem: str,
    etapa: str,
    **extras,
) -> dict:
    return {
        "estado": estado,
        "codigo_status": codigo_status,
        "status": mensagem,
        "mensagem": mensagem,
        "etapa": etapa,
        **extras,
    }


@app.get("/")
def home():
    return {"status": "API online, com fila de processamento ativa."}


@app.post("/chat")
async def chat_ia(req: MensagemChat):
    resposta = await gerar_resposta_chat(req.mensagem)
    return {"resposta": resposta}


@app.post("/analisar")
async def solicitar_analise(req: AnaliseRequest):
    tarefa = tarefa_analisar_site.delay(req.url)

    return {
        "estado": "RECEIVED",
        "codigo_status": "analise_enfileirada",
        "mensagem": "Analise recebida e colocada na fila.",
        "ticket_id": tarefa.id,
    }


@app.get("/analisar/status/{ticket_id}")
async def checar_status_analise(ticket_id: str):
    resultado_tarefa = AsyncResult(ticket_id)

    if resultado_tarefa.state == "PENDING":
        return resposta_status(
            estado="PENDING",
            codigo_status="aguardando_fila",
            mensagem="Sua analise esta na fila. Assim que o servidor estiver livre, ela sera iniciada.",
            etapa="fila",
        )

    if resultado_tarefa.state == "STARTED":
        return resposta_status(
            estado="STARTED",
            codigo_status="worker_iniciado",
            mensagem="O servidor comecou a preparar sua analise.",
            etapa="iniciando",
        )

    if resultado_tarefa.state == "PROGRESS":
        progresso = resultado_tarefa.info

        if not isinstance(progresso, dict):
            progresso = {}

        return resposta_status(
            estado="PROGRESS",
            codigo_status=progresso.get("codigo_status", "analise_em_andamento"),
            mensagem=progresso.get("mensagem", "Processando analise de acessibilidade..."),
            etapa=progresso.get("etapa", "processando"),
        )

    if resultado_tarefa.state == "SUCCESS":
        return resposta_status(
            estado="SUCCESS",
            codigo_status="analise_concluida",
            mensagem="Analise concluida.",
            etapa="finalizado",
            resultado=resultado_tarefa.result,
        )

    if resultado_tarefa.state == "FAILURE":
        return resposta_status(
            estado="FAILURE",
            codigo_status="falha_worker",
            mensagem="Nao foi possivel concluir a analise por uma falha interna.",
            etapa="erro",
            erro=str(resultado_tarefa.info),
        )

    return resposta_status(
        estado=resultado_tarefa.state,
        codigo_status="estado_desconhecido",
        mensagem="A analise esta em um estado inesperado. Aguarde alguns instantes.",
        etapa="desconhecido",
    )
