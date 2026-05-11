# Arquitetura Backend — TC Acessibilidade

Este documento descreve a arquitetura atual do backend da aplicação **TC Acessibilidade**, o fluxo real de funcionamento, as responsabilidades de cada arquivo, os pontos de atenção e o plano de evolução futura.

O objetivo deste documento é evitar perda de contexto, reduzir risco de alterações erradas e servir como referência técnica antes de qualquer refatoração.

---

## 1. Visão geral do projeto

A aplicação é uma plataforma de auditoria web com foco inicial em **acessibilidade digital baseada em WCAG**.

O fluxo principal atual é:

```text
Usuário digita uma URL no frontend
→ frontend envia a URL para o backend
→ backend coloca a análise em uma fila Celery
→ worker executa Playwright
→ Playwright carrega a página
→ AxeCore analisa o DOM carregado
→ backend transforma o resultado em relatório limpo
→ resultado volta para o frontend
→ usuário visualiza os erros encontrados
```

Além da análise automática, existe um assistente de IA especializado em acessibilidade:

```text
Usuário envia pergunta ou clica em um erro
→ frontend chama o endpoint /chat
→ backend consulta cache no MongoDB
→ se houver cache, retorna resposta salva
→ se não houver cache, chama o provider de IA
→ resposta é salva no cache
→ resposta volta para o frontend
```

Atualmente, a IA usa Gemini. Existe a possibilidade futura de trocar para Grok/xAI por exigência da faculdade ou decisão de arquitetura. A lógica de cache e resposta pode ser reaproveitada, mas a chamada específica ao provider precisa ser isolada futuramente.

---

## 2. Objetivo final da aplicação

Hoje a aplicação faz auditoria de acessibilidade, mas o objetivo futuro é maior.

A meta é evoluir para uma plataforma onde o usuário informa uma URL e recebe um diagnóstico amplo do site, não apenas acessibilidade.

Possíveis áreas futuras:

```text
1. Acessibilidade
2. SEO
3. Performance
4. Boas práticas de frontend
5. Segurança básica
6. Qualidade técnica
7. Relatório com priorização
8. Recomendações com IA
9. Histórico de análises
10. Exportação de relatórios
```

Acessibilidade com AxeCore é o primeiro módulo da plataforma.

O desenho futuro deve permitir múltiplos analisadores independentes:

```text
URL
→ análise de acessibilidade
→ análise de SEO
→ análise de performance
→ análise de segurança
→ análise de boas práticas
→ relatório consolidado
→ explicação/ações sugeridas pela IA
```

A IA não deve ser a fonte primária da análise técnica. A IA deve atuar como camada de explicação, priorização e auxílio na correção.

---

## 3. Stack atual do backend

Tecnologias principais:

```text
FastAPI
→ API HTTP principal

Pydantic
→ validação dos dados recebidos nos endpoints

Celery
→ fila de processamento em background

Redis
→ broker da fila e backend de status/resultado do Celery

Playwright
→ navegador headless para carregar páginas reais

AxeCore / axe-playwright-python
→ análise de acessibilidade no DOM carregado

MongoDB Atlas
→ histórico de análises e cache de respostas da IA

Google Gemini
→ provider atual da IA

Tenacity
→ retry/backoff em chamadas de IA

Docker Compose
→ orquestra backend, worker, redis, frontend e nginx
```

---

## 4. Estrutura atual relevante do backend

Estrutura atual:

```text
backend/
├── .env
├── Dockerfile
├── celery_app.py
├── database.py
├── main.py
├── requirements.txt
├── services/
│   ├── ai_service.py
│   └── analyzer_service.py
└── tasks.py
```

Responsabilidade geral dos arquivos:

```text
main.py
→ Define os endpoints FastAPI.

tasks.py
→ Define a task Celery que executa a análise.

celery_app.py
→ Configura Celery e Redis.

analyzer_service.py
→ Executa Playwright + AxeCore e monta o relatório.

ai_service.py
→ Controla cache, prompt e chamada ao Gemini.

database.py
→ Configura conexão com MongoDB e expõe coleções.

requirements.txt
→ Dependências Python.

Dockerfile
→ Imagem do backend/worker.
```

---

## 5. Fluxo principal da análise de URL

O fluxo atual da análise é assíncrono e usa fila.

