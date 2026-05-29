# Contexto Do Projeto

## Visao Geral

TC Acessibilidade e um projeto de TCC focado em analise de acessibilidade digital.

O usuario informa uma URL, o sistema analisa a pagina com ferramentas automatizadas de acessibilidade e apresenta os problemas encontrados. O sistema tambem possui um assistente de IA para explicar erros e ajudar com correcoes.

## Escopo Do TCC

O escopo atual do TCC e acessibilidade.

Mesmo que no futuro exista interesse em usar Google Lighthouse para avaliar mais areas de um site, como performance, SEO e boas praticas, isso nao e prioridade agora.

Neste ciclo, o objetivo e deixar a analise de acessibilidade confiavel, compreensivel e bem apresentada.

## Meta De Produto

O projeto deve ser tratado como um produto serio, nao apenas como uma tela para cumprir requisito.

A entrega minima poderia ser apenas visual, mas a meta do dono do projeto e fazer o melhor possivel dentro do tempo: backend funcional, fila, mensagens boas, IA util, documentacao e frontend redesenhado com cuidado.

O projeto tambem deve servir como portfolio pessoal, alem de trabalho academico. Por isso, no futuro pode fazer sentido ter areas com apresentacao do projeto, autoria e link profissional, como LinkedIn.

## Autoria E Contexto Academico

Autor: Gabriel Lourenço de Oliveira.

Instituicao: UNIFENAS, campus Alfenas.

Curso/periodo: 7 periodo.

Orientador: professor Celso.

Links profissionais:

- GitHub: `https://github.com/Gabriel-Oliviera42`
- LinkedIn: `https://www.linkedin.com/in/gabriel-lourenco-ab7893273`

Observacao: futuramente o site pode citar outros professores importantes para o autor, mas por enquanto o footer deve manter apenas as informacoes essenciais.

## Nome Do Projeto

O nome final ainda nao esta decidido.

Nome provisorio recomendado para discutir: AcessiLab.

Motivo: comunica acessibilidade, tem tom academico/profissional e nao limita totalmente a evolucao futura para outros tipos de auditoria.

Ideias iniciais para discutir:

- TC Acessibilidade
- AcessiLab
- AcessiCheck
- AcessiScan
- Acessibilidade Lab
- AcessiWeb
- WebAcessivel
- IncluiWeb
- A11y Mentor
- WCAG Assist
- Verifica Acessibilidade

O nome deve funcionar bem para banca, portfolio e possivel evolucao futura.

Preferencia inicial: nome claro, profissional, facil de explicar e que nao limite demais caso o projeto cresca depois.

## Objetivo Principal Agora

Arrumar e fortalecer o que ja existe:

- estabilizar backend
- melhorar tratamento de erros
- melhorar mensagens amigaveis
- melhorar fila e status de processamento
- documentar regras e decisoes
- preparar o projeto para evoluir sem bagunca
- mexer no frontend apenas quando o fluxo principal estiver bem definido

## Casos Que Precisam Ser Bem Tratados

O sistema deve lidar bem com situacoes como:

- usuario digitando URL incompleta
- site inexistente
- site fora do ar
- site demorando demais para responder
- site pesado demais para o servidor atual
- falha do Playwright
- falha do AxeCore
- falha no MongoDB
- Redis ou Celery indisponivel
- varias analises na fila
- IA indisponivel, sem chave ou com limite de uso

O usuario final deve receber uma mensagem clara e amigavel. O desenvolvedor deve ter logs tecnicos suficientes para investigar.

## Usuario Principal

O projeto deve ser profissional o suficiente para atender perfis diferentes, mas o usuario principal inicial sao estudantes que estao comecando a criar sites e querem testar acessibilidade.

Publicos considerados:

- estudantes de desenvolvimento web
- professores e avaliadores
- desenvolvedores iniciantes
- donos de sites
- usuarios comuns curiosos sobre acessibilidade

A linguagem principal deve ser simples e didatica, mas o sistema tambem pode exibir informacao tecnica para quem quiser se aprofundar.

