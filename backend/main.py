import time
from fastapi import FastAPI
from playwright.async_api import async_playwright
from axe_playwright_python.async_playwright import Axe
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Motor de Acessibilidade com Telemetria Pronto"}

@app.get("/analisar")
async def analisar(url: str):
    tempo_inicio_total = time.time()
    print(f"\n🚀 --- INICIANDO ANÁLISE: {url} ---")
    
    async with async_playwright() as p:
        tempo_browser = time.time()
        print("⏳ [1/4] Ligando o navegador Chromium...")
        browser = await p.chromium.launch(
            headless=True,
            args=["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"]
        )
        context = await browser.new_context(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
        page = await context.new_page()
        print(f"✅ [1/4] Navegador pronto em {time.time() - tempo_browser:.2f} segundos")
        
        # Filtro de rede para bloquear imagens e mídias
        async def interceptar_rotas(route):
            recursos_bloqueados = ["image", "media", "font", "websocket"]
            if route.request.resource_type in recursos_bloqueados:
                await route.abort()
            else:
                await route.continue_()

        await page.route("**/*", interceptar_rotas)
        
        try:
            tempo_navegacao = time.time()
            print("⏳ [2/4] Acessando o site e esperando o carregamento completo (load)...")
            # Voltamos para "load" para garantir que pegamos todos os erros do JS
            await page.goto(url, wait_until="load", timeout=60000) 
            print(f"✅ [2/4] Site carregado em {time.time() - tempo_navegacao:.2f} segundos")
            
            tempo_axe = time.time()
            print("⏳ [3/4] Injetando e rodando o motor AxeCore...")
            results = await Axe().run(page)
            print(f"✅ [3/4] AxeCore finalizou a varredura em {time.time() - tempo_axe:.2f} segundos")
            
            await browser.close()
            
            tempo_processamento = time.time()
            print("⏳ [4/4] Processando o JSON e limpando os dados...")
            violation_data = results.response.get("violations", [])
            relatorio_limpo = []
            
            for erro in violation_data:
                regra_id = erro["id"]
                descricao = erro.get("description", "Sem descrição")
                ajuda = erro.get("help", "Sem ajuda")
                
                for node in erro.get("nodes", []):
                    relatorio_limpo.append({
                        "id": regra_id,
                        "impacto": erro.get("impact", "desconhecido"),
                        "descricao": descricao,
                        "ajuda": ajuda,
                        "url_ajuda": erro.get("helpUrl", ""),
                        "elemento_html": node.get("html", "N/A"),
                        "sugestao": node.get("failureSummary", "Verifique o elemento."),
                        "alvo_css": node.get("target", [])
                    })
                    
            tempo_total = time.time() - tempo_inicio_total
            print(f"✅ [4/4] Dados processados em {time.time() - tempo_processamento:.2f} segundos")
            print(f"🏁 --- ANÁLISE CONCLUÍDA EM {tempo_total:.2f} SEGUNDOS TOTAL --- \n")
            
            return {
                "url": url,
                "total_erros": len(relatorio_limpo),
                "erros": relatorio_limpo
            }
            
        except Exception as e:
            if not browser.is_closed():
                await browser.close()
            print(f"❌ ERRO GRAVE: {str(e)}")
            return {"error": str(e)}