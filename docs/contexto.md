# contexto.md — Contexto Geral do Projeto TC Acessibilidade

> Documento de contexto geral do projeto.  
> Este arquivo existe para registrar a visão do produto, decisões técnicas, estado atual, próximos passos e cuidados importantes antes de qualquer alteração no código.

---

## 1. Visão Geral

O **TC Acessibilidade** é o projeto que estou desenvolvendo para o meu Trabalho de Conclusão de Curso, com foco principal em **análise de acessibilidade digital em páginas web**.

A ideia central é permitir que uma pessoa informe uma URL pública e receba uma análise automatizada dos principais problemas de acessibilidade encontrados naquela página. Além da análise técnica, o projeto também conta com um assistente de IA para ajudar o usuário a entender os problemas encontrados e receber orientações de correção.

O projeto não deve ser tratado apenas como uma tela simples para cumprir um requisito acadêmico. A meta é construir uma base real de produto, com backend funcional, fila de processamento, análise automatizada, respostas amigáveis, documentação, fluxo de deploy e frontend organizado.

Mesmo sendo um TCC, quero que esse projeto também funcione como portfólio pessoal, mostrando domínio de backend, frontend, Docker, filas, automação de navegador, IA, banco de dados e preocupação com experiência do usuário.

---

## 2. Objetivo Principal do Projeto

O objetivo principal, neste momento, é criar uma plataforma que ajude estudantes, desenvolvedores iniciantes e outros usuários a identificarem problemas de acessibilidade em sites.

O fluxo ideal é:

```text
Usuário informa uma URL
→ sistema valida a entrada
→ backend envia a análise para uma fila
→ worker abre a página com Playwright
→ AxeCore analisa o DOM carregado
→ backend organiza os problemas encontrados
→ frontend mostra um relatório claro
→ IA ajuda a explicar e corrigir os problemas
```

O foco atual é **acessibilidade digital**, principalmente usando AxeCore como base técnica.

No futuro, o projeto pode crescer para analisar outras áreas de qualidade web, como performance, SEO, boas práticas, segurança básica e qualidade técnica. Porém, isso não deve desviar o foco atual. A entrega principal do TCC precisa ser primeiro uma análise de acessibilidade confiável, compreensível e bem apresentada.

---

## 3. Escopo Atual do TCC

O escopo atual é:

```text
Análise automatizada de acessibilidade em páginas web.
```

Entram no escopo atual:

- análise de URL pública;
- uso de Playwright para carregar páginas reais;
- uso de AxeCore para detectar violações de acessibilidade;
- fila de processamento com Celery e Redis;
- mensagens de status durante análise;
- relatório com problemas encontrados;
- separação por severidade;
- assistente de IA para explicar erros;
- cache de respostas da IA;
- registro básico de histórico no MongoDB;
- documentação técnica e operacional;
- deploy em servidor da faculdade;
- interface frontend clara o suficiente para demonstração e uso.

Não entram como prioridade neste ciclo:

- Google Lighthouse;
- SEO;
- performance;
- segurança ampla;
- histórico completo no frontend;
- exportação de relatório;
- cancelamento de análise;
- sistema de login;
- dashboard administrativo;
- múltiplos usuários com controle de conta;
- configurações avançadas de IA;
- aplicativo mobile real;
- análise em grande escala.

Essas ideias podem ser consideradas no futuro, mas não podem atrapalhar a estabilização do fluxo principal.

---

## 4. Autoria e Contexto Acadêmico

Autor do projeto:

```text
Gabriel Lourenço de Oliveira
```

Instituição:

```text
UNIFENAS — Campus Alfenas
```

Curso:

```text
Ciência da Computação
```

Período informado no contexto atual do projeto:

```text
7º período
```

Orientador:

```text
Professor Celso
```

Links profissionais:

```text
GitHub:   https://github.com/Gabriel-Oliviera42
LinkedIn: https://www.linkedin.com/in/gabriel-lourenco-ab7893273
```

A aplicação deve refletir esse contexto acadêmico sem parecer amadora. A banca precisa entender rapidamente o objetivo, mas o projeto também deve passar a impressão de que poderia evoluir para uma ferramenta real.

---

## 5. Nome do Projeto

O nome definitivo ainda não está fechado.

Nome atual/provisório usado nas discussões:

```text
TC Acessibilidade
```

Nome visual sugerido para o produto:

```text
AcessiLab
```

Motivo do nome AcessiLab:

- remete diretamente a acessibilidade;
- tem tom acadêmico;
- combina com ideia de laboratório/análise;
- funciona para apresentação de TCC;
- não limita totalmente o crescimento futuro;
- pode ser usado no frontend como nome de produto.

Outras ideias já consideradas:

- TC Acessibilidade;
- AcessiLab;
- AcessiCheck;
- AcessiScan;
- Acessibilidade Lab;
- AcessiWeb;
- WebAcessivel;
- IncluiWeb;
- A11y Mentor;
- WCAG Assist;
- Verifica Acessibilidade.

Critérios para o nome final:

- precisa ser fácil de explicar;
- precisa parecer profissional;
- precisa funcionar bem para banca;
- precisa funcionar bem no portfólio;
- não deve ser técnico demais para usuários comuns;
- não deve limitar o projeto caso ele cresça para outras análises web.

---

## 6. Usuário Principal

