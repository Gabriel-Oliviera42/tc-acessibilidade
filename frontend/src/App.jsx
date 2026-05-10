// --- ÁREA DE IMPORTAÇÕES ---
// Trazemos as ferramentas que o React e nosso projeto precisam para funcionar.
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatWidget from './components/ChatWidget'

// Importamos a ferramenta que permite dividir e arrastar a tela
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

function App() {
  // --- ESTADOS (A MEMÓRIA DO APLICATIVO) ---
  // O 'useState' guarda valores. Toda vez que um valor muda, o React atualiza a tela automaticamente.
  const [url, setUrl] = useState('')
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erroBackend, setErroBackend] = useState(null)

  // Estados exclusivos para o Chat da Inteligência Artificial
  const [chatAberto, setChatAberto] = useState(false)
  const [mensagens, setMensagens] = useState([
    { autor: 'ia', texto: 'Olá! Sou seu assistente de acessibilidade.' }
  ])
  const [inputChat, setInputChat] = useState('')
  const [chatCarregando, setChatCarregando] = useState(false)
  
  // Referência para o fim da lista de mensagens (usado para rolar a tela para baixo automaticamente)
  const chatFimRef = useRef(null)

  // 'useEffect' executa uma ação automaticamente quando algo acontece. 
  // Aqui: "Toda vez que a lista de 'mensagens' mudar, role a tela do chat para o final".
  useEffect(() => {
    chatFimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  // Cria um objeto contando quantos erros de cada tipo existem para enviar à Sidebar
  const contagem = {
    critical: resultado?.erros?.filter(e => e.impacto === 'critical').length || 0,
    serious: resultado?.erros?.filter(e => e.impacto === 'serious').length || 0,
    moderate: resultado?.erros?.filter(e => e.impacto === 'moderate').length || 0,
    minor: resultado?.erros?.filter(e => e.impacto === 'minor').length || 0,
  }

  // --- FUNÇÕES DO SISTEMA ---

  // Função que envia a URL para o Python analisar
  const analisarSite = async () => {
    if (!url) return alert("Por favor, digite uma URL primeiro!")
    
    // Garante que a URL comece com http ou https
    let urlTratada = url.trim()
    if (!urlTratada.startsWith('http://') && !urlTratada.startsWith('https://')) {
      urlTratada = 'https://' + urlTratada
      setUrl(urlTratada)
    }

    setCarregando(true)
    setErroBackend(null)
    setResultado(null) 

    try {
      // 1. Correção do 405: Usando POST e enviando como JSON
      const response = await axios.post(`/analisar`, { url: urlTratada })
      
      // Pega o ticket da fila que o backend devolveu
      const ticketId = response.data.ticket_id
      
      if (!ticketId) {
        setErroBackend("Não foi possível gerar um ticket de análise.")
        setCarregando(false)
        return
      }

      // 2. Lógica de "Polling": Fica checando o status a cada 2 segundos
      let finalizado = false
      while (!finalizado) {
        // Pausa de 2 segundos para não sobrecarregar o servidor
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Pergunta pro backend o status do nosso ticket
        const statusResponse = await axios.get(`/analisar/status/${ticketId}`)
        const statusAtual = statusResponse.data.status

        if (statusAtual === "Concluído!") {
          // Uhul! Terminou. Salva o resultado e sai do loop.
          setResultado(statusResponse.data.resultado)
          finalizado = true
        } else if (statusAtual === "Erro crítico ao processar o site.") {
          // Deu ruim na análise.
          setErroBackend("Erro ao processar o site. Verifique os logs do worker.")
          finalizado = true
        }
        // Se o status for "Na fila..." ou "Processando...", o loop repete silenciosamente.
      }

    } catch (error) {
      console.error(error)
      setErroBackend("Erro ao conectar com o servidor Python.")
    } finally {
      setCarregando(false) // Tira a mensagem de "Analisando..." da tela
    }
  }

  // Função que envia a pergunta digitada para a IA (Gemini)
  const enviarMensagemIA = async (textoUsuario) => {
    if (!textoUsuario.trim()) return

    // Coloca a mensagem do usuário na tela e limpa o campo de texto
    setMensagens(prev => [...prev, { autor: 'usuario', texto: textoUsuario }])
    setInputChat('')
    setChatCarregando(true)

    try {
      const response = await axios.post(`/chat`, { mensagem: textoUsuario })
      const respostaDaIA = response.data.resposta;
      
      let textoParaMostrar = respostaDaIA.status === "sucesso" ? respostaDaIA.dados : "⚠️ " + respostaDaIA.mensagem; 
      
      // Coloca a resposta da IA na tela
      setMensagens(prev => [...prev, { autor: 'ia', texto: textoParaMostrar }])
    } catch (error) {
      console.error(error);
      setMensagens(prev => [...prev, { autor: 'ia', texto: "❌ Erro de conexão com a IA." }])
    } finally {
      setChatCarregando(false)
    }
  }

  // Função chamada pela Sidebar quando você clica em perguntar sobre um erro específico
  const perguntarSobreErro = (erro) => {
    setChatAberto(true) // Abre a janelinha do chat primeiro
    const prompt = `Encontrei este erro: "${erro.descricao}". Elemento afetado: ${erro.elemento_html}. Como resolvo?`
    enviarMensagemIA(prompt)
  }

  // --- DESENHO DA TELA (HTML/JSX) ---
  return (
    // Caixa principal que ocupa 100% da altura (h-screen)
    <div className="h-screen w-screen flex flex-col font-sans">
      
      {/* 1. O CABEÇALHO */}
      {/* Passamos para o Header as memórias e funções que ele precisa para funcionar */}
      <Header 
        url={url} 
        setUrl={setUrl} 
        analisarSite={analisarSite} 
        carregando={carregando} 
      />

      {/* 2. ÁREA DIVIDIDA (Abaixo do cabeçalho) */}
      {/* PanelGroup avisa que teremos painéis lado a lado (horizontal) */}
      <PanelGroup direction="horizontal" className="flex-1">
        
        {/* PAINEL ESQUERDO (Começa ocupando 100% do espaço disponível) */}
        <Panel defaultSize={100} className="flex">
          
          <Sidebar 
            resultado={resultado} 
            contagem={contagem} 
            perguntarSobreErro={perguntarSobreErro} 
          />

          {/* Área central simples que mostra os status da análise */}
          <main className="flex-1 p-4 overflow-y-auto">
            {carregando && <p>⏳ Analisando o site...</p>}
            {erroBackend && !carregando && <p style={{color: 'red'}}>Erro: {erroBackend}</p>}
            {!carregando && !erroBackend && !resultado && <p>Digite uma URL no topo e clique em Analisar.</p>}
          </main>
          
        </Panel>

        {/* A BARRINHA DE ARRASTAR */}
        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 cursor-col-resize" />

        {/* PAINEL DIREITO (Começa escondido - tamanho 0) */}
        <Panel defaultSize={0}>
          <div className="h-full bg-gray-200 p-4">
            <p>Área da Imagem do Site</p>
          </div>
        </Panel>

      </PanelGroup>
      
      {/* 3. WIDGET DO CHAT (Todo aquele código visual agora mora em outro arquivo!) */}
      <ChatWidget 
        chatAberto={chatAberto}
        setChatAberto={setChatAberto}
        mensagens={mensagens}
        inputChat={inputChat}
        setInputChat={setInputChat}
        enviarMensagemIA={enviarMensagemIA}
        chatCarregando={chatCarregando}
        chatFimRef={chatFimRef}
      />

    </div>
  )
}

export default App