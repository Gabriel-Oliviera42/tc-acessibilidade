FROM node:24-slim

WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as bibliotecas dentro do container
RUN npm install

# Copia o resto dos arquivos
COPY . .

# Expõe a porta que o Vite usa
EXPOSE 5173

# Comando para rodar o modo de desenvolvimento com acesso externo
CMD ["npm", "run", "dev", "--", "--host"]