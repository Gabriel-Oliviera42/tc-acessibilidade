# Fluxo GitHub E Servidor

Este documento registra o fluxo para subir mudancas do computador local para o GitHub e depois atualizar o servidor da faculdade.

## Parte 1: No Computador

Depois de alterar o codigo e testar localmente:

```bash
git status
git add .
git commit -m "descreve a mudanca feita"
git push
```

Antes do `git add .`, revisar sempre:

```bash
git status
git diff
```

Isso evita enviar arquivo errado ou commitar alteracoes que nao fazem parte da tarefa.

## Parte 2: No Servidor Da Faculdade

Conectar no servidor:

```bash
ssh gabriel_l@129.121.43.216 -p 22022
```

Entrar na pasta do projeto:

```bash
cd projeto
```

Puxar alteracoes do GitHub:

```bash
git pull
```

Reconstruir e reiniciar containers:

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

## Arquivos Ignorados Pelo Git

Arquivos no `.gitignore` nao sobem para o GitHub.

Isso e correto para:

- `.env`
- `node_modules/`
- `__pycache__/`
- `dist/`
- logs
- arquivos temporarios

Quando o servidor precisar de algum arquivo ignorado, ele deve ser criado ou atualizado manualmente no servidor.

O caso mais importante e:

```text
backend/.env
```

Esse arquivo guarda informacoes sensiveis como:

- `GEMINI_API_KEY`
- `MONGO_URI`
- configuracoes privadas do ambiente

Ele nunca deve ser commitado.

## Quando Usar Build

Use:

```bash
docker compose up -d
```

quando a mudanca for simples e os containers ja estiverem com tudo instalado.

Use:

```bash
docker compose up --build -d
```

quando mudar:

- `Dockerfile`
- `requirements.txt`
- `package.json`
- `package-lock.json`
- dependencias
- configuracao importante do Docker

Na duvida, para deploy no servidor pode usar `--build`, aceitando que sera um pouco mais demorado.

## Cuidado Com O Servidor

A porta externa obrigatoria e:

```text
8081
```

O Redis deve ficar interno ao Docker Compose. Nao precisa expor `6379` publicamente.

Depois de atualizar, testar no navegador:

```text
http://129.121.43.216:8081
```

ou o endereco definido pela faculdade para acessar essa porta.

