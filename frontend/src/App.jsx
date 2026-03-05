import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [resultado, setResultado] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erroBackend, setErroBackend] = useState(null) // PASSO 2: Novo estado para capturar erros de conexão/site

  // Adicionada a interrogação extra (resultado?.erros?.filter) para evitar Crash caso 'erros' não venha no JSON
  const contagem = {
    critical: resultado?.erros?.filter(e => e.impacto === 'critical').length || 0,
    serious: resultado?.erros?.filter(e => e.impacto === 'serious').length || 0,
    moderate: resultado?.erros?.filter(e => e.impacto === 'moderate').length || 0,
    minor: resultado?.erros?.filter(e => e.impacto === 'minor').length || 0, // Adicionado Minor
  }

  const analisarSite = async () => {
    if (!url) return alert("Please enter a URL first!")
    
    // PASSO 3: Tratamento Inteligente de URL (Sanitização)
    let urlTratada = url.trim()
    if (!urlTratada.startsWith('http://') && !urlTratada.startsWith('https://')) {
      urlTratada = 'https://' + urlTratada
      setUrl(urlTratada) // Atualiza o input visualmente para o usuário
    }

    setCarregando(true)
    setErroBackend(null) // Limpa erros anteriores
    setResultado(null)   // Limpa resultados anteriores

    try {
      const response = await axios.get(`http://localhost:8000/analisar?url=${urlTratada}`)
      
      // PASSO 2: Escudo Anti-Crash. Se o Python devolver {"error": "..."}
      if (response.data.error) {
        setErroBackend(response.data.error)
      } else {
        setResultado(response.data)
      }

    } catch (error) {
      console.error("Error analyzing:", error)
      setErroBackend("Error connecting to the server. Check if the Backend (Python) is running.")
    }
    setCarregando(false)
  }

  return (
    <div className="container">
      <header className="cabecalho">
        <h1>WAVE Clone</h1>
        <p>Web Accessibility Evaluator (WCAG)</p>
      </header>
      
      <div className="busca">
        <input 
          type="text" 
          placeholder="Enter URL. Ex: https://www.google.com" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={analisarSite} disabled={carregando}>
          {carregando ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {carregando && (
        <div className="alerta-carregando">
          <p>The engine is analyzing the site code. This might take a few seconds...</p>
        </div>
      )}

      {/* NOVO: Exibe o erro de forma elegante se o backend falhar */}
      {erroBackend && !carregando && (
        <div className="alerta-erro-backend">
          <h2>Analysis Failed</h2>
          <p>We couldn't analyze the requested URL. Reason:</p>
          <code>{erroBackend}</code>
        </div>
      )}

      {/* Renderiza os resultados apenas se existir 'resultado' e não houver erro */}
      {resultado && !resultado.error && !carregando && (
        <div className="resultados">
          <h2>Report for: <span className="url-destaque">{resultado.url}</span></h2>
          
          <div className="resumo-cards">
            <div className="resumo-item critico">
              <span className="numero">{contagem.critical}</span>
              <span className="rotulo">Critical</span>
            </div>
            <div className="resumo-item serio">
              <span className="numero">{contagem.serious}</span>
              <span className="rotulo">Serious</span>
            </div>
            <div className="resumo-item moderado">
              <span className="numero">{contagem.moderate}</span>
              <span className="rotulo">Moderate</span>
            </div>
            {/* NOVO: Card para os erros Minor */}
            <div className="resumo-item menor">
              <span className="numero">{contagem.minor}</span>
              <span className="rotulo">Minor</span>
            </div>
          </div>

          <h3 className="titulo-lista">Total problems found: {resultado.total_erros}</h3>

          <div className="lista-erros">
            {resultado.erros.map((erro, index) => (
              <div key={index} className={`card ${erro.impacto}`}>
                <h3>{erro.ajuda}</h3>
                
                <div className="detalhes-erro">
                  <p><strong>Impact Level:</strong> <span className={`tag-impacto ${erro.impacto}`}>{erro.impacto}</span></p>
                  <p><strong>Problem Description:</strong> {erro.descricao}</p>
                  <p><strong>How to Fix:</strong> {erro.sugestao}</p>
                </div>
                
                <div className="codigo-fonte">
                  <p><strong>Affected HTML Element:</strong></p>
                  <code>{erro.elemento_html}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App