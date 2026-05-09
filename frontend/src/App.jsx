// --- ÁREA DE IMPORTAÇÕES ---
// Trazemos as ferramentas que o React e nosso projeto precisam para funcionar.
import { useState, useRef } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatWidget from './components/ChatWidget'
import SitePreview from './components/SitePreview'

// Importamos a ferramenta que permite dividir e arrastar a tela
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

function App() {
  // --- ESTADOS (A MEMÓRIA DO APLICATIVO) ---
  // O 'useState' guarda valores. Toda vez que um valor muda, o React atualiza a tela automaticamente.
  const [url, setUrl] = useState('')
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
    const [panelSizes, setPanelSizes] = useState({ left: 100, right: 0 })
  
  // Referência para o ChatWidget
  const chatWidgetRef = useRef(null)

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
    setResultado(null) 

    try {
      // 1. Correção do 405: Usando POST e enviando como JSON
      const response = await axios.post(`/analisar`, { url: urlTratada })
      
      // Pega o ticket da fila que o backend devolveu
      const ticketId = response.data.ticket_id
      
      if (!ticketId) {
        alert("Não foi possível gerar um ticket de análise.")
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
          setPanelSizes({ left: 66.7, right: 33.3 })  // Esquerda 2/3, Direita 1/3
          finalizado = true
        } else if (statusAtual === "Erro crítico ao processar o site.") {
          // Deu ruim na análise.
          alert("Erro ao processar o site. Verifique os logs do worker.")
          finalizado = true
        }
        // Se o status for "Na fila..." ou "Processando...", o loop repete silenciosamente.
      }

    } catch (error) {
      console.error(error)
      alert("Erro ao conectar com o servidor Python.")
    } finally {
      setCarregando(false) // Tira a mensagem de "Analisando..." da tela
    }
  }

  // Função chamada pela Sidebar quando você clica em perguntar sobre um erro específico
  const perguntarSobreErro = (erro) => {
    chatWidgetRef.current?.perguntarSobreErro(erro)
  }

  // --- DESENHO DA TELA (HTML/JSX) ---
  return (
    // Caixa principal que ocupa 100% da altura (h-screen)
    <div className="h-screen w-screen flex flex-col font-sans bg-main">
      
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
        
        {/* PAINEL ESQUERDO (Sidebar + Status) */}
        <Panel 
          defaultSize={panelSizes.left} 
          minSize={33.3} 
          maxSize={100} 
          className="h-full"
          onResize={(size) => {
            if (size < 33.3) {
              // Se esquerda ficar muito pequena, fecha painel direito
              setPanelSizes({ left: 100, right: 0 })
            }
          }}
        >
          <Sidebar 
            resultado={resultado} 
            contagem={contagem} 
            perguntarSobreErro={perguntarSobreErro} 
          />
        </Panel>

        {/* A BARRINHA DE ARRASTAR */}
        <PanelResizeHandle className="flex items-center justify-center w-3 hover:bg-gray-100 cursor-col-resize group">
          <div className="w-2 h-8 bg-gray-300 rounded-full group-hover:bg-gray-400 transition-colors flex items-center justify-center">
            <div className="text-xs text-gray-500 group-hover:text-gray-600">
              ⋮⋮
            </div>
          </div>
        </PanelResizeHandle>

        {/* PAINEL DIREITO (Preview do site) */}
        <Panel 
          defaultSize={panelSizes.right} 
          minSize={0} 
          maxSize={100} 
          className="h-full relative z-10"
          onResize={(size) => {
            if (size < 15) {
              // Se direito ficar muito pequeno, fecha automaticamente
              setPanelSizes({ left: 100, right: 0 })
            } else if (size > 66.7) {
              // Se direito ficar muito grande, permite sobrepor esquerda
              setPanelSizes({ left: 33.3, right: 66.7 })
            }
          }}
        >
          <SitePreview resultado={resultado} />
        </Panel>

      </PanelGroup>
      
      {/* 3. WIDGET DO CHAT */}
      <ChatWidget ref={chatWidgetRef} />

    </div>
  )
}

export default App