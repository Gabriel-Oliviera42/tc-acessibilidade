import React from 'react';

export default function Sidebar({ resultado, contagem, perguntarSobreErro }) {
  
  if (!resultado || resultado.error) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 font-heading">Nenhuma análise realizada</h3>
          <p className="text-gray-600 font-body leading-relaxed">
            Digite uma URL no campo acima para iniciar uma análise profissional de acessibilidade WCAG.
          </p>
        </div>
      </div>
    );
  }

  return (
    <aside className="h-full overflow-y-auto bg-surface-secondary p-6">
      {/* Header do Relatório */}
      <div className="mb-8 animate-slide-up">
        <div className="card-elevated p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-primary font-heading mb-1">Relatório de Análise</h2>
              <p className="text-sm text-gray-600 font-body">Acessibilidade WCAG 2.1</p>
            </div>
            <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-sm"></div>
          </div>
          <a href={resultado.url} target="_blank" rel="noreferrer" 
             className="text-sm text-gray-700 hover:text-primary transition-colors truncate block font-mono bg-gray-50 px-3 py-2 rounded border border-gray-200">
            {resultado.url}
          </a>
        </div>
      </div>

      {/* Métricas de Impacto */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card p-5 border-l-4 border-error">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Críticos</p>
              <p className="text-3xl font-bold text-error font-heading">{contagem.critical}</p>
            </div>
            <div className="w-12 h-12 bg-error bg-opacity-10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Sérios</p>
              <p className="text-3xl font-bold text-warning font-heading">{contagem.serious}</p>
            </div>
            <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Moderados</p>
              <p className="text-3xl font-bold text-success font-heading">{contagem.moderate}</p>
            </div>
            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="card p-5 border-l-4 border-gray-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Menores</p>
              <p className="text-3xl font-bold text-gray-600 font-heading">{contagem.minor}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Problemas */}
      <div className="animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 font-heading">Problemas Identificados</h3>
          <span className="bg-primary text-white text-sm px-3 py-1 rounded-full font-medium">
            {resultado.total_erros} totais
          </span>
        </div>

        <div className="space-y-4">
          {resultado.erros.map((erro, index) => (
            <div key={index} className="card hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    erro.impacto === 'critical' ? 'bg-error text-white' :
                    erro.impacto === 'serious' ? 'bg-warning text-white' :
                    erro.impacto === 'moderate' ? 'bg-success text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {erro.impacto === 'critical' && 'Crítico'}
                    {erro.impacto === 'serious' && 'Sério'}
                    {erro.impacto === 'moderate' && 'Moderado'}
                    {erro.impacto === 'minor' && 'Menor'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 font-mono">#{index + 1}</span>
                    <span className="text-xs text-gray-400 font-mono uppercase tracking-wide">{erro.tipo || 'Acessibilidade'}</span>
                  </div>
                </div>
                
                <h4 className="font-semibold text-gray-800 mb-3 font-heading leading-tight">{erro.descricao}</h4>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                  <p className="text-xs text-gray-600 font-mono break-all mb-2">{erro.elemento_html}</p>
                  {erro.seletor && (
                    <p className="text-xs text-gray-500 font-mono">Seletor: {erro.seletor}</p>
                  )}
                </div>

                {erro.recomendacao && (
                  <div className="bg-primary-50 rounded-lg p-3 mb-4 border border-primary-200">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1">Recomendação:</p>
                        <p className="text-xs text-gray-700">{erro.recomendacao}</p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => perguntarSobreErro(erro)}
                  className="w-full bg-primary text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-primary-light flex items-center justify-center space-x-2 font-body"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Consultar IA sobre este problema</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}