O usuário principal inicial são estudantes e desenvolvedores iniciantes que estão criando sites e querem entender se suas páginas possuem problemas de acessibilidade.

Públicos considerados:

- estudantes de desenvolvimento web;
- professores;
- avaliadores;
- desenvolvedores iniciantes;
- donos de sites;
- usuários comuns curiosos sobre acessibilidade;
- pessoas interessadas em melhorar a qualidade de suas páginas.

A linguagem da aplicação deve ser:

```text
simples, didática e profissional.
```

O sistema não deve despejar erro técnico cru para o usuário final. A parte técnica precisa existir, mas deve ser organizada para não assustar nem confundir.

A referência de experiência desejada é algo parecido com ferramentas como WAVE: primeiro mostrar o problema de forma visual e compreensível, depois permitir que o usuário aprofunde nos detalhes técnicos.

---

## 7. Meta de Produto

A meta é construir uma ferramenta que pareça real.

A aplicação deve ter:

- fluxo funcional;
- mensagens amigáveis;
- tratamento de erro decente;
- backend separado do frontend;
- fila para tarefas pesadas;
- persistência mínima;
- IA integrada;
- layout organizado;
- documentação suficiente para manutenção;
- deploy reproduzível;
- comandos claros de desenvolvimento.

O projeto também deve demonstrar decisões técnicas profissionais. Isso significa evitar grandes refatorações sem necessidade, documentar antes de alterar e evoluir por etapas.

Regra principal:

```text
Não trocar uma aplicação funcionando por uma bagunça bonita.
```

Primeiro estabilizar o fluxo principal. Depois melhorar a interface. Depois evoluir arquitetura.

---

## 8. Estado Atual da Aplicação

A aplicação já possui uma base funcional.

Componentes principais atuais:

```text
frontend
backend
worker
redis
nginx
MongoDB Atlas
Gemini
```

Fluxo de acesso local:

```text
http://localhost:8081
```

Fluxo de acesso no servidor da faculdade:

```text
http://129.121.43.216:8081
```

A porta externa obrigatória do projeto é:

```text
8081
```

Funcionalidades que já foram consideradas funcionando em algum momento do desenvolvimento:

- aplicação sobe via Docker Compose;
- frontend é acessado via Nginx;
- backend recebe requisições;
- análise de URL entra na fila;
- worker executa análise;
- Playwright carrega páginas;
- AxeCore encontra violações;
- frontend consulta status;
- resultado aparece na tela;
- chat com IA responde;
- MongoDB é usado para cache e histórico;
- documentação inicial já existe.

---

## 9. Stack Técnica Atual

### Backend

```text
FastAPI
Pydantic
Celery
Redis
Playwright
AxeCore / axe-playwright-python
PyMongo
Google Gemini
Tenacity
Docker
```

### Frontend

```text
React
Vite
Tailwind
Axios
React Markdown
React Syntax Highlighter
React Resizable Panels
```

### Infraestrutura

```text
Docker Compose
Nginx
MongoDB Atlas
Servidor da faculdade
```

### IA

```text
Google Gemini
```

Modelos atuais configurados por padrão:

```text
gemini-2.5-flash
gemini-2.5-flash-lite
gemini-2.0-flash
```

---

## 10. Arquitetura Geral Atual

A arquitetura atual usa separação entre API, worker e fila.

Desenho geral:

```text
Navegador
→ Nginx
→ Frontend React
→ Backend FastAPI
→ Celery
→ Redis
→ Worker
→ Playwright
→ AxeCore
→ MongoDB Atlas
→ Resultado para Frontend
```

O backend não executa diretamente a análise pesada no processo HTTP.

Isso é importante porque Playwright pode demorar, consumir memória e travar uma requisição se rodar diretamente dentro do endpoint.

Por isso, a análise segue o modelo assíncrono:

```text
POST /analisar
→ retorna ticket_id
→ frontend consulta GET /analisar/status/{ticket_id}
→ backend informa estado da tarefa
→ quando finaliza, retorna o resultado
```

Essa decisão deixa o sistema mais profissional e preparado para lidar com análises demoradas.

---

## 11. Estrutura Atual Relevante

Estrutura principal do backend:

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

Responsabilidades:

```text
main.py
→ define endpoints FastAPI.

tasks.py
→ define task Celery de análise.

celery_app.py
→ configura Celery com Redis.

database.py
→ conecta ao MongoDB Atlas e expõe coleções.

services/analyzer_service.py
→ executa Playwright, AxeCore e organiza resultado.

services/ai_service.py
→ gerencia prompt, cache, modelos e chamada ao Gemini.

requirements.txt
→ dependências Python.

Dockerfile
→ imagem usada pelo backend e worker.
```

Estrutura esperada de serviços Docker:

```text
backend
frontend
nginx
redis
worker
```

---

## 12. Fluxo Detalhado da Análise de URL

Fluxo completo atual:

```text
1. Usuário digita uma URL no frontend.
2. Frontend envia POST /analisar para o backend.
3. Backend recebe a URL.
4. Backend cria uma tarefa Celery.
5. Celery envia a tarefa para o Redis.
6. Worker Celery pega a tarefa.
7. Worker chama executar_analise_completa(url).
8. analyzer_service valida a URL.
9. Playwright inicia Chromium headless.
10. Playwright cria contexto e página.
11. Recursos pesados são bloqueados quando possível.
12. Página é carregada.
13. Status HTTP é capturado.
14. Título da página é capturado.
15. HTML é medido.
16. AxeCore roda sobre o DOM carregado.
17. Resultado bruto do Axe é processado.
18. Violações são transformadas em relatório limpo.
19. Resumo é salvo no MongoDB.
20. Worker retorna resultado para o Celery.
21. Redis guarda status/resultado.
22. Frontend consulta status pelo ticket_id.
23. Backend devolve resultado final.
24. Frontend exibe resumo e lista de problemas.
```

