import React from 'react';
import { MagnifyingGlass, CircleNotch, CheckCircle } from "@phosphor-icons/react";

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
              <MagnifyingGlass size={20} weight="regular" className="text-gray-400" />
            </div>
          </div>
          
          <button
            onClick={analisarSite}
            disabled={carregando}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium transition-colors flex items-center space-x-2 hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed font-body shadow-sm"
          >
            {carregando ? (
              <>
                <CircleNotch size={16} weight="regular" className="animate-spin" />
                <span>Analisando</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} weight="regular" className="text-white" />
                <span>Analisar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}