# Etapa 1: Construcción del frontend
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copiar solo los archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Ejecutar el build
RUN npm run build

# Etapa 2: Imagen de producción con Nginx
FROM nginx:stable-alpine AS production-stage

# Copiar el build generado a la carpeta de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Exponer puertos
EXPOSE 80 443

ENV NODE_ENV=production

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