Esse fluxo é o coração da aplicação.

---

## 13. Endpoint `/analisar`

O endpoint `/analisar` é responsável por receber uma URL e iniciar a análise.

Ele não faz a análise diretamente.

Fluxo simplificado:

```text
Recebe URL
→ cria task Celery
→ retorna ticket_id
```

Exemplo conceitual:

```python
tarefa = tarefa_analisar_site.delay(req.url)
```

O retorno esperado para o frontend inclui um identificador da tarefa, que será usado para consultar o andamento.

---

## 14. Endpoint `/analisar/status/{ticket_id}`

Esse endpoint consulta o estado da task no Celery/Redis.

Estados principais:

```text
PENDING
STARTED
PROGRESS
SUCCESS
FAILURE
```

Status atuais ou desejados:

```text
PENDING
→ análise está na fila.

STARTED
→ worker começou a processar.

PROGRESS
→ worker informou uma etapa específica.

SUCCESS
→ análise terminou tecnicamente com sucesso.

FAILURE
→ tarefa falhou de forma crítica.
```

Importante:

Uma task pode terminar com `SUCCESS` no Celery e ainda assim conter um erro tratado de análise. Exemplo:

```text
O site demorou demais para responder.
```

Nesse caso, o sistema não deve considerar como relatório vazio. O frontend precisa reconhecer que o backend retornou um erro controlado e mostrar a mensagem amigável.

---

## 15. Endpoint `/chat`

O endpoint `/chat` recebe uma mensagem do usuário e chama o serviço de IA.

Fluxo:

```text
Usuário envia pergunta
→ frontend chama POST /chat
→ backend recebe mensagem
→ ai_service consulta cache MongoDB
→ se houver cache, retorna resposta salva
→ se não houver cache, chama Gemini
→ se Gemini responder, salva resposta no cache
→ retorna resposta ao frontend
```

A IA deve ajudar principalmente com:

- explicar problemas de acessibilidade;
- orientar correções;
- revisar trechos HTML;
- sugerir código corrigido;
- traduzir mensagens técnicas para uma explicação mais clara;
- ajudar estudantes a entenderem o motivo do erro.

A IA não deve ser tratada como fonte primária da auditoria. A análise técnica vem do AxeCore. A IA explica, prioriza e orienta.

---

## 16. Playwright

Playwright é usado porque a página precisa ser carregada como um navegador real.

Muitos sites modernos dependem de JavaScript. Apenas baixar HTML cru não seria suficiente para analisar o DOM final.

Uso atual:

```text
Playwright abre Chromium headless
→ carrega a página
→ permite AxeCore analisar o DOM renderizado
```

Argumentos usados no Chromium:

```text
--disable-gpu
--no-sandbox
--disable-dev-shm-usage
```

Esses argumentos ajudam a rodar em ambiente Docker/servidor.

O Playwright é uma das partes mais pesadas do sistema, porque abrir navegador consome CPU e memória.

Decisão atual:

```text
Manter Playwright abrindo e fechando por análise.
```

Motivo:

- é mais simples;
- é mais seguro;
- evita vazamento de estado entre sites;
- reduz bugs difíceis;
- facilita depuração;
- é suficiente para o momento atual do TCC.

Otimizar browser agora poderia criar problemas maiores do que os benefícios.

---

## 17. Bloqueio de Recursos Pesados

Durante a análise, alguns tipos de recurso são bloqueados para reduzir consumo:

```text
image
media
font
websocket
```

Motivos:

- reduzir tráfego;
- acelerar carregamento;
- diminuir uso de memória;
- evitar páginas muito pesadas;
- melhorar chance de análise terminar em servidor limitado.

Essa estratégia é válida para o contexto atual, mas precisa ser lembrada: a página analisada pode não estar exatamente igual ao carregamento completo de um navegador normal. Porém, para a análise de acessibilidade baseada no DOM, geralmente isso é aceitável.

---

## 18. AxeCore

AxeCore é a base técnica da análise de acessibilidade.

Ele identifica violações e retorna informações como:

- id da regra;
- impacto/severidade;
- descrição;
- ajuda;
- elementos HTML afetados;
- nós problemáticos.

O backend transforma o resultado bruto em uma estrutura mais simples para o frontend.

Formato simplificado de cada erro:

```text
id
impacto
descricao
ajuda
elemento_html
```

Severidades consideradas:

```text
critical
serious
moderate
minor
```

A interface deve priorizar os problemas mais graves.

Ordem recomendada:

```text
critical
serious
moderate
minor
```

---

## 19. MongoDB Atlas

O MongoDB Atlas é usado atualmente para duas funções principais:

```text
1. Histórico/resumo das análises.
2. Cache das respostas da IA.
```

Banco usado atualmente:

```text
waveclone_db
```

Coleções atuais:

```text
historico_analises
cache_ia
```

### Histórico de Análises

O histórico guarda um resumo, não necessariamente o relatório completo.