Uma referencia de experiencia futura e algo parecido com WAVE: informacao visual e simples primeiro, com detalhes tecnicos disponiveis quando necessario.

## Uso Esperado

O sistema nao precisa ser pensado para grande escala agora.

Cenario realista:

- uma pessoa usando por vez durante desenvolvimento e apresentacao
- possibilidade de mais de uma analise entrando na fila
- servidor limitado fornecido pela faculdade
- porta externa obrigatoria: `8081`
- sites publicos podem ser analisados, respeitando limites tecnicos do Playwright, rede e servidor

Se o servidor nao conseguir lidar com um site, o sistema deve falhar de forma clara e amigavel.

## Direcao Do Relatorio

Parte do desenho do relatorio sera decidida durante a fase de frontend.

Decisoes iniciais:

- deve usar AxeCore como base tecnica
- deve respeitar severidades e dados que o AxeCore fornece
- deve explicar problemas de acessibilidade de forma compreensivel
- idealmente deve ter relacao com WCAG
- futuramente pode ter pontuacao final, mas isso nao entra na primeira sprint
- agrupamento, ordem, layout e destaque de erros serao definidos no redesenho do frontend

## Mensagens E Erros

O tom das mensagens deve ser escolhido com criterio profissional:

- amigavel para o usuario
- claro sobre o que aconteceu
- sem assustar com detalhe tecnico desnecessario
- honesto quando o sistema nao conseguir analisar
- util para orientar proximo passo quando fizer sentido

Exemplo de direcao:

```text
Nao conseguimos concluir a analise deste site agora. Ele pode estar demorando demais para responder ou exigindo recursos acima do limite do servidor. Voce pode tentar novamente mais tarde ou testar outra URL.
```

Detalhes tecnicos devem ir para logs, nao para a mensagem principal do usuario.

## Fila E Processamento

A fila e parte importante da sensacao profissional do produto.

Direcao desejada:

- mostrar que a analise entrou na fila
- mostrar etapas reais quando possivel
- mostrar quantidade de analises na frente se for viavel com Celery/Redis
- mostrar tempo estimado se for viavel e minimamente confiavel
- nao implementar cancelamento de analise por enquanto
- nao limitar manualmente uma analise por usuario agora

Observacao importante: posicao real na fila e tempo estimado dependem de como Celery/Redis expoem ou permitem calcular esse estado. Se a posicao exata nao for confiavel, o sistema deve preferir uma mensagem honesta a uma estimativa falsa.

## IA

A IA e uma funcionalidade principal do produto atual.

Direcao atual:

- manter comportamento atual enquanto estiver funcionando bem
- responder sobre acessibilidade e correcao de problemas encontrados
- quando houver HTML/codigo, idealmente devolver codigo corrigido
- usar linguagem simples e tecnica na medida certa
- futuramente permitir configuracoes avancadas
- futuramente permitir trocar provider, modelo e chave

Gemini pode continuar sendo usado agora. No futuro, a arquitetura deve permitir outros providers.

## Frontend

O frontend atual sera totalmente redesenhado em uma fase propria.

Por enquanto, nao tomar decisoes finais sobre:

- estilo visual
- layout do relatorio
- agrupamento de erros
- ordem de severidade
- destaque do chat
- animacoes
- configuracoes avancadas

Ideias ja citadas para o futuro:

- chat parecido com o atual, mas mais suave e completo
- animacoes melhores
- configuracoes para IA e comportamento
- experiencia mais profissional

Exportacao de resultado nao e prioridade agora.

## Dados E Historico

O MongoDB tem duas funcoes principais:

1. cache da IA
2. registro de uso da aplicacao para mostrar no TCC que pessoas usaram o sistema

O historico nao precisa aparecer no frontend neste momento.

O relatorio completo nao precisa ser salvo agora. A estrategia atual de salvar resumo pode continuar, mantendo o campo de versao do documento para permitir mudancas futuras.

As URLs analisadas podem ser armazenadas.

