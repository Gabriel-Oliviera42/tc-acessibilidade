import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Bot, Check, Copy, Send, Sparkles, X } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copiado, setCopiado] = useState(false)
  const match = /language-(\w+)/.exec(className || '')
  const codigoLimpo = String(children).replace(/\n$/, '')

  const copiarParaAreaDeTransferencia = () => {
    navigator.clipboard.writeText(codigoLimpo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  if (!inline && match) {
    return (
      <div className="group relative my-3 overflow-hidden rounded-lg border border-slate-700">
        <button
          type="button"
          onClick={copiarParaAreaDeTransferencia}
          className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-slate-100 opacity-0 transition group-hover:opacity-100"
        >
          {copiado ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
          {copiado ? 'Copiado' : 'Copiar'}
        </button>

        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: '1.5rem 1rem 1rem 1rem', fontSize: '0.85rem' }}
          {...props}
        >
          {codigoLimpo}
        </SyntaxHighlighter>
      </div>
    )
  }

  return (
    <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-[0.8em] text-slate-800" {...props}>
      {children}
    </code>
  )
}

export default function ChatWidget({
  chatAberto,
  setChatAberto,
  mensagens,
  inputChat,
  setInputChat,
  enviarMensagemIA,
  chatCarregando,
  chatFimRef,
}) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {chatAberto && (
        <div className="mb-4 flex h-[540px] w-[min(calc(100vw-2rem),400px)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white">
                <Bot size={18} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-slate-950">Assistente IA</h3>
                <p className="text-xs text-slate-500">Ajuda para entender e corrigir erros</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatAberto(false)}
              className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Fechar assistente"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50 p-4">
            {mensagens.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[92%] rounded-lg border p-3 text-sm shadow-sm ${
                  msg.autor === 'ia'
                    ? 'self-start border-slate-200 bg-white text-slate-800'
                    : 'self-end border-blue-700 bg-blue-700 text-white'
                }`}
              >
                {msg.autor === 'ia' ? (
                  <div className="prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:p-0">
                    <ReactMarkdown components={{ code: CodeBlock }}>
                      {msg.texto}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="leading-relaxed">{msg.texto}</div>
                )}
              </div>
            ))}

            {chatCarregando && (
              <div className="flex h-10 w-16 items-center gap-1.5 self-start rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-700"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-700 delay-100"></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-700 delay-200"></span>
              </div>
            )}

            <div ref={chatFimRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
              <input
                type="text"
                value={inputChat}
                onChange={(event) => setInputChat(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !chatCarregando) enviarMensagemIA(inputChat)
                }}
                placeholder="Pergunte como resolver um erro..."
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => enviarMensagemIA(inputChat)}
                disabled={chatCarregando || !inputChat.trim()}
                className="m-1 inline-flex items-center justify-center rounded-md bg-blue-700 px-3 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
                aria-label="Enviar mensagem"
              >
                <Send size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setChatAberto(!chatAberto)}
        className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-xl transition ${
          chatAberto
            ? 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
            : 'border-blue-700 bg-blue-700 text-white hover:bg-blue-800'
        }`}
        aria-label={chatAberto ? 'Fechar assistente IA' : 'Abrir assistente IA'}
      >
        {chatAberto ? <X size={22} aria-hidden="true" /> : <Sparkles size={22} aria-hidden="true" />}
      </button>
    </div>
  )
}
