import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import AppHeader from './components/AppHeader'
import AnalysisStatus from './components/AnalysisStatus'
import AnalysisSummary from './components/AnalysisSummary'
import ChatWidget from './components/ChatWidget'
import IssueList from './components/IssueList'
import ProjectFooter from './components/ProjectFooter'
import UrlAnalyzerForm from './components/UrlAnalyzerForm'

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-950">
      <AppHeader onSoon={mostrarRecursoFuturo} />

      {avisoInterface && (
        <div className="fixed left-1/2 top-20 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg">
          {avisoInterface}
        </div>
      )}

      {telaInicial ? (
        <>
          <main className="mx-auto flex min-h-[calc(100vh-17rem)] w-full max-w-6xl flex-col justify-center px-4 py-10 sm:px-6">
            <section className="mx-auto w-full max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">Acessibilidade digital</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                Analise a acessibilidade de um site em poucos minutos
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Informe uma URL publica para identificar problemas de acessibilidade, entender prioridades
                e pedir ajuda da IA para corrigir os pontos encontrados.
              </p>

              <div className="mt-8">
                <UrlAnalyzerForm
                  url={url}
                  setUrl={setUrl}
                  analisarSite={analisarSite}
                  carregando={carregando}
                />
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">WCAG</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">AxeCore</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">Playwright</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">IA assistiva</span>
              </div>
            </section>
          </main>

          <ProjectFooter />
        </>
      ) : (
        <>
          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
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

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <AnalysisStatus statusAnalise={statusAnalise} erroBackend={erroBackend} />
                <IssueList resultado={resultado} perguntarSobreErro={perguntarSobreErro} />
              </div>

              <aside className="space-y-5">
                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Previa do site</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Esta area esta reservada para uma captura feita pelo Playwright em uma etapa futura.
                  </p>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">Assistente IA</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Use o chat para pedir explicacoes sobre erros e exemplos de correcao.
                  </p>
                  <button
                    type="button"
                    onClick={() => setChatAberto(true)}
                    className="mt-4 w-full rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Abrir assistente
                  </button>
                </section>
              </aside>
            </div>
          </main>
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
