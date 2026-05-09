import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message }) {
  return (
    <div className={`flex ${message.autor === 'usuario' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`max-w-xs ${message.autor === 'usuario' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'} shadow-sm border border-gray-200 p-3 rounded-xl`}>
        <div className="flex items-center space-x-2 mb-1">
          {message.autor === 'usuario' ? (
            <span className="text-xs text-white text-opacity-80">Você</span>
          ) : (
            <span className="text-xs text-gray-500">Assistente</span>
          )}
        </div>
        <div className="text-sm font-body markdown-content">
          <ReactMarkdown>{message.texto}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
