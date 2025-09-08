# Usando Node para dev
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copia package.json para instalar dependências
COPY package*.json ./

# Instala Quasar CLI globalmente
RUN npm install -g @quasar/cli

# Instala dependências do projeto
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta padrão do Quasar Dev Server
EXPOSE 9000

# Comando para rodar em modo dev
CMD ["quasar", "build",  "-p", "pwa", "-H", "0.0.0.0"]

