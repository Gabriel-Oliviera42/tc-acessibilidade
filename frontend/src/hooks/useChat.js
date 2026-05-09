import { useState } from 'react';
import { enviarMensagemChat } from '../services/chatService';

export function useChat() {
  const [mensagens, setMensagens] = useState([
    { autor: 'ia', texto: 'Olá! Sou seu assistente especializado em acessibilidade web. Posso ajudar você a entender e resolver problemas de WCAG encontrados na análise. Como posso auxiliar hoje?' }
  ])
  const [inputChat, setInputChat] = useState('')
  const [chatCarregando, setChatCarregando] = useState(false)

  const enviarMensagem = async (textoUsuario) => {
    if (!textoUsuario.trim()) return

    // Coloca a mensagem do usuário na tela e limpa o campo de texto
    setMensagens(prev => [...prev, { autor: 'usuario', texto: textoUsuario }])
    setInputChat('')
    setChatCarregando(true)

    try {
      const respostaDaIA = await enviarMensagemChat(textoUsuario)
      
      let textoParaMostrar = respostaDaIA.status === "sucesso" ? respostaDaIA.dados : "Aviso: " + respostaDaIA.mensagem; 
      
      // Coloca a resposta da IA na tela
      setMensagens(prev => [...prev, { autor: 'ia', texto: textoParaMostrar }])
    } catch (error) {
      console.error("Erro detalhado:", error)
      console.error("Response:", error.response)
      console.error("Request:", error.request)
      
      let mensagemErro = "Erro de conexão com a IA."
      if (error.response) {
        mensagemErro = `Erro ${error.response.status}: ${error.response.data?.detail || error.response.data?.message || 'Erro desconhecido'}`
      } else if (error.request) {
        mensagemErro = "Servidor não respondeu. Verifique se o backend está online."
      }
      
      setMensagens(prev => [...prev, { autor: 'ia', texto: mensagemErro }])
    } finally {
      setChatCarregando(false)
    }
  }

  const perguntarSobreErro = (erro) => {
    const prompt = `Encontrei este erro: "${erro.descricao}". Elemento afetado: ${erro.elemento_html}. Como resolvo?`
    enviarMensagem(prompt)
  }

  return {
    mensagens,
    inputChat,
    setInputChat,
    chatCarregando,
    enviarMensagem,
    perguntarSobreErro
  }
}
