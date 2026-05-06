import React from 'react';

export default function Header({ url, setUrl, analisarSite, carregando }) {
  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4 animate-fade-in">
      <div className="max-w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm font-heading">TC</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary font-heading">Acessibilidade Web</h1>
              <p className="text-sm text-gray-600 font-body">Análise Profissional de WCAG</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 flex-1 max-w-2xl mx-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Digite a URL do site para análise..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface font-body text-gray-900 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && analisarSite()}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={analisarSite}
            disabled={carregando}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium transition-colors flex items-center space-x-2 hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed font-body shadow-sm"
          >
            {carregando ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analisando</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Analisar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}