# Plano Do Frontend

Este documento organiza a primeira fase do redesenho do frontend.

O objetivo agora nao e criar a versao final perfeita, mas construir uma base visual e estrutural profissional, preparada para evoluir com animacoes, icones proprios, configuracoes, screenshot do site analisado e melhorias de IA.

## Principio Principal

O frontend deve parecer uma ferramenta real, nao apenas uma landing page.

Antes da analise, a tela pode ter uma apresentacao sutil do projeto. Depois que o usuario envia uma URL, a interface deve virar uma area de trabalho para acompanhar status, resultado, erros e ajuda da IA.

## Nome Provisorio

Nome recomendado para primeira versao visual: AcessiLab.

Esse nome ainda nao e definitivo. Ele funciona bem como nome de trabalho porque:

- remete a acessibilidade
- combina com contexto academico
- parece produto de portfolio
- nao prende o projeto apenas a uma unica tela
- permite evolucao futura

## Estrutura Antes Da Analise

Tela inicial:

- header
- area principal de URL
- footer discreto

### Header

Elementos:

- icone/logo do projeto
- nome do projeto
- botao de configuracoes
- botao "Baixar app" ou "App em breve"

Decisao atual:

- o botao de configuracoes pode existir visualmente, mas a funcao completa fica para depois
- o botao de baixar app pode abrir uma mensagem simples de "em breve"
- nao transformar o header em menu cheio de links

### Area Principal

Objetivo:

- dar foco total ao campo de URL
- explicar rapidamente que o sistema analisa acessibilidade
- deixar claro que o usuario pode digitar um site publico

Elementos:

- titulo curto
- texto de apoio
- input de URL grande
- botao principal de analise
- pequenos indicadores como WCAG, AxeCore e IA

### Footer

O footer deve aparecer de forma sutil ja na primeira tela, sem roubar o foco do campo de URL.

Conteudos iniciais:

- breve explicacao do objetivo do projeto
- contexto academico
- autoria
- GitHub
- LinkedIn
- tecnologias principais

Dados atuais:

- autor: Gabriel Lourenço de Oliveira
- instituicao: UNIFENAS, campus Alfenas
- periodo: 7 periodo
- orientador: professor Celso
- GitHub: `https://github.com/Gabriel-Oliviera42`
- LinkedIn: `https://www.linkedin.com/in/gabriel-lourenco-ab7893273`

Nao incluir ainda:

- telefone
- email pessoal
- lista grande de professores
- textos longos academicos

## Estrutura Durante A Analise

Quando o usuario envia a URL, a tela deve sair do modo apresentacao e entrar em modo processamento.

Elementos esperados:

- URL analisada
- status atual vindo do backend
- etapa atual
- mensagem amigavel
- indicacao visual de progresso sem prometer porcentagem falsa

Regra:

Nao mostrar tempo estimado ou posicao de fila se o dado ainda nao for confiavel.

## Estrutura Depois Da Analise

Quando a analise termina, a interface deve priorizar leitura e acao.

Ideia inicial:

- resumo no topo
- lista de problemas
- filtros por severidade
- detalhes de cada erro
- botao para perguntar para IA sobre cada erro
- chat de IA como apoio contextual

Resumo:

- total de problemas
- criticos
- serios
- moderados
- menores

Lista de problemas:

- titulo/ajuda do Axe
- severidade
- descricao
- elemento HTML afetado
- acao "Perguntar a IA"

## Previa Do Site

Mostrar o site analisado e uma boa ideia, mas precisa ser feito com cuidado.

Problema:

Muitos sites bloqueiam exibicao dentro de `iframe`, entao simplesmente colocar o site na tela pode falhar.

Direcao mais profissional:

- no futuro, o backend pode gerar screenshot com Playwright
- o frontend mostra a imagem capturada
- o painel de previa pode ser fechado ou recolhido

Na primeira etapa, o layout pode reservar espaco para essa area sem implementar screenshot ainda.

## Chat E IA

A IA e uma funcionalidade principal.

Direcao:

- manter chat acessivel durante a experiencia
- permitir perguntas gerais
- permitir perguntas contextuais sobre erros
- evitar que o chat cubra informacao importante
- preparar espaco futuro para configuracoes de IA

