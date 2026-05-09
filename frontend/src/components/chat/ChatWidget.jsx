import React, { useState, forwardRef, useImperativeHandle } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatCircleDots, PaperPlaneTilt, CircleNotch, Robot } from "@phosphor-icons/react";
import ChatPanel from './ChatPanel';
import ChatHeader from './ChatHeader';
import ChatMessageList from './ChatMessageList';
import ChatComposer from './ChatComposer';
import { useChat } from "../../hooks/useChat";

export default forwardRef(function ChatWidget(_, ref) {
  
  // Estado do Chat
  const [chatAberto, setChatAberto] = useState(false)
  
  // Hook do Chat
  const {
    mensagens,
    inputChat,
    setInputChat,
    chatCarregando,
    enviarMensagem,
    perguntarSobreErro: perguntarSobreErroChat
  } = useChat();

  // Método exposto para comunicação externa
  useImperativeHandle(ref, () => ({
    perguntarSobreErro: (erro) => {
      setChatAberto(true)
      perguntarSobreErroChat(erro)
    }
  }))

  const handleSendMessage = () => {
    if (inputChat.trim() && !chatCarregando) {
      enviarMensagem(inputChat)
    }
  }

  return (
    <>
      {/* Botão Flutuante */}
      {!chatAberto && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <button
            onClick={() => setChatAberto(true)}
            className="bg-primary text-white p-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center group"
          >
            <ChatCircleDots size={24} weight="regular" className="group-hover:animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse shadow-sm"></span>
          </button>
        </div>
      )}

      {/* Janela do Chat */}
      <ChatPanel isOpen={chatAberto}>
        <ChatHeader onClose={() => setChatAberto(false)} />
        <ChatMessageList messages={mensagens} loading={chatCarregando} />
        <ChatComposer 
          inputChat={inputChat}
          setInputChat={setInputChat}
          onSend={handleSendMessage}
          loading={chatCarregando}
        />
      </ChatPanel>
    </>
  );
});