```text
Frontend
→ POST /analisar
→ main.py recebe a URL
→ main.py chama tarefa_analisar_site.delay(url)
→ Celery envia a tarefa para o Redis
→ Worker Celery pega a tarefa
→ tasks.py executa executar_analise_completa(url)
→ analyzer_service.py abre Playwright e executa AxeCore
→ resultado é retornado pela task
→ Redis guarda status e resultado
→ Frontend consulta GET /analisar/status/{ticket_id}
→ main.py usa AsyncResult(ticket_id)
→ resultado volta para o frontend
```

Esse desenho existe para evitar que o FastAPI fique bloqueado enquanto Playwright abre o navegador e analisa a página.

A análise de acessibilidade é a parte pesada do sistema, por isso ela roda fora do processo principal da API.

---

## 6. main.py

O `main.py` é a porta de entrada HTTP da aplicação.

Responsabilidades atuais:

```text
1. Criar app FastAPI.
2. Configurar CORS.
3. Definir schemas simples com Pydantic.
4. Receber mensagens do chat.
5. Receber URLs para análise.
6. Retornar status das análises.
```

Endpoints atuais:

```text
GET /
→ Retorna status da API.

POST /chat
→ Recebe uma mensagem e chama gerar_resposta_chat.

POST /analisar
→ Recebe uma URL, envia para a fila Celery e retorna ticket_id.

GET /analisar/status/{ticket_id}
→ Consulta status e resultado da tarefa no Celery/Redis.
```

Fluxo do endpoint `/analisar`:

```text
Recebe URL
→ chama tarefa_analisar_site.delay(req.url)
→ retorna ticket_id
```

Importante:

O `main.py` não executa Playwright diretamente.

Ele apenas joga a URL na fila:

```python
tarefa = tarefa_analisar_site.delay(req.url)
```

Depois o frontend consulta o status usando:

```python
AsyncResult(ticket_id)
```

Estados tratados atualmente:

```text
PENDING
→ "Na fila aguardando sua vez..."

STARTED
→ "Processando... O robô está lendo o site agora!"

SUCCESS
→ retorna resultado

FAILURE
→ "Erro crítico ao processar o site."
```

### Pontos de atenção do main.py

- O CORS está aberto com `allow_origins=["*"]`.
- Isso é aceitável em desenvolvimento, mas não é ideal para produção.
- Os schemas `MensagemChat` e `AnaliseRequest` estão dentro do próprio `main.py`.
- Os textos de status são livres, não padronizados em enum/código.
- A resposta de erro da análise é genérica.
- Futuramente, os endpoints podem ser separados em arquivos de rota.

### Melhorias futuras para main.py

Possível estrutura futura:

```text
backend/
├── api/
│   ├── routes_analysis.py
│   └── routes_chat.py
├── schemas/
│   ├── analysis_schema.py
│   └── chat_schema.py
└── main.py
```

O `main.py` ficaria responsável apenas por criar o app, configurar middlewares e registrar rotas.

---

## 7. tasks.py

O `tasks.py` define a tarefa Celery responsável por executar a análise.

Código atual resumido:

```python
import asyncio
from celery_app import celery_app
from services.analyzer_service import executar_analise_completa

@celery_app.task(bind=True, name="analisar_site")
def tarefa_analisar_site(self, url: str):
    resultado = asyncio.run(executar_analise_completa(url))
    return resultado
```

Responsabilidade:

```text
1. Receber a URL da fila.
2. Chamar o motor de análise.
3. Retornar o resultado para o Celery.
```

Ele não faz análise diretamente.

Ele apenas chama:

```python
executar_analise_completa(url)
```

A função é assíncrona, por isso a task usa:

```python
asyncio.run(...)
```

Isso permite executar uma função async dentro de uma task Celery síncrona.

### bind=True

A task usa:

```python
@celery_app.task(bind=True, name="analisar_site")
```

O `bind=True` faz a task receber `self`.

Atualmente o `self` não é usado, mas pode ser útil no futuro para:

```text
- acessar self.request.id
- atualizar estado da tarefa
- configurar retry
- enviar status customizado
```

### Pontos de atenção do tasks.py

- O status ainda é genérico.
- Não existe `self.update_state`.
- Erros são tratados dentro do analyzer ou caem em FAILURE.
- Não há retry de análise.
- Não há timeout específico por task.

### Melhorias futuras para tasks.py

Adicionar status progressivo:

```python
self.update_state(
    state="PROGRESS",
    meta={"step": "validando_url", "message": "Validando URL..."}
)
```

Possíveis etapas futuras:

```text
validando_url
iniciando_browser
carregando_pagina
executando_axe
processando_resultado
salvando_historico
finalizado
```

Isso permitiria um frontend mais profissional, com progresso real da análise.

---

## 8. celery_app.py

O `celery_app.py` configura Celery e Redis.

Código atual resumido:

```python
import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "motor_acessibilidade",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=['tasks']
)

celery_app.conf.update(task_track_started=True)
```

Responsabilidades:

```text
1. Ler REDIS_URL do ambiente.
2. Criar app Celery.
3. Usar Redis como broker.
4. Usar Redis como backend de resultado.
5. Carregar tasks.py.
6. Ativar rastreamento de estado STARTED.
```

O Redis tem dois papéis:

```text
broker
→ fila de mensagens/tarefas

backend
→ status e resultado das tarefas
```

A configuração:

```python
task_track_started=True
```

permite que a tarefa apareça como `STARTED` quando o worker começa a processar.

Sem isso, a tarefa poderia ficar como `PENDING` até terminar.

### Pontos de atenção do celery_app.py

- Configuração simples e funcional.
- Redis é usado tanto como broker quanto como backend.
- Não há configuração de time limit.
- Não há configuração de prefetch.
- Não há configuração de concorrência nesse arquivo; isso provavelmente vem do comando do worker no Docker Compose.
- Não há configuração específica para produção.

### Melhorias futuras para Celery

Possíveis melhorias futuras:

```text
1. Configurar task_time_limit.
2. Configurar task_soft_time_limit.
3. Ajustar worker_concurrency.
4. Ajustar worker_prefetch_multiplier.
5. Configurar retry para tarefas específicas.
6. Separar filas no futuro:
   - accessibility_queue
   - ai_queue
   - reports_queue
```

Mas para o estado atual, a configuração é aceitável e funcional.

---

## 9. analyzer_service.py

O `analyzer_service.py` é o coração atual da análise de acessibilidade.

Função principal:

```python
async def executar_analise_completa(url: str):
```

Essa função é chamada pelo worker Celery, via `tasks.py`.

Ela não é chamada diretamente pelo FastAPI.

### Fluxo atual do analyzer_service.py

```text
1. Recebe URL.
2. Marca tempo inicial.
3. Registra logs.
4. Valida se a URL usa http ou https.
5. Inicia Playwright.
6. Abre Chromium headless.
7. Cria contexto isolado.
8. Cria página.
9. Intercepta requisições.
10. Bloqueia recursos pesados.
11. Acessa a URL com timeout de 45s.
12. Captura status HTTP.
13. Captura título da página.
14. Captura tamanho do HTML.
15. Executa AxeCore na página.
16. Fecha navegador.
17. Processa o JSON bruto do Axe.
18. Monta lista limpa de erros.
19. Monta resumo para MongoDB.
20. Salva resumo em `historico_analises`.
21. Retorna resultado limpo para o frontend.
```

### Validação de URL

O serviço valida se a URL possui esquema:

```python
parsed_url = urllib.parse.urlparse(url)

if not parsed_url.scheme in ["http", "https"]:
    return {"error": "A URL fornecida é inválida. Use http:// ou https://"}
```

Atualmente, se o usuário digitar uma URL sem `http://` ou `https://`, o backend retorna erro.

Possível melhoria futura:

```text
Se o usuário digitar "example.com", o backend pode tentar completar como "https://example.com".
```

Mas isso precisa ser decidido com cuidado.

### Playwright

O serviço usa:

```python
async with async_playwright() as p:
```

Dentro disso, abre Chromium:

```python
browser = await p.chromium.launch(
    headless=True,
    args=["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"]
)
```

Depois cria contexto e página:

```python
context = await browser.new_context(
    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
)

page = await context.new_page()
```

O contexto isola a execução da página.

### Bloqueio de recursos pesados

O código bloqueia:

```text
image
media
font
websocket
```

Isso é feito com:

```python
await page.route("**/*", interceptar_rotas)
```

E a função decide:

```python
if route.request.resource_type in ["image", "media", "font", "websocket"]:
    await route.abort()
else:
    await route.continue_()
```

Esse bloqueio reduz:

```text
- tráfego de rede
- tempo de carregamento
- consumo de memória
- chance de sites muito pesados travarem o worker
```