Configuracoes futuras:

- provider de IA
- chave propria
- modelo
- nivel de explicacao
- formato de resposta

## Estilo Visual

Direcao inicial:

- limpo
- profissional
- claro
- acessivel
- com cara de ferramenta, nao propaganda

Cores:

- base clara com branco e cinzas suaves
- azul como acao principal, sem depender somente dele
- vermelho para critico
- laranja/vermelho suave para serio
- amarelo/ambar para moderado
- azul/teal ou cinza para menor

Evitar:

- tela toda azul
- gradientes pesados
- visual escuro demais
- excesso de cards decorativos
- animacoes antes da estrutura estar boa

## Bibliotecas Candidatas

Ja existentes:

- React
- Vite
- Tailwind
- Axios
- React Markdown
- React Syntax Highlighter
- React Resizable Panels

Recomendadas para avaliar:

- Lucide React para icones
- Radix UI ou shadcn/ui para componentes acessiveis
- Motion para animacoes futuras

Decisao inicial:

Nao instalar bibliotecas novas ate definir a primeira tela com mais clareza.

## Primeira Etapa De Implementacao

Escopo pequeno:

1. Criar estrutura visual base. Status: iniciado.
2. Separar componentes principais. Status: iniciado.
3. Melhorar tela inicial. Status: iniciado.
4. Mostrar status da analise de forma mais bonita. Status: iniciado.
5. Preservar funcionalidade atual.

Componentes provaveis:

- `AppHeader`
- `UrlAnalyzerForm`
- `ProjectFooter`
- `AnalysisStatus`
- `AnalysisSummary`
- `IssueList`
- `IssueCard`
- `AiAssistant`

## Progresso Da Primeira Etapa

Primeira implementacao visual:

- header novo com nome provisorio AcessiLab, configuracoes e app em breve
- tela inicial centralizada com campo de URL em destaque
- footer discreto com autoria, contexto academico, GitHub e LinkedIn
- area de status da analise com mensagem amigavel
- resumo de severidades separado
- lista inicial de problemas em componentes proprios
- area reservada para previa futura do site analisado
- bloco lateral para reforcar o papel do assistente IA

Refinamento apos revisao visual:

- remover selos tecnicos soltos da tela inicial
- trocar o texto inicial por uma promessa mais simples e menos repetitiva
- explicar o produto com tres blocos curtos: analise automatica, relatorio claro e ajuda com IA
- melhorar footer com cards e icones
- remover card redundante do assistente IA na tela de resultado
- manter apenas o painel futuro de visual do site, com texto mais claro
- deixar cada problema mais informativo, com regra Axe, diagnostico e elemento afetado

Segundo refinamento apos teste local:

- ajustar titulo inicial para evitar quebra visual ruim
- substituir footer em cards por uma faixa mais profissional e compacta
- corrigir cards de problemas para impedir que o bloco de codigo estoure a tela
- reorganizar diagnostico e elemento afetado para leitura mais confortavel
- alinhar o visual do chat IA com a paleta do restante da interface

Terceiro refinamento apos revisao:

- remover bloco "Proximo passo" dos cards de erro
- dar mais espaco para o elemento HTML afetado
- colocar rolagem propria na lista de problemas
- manter footer tambem depois da analise, em versao mais compacta

Quarto refinamento apos revisao:

- manter footer preso ao rodape do layout durante carregamento
- ordenar problemas por severidade: criticos, serios, moderados e menores
- redesenhar o resumo do relatorio com total separado, barra de distribuicao e cards menores

Componentes criados:

- `AppHeader`
- `UrlAnalyzerForm`
- `ProjectFooter`
- `AnalysisStatus`
- `AnalysisSummary`
- `IssueList`

## Decisoes Pendentes

- Nome definitivo do projeto.
- Estilo exato do logo.
- Se o botao de baixar app aparece agora ou depois.
- Se o footer fica como faixa, colunas ou bloco compacto.
- Layout final do relatorio.
- Como sera a previa do site analisado.
- Se vamos instalar shadcn/ui, Radix UI, Lucide ou Motion nesta fase.
