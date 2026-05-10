// --- IMPORTAÇÕES ---
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Ferramentas para deixar o código colorido e com tema escuro (estilo VS Code/Notion)
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ============================================================================
// COMPONENTE AUXILIAR: Bloco de Código Inteligente
// Criamos isso fora do ChatWidget para que CADA bloco de código tenha seu 
// próprio botão de "Copiar" funcionando de forma independente.
// ============================================================================
// eslint-disable-next-line no-unused-vars
const CodeBlock = ({ node, inline, className, children, ...props }) => {
  // Estado para controlar se o texto foi copiado recentemente
  const [copiado, setCopiado] = useState(false);

  // Descobre qual é a linguagem de programação que a IA mandou (ex: html, js, css)
  const match = /language-(\w+)/.exec(className || '');
  // Limpa quebras de linha extras no final do código
  const codigoLimpo = String(children).replace(/\n$/, '');

  // Função que copia o texto e muda o botão para "Copiado!" por 2 segundos
  const copiarParaAreaDeTransferencia = () => {
    navigator.clipboard.writeText(codigoLimpo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000); // Volta ao normal após 2s
  };

  // Se não for um código no meio da frase (inline) e tiver uma linguagem definida:
  if (!inline && match) {
    return (
      // 'relative' e 'group' são os segredos aqui. O 'group' avisa o Tailwind que 
      // quando passarmos o mouse nessa div inteira, elementos dentro dela podem reagir.
      <div className="relative group mt-3 mb-3 rounded-lg overflow-hidden border border-slate-700 shadow-md">
        
        {/* O botão de copiar. 'opacity-0 group-hover:opacity-100' faz ele aparecer 
            só quando passamos o mouse por cima do bloco de código. */}
        <button 
          onClick={copiarParaAreaDeTransferencia}
          className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-10"
        >
          {copiado ? '✅ Copiado!' : '📋 Copiar'}
        </button>

        {/* O componente que pinta o código com as cores do VS Code */}
        <SyntaxHighlighter 
          style={vscDarkPlus} 
          language={match[1]} 
          PreTag="div" 
          // Ajustamos a margem interna para o botão não ficar em cima do código
          customStyle={{ margin: 0, padding: '1.5rem 1rem 1rem 1rem', fontSize: '0.85rem' }}
          {...props}
        >
          {codigoLimpo}
        </SyntaxHighlighter>
      </div>
    );
  }

  // Se for um código pequeno no meio do texto (ex: `<div>`), aplicamos um estilo simples
  return (
    <code className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[0.8em] font-mono" {...props}>
      {children}
    </code>
  );
};


// ============================================================================
// COMPONENTE PRINCIPAL: O Widget do Chat
// ============================================================================
export default function ChatWidget({ 
  chatAberto, 
  setChatAberto, 
  mensagens, 
  inputChat, 
  setInputChat, 
  enviarMensagemIA, 
  chatCarregando, 
  chatFimRef 
}) {
  return (
    // 'fixed z-50': Garante que o chat flutue acima de TUDO no site
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* 1. A JANELA DO CHAT */}
      {chatAberto && (
        // Usamos 'animate-in slide-in-from-bottom-5' para o chat surgir subindo suavemente
        <div className="w-80 sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* TOPO DO CHAT (Cabeçalho) */}
          <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-1.5 rounded-lg">✨</div>
              <div>
                <h3 className="font-semibold tracking-wide leading-tight">Assistente IA</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Especialista WCAG</p>
              </div>
            </div>
            <button 
              onClick={() => setChatAberto(false)}
              className="text-slate-400 hover:text-white hover:rotate-90 transition-all duration-300 p-1"
            >
              ✖
            </button>
          </div>

          {/* CORPO DO CHAT (Área das mensagens) */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
            
            {mensagens.map((msg, index) => (
              <div 
                key={index} 
                // A magia do layout: se for IA, alinha na esquerda ('self-start'). Se for usuário, direita ('self-end').
                className={`max-w-[90%] p-3.5 text-sm shadow-sm animate-in fade-in slide-in-from-bottom-2 ${
                  msg.autor === 'ia' 
                    ? 'bg-white border border-slate-200 text-slate-800 self-start rounded-2xl rounded-tl-sm' 
                    : 'bg-blue-600 text-white self-end rounded-2xl rounded-tr-sm'
                }`}
              >
                {msg.autor === 'ia' ? (
                  // 'prose': Configura automaticamente as margens de parágrafos e listas (padrão do Tailwind)
                  // Passamos nosso 'CodeBlock' customizado para o ReactMarkdown usar
                  <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:p-0">
                    <ReactMarkdown components={{ code: CodeBlock }}>
                      {msg.texto}
                    </ReactMarkdown>
                  </div>
                ) : (
                  // Mensagem do usuário não precisa de Markdown
                  <div className="leading-relaxed">{msg.texto}</div>
                )}
              </div>
            ))}
            
            {/* ANIMAÇÃO DE DIGITAÇÃO DA IA */}
            {chatCarregando && (
              <div className="bg-white border border-slate-200 text-blue-600 self-start rounded-2xl rounded-tl-sm shadow-sm p-4 flex gap-1.5 items-center w-16 h-10">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></span>
              </div>
            )}
            
            {/* Essa div vazia é o "alvo" para onde a tela rola automaticamente */}
            <div ref={chatFimRef} />
          </div>

          {/* RODAPÉ DO CHAT (Área de Digitação) */}
          <div className="p-3 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            {/* 'focus-within': quando o usuário clica no input, a borda da div inteira muda de cor! */}
            <div className="flex bg-slate-50 rounded-xl overflow-hidden border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <input 
                type="text" 
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !chatCarregando) enviarMensagemIA(inputChat) }}
                placeholder="Pergunte como resolver um erro..."
                className="flex-1 bg-transparent px-4 py-3 outline-none text-slate-700 placeholder-slate-400 text-sm"
              />
              <button 
                onClick={() => enviarMensagemIA(inputChat)} 
                disabled={chatCarregando || !inputChat.trim()}
                className="bg-blue-600 text-white px-4 py-2 m-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-sm hover:shadow"
              >
                {/* Ícone de enviar simples em texto (pode ser trocado por um SVG depois) */}
                ➤
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 2. O BOTÃO FLUTUANTE (A Bolha Principal) */}
      <button 
        onClick={() => setChatAberto(!chatAberto)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 text-2xl z-50 ${
          chatAberto 
            // Botão fechado (X)
            ? 'bg-slate-800 text-white hover:bg-slate-900 rotate-90 scale-90' 
            // Botão aberto (Estrelas)
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110 hover:-translate-y-1'
        }`}
      >
        {chatAberto ? '✖' : '✨'}
      </button>

    </div>
  );
}