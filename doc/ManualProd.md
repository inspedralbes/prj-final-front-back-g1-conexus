
# Guía para Ejecutar el Proyecto en PROD

## 1. Asegúrate de tener Docker y Docker Compose instalados:

Puedes verificar si Docker está instalado ejecutando `docker --version` y `docker compose --version` en tu terminal.

:information_source: Si no tienes Docker ni Docker Compose instalado, puedes hacerlo con:
```bash
wget https://gist.githubusercontent.com/welel/f80c96482e3b539487b9fa08bfcab86d/raw/90bc2330924d225aef7dc3178f5926bda7daff04/install_docker.sh
sudo chmod +x install_docker.sh
sudo ./install_docker.sh
```

## 2. Asegúrate de tener los puertos abiertos: 80, 81, 443, y el rango del 3000-3015

## 3. Navega al directorio `Scripts` dentro de tu proyecto

```bash
cd path/to/your/{{projectName}}/Scripts
```

## 4. Ejecuta los dos scripts de la carpeta:

```bash
chmod 777 RunDockerDev.sh 
chmod 777 buildApp.sh 
./RunDockerDev.sh 
./buildApp.sh
```

## 5. Accede desde el navegador al panel de administrador de nginx:

```bash
http://URLSERVER:81/
```

## 6. En la configuración de tu dominio para la web, necesitas colocar en el apartado "Custom Nginx Configuration":

```bash
location / {
  root /data/web/;
  index index.html;
  try_files $uri /index.html;
}
```

:information_source: Si el dominio no está creado, haz que el DNS apunte a tu servidor, crea el servicio apuntando al puerto predeterminado (80) o al que necesites e inserta la configuración predeterminada.

## 7. Enciende y verifica los microservicios:
- Para encender los microservicios, ejecuta (desde Thunder Client o terminal):
```bash
    curl -X GET http://localhost:4000/startAllServices/dev
```
- Para obtener los microservicios, ejecuta (desde Thunder Client o terminal):
```bash
    curl -X GET http://localhost:4000/startAllServices/dev
```