Campos principais:

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

Isso ajuda a demonstrar uso do sistema no TCC e permite métricas futuras.

### Cache da IA

O cache atual usa a mensagem exata do usuário como chave.

Campos principais:

```text
mensagem
resposta
modelo
data_hora
```

Essa solução é simples e funcional, mas pode ser melhorada no futuro.

Problema do cache por mensagem exata:

```text
"Como corrijo esse erro?"
"como eu corrijo esse erro?"
"Pode corrigir esse erro?"
```

Essas mensagens podem significar a mesma coisa, mas viram chaves diferentes.

Melhorias futuras:

- normalizar mensagem;
- incluir versão do prompt;
- incluir provider/modelo;
- criar TTL;
- criar índices;
- separar camada de repository.

---

## 20. IA e Gemini

A IA atual usa Gemini.

Responsabilidades do serviço de IA:

- ler chave de API;
- escolher modelo;
- montar prompt;
- consultar cache;
- chamar Gemini;
- lidar com fallback;
- salvar resposta;
- retornar resposta padronizada.

O prompt orienta a IA a atuar como especialista em acessibilidade e WCAG.

Quando o usuário envia erro ou código, a resposta ideal deve conter:

```text
Diagnóstico
Como corrigir
Código original
Código corrigido
```

Quando for dúvida geral, a resposta pode ser mais natural e didática.

Erros importantes tratados:

```text
429
→ limite de cota/rate limit.

503
→ modelo indisponível ou sobrecarregado.

404
→ modelo inválido ou não disponível.
```

Se todos os modelos falharem, o sistema deve retornar uma mensagem amigável, não um erro técnico cru.

Exemplo de mensagem:

```text
Serviço de IA temporariamente indisponível. Tente novamente mais tarde.
```

---

## 21. Possível Evolução para Múltiplos Providers de IA

Hoje o serviço está acoplado ao Gemini.

No futuro, talvez seja necessário usar Grok/xAI ou outro provider por decisão técnica ou exigência acadêmica.

A arquitetura futura ideal seria:

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
→ coordena cache, prompt e provider.

model_registry.py
→ escolhe o modelo disponível mais adequado.

base_provider.py
→ define contrato comum.

gemini_provider.py
→ sabe chamar Gemini.

grok_provider.py
→ sabe chamar Grok/xAI.
```

Regra importante:

```text
Não simplesmente escolher qualquer modelo disponível.
```

A escolha precisa considerar:

- suporte a texto/chat;
- estabilidade;
- custo;
- limites da chave;
- prioridade do projeto;
- fallback seguro;
- compatibilidade com o formato de resposta esperado.

---

## 22. Celery e Redis

Celery é usado para executar tarefas demoradas fora do processo principal do FastAPI.

Redis tem dois papéis:

```text
broker
→ fila de tarefas.

