import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { CircleNotch } from "@phosphor-icons/react";

export default function ChatMessageList({ messages, loading }) {
  const chatFimRef = useRef(null);

  // Scroll automático quando mensagens mudam
  useEffect(() => {
    chatFimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.autor === 'usuario' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
          <div className={`max-w-xs ${msg.autor === 'usuario' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} shadow-sm border border-gray-200 p-3 rounded-xl`}>
            <div className="flex items-center space-x-2 mb-1">
              {msg.autor === 'usuario' ? (
                <span className="text-xs text-white text-opacity-80">Você</span>
              ) : (
                <span className="text-xs text-gray-500">Assistente</span>
              )}
            </div>
            <div className="text-sm font-body markdown-content">
              <ReactMarkdown>{msg.texto}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
      
      {loading && (
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
  );
}
