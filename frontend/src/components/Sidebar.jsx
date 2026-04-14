// Importamos o React
import React from 'react';

// A Sidebar (Barra Lateral) recebe 3 ferramentas (props) do chefe (App.jsx):
// - resultado: a lista completa com os dados que o Python devolveu.
// - contagem: os números calculados (quantos erros críticos, sérios, etc).
// - perguntarSobreErro: a função que pega o texto do erro e envia para a IA.
export default function Sidebar({ resultado, contagem, perguntarSobreErro }) {
  
  // 1. TELA VAZIA (ESTADO INICIAL)
  // Se ainda não temos um 'resultado' (o usuário ainda não clicou em analisar),
  // mostramos apenas um aviso e paramos a leitura do componente por aqui mesmo (return).
  if (!resultado || resultado.error) {
    return (
      <div className="p-4 text-gray-500">
        Digite uma URL no topo para começar a análise.
      </div>
    );
  }

  // 2. TELA COM DADOS
  // Se o código chegou até essa linha, significa que temos resultados válidos!
  // Vamos desenhar a tela:
  return (
    // 'h-full' (altura total) e 'overflow-y-auto' criam uma barra de rolagem 
    // caso a lista de erros seja tão grande que passe do tamanho da tela.
    <aside className="h-full overflow-y-auto p-4 bg-white">
      
      {/* Qual site estamos analisando? */}
      <div className="mb-4">
        <h2 className="font-bold">Relatório:</h2>
        <a href={resultado.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
          {resultado.url}
        </a>
      </div>

      {/* Resumo simples dos erros que vieram na 'contagem' */}
      <div className="mb-4 p-3 bg-gray-100 border border-gray-300">
         <p><strong>Críticos:</strong> {contagem.critical}</p>
         <p><strong>Sérios:</strong> {contagem.serious}</p>
         <p><strong>Moderados:</strong> {contagem.moderate}</p>
         <p><strong>Menores:</strong> {contagem.minor}</p>
      </div>

      <h3 className="font-bold mb-2">Lista de Problemas ({resultado.total_erros})</h3>

      {/* LISTAGEM DE ERROS (O LAÇO DE REPETIÇÃO) */}
      <div>
        {/* O '.map()' percorre toda a lista de erros. Para cada erro que ele acha,
            ele cria um 'div' novo na tela com os dados daquele erro específico. */}
        {resultado.erros.map((erro, index) => (
          
          // 'key' é uma regra do React. Toda lista precisa de uma chave única (como o index)
          // para o React não se perder na hora de atualizar a tela.
          <div key={index} className="mb-4 p-3 border border-gray-400">
            
            <p className="font-bold">
              {/* Mostra o título da ajuda e a gravidade entre parênteses */}
              {erro.ajuda} ({erro.impacto})
            </p>
            
            {/* Mostra a descrição técnica do problema */}
            <p className="text-sm my-2 text-gray-700">{erro.descricao}</p>
            
            {/* O BOTÃO MÁGICO */}
            <button 
              // Quando o usuário clica, nós ativamos a função 'perguntarSobreErro' e
              // passamos os dados EXATOS deste 'erro' específico em que ele clicou.
              onClick={() => perguntarSobreErro(erro)}
              className="bg-blue-600 text-white px-3 py-1 mt-2"
            >
              Perguntar à IA
            </button>
            
          </div>

        ))}
      </div>

    </aside>
  );
}