from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from celery.result import AsyncResult

# Importando nossos serviços
from services.ai_service import gerar_resposta_chat
# Importando a tarefa da fila (e não o analyzer_service direto)
from tasks import tarefa_analisar_site

app = FastAPI(title="Motor de Acessibilidade e IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MensagemChat(BaseModel):
    mensagem: str

class AnaliseRequest(BaseModel):
    url: str

@app.get("/")
def home():
    return {"status": "✅ API Online, Refatorada e com Fila de Processamento!"}

@app.post("/chat")
async def chat_ia(req: MensagemChat):
    resposta = await gerar_resposta_chat(req.mensagem)
    return {"resposta": resposta}

@app.post("/analisar")
async def solicitar_analise(req: AnaliseRequest):
    # O ".delay()" é a mágica! Ele manda a URL para a fila (tasks.py) e libera o servidor
    tarefa = tarefa_analisar_site.delay(req.url)
    
    return {
        "mensagem": "Análise colocada na fila de processamento!",
        "ticket_id": tarefa.id
    }

@app.get("/analisar/status/{ticket_id}")
async def checar_status_analise(ticket_id: str):
    # Vai no Redis procurar como está essa tarefa
    resultado_tarefa = AsyncResult(ticket_id)
    
    if resultado_tarefa.state == 'PENDING':
        return {"status": "Na fila aguardando sua vez..."}
    elif resultado_tarefa.state == 'STARTED':
        return {"status": "Processando... O robô está lendo o site agora!"}
    elif resultado_tarefa.state == 'SUCCESS':
        return {
            "status": "Concluído!", 
            "resultado": resultado_tarefa.result
        }
    elif resultado_tarefa.state == 'FAILURE':
        return {"status": "Erro crítico ao processar o site."}
    else:
        return {"status": resultado_tarefa.state}