O cache por mensagem exata ainda precisa ser avaliado. Ele funciona como solucao simples, mas pode gerar repeticao quando a pergunta muda pouco.

## Infraestrutura

O projeto sera demonstrado/usado no servidor fornecido pela faculdade.

Decisoes atuais:

- manter porta externa `8081`
- usar internet normalmente
- manter MongoDB Atlas para cache e registro
- verificar depois limites reais de CPU, RAM e rede do servidor
- Redis deve preferencialmente ficar interno ao Docker Compose, sem exposicao publica

Redis interno significa: outros containers do projeto acessam `redis://redis:6379/0`, mas a porta `6379` nao fica aberta para fora do servidor. Isso e mais seguro e suficiente para o desenho atual.

## Produto Futuro

Depois que acessibilidade estiver bem resolvida, o projeto pode evoluir para uma plataforma maior de auditoria web.

Possivel direcao futura:

- Google Lighthouse
- performance
- SEO
- boas praticas
- seguranca basica
- historico completo
- exportacao de relatorios
- painel visual mais completo

Essa evolucao futura nao deve comprometer a entrega principal de acessibilidade.

## Perguntas Pendentes

Estas perguntas devem ser respondidas antes das proximas grandes mudancas.

### TCC E Demonstracao

1. Qual sera o nome final do projeto apresentado na banca?
2. Quais detalhes do servidor da faculdade precisam entrar na documentacao?
3. Existe uma data interna para congelar grandes mudancas antes da entrega final?
4. O que precisa estar pronto na primeira sprint de estabilizacao?

### Usuarios E Uso Esperado

1. A linguagem deve ser mais parecida com ferramenta de estudante, ferramenta profissional ou mistura das duas?
2. Quais exemplos de sites serao usados na demonstracao?
3. Deve haver alguma protecao basica contra abuso, mesmo sem foco em escala?

### Analise De Acessibilidade

1. Quais resultados sao obrigatorios no relatorio?
2. O relatorio deve mostrar todos os erros ou agrupar por tipo?
3. O sistema deve priorizar erros criticos primeiro?
4. Deve haver explicacao sobre WCAG em cada problema?
5. Deve haver link para documentacao oficial ou referencia externa?
6. Deve existir pontuacao final de acessibilidade ou apenas lista de problemas?

### Erros E Mensagens

1. Quais erros devem ter mensagem especifica na primeira sprint?
2. O sistema deve sugerir tentar novamente quando der timeout?
3. Mensagens tecnicas detalhadas devem ficar acessiveis em alguma area de debug ou apenas nos logs?

### Fila E Processamento

1. Como calcular posicao de fila de forma confiavel no Celery/Redis atual?
2. Como calcular tempo estimado sem mentir para o usuario?
3. Deve haver timeout diferente para sites pequenos e grandes?
4. Analises antigas devem expirar do Redis depois de quanto tempo?
5. Qual mensagem mostrar quando o servidor estiver sobrecarregado?

### IA

1. O prompt atual precisa ganhar exemplos de resposta?
2. O cache por mensagem exata deve continuar ou precisa de chave normalizada?
3. Quando a IA falhar, qual mensagem amigavel deve aparecer?
4. Quais configuracoes avancadas de IA entram apenas no futuro?

### Frontend

1. Qual estilo visual sera escolhido no redesenho?
2. O relatorio deve ocupar a tela principal ou ficar em sidebar?
3. O chat deve ser destaque ou apoio lateral?
4. Como mostrar detalhes WCAG sem poluir a tela?
5. Quais animacoes fazem sentido sem atrapalhar usabilidade?

### Dados E Historico

1. Quais metricas de uso precisam aparecer no TCC?
2. O cache por mensagem exata e suficiente?
3. Devem existir indices no MongoDB para historico e cache?
4. Deve haver limpeza automatica do cache algum dia?

### Infra E Ambiente

1. Quais sao CPU, RAM e disco do servidor?
2. Como sera feito deploy final no servidor da faculdade?
3. Como guardar e atualizar `.env` no servidor?
4. Quais comandos oficiais serao usados na apresentacao?
