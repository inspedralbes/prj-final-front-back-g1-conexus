#!/bin/bash

# Configuraciones
DOMAIN="conexushub.cat"
EMAIL="admin@conexushub.cat"
WEBROOT_PATH="/opt/conexus/webroot"

# Asegurar que el directorio webroot existe
mkdir -p $WEBROOT_PATH

# Instalar certbot si no está instalado
if ! command -v certbot &> /dev/null; then
    echo "Certbot no está instalado. Instalando..."
    apt-get update
    apt-get install -y certbot
fi

# Generar certificado usando webroot
echo "Generando certificado SSL para $DOMAIN..."
certbot certonly \
    --webroot \
    --webroot-path=$WEBROOT_PATH \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --domain $DOMAIN \
    --domain www.$DOMAIN

# Verificar si la generación fue exitosa
if [ $? -eq 0 ]; then
    echo "Certificado generado exitosamente en /etc/letsencrypt/live/$DOMAIN/"
    # Configurar permisos para que Docker pueda acceder
    chmod -R 755 /etc/letsencrypt
    
    # Copiar los certificados al directorio que será montado en el contenedor
    mkdir -p /opt/conexus/letsencrypt/live/$DOMAIN/
    cp -L /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/conexus/letsencrypt/live/$DOMAIN/
    cp -L /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/conexus/letsencrypt/live/$DOMAIN/
    chmod -R 755 /opt/conexus/letsencrypt
else
    echo "Error al generar el certificado"
    exit 1
fi

echo "Proceso completado" 