backend
→ armazenamento de status e resultado.
```

Configuração conceitual:

```text
REDIS_URL=redis://redis:6379/0
```

O Redis deve ficar interno ao Docker Compose. Ele não precisa ser exposto publicamente.

Correto:

```text
redis:6379 acessível apenas pelos containers
```

Evitar:

```text
0.0.0.0:6379->6379/tcp
```

Motivo:

- Redis não precisa estar aberto;
- reduz risco de segurança;
- backend e worker acessam via rede interna Docker.

---

## 23. Status de Processamento

Status é uma parte importante da experiência do usuário.

O usuário não pode clicar em analisar e ficar sem saber o que está acontecendo.

Status desejados:

```text
validando_url
preparacao
execucao
carregando_pagina
executando_axe
processando_resultado
salvando_historico
finalizacao
finalizado
erro
```

A primeira sprint já iniciou uma padronização com campos mais estáveis:

```text
estado
codigo_status
mensagem
status
etapa
```

A ideia é que o frontend possa mostrar uma mensagem real e amigável durante fila/processamento.

Regra importante:

```text
Não inventar porcentagem, posição na fila ou tempo estimado se o dado não for confiável.
```

Se não for possível calcular a posição real da fila, usar uma mensagem honesta:

```text
Sua análise está na fila. Assim que o servidor terminar as análises anteriores, ela será iniciada.
```

Isso é melhor do que mostrar um número falso.

---

## 24. Tratamento de Erros

O tratamento de erros é parte central do projeto.

O sistema precisa lidar com:

- URL vazia;
- URL sem protocolo;
- URL inválida;
- domínio inexistente;
- site fora do ar;
- site lento;
- timeout;
- site bloqueando automação;
- erro no Playwright;
- erro no AxeCore;
- falha no MongoDB;
- Redis indisponível;
- Celery indisponível;
- task falhando;
- IA sem chave;
- IA fora do ar;
- limite de uso da IA.

A mensagem para o usuário deve ser amigável.

Exemplo:

```text
Não conseguimos concluir a análise deste site agora. Ele pode estar demorando demais para responder, bloqueando navegadores automáticos ou exigindo mais recursos do que o servidor disponível. Tente novamente mais tarde ou teste outra URL.
```

O detalhe técnico deve ficar nos logs, não na tela principal.

O backend pode retornar campos como:

```text
status
codigo_erro
mensagem
error
detalhe_tecnico
```

Mas o frontend deve escolher o que mostrar para o usuário.

---

## 25. Logs

Atualmente, o projeto ainda usa muitos `print`.

Isso funciona durante desenvolvimento, mas não é o ideal para um projeto maior.

Objetivo futuro:

```text
Trocar prints por logging estruturado.
```

Benefícios:

- controlar nível de log;
- separar info/warning/error;
- reduzir poluição no terminal;
- facilitar debug;
- melhorar diagnóstico no servidor;
- evitar expor informação sensível sem querer.

Níveis úteis:

```text
DEBUG
INFO
WARNING
ERROR
CRITICAL
```

Cuidado:

```text
Nunca logar GEMINI_API_KEY, MONGO_URI completo ou dados sensíveis.
```

---

## 26. Docker Compose

O projeto roda com Docker Compose.

Serviços esperados:

```text
backend
frontend
nginx
redis
worker
```

Comando para subir normalmente:

```bash
docker compose up
```

Comando para subir em segundo plano:

```bash
docker compose up -d
```

Comando para rebuild:

```bash
docker compose up --build
```

Rebuild é necessário quando mudar:

- Dockerfile;
- requirements.txt;
- package.json;
- package-lock.json;
- docker-compose.yml;
- dependências;
- configuração importante de Docker.

Para alteração simples em `.py`, `.jsx` ou `.css`, normalmente não precisa rebuild porque o projeto usa volumes.

---

## 27. Usuário dos Containers

Backend e worker devem rodar como usuário não-root.

Comandos para verificar:

```bash
docker compose exec backend whoami
docker compose exec worker whoami
docker compose exec backend id
docker compose exec worker id
```

Resultado esperado:

```text
appuser
appuser
uid=1000(appuser) gid=1000(appuser)
uid=1000(appuser) gid=1000(appuser)
```

Se aparecer:

```text
root
uid=0(root)
```

então existe algo errado ou pendente na configuração de Docker/Compose.

Isso foi identificado como ponto importante porque o Dockerfile sugere uso de `appuser`, mas em alguns testes os containers estavam rodando como root.

---

## 28. Nginx

O Nginx atua como proxy reverso.

Ele expõe a aplicação na porta externa:

```text
8081
```

Fluxo:

```text
Navegador
→ localhost:8081 ou servidor:8081
→ Nginx
→ frontend/backend conforme configuração
```

A porta 8081 precisa continuar sendo respeitada porque é a porta liberada/esperada no servidor da faculdade.

---

## 29. Comandos de Desenvolvimento

Subir aplicação:

```bash
docker compose up
```

Subir em segundo plano:

```bash
docker compose up -d
```

Ver containers:

```bash
docker compose ps
```

Derrubar containers:

```bash
docker compose down
```

Derrubar removendo órfãos:

```bash
docker compose down --remove-orphans
```

Logs do backend:

```bash
docker compose logs -f backend
```

Logs do worker:

```bash
docker compose logs -f worker
```

Logs do frontend:

```bash
docker compose logs -f frontend
```

Logs do Nginx:

```bash
docker compose logs -f nginx
```

Logs recentes do backend:

```bash
docker compose logs --tail=80 backend
```

Logs recentes do worker:

```bash
docker compose logs --tail=80 worker
```

Reiniciar backend:

```bash
docker compose restart backend
```

Reiniciar worker:

```bash
docker compose restart worker
```

Teste funcional mínimo:

```text
1. Abrir http://localhost:8081
2. Enviar uma URL para análise
3. Verificar se entra na fila
4. Verificar se processa
5. Verificar se mostra resultado
6. Abrir chat
7. Enviar uma mensagem
8. Confirmar resposta da IA
```

URL simples para teste:

```text
https://pt.wikipedia.org/
```

Outra URL útil para teste rápido:

```text
https://example.com
```

---

## 30. Fluxo Git Local

Antes de qualquer commit:

```bash
git status
git diff
```

Adicionar alterações:

```bash
git add .
```

Commitar:

```bash
git commit -m "mensagem clara da mudança"
```

Enviar para GitHub:

```bash
git push
```

Ver últimos commits:

```bash
git log --oneline -10
```

Regra importante:

```text
Nunca commitar sem revisar git status e git diff.
```

Isso evita subir arquivo errado, `.env`, build gerado, node_modules ou alterações que não fazem parte da tarefa.

---

## 31. Fluxo para Servidor da Faculdade

Conectar no servidor:

```bash
ssh gabriel_l@129.121.43.216 -p 22022
```

Entrar na pasta do projeto:

```bash
cd projeto
```

Atualizar código:

```bash
git pull
```

Reconstruir e subir containers:

```bash
docker compose up --build -d
```

Verificar containers:

```bash
docker compose ps
```

Ver logs principais:

```bash
docker compose logs --tail=80 backend
docker compose logs --tail=80 worker
docker compose logs --tail=80 nginx
```

Testar no navegador:

```text
http://129.121.43.216:8081
```

A depender da configuração da faculdade, pode existir outro endereço apontando para essa porta.

---

## 32. Arquivos que Não Devem Ir para o GitHub

Não commitar:

```text
.env
backend/.env
node_modules/
frontend/node_modules/
frontend/dist/
__pycache__/
logs
arquivos temporários
```

Motivo:

- `.env` contém chaves e URIs sensíveis;
- node_modules é dependência instalada;
- dist é build gerado;
- pycache é cache Python;
- logs podem conter informações internas.

Arquivos sensíveis atuais:

```text
GEMINI_API_KEY
MONGO_URI
```

Evitar colar publicamente saídas completas de:

```bash
docker compose config
```

Esse comando pode mostrar variáveis vindas do `.env`.

---

## 33. Frontend — Direção Geral

O frontend deve parecer uma ferramenta real, não apenas uma landing page.

Antes da análise:

```text
Tela inicial
→ foco no campo de URL
→ explicação curta
→ aparência profissional
→ footer discreto
```

Durante a análise:

```text
Modo processamento
→ URL analisada
→ status atual
→ mensagem amigável
→ indicação de que a análise está em andamento
```

Depois da análise:

```text
Modo relatório
→ resumo no topo
→ problemas por severidade
→ lista de erros
→ detalhes técnicos quando necessário
→ opção de perguntar para IA
```

A interface deve mudar de “apresentação” para “área de trabalho” depois que o usuário inicia uma análise.

---

## 34. Componentes Frontend

Componentes já criados ou planejados:

```text
AppHeader
UrlAnalyzerForm
ProjectFooter
AnalysisStatus
AnalysisSummary
IssueList
IssueCard
AiAssistant
```

Componentes já mencionados no progresso:

```text
AppHeader
UrlAnalyzerForm
ProjectFooter
AnalysisStatus
AnalysisSummary
IssueList
```

Objetivo dos componentes:

```text
AppHeader
→ topo com nome do projeto, configurações futuras e app em breve.

