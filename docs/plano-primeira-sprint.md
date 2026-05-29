# Plano Da Primeira Sprint

## Objetivo

Estabilizar o fluxo atual de acessibilidade antes de redesenhar o frontend.

Esta sprint deve focar em backend, fila, erros e confiabilidade. Mudancas visuais grandes ficam para uma fase posterior.

## Escopo

Entram nesta sprint:

- melhorar tratamento de erros da analise
- melhorar mensagens amigaveis para o usuario
- melhorar status de fila/processamento
- avaliar como mostrar posicao de fila de forma confiavel
- avaliar tempo estimado de espera sem prometer dado falso
- revisar timeouts
- revisar logs tecnicos
- revisar cache da IA apenas se afetar estabilidade
- documentar comandos de teste, GitHub e servidor

Nao entram nesta sprint:

- redesenho visual do frontend
- Google Lighthouse
- SEO, performance ou seguranca geral
- cancelamento de analise
- exportacao de relatorio
- historico aparecendo no frontend
- configuracoes avancadas de IA

## Ordem Recomendada

1. Mapear erros possiveis do fluxo atual. Status: em andamento.
2. Padronizar formato de erro retornado pelo backend. Status: iniciado.
3. Padronizar mensagens amigaveis para o frontend. Status: iniciado.
4. Melhorar status do Celery quando possivel. Status: iniciado.
5. Investigar posicao de fila no Redis/Celery.
6. Decidir se tempo estimado sera real, aproximado ou omitido.
7. Testar com sites leves, medios e problematicos.
8. Atualizar documentacao.
9. Rodar testes manuais.
10. Subir para GitHub e servidor.

## Padrao De Mensagens

As mensagens para usuario devem ser didaticas e amigaveis.

Preferencia:

```text
Nao conseguimos concluir a analise deste site agora. Ele pode estar demorando demais para responder, bloqueando navegadores automaticos ou exigindo mais recursos do que o servidor disponivel. Tente novamente mais tarde ou teste outra URL.
```

O frontend pode exibir uma mensagem curta primeiro e, se fizer sentido, permitir ver detalhes.

Detalhes tecnicos devem ir para logs do backend/worker.

## Casos De Erro A Tratar

- URL vazia: tratada no frontend.
- URL sem protocolo: tratada pelo frontend e pelo backend.
- URL invalida/incompleta: tratada pelo backend.
- DNS/host inexistente: tratado como falha de acesso ao site.
- site fora do ar: tratado como falha de acesso ao site.
- timeout de carregamento: tratado com mensagem especifica.
- site bloqueando acesso automatizado: tratado como falha de acesso ao site.
- pagina sem resposta HTTP clara: pendente de avaliacao.
- erro inesperado do Playwright: tratado como falha de acesso ou erro interno.
- erro inesperado do AxeCore: tratado com mensagem especifica.
- falha ao salvar no MongoDB: atualmente fica em log e nao bloqueia resultado.
- Redis/Celery indisponivel: pendente.
- tarefa falhou no worker: parcialmente tratado no endpoint de status.
- IA sem chave configurada: ja tratada no servico de IA.
- IA indisponivel ou com limite: ja tratada no servico de IA.

## Progresso Atual

Primeira mudanca aplicada:

- `analyzer_service.py` agora retorna erros estruturados com `status`, `codigo_erro`, `mensagem`, `error` e `detalhe_tecnico`.
- `App.jsx` agora reconhece quando uma tarefa Celery termina com sucesso tecnico, mas o resultado da analise contem erro tratado.
- O usuario passa a receber a mensagem amigavel em vez de cair em um estado vazio do relatorio.

Segunda mudanca aplicada:

- `main.py` agora retorna status de analise com campos estaveis: `estado`, `codigo_status`, `mensagem`, `status` e `etapa`.
- `tasks.py` agora informa etapas com `codigo_status`: preparacao, execucao e finalizacao.
- `App.jsx` agora mostra a mensagem atual da API enquanto a analise esta na fila ou em processamento.

## Fila

Objetivo ideal:

- mostrar que a analise entrou na fila
- mostrar etapa atual
- mostrar quantas analises estao na frente se o dado for confiavel
- mostrar tempo estimado somente se a estimativa for honesta

Regra:

Nao inventar posicao ou tempo estimado. Se nao for possivel calcular bem, usar mensagem clara:

```text
Sua analise esta na fila. Assim que o servidor terminar as analises anteriores, ela sera iniciada.
```

## Sites Para Teste

Ainda pendente escolher tres sites:

- site facil
- site medio
- site problematico

Sugestao inicial para discutir:

- facil: `https://example.com`
- medio: `https://pt.wikipedia.org/`
- problematico: um site pesado, lento ou que bloqueie automacao, a definir durante os testes

## Criterio De Conclusao

A sprint pode ser considerada concluida quando:

- erros comuns retornam mensagens amigaveis
- logs continuam tecnicos o suficiente para debug
- fila/status nao deixam o usuario perdido
- comandos de desenvolvimento e deploy estao documentados
- o fluxo principal continua funcionando no Docker
- as mudancas foram testadas localmente antes de subir
