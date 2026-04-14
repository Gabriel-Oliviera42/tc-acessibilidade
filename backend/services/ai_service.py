import time          
import os            
from datetime import datetime, timezone, timedelta
import google.generativeai as genai 

# Conexão com o banco de dados
from database import colecao_cache_ia 

# biblioteca para poder ficar rodando denovo e denovo
from tenacity import retry, wait_random_exponential, stop_after_attempt, retry_if_exception

# Pega a chave da API no .env
API_KEY = os.getenv("GEMINI_API_KEY", "")

# configura o Google se a chave existir. 
if API_KEY:
    genai.configure(api_key=API_KEY)

# 1. Busca a variável no .env. Se o usuário (você) esquecer de criar no .env, ele usa a string padrão com os dois flash.
modelos_env = os.getenv("GEMINI_MODELOS", "gemini-2.5-flash,gemini-1.5-flash")

# 2. Transforma a string do .env em uma lista de verdade
MODELOS_PERMITIDOS = []
lista_suja = modelos_env.split(",") # Corta o texto toda vez que achar uma vírgula

for modelo in lista_suja:
    modelo_limpo = modelo.strip() # Remove espaços vazios do começo e do fim
    
    if modelo_limpo != "": # Se não for só um espaço em branco, salva na lista final
        MODELOS_PERMITIDOS.append(modelo_limpo)

# O resultado final na variável MODELOS_PERMITIDOS será: ['gemini-2.5-flash', 'gemini-1.5-flash']


PROMPT_SISTEMA = """Aja como especialista em WCAG. 

REGRA DE RESPOSTA:
1. Se o usuário relatar um erro ou enviar código, use EXATAMENTE este formato:
### Diagnóstico
(Máx 2 frases explicando o erro)
### Como Corrigir
(Ação direta)
**Código Original:**
```html
(código com erro)
```
**Código Corrigido:**
```html
(código acessível)
```

2. Se for uma dúvida geral ou bate-papo, responda naturalmente de forma clara e concisa, ignorando o formato acima."""

# pega o horario de agora
def get_hora_formatada() -> str:
    fuso_br = timezone(timedelta(hours=-3))
    return datetime.now(fuso_br).strftime('%H:%M:%S')

# mensagem pronta
def log_IA(mensagem: str) -> None:
    print(f"[IA - {get_hora_formatada()}] {mensagem}")

# função para ficar olhando se deu erro de tentatias no retry
def erro_de_limite(exception: Exception) -> bool:

    erro_str = str(exception).lower()
    eh_limite = "429" in erro_str or "quota" in erro_str
    if eh_limite:
        log_IA("Limite de requisicoes atingido. Aguardando para tentar novamente...")
    return eh_limite


# fica tentando até 3 vezes
@retry(
    wait=wait_random_exponential(multiplier=2, max=15),
    stop=stop_after_attempt(3),                       
    retry=retry_if_exception(erro_de_limite),        
    reraise=True                                        
)

# chama a api do gemini de maneira asincrona
async def chamar_api_gemini_async(modelo_escolhido: str, prompt_final: str):
    model = genai.GenerativeModel(modelo_escolhido)
    # O "await" diz: "Servidor, vai atender outras pessoas, eu te aviso quando o Google responder".
    return await model.generate_content_async(prompt_final)

# funão principal
async def gerar_resposta_chat(mensagem_usuario: str) -> dict:
    log_IA("Iniciando processamento de nova mensagem.")
    
    # Sem chave, sem festa.
    if not API_KEY:
        log_IA("Erro: Chave da API ausente no .env.")
        return {"status": "erro", "mensagem": "Erro interno: Chave da API não configurada."}

    # Olha o cache primeiro pelo MongoDB: 
    if colecao_cache_ia is not None:
        resposta_salva = colecao_cache_ia.find_one({"mensagem": mensagem_usuario})
        
        if resposta_salva:
            log_IA("Cache encontrado: Resposta recuperada do banco de dados instantaneamente.")
            # Se achou, devolve o que estava salvo e a função morre aqui. Não gasta IA.
            return {
                "status": "sucesso",
                "modelo_utilizado": "cache_mongodb",
                "dados": resposta_salva["resposta"]
            }

    # Se chegou aqui, é porque a pergunta é nova e temos que usar IA
    log_IA("Resposta não encontrada no cache. Preparando chamada à API Gemini...")
    
    # Junta as regras do sistema com a dúvida do usuario
    prompt_final = f"{PROMPT_SISTEMA}\n\nMensagem do Usuário/Sistema: {mensagem_usuario}"
    tempo_inicio = time.time() 
    
    # loop para testar os modelos(depois vou ver uma forma mais profisional)
    for index, modelo_atual in enumerate(MODELOS_PERMITIDOS):
        try:
            log_IA(f"Tentando modelo [{index + 1}/{len(MODELOS_PERMITIDOS)}]: {modelo_atual}...")
            
            # libera a thread do servidor.
            response = await chamar_api_gemini_async(modelo_atual, prompt_final)
            
            tempo_total = time.time() - tempo_inicio # Para o cronômetro.
            log_IA(f"Processamento concluido. Tempo: {tempo_total:.2f}s.")
            
            # Salva no mongoDB
            if colecao_cache_ia is not None:
                colecao_cache_ia.insert_one({
                    "mensagem": mensagem_usuario,
                    "resposta": response.text,
                    "modelo": modelo_atual,
                    "data_hora": datetime.now(timezone(timedelta(hours=-3)))
                })
            
            # Devolve padronizado para o FastAPI entregar para o Frontend.
            return {"status": "sucesso", "modelo_utilizado": modelo_atual, "dados": response.text}

        except Exception as erro:
            # Se o código cair aqui, aquele modelo específico falhou.
            log_IA(f"Falha no modelo {modelo_atual}: {str(erro)[:100]}")
            
            # Ve se temos mais opções de modelo.
            if index == len(MODELOS_PERMITIDOS) - 1:
                log_IA("Todos os modelos da lista falharam. Abortando operação.")
                return {"status": "erro", "mensagem": "Serviço de IA temporariamente indisponível. Tente mais tarde."}
            
            # testamos outro modelo
            log_IA("Passando para o próximo modelo da lista para tentar contornar a falha...")

    # Caso tenho um erro que não esperemos
    return {"status": "erro", "mensagem": "Falha na comunicação com os servidores."}