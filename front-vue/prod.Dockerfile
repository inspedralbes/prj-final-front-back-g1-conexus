# Usa una imagen oficial de Node para construir el frontend
FROM node:18-alpine AS build

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación Vue.js
RUN npm run build

# Usar una imagen de Nginx para servir la aplicación
FROM nginx:stable-alpine

# Copiar los archivos estáticos generados por Vue.js desde la etapa de build al directorio donde Nginx los servirá
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer los puertos para HTTP y HTTPS
EXPOSE 80 443

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
