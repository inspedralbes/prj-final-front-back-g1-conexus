# Guía para Ejecutar el Proyecto con Docker Compose

## 1. Asegúrate de tener Docker y Docker Compose instalados:
Puedes verificar si Docker está instalado ejecutando docker --version y docker-compose --version en tu terminal.

## 2. Navega al directorio donde se encuentra tu archivo docker-compose.dev.yml:
```bash
    cd path/to/your/project
```

## 3. Inicia los servicios con Docker Compose:
```bash
    docker-compose -f docker-compose.dev.yml up --build
```
El flag --build asegura que las imágenes se construyan nuevamente si hay cambios en los Dockerfiles.

## 4. Verifica que los servicios estén corriendo:
- Abre tu navegador y navega a http://localhost:5173 para verificar el frontend.
- Navega a http://localhost:3000 para verificar el backend.
- Navega a http://localhost:8080 para acceder a Adminer y verificar la base de datos MySQL.
- Navega a http://localhost:8081 para acceder a Mongo Express y verificar la base de datos MongoDB.

## 5. Verifica los logs:
- Puedes ver los logs de los servicios en la terminal donde ejecutaste docker-compose up.
- Para ver los logs de un servicio específico, puedes abrir otra terminal y ejecutar:
```bash	
        docker-compose -f docker-compose.dev.yml logs <service_name>
```
Reemplaza <service_name> con el nombre del servicio, por ejemplo, tr2g2-back.

## 6. Detén los servicios:
- Para detener los servicios, presiona Ctrl + C en la terminal donde ejecutaste docker-compose up.
- Para eliminar los contenedores, redes y volúmenes creados por Docker Compose, ejecuta:
```bash
    docker-compose -f docker-compose.dev.yml down
```
Siguiendo estos pasos, deberías poder probar y verificar que la configuración de Docker Compose funciona correctamente con el proyecto.

## 7. Eliminar los volúmenes (Si es necesario):
- Si deseas eliminar los volúmenes de Docker, puedes agregar el flag -v al comando docker-compose down:
```bash
    docker-compose -f docker-compose.dev.yml down -v
```
Esto eliminará los volúmenes de Docker y asegurará que no quede ningún rastro de los contenedores en tu sistema.