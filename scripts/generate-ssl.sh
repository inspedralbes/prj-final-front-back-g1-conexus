#!/bin/bash

# Configuraciones
DOMAIN="conexushub.cat"
EMAIL="admin@conexushub.cat"
WEBROOT_PATH="/opt/conexus/webroot"

# Asegurar que el directorio webroot existe
mkdir -p $WEBROOT_PATH
chown -R www-data:www-data $WEBROOT_PATH || true
chmod -R 755 $WEBROOT_PATH

# Instalar certbot si no está instalado
if ! command -v certbot &> /dev/null; then
    echo "Certbot no está instalado. Instalando..."
    apt-get update
    apt-get install -y certbot
fi

# Función para generar certificados autofirmados
generate_self_signed_cert() {
    echo "Generando certificado autofirmado como último recurso..."
    
    # Asegurar que openssl está instalado
    if ! command -v openssl &> /dev/null; then
        apt-get update
        apt-get install -y openssl
    fi
    
    # Crear directorios necesarios
    mkdir -p /etc/letsencrypt/live/$DOMAIN
    mkdir -p /opt/conexus/letsencrypt/live/$DOMAIN
    
    # Generar certificado autofirmado
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
        -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
        -subj "/CN=$DOMAIN/O=Conexus/C=ES"
    
    # Copiar certificados al directorio que será montado en el contenedor
    cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/conexus/letsencrypt/live/$DOMAIN/
    cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/conexus/letsencrypt/live/$DOMAIN/
    
    # Configurar permisos
    chmod -R 755 /etc/letsencrypt
    chmod -R 755 /opt/conexus/letsencrypt
    
    echo "Certificado autofirmado generado exitosamente"
}

# Generar certificado usando modo standalone de manera no interactiva
echo "Generando certificado SSL para $DOMAIN..."

# Primer intento: usando modo --standalone
certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    --domain $DOMAIN \
    --domain www.$DOMAIN \
    --staging \
    --force-renewal

# Verificar si la generación fue exitosa
if [ $? -eq 0 ]; then
    # Ahora intentar con producción si el staging fue exitoso
    certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --domain $DOMAIN \
        --domain www.$DOMAIN \
        --force-renewal
        
    echo "Certificado generado exitosamente en /etc/letsencrypt/live/$DOMAIN/"
    # Configurar permisos para que Docker pueda acceder
    chmod -R 755 /etc/letsencrypt
    
    # Copiar los certificados al directorio que será montado en el contenedor
    mkdir -p /opt/conexus/letsencrypt/live/$DOMAIN/
    cp -L /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/conexus/letsencrypt/live/$DOMAIN/
    cp -L /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/conexus/letsencrypt/live/$DOMAIN/
    chmod -R 755 /opt/conexus/letsencrypt
    echo "Proceso completado exitosamente"
else
    echo "Error al generar el certificado en modo standalone. Intentando con modo webroot..."
    
    # Segundo intento: crear un servidor web temporal para el desafío de webroot
    mkdir -p $WEBROOT_PATH/.well-known/acme-challenge
    chmod -R 755 $WEBROOT_PATH
    
    # Usar Python para un servidor web simple si está disponible
    if command -v python3 &> /dev/null; then
        python3 -m http.server 80 --directory $WEBROOT_PATH &
        SERVER_PID=$!
        sleep 5
        
        # Intentar generar el certificado
        certbot certonly --webroot \
            --non-interactive \
            --agree-tos \
            --email $EMAIL \
            --webroot-path $WEBROOT_PATH \
            --domain $DOMAIN \
            --domain www.$DOMAIN \
            --force-renewal
        
        # Matar el servidor web temporal
        kill $SERVER_PID || true
        
        # Verificar si esta vez fue exitoso
        if [ $? -eq 0 ]; then
            echo "Certificado generado exitosamente en /etc/letsencrypt/live/$DOMAIN/"
            # Configurar permisos para que Docker pueda acceder
            chmod -R 755 /etc/letsencrypt
            
            # Copiar los certificados al directorio que será montado en el contenedor
            mkdir -p /opt/conexus/letsencrypt/live/$DOMAIN/
            cp -L /etc/letsencrypt/live/$DOMAIN/fullchain.pem /opt/conexus/letsencrypt/live/$DOMAIN/
            cp -L /etc/letsencrypt/live/$DOMAIN/privkey.pem /opt/conexus/letsencrypt/live/$DOMAIN/
            chmod -R 755 /opt/conexus/letsencrypt
            echo "Proceso completado exitosamente"
        else
            echo "No se pudo generar el certificado con Let's Encrypt. Generando certificado autofirmado..."
            generate_self_signed_cert
        fi
    else
        echo "Python no está disponible para crear un servidor web temporal. Generando certificado autofirmado..."
        generate_self_signed_cert
    fi
fi 