Essa é uma otimização válida.

### Navegação

A navegação atual usa:

```python
resposta_pagina = await page.goto(url, wait_until="load", timeout=45000)
```

Isso significa:

```text
wait_until="load"
→ espera o evento load da página.

timeout=45000
→ espera no máximo 45 segundos.
```

Se der timeout:

```python
return {"error": "O site demorou mais de 45 segundos para responder."}
```

Se der erro de rede:

```python
return {"error": "Não foi possível acessar o site. Detalhe: ..."}
```

### AxeCore

A análise WCAG é feita com:

```python
results = await Axe().run(page)
```

O resultado bruto vem de:

```python
results.response.get("violations", [])
```

Cada violação pode ter vários nodes afetados.

O serviço transforma o resultado em uma lista simples:

```python
relatorio_limpo.append({
    "id": erro["id"],
    "impacto": node.get("impact", impacto),
    "descricao": erro.get("description", "Sem descrição"),
    "ajuda": erro.get("help", "Sem ajuda"),
    "elemento_html": node.get("html", "N/A"),
})
```

### Resumo de severidade

O serviço conta severidades:

```python
contagem_impacto = {
    "critical": 0,
    "serious": 0,
    "moderate": 0,
    "minor": 0
}
```

Também calcula:

```text
regras_violadas
total_elementos_afetados
```

### MongoDB

O analyzer salva no MongoDB um resumo, não o relatório completo.

Documento atual:

```python
documento = {
    "versao_documento": "1.2",
    "url_analisada": url,
    "titulo_pagina": titulo_pagina,
    "status_http": status_http,
    "tamanho_pagina_kb": round(peso_html_bytes/1024, 2),
    "data_hora": datetime.now(timezone(timedelta(hours=-3))),
    "tempo_total_segundos": round(tempo_total_segundos, 3),
    "resumo_erros": {
        "regras_violadas": len(violation_data),
        "total_elementos": total_elementos_afetados,
        "gravidade": contagem_impacto
    }
}
```

Coleção usada:

```python
colecao_analises
```

### Resposta para o frontend

O retorno atual é:

```python
return {
    "url": url,
    "titulo": titulo_pagina,
    "total_erros": len(relatorio_limpo),
    "erros": relatorio_limpo
}
```

### Pontos de atenção do analyzer_service.py

O arquivo funciona, mas concentra muitas responsabilidades:

```text
1. Validação de URL
2. Configuração do navegador
3. Interceptação de recursos
4. Navegação
5. Execução do Axe
6. Transformação do resultado
7. Persistência no MongoDB
8. Logs
9. Tratamento de erro
10. Montagem da resposta para o frontend
```

Isso é aceitável no estado atual, mas deve ser separado futuramente.

### Playwright é pesado?

Sim.

Playwright é uma parte pesada porque abre um navegador real/headless.

Atualmente, o serviço abre e fecha um Chromium por análise.

Vantagens:

```text
- Simples
- Seguro
- Cada análise é isolada
- Menor risco de vazamento de estado entre sites
- Fácil de depurar
```

Desvantagens:

```text
- Mais lento
- Consome mais CPU e memória
- Pode pesar no servidor da faculdade
- Escala pior com muitos usuários
```

### Níveis de evolução do uso do Playwright

Nível atual:

```text
Nível 1 — MVP seguro
→ abre browser por análise
→ fecha browser no final
```

Próximo nível possível:

```text
Nível 2 — otimização moderada
→ manter browser vivo por worker
→ criar novo context/page por análise
→ fechar context/page no final
```

Nível mais robusto:

```text
Nível 3 — serviço dedicado de browser
→ gerenciar pool de browsers
→ limitar concorrência
→ reiniciar browser em caso de falha
→ controlar memória
```

Nível plataforma:

```text
Nível 4 — pipeline modular
→ análise rápida primeiro
→ análises pesadas em etapas
→ resultados parciais
→ frontend acompanha progresso
```

### Decisão atual sobre Playwright

Decisão atual:

```text
Não otimizar Playwright agora.
```

Motivo:

```text
O modelo atual é mais simples, mais seguro e está funcionando.
```

Otimizar reutilização de browser pode trazer bugs difíceis, como:

```text
- browser travado entre tarefas
- vazamento de memória
- contextos não fechados
- estado vazando entre sites
- worker instável
```

