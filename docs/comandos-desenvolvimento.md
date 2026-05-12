# Comandos de Desenvolvimento — TC Acessibilidade

Este documento reúne os comandos principais para rodar, testar e diagnosticar a aplicação localmente usando Docker Compose.

A aplicação usa os seguintes serviços:

```text
backend
frontend
nginx
redis
worker

A aplicação é acessada por:

http://localhost:8081

No servidor da faculdade, a porta externa liberada é 8081, por isso o Nginx deve continuar expondo:

ports:
  - "8081:80"
1. Subir a aplicação normalmente

Use quando não mudou Dockerfile nem dependências.

docker compose up

Esse comando mostra os logs no terminal.

Para parar, use:

Ctrl + C
2. Subir a aplicação em segundo plano

Use quando quiser deixar a aplicação rodando sem prender o terminal.

docker compose up -d

Depois acesse:

http://localhost:8081
3. Ver status dos containers
docker compose ps

Estado esperado:

backend  → up, sem porta externa
frontend → up, porta interna 5173/tcp
nginx    → up, 8081->80
redis    → up, apenas 6379/tcp interno
worker   → up, sem porta externa

O Redis não deve aparecer como:

0.0.0.0:6379->6379/tcp

Se aparecer assim, ele está exposto para fora, o que não é necessário.

4. Quando usar rebuild

Use rebuild quando mudar:

Dockerfile
requirements.txt
package.json
package-lock.json
docker-compose.yml

Comando:

docker compose up --build

Ou em segundo plano:

docker compose up -d --build

Não é necessário usar --build para toda alteração em .py, .jsx ou .css, porque o projeto usa volumes.

5. Rebuild completo do backend/worker

Use quando alterar algo relacionado ao Dockerfile do backend, Playwright ou permissões do container.

docker compose down
docker compose build --no-cache backend worker
docker compose up -d

Depois valide:

docker compose exec backend whoami
docker compose exec worker whoami

Resultado esperado:

appuser
appuser
6. Reiniciar apenas o backend

Use quando quiser reiniciar a API FastAPI.

docker compose restart backend

Ver logs:

docker compose logs --tail=60 backend
7. Reiniciar apenas o worker

Use quando mexer em Celery, tasks ou analyzer_service.

docker compose restart worker

Ver logs:

docker compose logs --tail=60 worker
8. Ver logs em tempo real

Backend:

docker compose logs -f backend

Worker:

docker compose logs -f worker

Frontend:

docker compose logs -f frontend

Nginx:

docker compose logs -f nginx

Todos os serviços:

docker compose logs -f
9. Validar usuário dos containers

Backend e worker devem rodar como usuário não-root.

docker compose exec backend whoami
docker compose exec worker whoami
docker compose exec backend id
docker compose exec worker id

Resultado esperado:

appuser
appuser
uid=1000(appuser) gid=1000(appuser)
uid=1000(appuser) gid=1000(appuser)
10. Validar Redis interno

O worker deve conectar no Redis usando:

redis://redis:6379/0

Ver logs do worker:

docker compose logs --tail=40 worker

Procure:

Connected to redis://redis:6379/0
11. Derrubar tudo
docker compose down

Para remover containers órfãos também:

docker compose down --remove-orphans
12. Teste funcional mínimo

Depois de subir a aplicação, testar:

1. Abrir http://localhost:8081
2. Enviar uma URL para análise
3. Confirmar que a análise entra na fila
4. Confirmar que o resultado aparece
5. Abrir o chat
6. Enviar uma mensagem
7. Confirmar resposta da IA

URL simples para teste:

https://pt.wikipedia.org/
13. Comandos Git básicos do fluxo de trabalho

Ver estado atual:

git status

Adicionar alterações:

git add .

Commitar:

git commit -m "mensagem do commit"

Ver últimos commits:

git log --oneline -10
14. Cuidados de segurança

Não colar publicamente saídas completas de:

docker compose config

Esse comando pode exibir variáveis sensíveis vindas do .env, como:

GEMINI_API_KEY
MONGO_URI

Também não commitar:

backend/.env
node_modules/
frontend/node_modules/
frontend/dist/
__pycache__/
15. Regra prática

Para alteração comum de código:

docker compose up

Para alteração em Docker/dependências:

docker compose up --build

Para investigar worker/fila:

docker compose logs -f worker

Para investigar API:

docker compose logs -f backend

Depois de criar e salvar, rode:

```bash
git status

Se aparecer só esse arquivo novo, commita:

git add docs/comandos-desenvolvimento.md
git commit -m "documenta comandos de desenvolvimento"