UrlAnalyzerForm
→ campo principal de URL e botão de análise.

ProjectFooter
→ autoria, contexto acadêmico e links profissionais.

AnalysisStatus
→ estado atual da análise.

AnalysisSummary
→ resumo dos problemas encontrados.

IssueList
→ lista ordenada de problemas.

IssueCard
→ detalhe individual de um problema.

AiAssistant
→ chat ou apoio de IA.
```

---

## 35. Visual do Frontend

Direção visual:

- limpo;
- claro;
- profissional;
- acessível;
- com cara de ferramenta;
- sem excesso de decoração.

Evitar:

- tela toda azul;
- visual escuro demais;
- gradientes pesados;
- cards demais sem função;
- animações que atrapalham;
- texto repetitivo;
- layout bonito mas confuso.

Cores sugeridas:

```text
Azul
→ ação principal.

Vermelho
→ crítico.

Laranja/vermelho suave
→ sério.

Amarelo/âmbar
→ moderado.

Azul/teal/cinza
→ menor.
```

Importante:

```text
A interface não deve depender apenas de cor para comunicar severidade.
```

Também precisa usar texto, ícones ou rótulos.

---

## 36. Footer

O footer deve ser discreto e profissional.

Conteúdos iniciais:

- objetivo do projeto;
- contexto acadêmico;
- autoria;
- GitHub;
- LinkedIn;
- tecnologias principais.

Dados:

```text
Gabriel Lourenço de Oliveira
UNIFENAS — Campus Alfenas
Ciência da Computação
7º período
Orientador: Professor Celso
GitHub: Gabriel-Oliviera42
LinkedIn: gabriel-lourenco-ab7893273
```

Não incluir por enquanto:

- telefone;
- email pessoal;
- lista grande de professores;
- texto acadêmico longo;
- informações sensíveis.

---

## 37. Prévia do Site Analisado

Existe interesse em mostrar uma prévia visual do site analisado.

Porém, usar `iframe` diretamente pode falhar porque muitos sites bloqueiam incorporação.

Problema:

```text
X-Frame-Options
Content-Security-Policy
bloqueios contra iframe
```

Direção mais profissional para o futuro:

```text
Backend usa Playwright para capturar screenshot
→ frontend exibe a imagem
```

Para a primeira versão, o frontend pode apenas reservar espaço para essa área.

Não implementar screenshot antes de estabilizar o fluxo principal.

---

## 38. Relatório de Acessibilidade

O relatório deve priorizar clareza.

Resumo ideal:

- total de problemas;
- críticos;
- sérios;
- moderados;
- menores;
- distribuição visual;
- URL analisada;
- título da página, se disponível.

Cada problema deve mostrar:

- regra Axe;
- severidade;
- descrição;
- ajuda;
- elemento HTML afetado;
- opção de perguntar à IA;
- detalhes técnicos sem estourar layout.

A lista deve ser ordenada por severidade:

```text
critical
serious
moderate
minor
```

Problemas de layout já observados/considerados:

- bloco de código HTML pode estourar a tela;
- lista de problemas pode ficar longa;
- precisa de rolagem própria;
- footer precisa continuar organizado mesmo após análise.

---

## 39. Primeira Sprint

Objetivo da primeira sprint:

```text
Estabilizar o fluxo atual de acessibilidade antes de redesenhar completamente o frontend.
```

Entram na sprint:

- tratamento de erros da análise;
- mensagens amigáveis;
- status de fila/processamento;
- avaliação de posição de fila;
- avaliação de tempo estimado;
- revisão de timeouts;
- revisão de logs;
- revisão do cache da IA se afetar estabilidade;
- documentação de comandos;
- documentação de GitHub e servidor.

Não entram na sprint:

- redesenho visual completo;
- Lighthouse;
- SEO;
- performance;
- segurança geral;
- exportação de relatório;
- cancelamento de análise;
- histórico no frontend;
- configurações avançadas da IA.

Ordem recomendada:

```text
1. Mapear erros possíveis.
2. Padronizar formato de erro.
3. Padronizar mensagens amigáveis.
4. Melhorar status do Celery.
5. Investigar posição de fila.
6. Decidir sobre tempo estimado.
7. Testar sites leves, médios e problemáticos.
8. Atualizar documentação.
9. Rodar testes manuais.
10. Subir para GitHub e servidor.
```

---

## 40. Progresso Atual da Primeira Sprint

Mudanças já registradas:

```text
analyzer_service.py
→ passou a retornar erros estruturados com status, codigo_erro, mensagem, error e detalhe_tecnico.
```

```text
App.jsx
→ passou a reconhecer quando a task termina com sucesso técnico, mas o resultado contém erro tratado.
```

```text
main.py
→ passou a retornar status de análise com campos estáveis como estado, codigo_status, mensagem, status e etapa.
```

```text
tasks.py
→ passou a informar etapas com codigo_status: preparacao, execucao e finalizacao.
```

```text
App.jsx
→ passou a mostrar mensagem atual da API enquanto a análise está na fila ou em processamento.
```

Essas mudanças deixam o sistema mais previsível para o frontend e evitam estado vazio quando a análise falha de forma controlada.

---

## 41. Sites para Teste

Sites sugeridos:

```text
Fácil:
https://example.com

