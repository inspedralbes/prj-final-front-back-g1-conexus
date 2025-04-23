FROM node:18-alpine3.20

WORKDIR /app

# Copiar solo los archivos necesarios para la instalación de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Exponer el puerto que usa tu aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]