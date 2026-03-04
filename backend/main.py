import os
import asyncio
from fastapi import FastAPI
from playwright.async_api import async_playwright
from axe_playwright_python.async_playwright import Axe
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# --- MUDANÇA 1: Importamos a nova biblioteca ---
from google import genai 

# 1. Carrega as variáveis do ficheiro .env
load_dotenv()

# 2. Configura o Cliente do Gemini (Nova SDK)
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

# --- A MÁGICA DA IA (PROMPT ENGINEERING) ---
async def obter_dica_ia(regra_id, descricao, ajuda):
    """ Envia o erro técnico para o Gemini e devolve uma dica didática """
    if not cliente_ia:
        return "Configure a sua chave da API do Gemini para ver dicas personalizadas."

    prompt = f"""
    Aja como um professor de programação de frontend paciente e didático.
    Um aluno do 1º ano cometeu o seguinte erro de acessibilidade web (WCAG):
    
    - ID da Regra: {regra_id}
    - Descrição Técnica: {descricao}
    - Ajuda do Sistema: {ajuda}
    
    Escreva uma dica muito amigável, em português, de no máximo 3 linhas. 
    Explique de forma muito simples o que isto significa e dê uma sugestão direta de como ele deve corrigir o código HTML ou CSS. 
    Não uses jargões complexos nem formatação markdown excessiva.
    """
    try:
        # --- MUDANÇA 2: Nova forma de chamar a IA assincronamente ---
        resposta = await cliente_ia.aio.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        return resposta.text.strip()
    except Exception as e:
        print(f"Erro na IA: {e}")
        return "Dica do professor: Verifique a documentação HTML sobre este elemento para o corrigir."

# ... (MANTENHA O RESTO DO SEU CÓDIGO INTACTO A PARTIR DAQUI) ...

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
            
            # --- ESTRATÉGIA DE CACHE DO SÊNIOR ---
            # Vamos guardar as dicas já pedidas para não perguntar a mesma coisa duas vezes ao Google
            dicas_cache = {}
            
            # LOOP 1: Passa por cada Regra de Acessibilidade violada
            for erro in violation_data:
                regra_id = erro["id"]
                descricao = erro.get("description", "Sem descrição")
                ajuda = erro.get("help", "Sem ajuda")
                
                # Verifica se já perguntamos sobre esta regra. Se não, pergunta e pausa.
                if regra_id not in dicas_cache:
                    dicas_cache[regra_id] = await obter_dica_ia(regra_id, descricao, ajuda)
                    await asyncio.sleep(4) # Pausa apenas quando fazemos uma nova requisição
                
                # Pegamos a dica salva (seja a recém-baixada ou a que já estava no cache)
                dica_do_professor = dicas_cache[regra_id]
                
                # LOOP 2: Passa por CADA ELEMENTO HTML
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