import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import AppHeader from './components/AppHeader'
import AnalysisStatus from './components/AnalysisStatus'
import AnalysisSummary from './components/AnalysisSummary'
import ChatWidget from './components/ChatWidget'
import IssueList from './components/IssueList'
import ProjectFooter from './components/ProjectFooter'
import UrlAnalyzerForm from './components/UrlAnalyzerForm'
import { Camera, CheckCircle2, ListChecks, WandSparkles } from 'lucide-react'

function App() {
  const [url, setUrl] = useState('')
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erroBackend, setErroBackend] = useState(null)
  const [statusAnalise, setStatusAnalise] = useState('')
  const [avisoInterface, setAvisoInterface] = useState('')

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

  useEffect(() => {
    if (!avisoInterface) return

    const timer = window.setTimeout(() => {
      setAvisoInterface('')
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [avisoInterface])

  const contagem = {
    critical: resultado?.erros?.filter(e => e.impacto === 'critical').length || 0,
    serious: resultado?.erros?.filter(e => e.impacto === 'serious').length || 0,
    moderate: resultado?.erros?.filter(e => e.impacto === 'moderate').length || 0,
    minor: resultado?.erros?.filter(e => e.impacto === 'minor').length || 0,
  }

  const telaInicial = !carregando && !erroBackend && !resultado

  const mostrarRecursoFuturo = (recurso) => {
    setAvisoInterface(`${recurso} sera adicionado em uma etapa futura.`)
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
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-950">
      <AppHeader onSoon={mostrarRecursoFuturo} />

      {avisoInterface && (
        <div className="fixed left-1/2 top-20 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
          {avisoInterface}
        </div>
      )}

      {telaInicial ? (
        <>
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
            <section className="mx-auto w-full max-w-4xl text-center">
              <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                Teste a acessibilidade do seu site
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Informe uma URL publica para receber um relatorio organizado, entender o que precisa
                de atencao e pedir ajuda da IA para corrigir os pontos encontrados.
              </p>

              <div className="mt-8">
                <UrlAnalyzerForm
                  url={url}
                  setUrl={setUrl}
                  analisarSite={analisarSite}
                  carregando={carregando}
                />
              </div>

              <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <CheckCircle2 size={18} className="text-blue-700" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-slate-950">Analise automatica</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">O sistema carrega a pagina e procura problemas comuns.</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <ListChecks size={18} className="text-blue-700" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-slate-950">Relatorio claro</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">Os achados aparecem por gravidade e elemento afetado.</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <WandSparkles size={18} className="text-blue-700" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-slate-950">Ajuda com IA</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">Peça explicacoes e exemplos de correcao quando precisar.</p>
                </div>
              </div>
            </section>
          </main>

          <ProjectFooter />
        </>
      ) : (
        <>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
            <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4">
              <UrlAnalyzerForm
                url={url}
                setUrl={setUrl}
                analisarSite={analisarSite}
                carregando={carregando}
                compact
              />
            </section>

            <AnalysisSummary resultado={resultado} contagem={contagem} />

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-5">
                <AnalysisStatus statusAnalise={statusAnalise} erroBackend={erroBackend} />
                <IssueList resultado={resultado} perguntarSobreErro={perguntarSobreErro} />
              </div>

              <aside className="space-y-5">
                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <Camera size={17} className="text-blue-700" aria-hidden="true" />
                    Visual do site
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Em uma etapa futura, este painel pode mostrar uma captura da pagina analisada
                    para ajudar a localizar os problemas no contexto visual.
                  </p>
                </section>
              </aside>
            </div>
          </main>

          <ProjectFooter compact />
        </>
      )}

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
