# Regras Para Trabalhar Neste Projeto

Este arquivo orienta qualquer pessoa ou IA que for mexer no projeto TC Acessibilidade.

## Objetivo Atual

O objetivo do TCC e manter o foco em acessibilidade digital.

Neste momento, o projeto deve ser tratado como uma plataforma de analise de acessibilidade baseada em URL, com relatorio tecnico e apoio de IA para explicar erros e sugerir correcoes.

Google Lighthouse, SEO, performance, seguranca e boas praticas gerais podem ser objetivos futuros, mas nao devem puxar a arquitetura agora se isso atrapalhar a entrega principal do TCC.

O projeto deve ser tratado como produto de TCC e portfolio pessoal. A meta nao e apenas entregar uma tela funcionando, mas construir algo bem feito, explicavel e confiavel.

## Prioridade De Trabalho

1. Entender e estabilizar o que ja existe.
2. Corrigir erros e casos ruins de uso.
3. Melhorar mensagens para o usuario.
4. Melhorar fila, status e feedback de progresso.
5. Organizar backend sem quebrar comportamento.
6. Melhorar frontend depois que o fluxo principal estiver confiavel.
7. So depois avaliar expansao para Lighthouse ou outros analisadores.

## Decisoes Atuais

- Escopo principal: acessibilidade.
- Usuario principal inicial: estudantes que estao comecando a criar sites.
- O sistema tambem deve parecer profissional para professor, banca e portfolio.
- A IA e funcionalidade principal, nao apenas detalhe extra.
- Frontend sera totalmente redesenhado depois, em fase propria.
- Exportacao de relatorio nao e prioridade agora.
- Historico do MongoDB nao precisa aparecer no frontend por enquanto.
- MongoDB deve continuar sendo usado para cache da IA e registro de uso.
- Porta externa `8081` e obrigatoria.
- Redis deve ficar interno ao Docker Compose, sem porta publica exposta.
- Cancelamento de analise nao sera implementado agora.
- Google Lighthouse fica para uma fase futura, depois da entrega de acessibilidade estar forte.

## Regras De Mudanca

- Nao refatorar tudo de uma vez.
- Nao alterar frontend visualmente sem alinhamento previo.
- Nao remover arquivos sem verificar se sao usados e se estao versionados.
- Nao commitar `.env`, chaves de API, conexoes privadas ou dados sensiveis.
- Preservar o fluxo principal antes de melhorar detalhes.
- Mudancas devem ser pequenas, testaveis e explicaveis.
- Ao mexer em backend, priorizar estabilidade, mensagens, logs e comportamento previsivel.
- Ao mexer em fila/status, evitar prometer posicao ou tempo estimado se o dado nao for confiavel.
- Ao mexer em IA, preservar o fluxo atual funcionando antes de preparar multi-provider.
- Ao mexer em frontend, esperar a fase de redesenho definida pelo dono do projeto.
- Antes de uma mudanca importante, registrar:
  - o que sera alterado
  - por que sera alterado
  - risco da mudanca
  - como testar
  - como reverter

## Qualidade Esperada

O projeto deve ficar simples de explicar em banca, facil de demonstrar e resistente a erros comuns de usuario, como:

- URL sem `http://` ou `https://`
- site fora do ar
- site lento
- site pesado demais para o servidor
- timeout na analise
- erro de rede
- fila com outras analises na frente
- IA indisponivel ou sem chave configurada

Mensagens para usuario devem ser simples, profissionais e amigaveis. Detalhes tecnicos devem aparecer nos logs ou em areas especificas de debug, nao como resposta bruta para usuario comum.

## Direcao Tecnica

O backend deve continuar sendo a base mais importante nesta fase.

O frontend sera redesenhado e melhorado depois, com explicacao detalhada do dono do projeto antes de qualquer mudanca visual grande.

O sistema deve priorizar mensagens amigaveis para usuarios comuns, sem esconder logs tecnicos que ajudem no desenvolvimento.

O servidor final e o servidor da faculdade. Antes de ajustes de performance, levantar dados reais de CPU, RAM, disco e rede quando o usuario fornecer ou quando for necessario verificar.