Antes de otimizar, o backend deve estar bem documentado e os fluxos devem estar estabilizados.

### Melhorias futuras para analyzer_service.py

Possíveis melhorias:

```text
1. Separar validação de URL em função própria.
2. Separar navegação Playwright em browser_service.py.
3. Separar execução Axe em accessibility_service.py.
4. Separar transformação de resultado em mapper próprio.
5. Separar persistência em repository.
6. Tornar timeout configurável via .env.
7. Tornar bloqueio de recursos configurável.
8. Criar modo rápido e modo completo.
9. Salvar relatório completo no MongoDB.
10. Criar status progressivo via Celery.
11. Usar logging estruturado.
12. Criar tratamento de erro mais granular.
13. Avaliar reaproveitamento de browser por worker apenas depois.
```

---

## 10. ai_service.py

O `ai_service.py` controla a lógica atual do chat com IA.

Responsabilidades atuais:

```text
1. Ler chave GEMINI_API_KEY.
2. Criar client Gemini.
3. Ler lista de modelos.
4. Definir prompt do sistema.
5. Consultar cache no MongoDB.
6. Chamar Gemini se não houver cache.
7. Tratar erros de provider.
8. Fazer fallback entre modelos.
9. Salvar resposta no cache.
10. Retornar resposta padronizada para o frontend.
```

Função principal:

```python
async def gerar_resposta_chat(mensagem_usuario: str) -> dict:
```

### Fluxo atual da IA

```text
POST /chat
→ main.py chama gerar_resposta_chat(mensagem)
→ ai_service.py verifica GEMINI_API_KEY
→ consulta cache MongoDB
→ se houver cache, retorna resposta salva
→ se não houver cache, monta prompt final
→ tenta modelo 1
→ se falhar, tenta próximo modelo
→ se algum responder, salva no cache
→ retorna resposta
```

### Variáveis de ambiente

Chave da API:

```python
API_KEY = os.getenv("GEMINI_API_KEY", "")
```

Modelos:

```python
modelos_env = os.getenv(
    "GEMINI_MODELOS",
    "gemini-2.5-flash,gemini-2.5-flash-lite,gemini-2.0-flash"
)
```

Se `GEMINI_MODELOS` não existir, usa a lista padrão.

### Modelos atuais

Lista padrão atual:

```text
gemini-2.5-flash
gemini-2.5-flash-lite
gemini-2.0-flash
```

### Prompt do sistema

O prompt atual orienta a IA a agir como especialista em WCAG.

Quando o usuário relata um erro ou envia código, a resposta deve seguir formato com:

```text
Diagnóstico
Como Corrigir
Código Original
Código Corrigido
```

Para dúvidas gerais, responde de forma natural, clara e concisa.

### Cache da IA

O cache usa MongoDB.

Coleção usada:

```python
colecao_cache_ia
```

Busca atual:

```python
colecao_cache_ia.find_one({"mensagem": mensagem_usuario})
```

Se encontrar cache, retorna:

```python
{
    "status": "sucesso",
    "modelo_utilizado": "cache_mongodb",
    "dados": resposta_salva["resposta"]
}
```

Se não encontrar cache, chama a IA.

### Chamada ao Gemini

A chamada ao provider é feita por:

```python
return await client.aio.models.generate_content(
    model=modelo_escolhido,
    contents=prompt_final
)
```

### Tratamento de erro

O arquivo identifica erros comuns:

```text
429
→ limite de cota/rate limit

503
→ modelo indisponível ou sobrecarregado

404
→ modelo inválido ou não disponível
```

Se todos os modelos falharem, retorna:

```python
{
    "status": "erro",
    "mensagem": "Serviço de IA temporariamente indisponível. Tente mais tarde."
}
```

Esse formato é importante porque o frontend espera `status`, `mensagem` ou `dados`.

### Retry

O serviço usa Tenacity:

```python
@retry(
    wait=wait_random_exponential(multiplier=2, max=15),
    stop=stop_after_attempt(3),
    retry=retry_if_exception(erro_de_limite),
    reraise=True
)
```

Atualmente, retry é aplicado para limite/cota.

### Pontos de atenção do ai_service.py

O arquivo funciona, mas tem pontos importantes:

```text
1. Está fortemente acoplado ao Gemini.
2. O cache usa mensagem exata como chave.
3. O prompt está hardcoded no arquivo.
4. As operações MongoDB são síncronas dentro de função async.
5. A escolha de modelos ainda é manual/hardcoded.
6. Logs usam print.
7. Trocar para Grok exigirá mexer no arquivo.
```

### Decisão futura sobre modelos de IA

O objetivo futuro é evitar troca manual de modelos no código.

A estratégia desejada é:

```text
1. Consultar modelos disponíveis no provider.
2. Verificar quais modelos suportam geração de texto/chat.
3. Aplicar uma lista de modelos permitidos pelo projeto.
4. Escolher o melhor modelo disponível.
5. Fazer fallback automático quando falhar.
6. Cachear a lista de modelos disponíveis por algum tempo.
7. Evitar usar modelo inexistente/descontinuado.
```

Importante:

```text
O sistema não deve simplesmente escolher qualquer modelo disponível.
```

A escolha precisa seguir regras:

```text
- compatibilidade com chat/texto
- estabilidade
- custo
- limite da chave/projeto
- prioridade definida pela aplicação
- fallback seguro
```

### Possível arquitetura futura para IA

```text
backend/
├── services/
│   ├── ai_service.py
│   ├── model_registry.py
│   └── providers/
│       ├── base_provider.py
│       ├── gemini_provider.py
│       └── grok_provider.py
```

Responsabilidades futuras:

```text
ai_service.py
→ coordena cache, prompt, provider e resposta.

model_registry.py
→ lista modelos disponíveis, filtra e escolhe o modelo.

providers/gemini_provider.py
→ sabe chamar a API do Gemini.

providers/grok_provider.py
→ sabe chamar a API do Grok/xAI.

base_provider.py
→ define contrato comum para providers.
```

### Melhorias futuras para IA

```text
1. Separar provider Gemini do ai_service.py.
2. Preparar provider Grok.
3. Criar model_registry.py.
4. Criar cache_key normalizada.
5. Incluir versão do prompt no cache.
6. Separar prompts em arquivos próprios.
7. Registrar provider/modelo usado.
8. Trocar prints por logging.
9. Criar fallback automático por provider.
10. Criar opção futura para usuário configurar chave/modelo.
```

---

## 11. database.py

O `database.py` configura a conexão com MongoDB Atlas.

Responsabilidades atuais:

```text
1. Ler MONGO_URI do ambiente.
2. Criar MongoClient.
3. Testar conexão.
4. Selecionar banco.
5. Expor coleções usadas pelo sistema.
```

Variável principal:

```python
MONGO_URI = os.getenv("MONGO_URI")
```

Se `MONGO_URI` não existir, o banco é desativado:

```text
O sistema continua rodando parcialmente.
```

Conexão:

```python
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
```

A chamada:

```python
client.server_info()
```

força o teste real de conexão.

Banco usado atualmente:

```text
waveclone_db
```

Coleções atuais:

```python
colecao_analises = db["historico_analises"] if db is not None else None
colecao_cache_ia = db["cache_ia"] if db is not None else None
```

### historico_analises

Usada por:

```text
analyzer_service.py
```

Guarda resumo da análise de acessibilidade.

Dados salvos atualmente:

```text
versao_documento
url_analisada
titulo_pagina
status_http
tamanho_pagina_kb
data_hora
tempo_total_segundos
resumo_erros
```

### cache_ia

Usada por:

```text
ai_service.py
```

Guarda perguntas e respostas de IA.

Dados salvos atualmente:

```text
mensagem
resposta
modelo
data_hora
```

### Pontos de atenção do database.py

```text
1. Nome do banco está hardcoded como waveclone_db.
2. Logs usam print.
3. Coleções são variáveis globais.
4. Usa PyMongo síncrono.
5. Não há camada de repository.
6. Não há índices configurados no código.
7. Cache da IA usa mensagem exata.
```

### Melhorias futuras para banco

```text
1. Mover nome do banco para MONGO_DB_NAME no .env.
2. Criar camada repositories/.
3. Criar analysis_repository.py.
4. Criar ai_cache_repository.py.
5. Criar índices para cache e histórico.
6. Avaliar Motor/Mongo async se a aplicação crescer.
7. Trocar prints por logging estruturado.
```

---

## 12. Infraestrutura atual

A aplicação roda com Docker Compose.

Serviços esperados:

```text
frontend
backend
worker
redis
nginx
```

Fluxo de infraestrutura:

```text
Navegador
→ localhost:8081
→ Nginx
→ frontend Vite
→ backend FastAPI
→ Redis/Celery para análise
→ MongoDB Atlas para persistência/cache
```

O Nginx atua como proxy reverso.

O Redis é usado por Celery.

O worker executa tarefas pesadas.

O backend recebe requisições HTTP.

O frontend serve a interface.

### Observação sobre logs

Atualmente, ao rodar:

```bash
docker compose up --build
```

muitos logs aparecem no terminal.

Isso acontece porque sobem vários serviços ao mesmo tempo:

```text
frontend
backend
worker
redis
nginx
```

E alguns serviços geram muitos logs:

```text
- Uvicorn
- Celery
- Worker
- MongoDB connection logs
- Nginx access logs
- Logs customizados com print
- Playwright/análise
```

### Decisão futura sobre execução local

Para desenvolvimento, o ideal é separar comandos:

```text
Uso normal:
docker compose up

Rebuild:
docker compose up --build
somente quando mudar Dockerfile ou dependências

Logs específicos:
docker compose logs backend
docker compose logs worker
docker compose logs frontend
```

Também pode ser criado um README com comandos oficiais de desenvolvimento.

---

## 13. Pontos de limpeza identificados

Arquivos/pastas que parecem não fazer parte do produto final e precisam ser avaliados antes de remover:

```text
cd
git
teste.html
node_modules/ na raiz
package.json na raiz
package-lock.json na raiz
frontend/dist/
frontend/node_modules/
backend/__pycache__/
backend/services/__pycache__/
frontend/public/vite.svg
frontend/src/assets/react.svg
```

Atenção:

```text
Não remover nada sem verificar se está versionado, se é usado e se a aplicação continua funcionando.
```

Procedimento seguro:

```text
1. Verificar git status.
2. Verificar se arquivo é referenciado.
3. Remover um grupo pequeno.
4. Rodar aplicação.
5. Rodar build.
6. Commitar.
7. Seguir para o próximo grupo.
```

---

## 14. Diretrizes de trabalho daqui para frente

Regra principal:

```text
Não fazer grandes mudanças de uma vez.
```

Processo recomendado:

```text
1. Entender arquivo atual.
2. Documentar responsabilidade.
3. Identificar risco.
4. Propor melhoria.
5. Perguntar antes de aplicar.
6. Alterar pouco.
7. Testar.
8. Commitar.
9. Continuar.
```

Antes de qualquer alteração importante, responder:

```text
O que vamos alterar?
Por que vamos alterar?
Qual o risco?
Como testar?
Como reverter?
```

---

## 15. Arquitetura futura desejada

A estrutura atual funciona, mas pode evoluir para algo mais profissional.

Possível estrutura futura:

```text
backend/
├── app/
│   ├── api/
│   │   ├── routes_analysis.py
│   │   └── routes_chat.py
│   ├── core/
│   │   ├── config.py
│   │   └── logging.py
│   ├── schemas/
│   │   ├── analysis_schema.py
│   │   └── chat_schema.py
│   ├── services/
│   │   ├── analysis_service.py
│   │   ├── browser_service.py
│   │   ├── accessibility_service.py
│   │   ├── ai_service.py
│   │   └── model_registry.py
│   ├── providers/
│   │   ├── base_provider.py
│   │   ├── gemini_provider.py
│   │   └── grok_provider.py
│   ├── repositories/
│   │   ├── analysis_repository.py
│   │   └── ai_cache_repository.py
│   ├── workers/
│   │   ├── celery_app.py
│   │   └── tasks.py
│   └── main.py
├── requirements.txt
└── Dockerfile
```

Essa estrutura não deve ser aplicada agora de uma vez.

Ela serve como direção.

---

## 16. Plano de evolução em fases

### Fase 1 — Documentação e entendimento

Status: em andamento.

Objetivo:

```text
Entender o backend atual sem alterar comportamento.
```

Arquivos analisados:

```text
main.py
tasks.py
celery_app.py
analyzer_service.py
ai_service.py
database.py
```

Resultado:

```text
Este documento.
```

---

### Fase 2 — Limpeza segura

Objetivo:

```text
Remover arquivos claramente inúteis sem mexer em lógica.
```

Possíveis candidatos:

```text
cd
git
teste.html
__pycache__
node_modules raiz
dist
assets padrão do Vite/React
```

