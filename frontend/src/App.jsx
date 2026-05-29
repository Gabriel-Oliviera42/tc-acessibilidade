import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatWidget from './components/ChatWidget'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

function App() {
  const [url, setUrl] = useState('')
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erroBackend, setErroBackend] = useState(null)
  const [statusAnalise, setStatusAnalise] = useState('')

  const [chatAberto, setChatAberto] = useState(false)
  const [mensagens, setMensagens] = useState([
    { autor: 'ia', texto: 'Ola! Sou seu assistente de acessibilidade.' }
  ])
  const [inputChat, setInputChat] = useState('')
  const [chatCarregando, setChatCarregando] = useState(false)

  const chatFimRef = useRef(null)

  useEffect(() => {
    chatFimRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const contagem = {
    critical: resultado?.erros?.filter(e => e.impacto === 'critical').length || 0,
    serious: resultado?.erros?.filter(e => e.impacto === 'serious').length || 0,
    moderate: resultado?.erros?.filter(e => e.impacto === 'moderate').length || 0,
    minor: resultado?.erros?.filter(e => e.impacto === 'minor').length || 0,
  }

  const analisarSite = async () => {
    if (!url) return alert('Por favor, digite uma URL primeiro!')

    let urlTratada = url.trim()
    if (!urlTratada.startsWith('http://') && !urlTratada.startsWith('https://')) {
      urlTratada = 'https://' + urlTratada
      setUrl(urlTratada)
    }

    setCarregando(true)
    setErroBackend(null)
    setResultado(null)
    setStatusAnalise('Enviando URL para analise...')

    try {
      const response = await axios.post('/analisar', { url: urlTratada })
      const ticketId = response.data.ticket_id
      setStatusAnalise(response.data.mensagem || 'Analise colocada na fila.')

      if (!ticketId) {
        setErroBackend('Nao foi possivel gerar um ticket de analise.')
        setCarregando(false)
        return
      }

      let finalizado = false
      while (!finalizado) {
        await new Promise(resolve => setTimeout(resolve, 2000))

        const statusResponse = await axios.get(`/analisar/status/${ticketId}`)
        const {
          estado,
          resultado: resultadoAnalise,
          erro,
          mensagem,
          status,
        } = statusResponse.data

        setStatusAnalise(mensagem || status || 'Processando analise...')

        if (estado === 'SUCCESS') {
          if (resultadoAnalise?.status === 'erro' || resultadoAnalise?.error) {
            setErroBackend(
              resultadoAnalise.mensagem ||
              resultadoAnalise.error ||
              'Nao foi possivel concluir a analise deste site agora.'
            )
          } else {
            setResultado(resultadoAnalise)
          }

          finalizado = true
        } else if (estado === 'FAILURE') {
          setErroBackend(
            mensagem ||
            erro ||
            'Erro ao processar o site. Verifique os logs do worker.'
          )
          finalizado = true
        }
      }
    } catch (error) {
      console.error(error)
      setErroBackend('Erro ao conectar com o servidor Python.')
    } finally {
      setCarregando(false)
      setStatusAnalise('')
    }
  }

  const enviarMensagemIA = async (textoUsuario) => {
    if (!textoUsuario.trim()) return

    setMensagens(prev => [...prev, { autor: 'usuario', texto: textoUsuario }])
    setInputChat('')
    setChatCarregando(true)

    try {
      const response = await axios.post('/chat', { mensagem: textoUsuario })
      const respostaDaIA = response.data.resposta

      const textoParaMostrar = respostaDaIA.status === 'sucesso'
        ? respostaDaIA.dados
        : 'Atencao: ' + respostaDaIA.mensagem

      setMensagens(prev => [...prev, { autor: 'ia', texto: textoParaMostrar }])
    } catch (error) {
      console.error(error)
      setMensagens(prev => [...prev, { autor: 'ia', texto: 'Erro de conexao com a IA.' }])
    } finally {
      setChatCarregando(false)
    }
  }

  const perguntarSobreErro = (erro) => {
    setChatAberto(true)
    const prompt = `Encontrei este erro: "${erro.descricao}". Elemento afetado: ${erro.elemento_html}. Como resolvo?`
    enviarMensagemIA(prompt)
  }

  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <Header
        url={url}
        setUrl={setUrl}
        analisarSite={analisarSite}
        carregando={carregando}
      />

      <PanelGroup direction="horizontal" className="flex-1">
        <Panel defaultSize={100} className="flex">
          <Sidebar
            resultado={resultado}
            contagem={contagem}
            perguntarSobreErro={perguntarSobreErro}
          />

          <main className="flex-1 p-4 overflow-y-auto">
            {carregando && <p>{statusAnalise || 'Analisando o site...'}</p>}
            {erroBackend && !carregando && <p style={{ color: 'red' }}>Erro: {erroBackend}</p>}
            {!carregando && !erroBackend && !resultado && <p>Digite uma URL no topo e clique em Analisar.</p>}
          </main>
        </Panel>

        <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 cursor-col-resize" />

        <Panel defaultSize={0}>
          <div className="h-full bg-gray-200 p-4">
            <p>Area da Imagem do Site</p>
          </div>
        </Panel>
      </PanelGroup>

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