Médio:
https://pt.wikipedia.org/

Problemático:
a definir durante testes
```

Critérios para escolher site problemático:

- site pesado;
- site que demora;
- site que bloqueia automação;
- site com muitos scripts;
- site que pode gerar timeout;
- site que exige mais recursos do servidor.

O objetivo não é fazer todos os sites do mundo funcionarem. O objetivo é falhar bem quando não for possível analisar.

---

## 42. Critério de Conclusão da Sprint

A sprint pode ser considerada concluída quando:

- erros comuns retornarem mensagens amigáveis;
- logs continuarem úteis para debug;
- fila/status não deixarem o usuário perdido;
- comandos de desenvolvimento estiverem documentados;
- comandos de deploy estiverem documentados;
- fluxo principal funcionar via Docker;
- frontend conseguir lidar com sucesso e erro tratado;
- alterações forem testadas localmente;
- alterações forem commitadas;
- servidor puder ser atualizado com segurança.

---

## 43. Arquivos e Pastas para Limpeza Futura

Arquivos/pastas que parecem candidatos à limpeza, mas precisam ser verificados antes:

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

Regra:

```text
Não apagar nada sem verificar.
```

Procedimento seguro:

```text
1. git status
2. verificar referências
3. apagar grupo pequeno
4. rodar aplicação
5. rodar build se necessário
6. commit
7. seguir para próximo grupo
```

---

## 44. Diretrizes de Trabalho

Forma correta de trabalhar no projeto:

```text
1. Entender o arquivo atual.
2. Documentar responsabilidade.
3. Identificar risco.
4. Propor melhoria.
5. Alterar pouco.
6. Testar.
7. Commitar.
8. Continuar.
```

Antes de alteração importante, responder:

```text
O que será alterado?
Por que será alterado?
Qual o risco?
Como testar?
Como reverter?
```

Evitar:

- refatorar muitos arquivos de uma vez;
- alterar backend e frontend grande ao mesmo tempo;
- mexer em Docker sem necessidade;
- apagar arquivos sem verificar;
- instalar biblioteca sem justificar;
- mudar contrato da API sem ajustar frontend;
- mudar mensagens sem pensar no usuário;
- usar IA como fonte técnica principal da análise.

---

## 45. Arquitetura Futura Desejada

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

Essa estrutura não deve ser aplicada de uma vez.

Ela serve como direção de longo prazo.

---

## 46. Evolução em Fases

### Fase 1 — Documentação e Entendimento

Objetivo:

```text
Entender o projeto atual sem alterar comportamento.
```

Documentos relacionados:

- arquitetura do backend;
- contexto do projeto;
- comandos de desenvolvimento;
- fluxo GitHub/servidor;
- plano frontend;
- plano da primeira sprint;
- este contexto geral.

### Fase 2 — Limpeza Segura

Objetivo:

```text
Remover arquivos inúteis sem mexer na lógica.
```

### Fase 3 — Configuração Centralizada

Objetivo:

```text
Parar de espalhar os.getenv pelo sistema.
```

Configurações futuras:

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

### Fase 4 — Logging Estruturado

Objetivo:

```text
Trocar print por logging.
```

### Fase 5 — Status Melhor

Objetivo:

```text
Dar feedback real e confiável durante a análise.
```

### Fase 6 — Modularizar Análise

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

### Fase 7 — Multi-Analisadores

Objetivo:

```text
Permitir outros tipos de análise além de acessibilidade.
```

Possíveis módulos futuros:

```text
accessibility_analyzer.py
seo_analyzer.py
performance_analyzer.py
security_analyzer.py
best_practices_analyzer.py
```

### Fase 8 — IA Multi-Provider

Objetivo:

```text
Permitir trocar Gemini por Grok ou outro provider sem reescrever tudo.
```

---

## 47. Decisões Técnicas Atuais

Decisões já tomadas ou assumidas:

```text
1. Não refatorar tudo de uma vez.
2. Manter backend funcional antes de reorganizar.
3. Documentar antes de alterar.
4. Manter Playwright abrindo/fechando por análise por enquanto.
5. Não otimizar browser antes de estabilizar arquitetura.
6. Manter Gemini enquanto estiver funcionando.
7. Preparar possibilidade futura de Grok.
8. Não confiar em IA para apagar arquivos sem validação.
9. Trabalhar em etapas pequenas.
10. Testar e commitar após cada etapa.
11. Redis deve ficar interno.
12. Porta externa deve permanecer 8081.
13. IA explica, mas AxeCore analisa.
14. Mensagem para usuário deve ser amigável.
15. Detalhe técnico deve ficar nos logs.
```

---

## 48. Riscos Técnicos

Riscos principais:

### Playwright pesado

Pode consumir memória e CPU, principalmente no servidor da faculdade.

Mitigação:

```text
bloquear recursos pesados
usar timeout
limitar concorrência
manter worker controlado
falhar com mensagem amigável
```

### Sites bloqueando automação

Alguns sites podem bloquear navegador headless.

Mitigação:

```text
mensagem amigável
logs técnicos
não prometer suporte universal
```

### IA indisponível

Gemini pode falhar por limite, modelo indisponível ou chave incorreta.

Mitigação:

```text
fallback de modelos
cache
mensagem amigável
não bloquear análise principal
```

### MongoDB falhar

Banco pode ficar indisponível.

Mitigação:

```text
não impedir resultado da análise se apenas o histórico falhar
registrar erro em log
```

### Redis/Celery falhar

Fila pode ficar indisponível.

Mitigação futura:

```text
tratar erro no endpoint /analisar
retornar mensagem clara
registrar log
```

### Frontend não reconhecer erro tratado

Task pode terminar como SUCCESS contendo erro de análise.

Mitigação já iniciada:

```text
frontend reconhece erro estruturado no resultado
```

---

## 49. Segurança e Cuidados

Cuidados importantes:

- não expor Redis publicamente;
- não commitar `.env`;
- não exibir chaves em logs;
- não colar `docker compose config` publicamente;
- não mostrar detalhes técnicos sensíveis ao usuário final;
- validar URL;
- limitar timeout;
- evitar abrir caminho para SSRF sem pensar no futuro;
- evitar permitir análise de endereços internos em produção sem validação.

Ponto futuro importante:

```text
Como o backend acessa URLs informadas pelo usuário, futuramente será necessário pensar em proteção contra SSRF.
```

No contexto atual de TCC e ambiente controlado, isso pode não ser prioridade imediata, mas deve ser registrado como cuidado técnico.

---

## 50. Perguntas Pendentes

### Produto e TCC

1. Qual será o nome definitivo apresentado na banca?
2. Qual será o escopo final fechado para entrega?
3. Existe data para congelar grandes mudanças?
4. O que precisa estar pronto obrigatoriamente na demonstração?

### Backend

1. Quais erros precisam de mensagem específica primeiro?
2. O timeout atual de 45 segundos é ideal?
3. Como tratar Celery/Redis indisponível?
4. Como limitar análise de URLs internas no futuro?
5. Quando separar analyzer_service.py?

### Fila

1. Dá para calcular posição real da fila com confiabilidade?
2. Vale a pena mostrar tempo estimado?
3. Quando expirar resultados antigos do Redis?
4. Qual concorrência ideal do worker no servidor?

### Frontend

1. Nome visual final será AcessiLab?
2. O relatório deve ocupar tela inteira ou dividir com chat?
3. Como mostrar WCAG sem poluir?
4. Como mostrar screenshot futura?
5. Quais animações realmente ajudam?

### IA

1. O prompt atual precisa de exemplos?
2. O cache por mensagem exata continua?
3. Quando separar provider Gemini?
4. Grok/xAI será necessário mesmo?

### Dados

1. Quais métricas entram no TCC?
2. Histórico precisa aparecer no frontend?
3. Relatório completo deve ser salvo algum dia?
4. Cache deve ter expiração?

### Infra

1. Quais são CPU e RAM reais do servidor?
2. Como será mantido o `.env` no servidor?
3. Qual comando oficial de deploy será usado na apresentação?
4. Quem terá acesso ao servidor?

---

## 51. Resumo Executivo

O TC Acessibilidade é uma plataforma de auditoria web com foco inicial em acessibilidade digital.

A arquitetura atual é:

```text
FastAPI
→ recebe requisições HTTP

Celery + Redis
→ processa análise pesada em background

Playwright
→ carrega páginas reais

AxeCore
→ detecta problemas de acessibilidade

MongoDB Atlas
→ salva histórico e cache

Gemini
→ explica erros e ajuda com correções

React + Vite
→ exibe interface e relatório

Nginx
→ centraliza acesso pela porta 8081
```

O maior valor atual da aplicação está neste fluxo:

```text
URL → análise automatizada → relatório → explicação com IA
```

A evolução correta é:

```text
documentar
estabilizar
limpar
padronizar erros
melhorar status
melhorar frontend
modularizar backend
preparar multi-provider de IA
preparar multi-analisadores
```

O projeto deve continuar sendo desenvolvido com calma, por etapas pequenas, mantendo sempre a aplicação funcionando.

---

## 52. Regra Final de Manutenção

Antes de qualquer mudança grande, lembrar:

```text
O objetivo não é só fazer funcionar.
O objetivo é conseguir explicar, manter, demonstrar e evoluir.
```

Por isso, cada alteração precisa ter motivo, teste e commit claro.
