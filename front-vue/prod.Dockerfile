# Imagen ligera de nginx para servir archivos estáticos
FROM nginx:stable-alpine

# Copiar los archivos generados por npm run build
COPY /dist/ /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80 443

# Arrancar Nginx
CMD ["nginx", "-g", "daemon off;"]
