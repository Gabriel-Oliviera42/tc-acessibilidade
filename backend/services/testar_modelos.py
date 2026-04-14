import os
import google.generativeai as genai

def testar_modelos():
    print("Modelos Disponiveis - Google Gemini")

    # Pega a chave no .env
    api_key = os.getenv("GEMINI_API_KEY")
    
    try:
        genai.configure(api_key=api_key)
        print("Conectando aos servidores do Google...\n")
        
        modelos_suportados = []
        
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                nome_limpo = m.name.replace('models/', '')
                modelos_suportados.append(nome_limpo)
        

        print("Flash (Rapidos e mais economicos):")
        for m in modelos_suportados:
            if "flash" in m.lower():
                print(f" {m}")
                
        print("\nPro (Raciocinio mas Lento e Complexo):")
        for m in modelos_suportados:
            if "pro" in m.lower() and "flash" not in m.lower():
                print(f" {m}")
                
        print("\nOutros (Gemma, Vision, etc):")
        for m in modelos_suportados:
            if "flash" not in m.lower() and "pro" not in m.lower():
                print(f" {m}")

   
        print(f"\nConsulta finalizada! Total de modelos: {len(modelos_suportados)}")

    except Exception as e:
        print(f"\nErro de Comunicação: {e}")
        print("Verifique se sua chave da API e valida e se voce tem internet.")

if __name__ == "__main__":
    testar_modelos()