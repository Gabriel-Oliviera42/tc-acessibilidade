import React from 'react';
import ReactMarkdown from 'react-markdown';

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
  
  if (!chatAberto) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
        <button
          onClick={() => setChatAberto(true)}
          className="bg-primary text-white p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center group"
        >
          <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse shadow-sm"></span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-surface rounded-xl shadow-xl border border-gray-200 flex flex-col animate-slide-up glass-effect">
      
      {/* Header do Chat */}
      <div className="bg-primary p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-white font-heading">Assistente IA</h3>
            <p className="text-xs text-white text-opacity-90 font-body">Acessibilidade WCAG</p>
          </div>
        </div>
        <button
          onClick={() => setChatAberto(false)}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-secondary">
        {mensagens.map((msg, index) => (
          <div key={index} className={`flex ${msg.autor === 'usuario' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${
              msg.autor === 'usuario' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-surface text-gray-800 shadow-sm border border-gray-200'
            }`}>
              <div className="flex items-center space-x-2 mb-1">
                {msg.autor === 'usuario' ? (
                  <span className="text-xs text-white text-opacity-90 font-body">Você</span>
                ) : (
                  <span className="text-xs text-gray-500 font-body">Assistente</span>
                )}
              </div>
              <div className="text-sm font-body markdown-content">
                <ReactMarkdown>{msg.texto}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {chatCarregando && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-surface text-gray-800 shadow-sm border border-gray-200 p-3 rounded-xl">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatFimRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-surface border-t border-gray-200 rounded-b-xl">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputChat}
              onChange={(e) => setInputChat(e.target.value)}
              placeholder="Digite sua pergunta sobre acessibilidade..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface font-body text-gray-900 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && !chatCarregando && enviarMensagemIA(inputChat)}
              disabled={chatCarregando}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => enviarMensagemIA(inputChat)}
            disabled={chatCarregando || !inputChat.trim()}
            className="px-4 py-3 bg-primary text-white rounded-lg font-medium transition-colors hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-body shadow-sm"
          >
            {chatCarregando ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}