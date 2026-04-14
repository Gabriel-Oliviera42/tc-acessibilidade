from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Importando nossos serviços recém-criados!
from services.ai_service import gerar_resposta_chat
from services.analyzer_service import executar_analise_completa

app = FastAPI(title="Motor de Acessibilidade e IA")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class MensagemChat(BaseModel):
    mensagem: str

@app.get("/")
def home():
    return {"status": "✅ API Online, Refatorada e Pronta para Produção!"}

@app.post("/chat")
async def chat_ia(req: MensagemChat):
    # AQUI ADICIONAMOS O AWAIT: O servidor agora espera a IA sem travar outras rotas
    resposta = await gerar_resposta_chat(req.mensagem)
    return {"resposta": resposta}

@app.get("/analisar")
async def analisar(url: str):
    # Passa a responsabilidade para o serviço de motor de análise
    resultado = await executar_analise_completa(url)
    return resultado