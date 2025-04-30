# Etapa 1: Construcción del frontend
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copia solo los archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar la aplicación
RUN npm run build

# Etapa 2: Imagen de producción con Nginx
FROM nginx:stable-alpine AS production-stage

# Copiar el build generado a la carpeta de Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Exponer puertos
EXPOSE 80 443

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
