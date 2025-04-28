FROM node:18-alpine3.20

ENV NODE_ENV=production

WORKDIR /app

# Copiar solo los archivos necesarios para la instalación de dependencias
COPY package*.json package-lock.json ./

# Instalar dependencias de producción
RUN npm ci --omit=dev

# Copiar el resto del código
COPY . .

# Exponer el puerto que usa tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]