import React from 'react';

export default function SitePreview({ resultado }) {
  return (
    <div className="h-full w-full">
      {resultado ? (
        <iframe 
          src={resultado.url}
          title={`Prévia de ${resultado.titulo}`}
          className="w-full h-full border-0"
          style={{ backgroundColor: 'var(--white)' }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        />
      ) : (
        <div className="h-full flex items-center justify-center bg-surface-secondary">
          <div className="text-center animate-fade-in max-w-md mx-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 font-heading">Visualização do Site</h3>
            <p className="text-gray-600 font-body leading-relaxed">
              Após analisar um site, você poderá visualizá-lo aqui para identificar os problemas de acessibilidade em tempo real.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
