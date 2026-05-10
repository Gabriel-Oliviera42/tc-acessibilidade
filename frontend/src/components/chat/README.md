# Arquitetura do Chat IA

## Fluxo de Comunicação

```
App.jsx
→ components/ChatWidget.jsx
→ components/chat/ChatWidget.jsx
→ useChat.js
→ chatService.js
→ backend /chat
```

## Responsabilidade de Cada Arquivo

### **components/ChatWidget.jsx**
- **Finalidade:** Reexport para manter compatibilidade com App.jsx
- **Função:** Redireciona imports para `./chat/ChatWidget`
- **Motivo:** Permite refatoração sem quebrar App.jsx

### **components/chat/ChatWidget.jsx**
- **Finalidade:** Orquestrador principal do chat
- **Responsabilidades:**
  - Estado de abertura/fechamento (`chatAberto`)
  - forwardRef/useImperativeHandle para integração com Sidebar
  - Composição visual dos componentes do chat
  - Passagem de props para componentes filhos

### **ChatPanel.jsx**
- **Finalidade:** Container animado do chat
- **Responsabilidades:**
  - Animação de abertura/fechamento com Motion
  - Layout e posicionamento do painel
  - Envolve todos os componentes internos

### **ChatHeader.jsx**
- **Finalidade:** Cabeçalho do chat
- **Responsabilidades:**
  - Título e subtítulo do assistente
  - Botão de fechar
  - Avatar e informações do IA

### **ChatMessageList.jsx**
- **Responsabilidades:**
  - Renderização da lista de mensagens
  - Scroll automático para última mensagem
  - Indicador de loading
  - Ref para controle de scroll

### **ChatMessage.jsx**
- **Finalidade:** Renderização individual de mensagem
- **Responsabilidades:**
  - Diferenciação visual entre usuário/IA
  - Renderização de markdown com ReactMarkdown
  - Estilização condicional por autor

### **ChatComposer.jsx**
- **Finalidade:** Campo de entrada e envio
- **Responsabilidades:**
  - Textarea autosize (react-textarea-autosize)
  - Botão de envio com loading state
  - Comportamento de Enter/Shift+Enter
  - Validação de input vazio

### **hooks/useChat.js**
- **Finalidade:** Hook central da lógica do chat
- **Responsabilidades:**
  - Estado de mensagens, input e loading
  - Função de envio de mensagem
  - Função de pergunta sobre erro
  - Comunicação com chatService
  - Tratamento de erros e respostas

### **services/chatService.js**
- **Finalidade:** Comunicação HTTP com backend
- **Responsabilidades:**
  - POST `/chat` com payload `{ mensagem }`
  - Retorno da resposta da IA
  - Abstração da API do frontend

## Regras Importantes

### **Comunicação com IA**
- **Frontend não deve conhecer diretamente a API Gemini**
- **Toda comunicação IA passa pelo backend via `/chat`**
- **Backend gerencia modelos, cache e tratamento de erros**

### **Segurança Futura**
- **Chave de API do usuário não deve ser salva em texto puro no frontend**
- **Configurações sensíveis devem ser tratadas pelo backend**
- **Frontend apenas envia mensagens e recebe respostas**

## Como Testar o Chat

### **Funcionalidades Básicas**
1. **Abrir/Fechar Chat:** Botão flutuante e X no header
2. **Enviar Mensagem Manual:** Digitar e clicar no botão de envio
3. **Enviar com Enter:** Enter envia, Shift+Enter quebra linha
4. **Loading:** Indicador de carregamento aparece durante envio
5. **Markdown:** Respostas renderizam markdown (títulos, listas, código)
6. **Scroll:** Scroll automático para última mensagem

### **Integração com Sidebar**
1. **Botão "Perguntar sobre erro":** Abre chat e envia pergunta contextual
2. **Contexto do Erro:** Passa descrição e elemento HTML para IA
3. **Resposta Contextual:** IA responde sobre erro específico

### **Estados e Comportamentos**
1. **Campo Desabilitado:** Durante loading
2. **Botão Desabilitado:** Mensagem vazia ou loading
3. **Animação:** Abertura/fechamento suave com Motion
4. **Responsividade:** Chat flutuante posicionado corretamente

## Estrutura de Dados

### **Mensagem**
```javascript
{
  autor: 'usuario' | 'ia',
  texto: 'conteúdo da mensagem (pode incluir markdown)'
}
```

### **Resposta do Backend**
```javascript
{
  status: "sucesso" | "erro",
  dados: "resposta formatada em markdown" // se sucesso
  mensagem: "mensagem de erro" // se erro
}
```

## Dependências

### **React e Bibliotecas**
- **ReactMarkdown:** Renderização de markdown
- **Motion:** Animações do painel
- **react-textarea-autosize:** Campo de entrada
- **@phosphor-icons/react:** Ícones

### **Serviços**
- **chatService.js:** Comunicação HTTP
- **useChat.js:** Hook de lógica

## Manutenção

### **Para Adicionar Funcionalidades**
1. **Lógica:** Adicionar em `useChat.js`
2. **Visual:** Criar componente em `components/chat/`
3. **API:** Modificar `chatService.js` se necessário
4. **Integração:** Atualizar `ChatWidget.jsx` para compor novo componente

### **Para Debugar**
1. **Erros de API:** Verificar `chatService.js`
2. **Estados:** Verificar `useChat.js`
3. **Visual:** Verificar componente específico
4. **Integração:** Verificar `ChatWidget.jsx`

## Notas de Desenvolvimento

- **ForwardRef:** Mantido para integração com Sidebar
- **useImperativeHandle:** Expõe `perguntarSobreErro`
- **Motion:** Animações configuradas com spring
- **Markdown:** Classes CSS personalizadas em `index.css`
- **Autosize:** Limitado a 4 linhas máximas