Procedimento:

```text
Remover um grupo pequeno
→ testar
→ commit
```

---

### Fase 3 — Configuração centralizada

Objetivo:

```text
Parar de espalhar os.getenv pelo sistema.
```

Criar futuramente:

```text
core/config.py
```

Configurações:

```text
REDIS_URL
MONGO_URI
MONGO_DB_NAME
GEMINI_API_KEY
GEMINI_MODELOS
AI_PROVIDER
ANALYSIS_TIMEOUT
BLOCK_RESOURCE_TYPES
ENVIRONMENT
CORS_ORIGINS
```

---

### Fase 4 — Logging estruturado

Objetivo:

```text
Trocar print por logging.
```

Benefícios:

```text
- controlar nível de log
- reduzir poluição no terminal
- separar logs por serviço
- facilitar debug em produção
```

---

### Fase 5 — Melhorar fila/status

Objetivo:

```text
Dar feedback mais profissional durante a análise.
```

Exemplo futuro:

```text
validando_url
abrindo_browser
carregando_pagina
executando_axe
salvando_resultado
finalizado
```

---

### Fase 6 — Modularizar análise

Objetivo:

```text
Separar analyzer_service.py em partes menores.
```

Possíveis módulos:

```text
url_validator.py
browser_service.py
accessibility_service.py
analysis_mapper.py
analysis_repository.py
```

---

### Fase 7 — Preparar multi-analisadores

Objetivo:

```text
Transformar acessibilidade em um módulo entre vários.
```

Possíveis analisadores futuros:

```text
accessibility_analyzer.py
seo_analyzer.py
performance_analyzer.py
security_analyzer.py
best_practices_analyzer.py
```

---

### Fase 8 — Preparar IA multi-provider

Objetivo:

```text
Permitir Gemini, Grok ou outro provider sem reescrever todo o serviço de IA.
```

Possível estrutura:

```text
providers/
├── base_provider.py
├── gemini_provider.py
└── grok_provider.py
```

---

## 17. Decisões técnicas atuais

Decisões já tomadas:

```text
1. Não refatorar tudo de uma vez.
2. Manter backend funcional antes de organizar.
3. Documentar antes de alterar.
4. Manter Playwright abrindo/fechando por análise por enquanto.
5. Não otimizar browser antes de estabilizar arquitetura.
6. Manter IA atual funcionando.
7. Preparar troca futura para Grok depois.
8. Não confiar em IA para apagar arquivos sem validação.
9. Trabalhar em etapas pequenas.
10. Testar e commitar após cada etapa.
```

---

## 18. Estado atual considerado seguro

Até este momento, a aplicação está funcionando com:

```text
docker compose up --build
```

Acesso:

```text
http://localhost:8081
```

Funcionalidades confirmadas pelo usuário:

```text
- Aplicação sobe.
- Análise de URL funciona.
- Chat/IA funciona normalmente.
- Backend está funcional.
```

---

## 19. Próximos passos recomendados

Próxima etapa recomendada:

```text
1. Salvar este documento.
2. Fazer commit da documentação.
3. Revisar docker-compose.yml e nginx.conf.
4. Entender por que a inicialização gera muitos logs.
5. Planejar limpeza segura de arquivos temporários.
```

Não recomendado agora:

```text
- Refatorar analyzer_service.py imediatamente.
- Trocar provider de IA imediatamente.
- Otimizar Playwright imediatamente.
- Reorganizar pastas do backend de uma vez.
- Apagar arquivos sem verificar uso.
```

---

## 20. Resumo executivo

O backend atual está funcional e bem encaminhado para um MVP/TCC.

A arquitetura principal é:

```text
FastAPI
→ recebe requisições

Celery + Redis
→ processa análise pesada em background

Playwright
→ carrega páginas reais

AxeCore
→ detecta problemas de acessibilidade

MongoDB
→ salva histórico e cache

Gemini
→ responde dúvidas e explica correções
```

O maior valor atual da aplicação está no fluxo:

```text
URL → análise automatizada → relatório → explicação com IA
```

A evolução correta não é reescrever tudo, mas transformar esse fluxo em uma plataforma modular de auditoria web.

O backend deve evoluir com segurança, seguindo esta ordem:

```text
documentar
limpar
centralizar configuração
melhorar logs
melhorar status
separar responsabilidades
adicionar novos analisadores
preparar IA multi-provider
```