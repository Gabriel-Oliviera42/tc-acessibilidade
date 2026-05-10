// Importamos o React
import React from 'react';

// O Header é como um "funcionário" do App.jsx. 
// Para trabalhar, ele precisa receber ferramentas do chefe. Essas ferramentas são as "props":
// - url: o texto atual que está guardado na memória.
// - setUrl: o rádio comunicador para avisar o chefe que o usuário digitou uma letra nova.
// - analisarSite: o botão de partida do motor.
// - carregando: uma luzinha que avisa se o motor já está rodando.
export default function Header({ url, setUrl, analisarSite, carregando }) {
  return (
    // 'flex' coloca os itens (input e botão) lado a lado na mesma linha.
    // 'p-4' (padding) dá um respiro de espaço dentro da caixa.
    // 'bg-gray-800' pinta o fundo de cinza escuro.
    <header className="flex p-4 bg-gray-800">
      
      {/* 1. CAMPO DE DIGITAÇÃO */}
      <input 
        type="text" 
        // O valor mostrado na tela é exatamente o que está na memória do App.jsx
        value={url} 
        
        // Toda vez que você aperta uma tecla (onChange), ele pega o valor do campo (e.target.value)
        // e usa o comunicador (setUrl) para atualizar a memória principal.
        onChange={(e) => setUrl(e.target.value)} 
        
        placeholder="Digite a URL..."
        
        // 'flex-1' manda o input crescer o máximo que puder, empurrando o botão para o canto.
        // 'text-black' garante que a letra fique preta, já que o fundo do header é escuro.
        className="flex-1 p-2 text-black"
      />

      {/* 2. BOTÃO DE AÇÃO */}
      <button 
        // Quando receber um clique, execute a função que o chefe mandou
        onClick={analisarSite} 
        
        // Se a variável 'carregando' for verdadeira, desative (disabled) o botão.
        // Isso impede que o usuário clique 10 vezes seguidas na mesma coisa.
        disabled={carregando}
        
        // 'ml-4' (margin-left) cria um espaço à esquerda para não ficar colado no input.
        className="ml-4 bg-blue-600 text-white px-4 py-2"
      >
        {/* Usamos um "if" resumido aqui: 
            Se (carregando) for true -> Mostre 'Analisando...' 
            Se não (:)             -> Mostre 'Analisar' */}
        {carregando ? 'Analisando...' : 'Analisar'}
      </button>

    </header>
  );
}