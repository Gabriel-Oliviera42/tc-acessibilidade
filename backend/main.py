import os
import asyncio
from fastapi import FastAPI
from playwright.async_api import async_playwright
from axe_playwright_python.async_playwright import Axe
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from google import genai 

# 1. Carrega as variáveis do ficheiro .env
load_dotenv()

# 2. Configura o Cliente do Gemini
CHAVE_API = os.getenv("GEMINI_API_KEY")
cliente_ia = None
if CHAVE_API:
    cliente_ia = genai.Client(api_key=CHAVE_API)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- O NOSSO PLANO B (SALVA-VIDAS DA APRESENTAÇÃO) ---
# Se o Google der erro 429 com as 30 pessoas, o sistema usa essas dicas perfeitas!
DICAS_OFFLINE = {
    "label-title-only": "Dica do Professor: Elementos de formulário precisam de uma tag <label> visível. Não use apenas o atributo 'title', pois leitores de tela podem ignorá-lo.",
    "landmark-one-main": "Dica do Professor: Toda página precisa ter exatamente uma tag <main> para indicar onde fica o conteúdo principal do site.",
    "page-has-heading-one": "Dica do Professor: Sua página deve ter um (e apenas um) <h1> principal para explicar o assunto para usuários e motores de busca.",
    "region": "Dica do Professor: Todo o seu conteúdo deve estar agrupado dentro de tags semânticas (como <header>, <nav>, <main> ou <footer>).",
    "color-contrast": "Dica do Professor: A cor do texto está muito parecida com a cor do fundo. Aumente o contraste para facilitar a leitura!",
    "image-alt": "Dica do Professor: Toda tag <img> precisa de um atributo 'alt' descrevendo a imagem para quem não pode vê-la."
}

# --- A MÁGICA DA IA ---
async def obter_dica_ia(regra_id, descricao, ajuda):
    # Se a dica já existe no nosso modo Offline, devolvemos ela para economizar a IA para outros erros!
    if regra_id in DICAS_OFFLINE:
        return DICAS_OFFLINE[regra_id]

    if not cliente_ia:
        return "Configure a sua chave da API do Gemini para ver dicas personalizadas."

    prompt = f"""
    Aja como um professor de programação de frontend paciente e didático.
    Um aluno do 1º ano cometeu o seguinte erro de acessibilidade web (WCAG):
    
    - ID da Regra: {regra_id}
    - Descrição Técnica: {descricao}
    - Ajuda do Sistema: {ajuda}
    
    Escreva uma dica muito amigável, em português, de no máximo 3 linhas. 
    Explique de forma simples o que isto significa e dê uma sugestão direta de como corrigir.
    """
    try:
        # Usando o modelo correto do Gemini 2.0
        resposta = await cliente_ia.aio.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        return resposta.text.strip()
    except Exception as e:
        print(f"Erro na IA ({regra_id}): {e}")
        # Se a cota estourar (429), ele devolve uma dica genérica amigável em vez de quebrar!
        return "Dica do professor: Dê uma olhada na documentação HTML sobre este elemento. A estrutura precisa de ajustes de acessibilidade."

@app.get("/")
def home():
    return {"status": "Motor de Acessibilidade com IA Pronto"}

@app.get("/analisar")
async def analisar(url: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        page = await context.new_page()
        
        try:
            await page.goto(url, wait_until="load", timeout=60000) 
            await page.wait_for_timeout(3000)
            
            results = await Axe().run(page)
            await browser.close()
            
            violation_data = results.response.get("violations", [])
            relatorio_limpo = []
            
            dicas_cache = {}
            
            for erro in violation_data:
                regra_id = erro["id"]
                descricao = erro.get("description", "Sem descrição")
                ajuda = erro.get("help", "Sem ajuda")
                
                if regra_id not in dicas_cache:
                    dicas_cache[regra_id] = await obter_dica_ia(regra_id, descricao, ajuda)
                    await asyncio.sleep(2) # Pausa reduzida para 2s
                
                dica_do_professor = dicas_cache[regra_id]
                
                for node in erro.get("nodes", []):
                    relatorio_limpo.append({
                        "id": regra_id,
                        "impacto": erro.get("impact", "desconhecido"),
                        "descricao": descricao,
                        "ajuda": ajuda,
                        "url_ajuda": erro.get("helpUrl", ""),
                        "elemento_html": node.get("html", "N/A"),
                        "sugestao": node.get("failureSummary", "Verifique o elemento."),
                        "alvo_css": node.get("target", []),
                        "dica_ia": dica_do_professor
                    })
                    
            return {
                "url": url,
                "total_erros": len(relatorio_limpo),
                "erros": relatorio_limpo
            }
            
        except Exception as e:
            if not browser.is_closed():
                await browser.close()
            return {"error": str(e)}