import os
from pymongo import MongoClient
from datetime import datetime

# pego oque eu preciso para entrar no banco de dados, que estou guardando no .env
MONGO_URI = os.getenv("MONGO_URI")

# Função para pegar o horario atual
def get_hora_formatada():
    return datetime.now().strftime('%H:%M:%S')

# Ela automatiza os prints, garantindo que a hora esteja sempre exata no momento do erro/sucesso
def log_banco(mensagem):
    print(f"[Banco de Dados - {get_hora_formatada()}] {mensagem}")

def get_database():

    # Teste de segurança: Verifica se a variável do .env realmente existe e foi carregada
    if not MONGO_URI:
        log_banco("AVISO: MONGO_URI não encontrada no .env. O banco rodará desativado.")
        return None

    # Basicmente tenta abrir o banco de dados
    try:
        # Marca o tempo exato antes de tentar conectar para calcular o ping depois
        t_inicio = datetime.now()
        
        # Inicia a configuração do cliente MongoDB e desiste de conectar em 5 segundos para não travar a API
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        log_banco("Inicia a configuração do cliente MongoDB de até 5 segundos")
        
        # Isso força essa conexão agora, servindo para conectar de verdade antes de pedir alguma coisa.
        client.server_info() 
        
        print() # Pula uma linha no terminal para ficar mais organizado
        log_banco("Iniciando conexão com o MongoDB Atlas...")

        # Seleciona qual banco de dados vamos usar lá dentro do Mongo Atlas
        nome_do_banco = "waveclone_db" # só para depois escrever no terminal
        db = client[nome_do_banco]
        log_banco(f"Banco encontrado! Entrando no banco de dados específico: '{nome_do_banco}'")
        
        # Marca o tempo exato que a conexão terminou
        t_fim = datetime.now()
        
        # Calcula a diferença entre o fim e o início para descobrirmos a latência (tempo de resposta)
        latencia = (t_fim - t_inicio).total_seconds()
        log_banco(f"Conectado com sucesso! (Latência: {latencia:.3f}s)")
        
        # Retorna o banco de dados pronto para uso
        return db
        
    except Exception as e:
        # Se qualquer coisa der errado, o código não quebra e cai aqui
        log_banco("ERRO DE CONEXÃO: Não foi possível acessar o MongoDB Atlas.")
        log_banco(f"Detalhe técnico do erro: {e}")
        return None

# vai até a internet e guarda o banco de dados inteiro em db
db = get_database()

# estamos algo tipo assim por enquanto

#     "versao_documento": "1.2",
#     "url_analisada": "http://exemplo.com",
#     "titulo_pagina": "Título do Site",
#     "status_http": 200,
#     "tamanho_pagina_kb": 150.5,
#     "data_hora": "Data e hora exata",
#     "tempo_total_segundos": 12.3,
#     "resumo_erros": { "regras_violadas": 5, "total_elementos": 10, "gravidade": {...} }


# e selecionamos a tabela específica chamada historico_analises
colecao_analises = db["historico_analises"] if db is not None else None

# Criamos uma nova tabela (coleção) específica para ser o "Cache" da nossa IA
colecao_cache_ia = db["cache_ia"] if db is not None else None