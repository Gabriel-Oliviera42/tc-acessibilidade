import React from 'react';
import TextareaAutosize from "react-textarea-autosize";
import { ChatCircleDots, PaperPlaneTilt, CircleNotch } from "@phosphor-icons/react";

export default function ChatComposer({ inputChat, setInputChat, onSend, loading }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-4 bg-surface border-t border-gray-200 rounded-b-xl">
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <TextareaAutosize
            value={inputChat}
            onChange={(e) => setInputChat(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            aria-label="Mensagem para o assistente"
            minRows={1}
            maxRows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface font-body text-gray-900 placeholder-gray-500 resize-none"
            disabled={loading}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <ChatCircleDots size={20} weight="regular" className="text-gray-400" />
          </div>
        </div>
        <button
          onClick={onSend}
          disabled={loading || !inputChat.trim()}
          aria-label="Enviar mensagem"
          className="px-4 py-3 bg-primary text-white rounded-lg font-medium transition-colors hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-body shadow-sm"
        >
          {loading ? (
            <CircleNotch size={20} weight="regular" className="animate-spin" />
          ) : (
            <PaperPlaneTilt size={20} weight="regular" className="text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
