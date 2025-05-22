# Guia de Desenvolupament amb Docker - Conexus Hub

## Contingut
- [Prerequisits](#prerequisits)
- [Instal·lació](#instal·lació)
- [Iniciar l'entorn de desenvolupament](#iniciar-lentorn-de-desenvolupament)
- [Visió general dels serveis](#visió-general-dels-serveis)
- [Configuració dels contenidors i volums](#configuració-dels-contenidors-i-volums)
- [Explicació detallada del Docker Compose](#explicació-detallada-del-docker-compose)

## Prerequisits

Per a poder treballar amb aquest projecte, necessitaràs tenir instal·lat:

- **Git**: Per a clonar el repositori.
- **Docker**: Versió 20.10 o superior.
- **Docker Compose**: Versió 2.0 o superior (integrat amb Docker Desktop en Windows i Mac).
- **Node.js**: Recomanable tenir-lo instal·lat localment per executar comandes npm fora dels contenidors.
- **Espai en disc**: Mínim 2GB lliures per als contenidors i volums.

## Instal·lació

Segueix aquests passos per a configurar l'entorn de desenvolupament:

1. **Clona el repositori** del projecte:

```bash
git clone https://github.com/inspedralbes/prj-final-front-back-g1-conexus.git
```

2. **Accedeix a la carpeta** del projecte:

```bash
cd prj-final-front-back-g1-conexus
```

3. **Crea l'arxiu d'entorn** `.env` a l'arrel del projecte. Pots fer-ho copiant i ajustant l'arxiu `.env.example` si existeix:

```bash
cp .env.example .env
```

4. **Ajusta les variables d'entorn** segons sigui necessari per al teu entorn local.

## Iniciar l'entorn de desenvolupament

Per iniciar tots els serveis i construir els contenidors:

```bash
docker-compose up --build
```

L'opció `--build` assegura que les imatges es construeixin amb els canvis més recents. Si ja has construït les imatges i no hi ha canvis als Dockerfiles, pots ometre-la:

```bash
docker-compose up
```

Per iniciar els contenidors en segon pla (mode "detached"):

```bash
docker-compose up -d
```

Per aturar tots els serveis:

```bash
docker-compose down
```

## Visió general dels serveis

El projecte Conexus Hub està compost pels següents serveis Docker:

1. **conexus-hub-front**: Servidor frontend basat en Vue.js.
2. **conexus-hub-back**: Servidor backend basat en Node.js.
3. **conexus-hub-mysql**: Servei de base de dades MySQL.
4. **conexus-hub-adminer**: Eina d'administració web per a MySQL.
5. **conexus-hub-mongodb**: Servei de base de dades MongoDB per a dades no relacionals.
6. **conexus-hub-mongo-express**: Eina d'administració web per a MongoDB.

## Configuració dels contenidors i volums

### Contenidors

Tots els contenidors es connecten a la mateixa xarxa Docker anomenada `conexus-hub-network`, el que permet la comunicació entre ells utilitzant els noms dels serveis com a noms de host.

### Volums

El projecte utilitza els següents volums:

- **conexus-hub-mysql-data**: Emmagatzema les dades de MySQL, garantint la persistència entre reinicis.
- **mongo-db**: Emmagatzema les dades de MongoDB.
- **Volums de codi font**: Els directoris `./front-vue` i `./back-node/node` es munten als contenidors corresponents, permetent el desenvolupament en temps real.

## Explicació detallada del Docker Compose

### Servei Frontend (conexus-hub-front)

```yaml
conexus-hub-front:
  build:
    context: ./front-vue
    dockerfile: Dockerfile
  ports:
    - "5173:5173"
  volumes:
    - ./front-vue:/app
    - /app/node_modules
  working_dir: /app
  environment:
    - NODE_ENV=development
  env_file:
    - .env
  restart: unless-stopped
  networks:
    - conexus-hub-network
```

- **build**: Especifica la ubicació del context de construcció (`./front-vue`) i el Dockerfile a utilitzar.
- **ports**: Mapeja el port 5173 del contenidor al port 5173 de la màquina host, permetent accedir al frontend a través de http://localhost:5173.
- **volumes**: 
  - `./front-vue:/app`: Munta el codi font del frontend al contenidor, permetent canvis en temps real.
  - `/app/node_modules`: Volum anònim per evitar que els node_modules locals sobreescriguin els del contenidor.
- **working_dir**: Estableix el directori de treball dins del contenidor.
- **environment**: Variables d'entorn específiques per al frontend.
  - `NODE_ENV=development`: Indica que estem en entorn de desenvolupament.
  - `HOST=0.0.0.0`: Permet accessos des de qualsevol IP.
- **env_file**: Carrega variables d'entorn addicionals des de l'arxiu `.env`.
- **restart**: Política de reinici, `unless-stopped` reinicia el contenidor si s'atura, excepte si és manualment.
- **networks**: Connecta el contenidor a la xarxa `conexus-hub-network`.

### Servei Backend (conexus-hub-back)

```yaml
conexus-hub-back:
  build:
    context: ./back-node/node
    dockerfile: Dockerfile
  ports:
    - "3000:3000"
    - "3001:3001"
    - "3002:3002"
    - "3003:3003"
    - "3004:3004"
    - "3005:3005"
    - "3006:3006"
    - "3007:3007"
  volumes:
    - ./back-node/node:/app
    - /app/node_modules
  working_dir: /app
  environment:
    - NODE_ENV=development
  env_file:
    - .env
  depends_on:
    conexus-hub-mysql:
      condition: service_healthy
  command: >
    sh -c "
      echo 'Esperando a que MySQL esté disponible...'
      while ! nc -z conexus-hub-mysql 3306; do
        sleep 1
      done
      echo 'MySQL está disponible, iniciando la aplicación...'
      npm run dev 
    "
  restart: unless-stopped
  networks:
    - conexus-hub-network
  healthcheck:
    test: [ "CMD", "mysqladmin", "ping", "-h", "conexus-hub-mysql" ]
    interval: 30s
    timeout: 10s
    retries: 5
```

- **ports**: Mapeja múltiples ports per a diferents serveis o API's del backend.
- **depends_on**: Indica que aquest servei depèn de `conexus-hub-mysql` i esperarà fins que estigui en estat `healthy`.
- **command**: Script personalitzat que:
  1. Espera que MySQL estigui disponible comprovant la connexió al port 3306.
  2. Inicia l'aplicació amb `npm run dev` quan MySQL està disponible.
- **healthcheck**: Configura comprovacions periòdiques de salut utilitzant `mysqladmin ping`.
  - **test**: Comanda per verificar la salut del servei.
  - **interval**: Freqüència amb què s'executa la comprovació.
  - **timeout**: Temps màxim per a cada comprovació.
  - **retries**: Nombre d'intents fallits abans de marcar el servei com a no saludable.

### Servei MySQL (conexus-hub-mysql)

```yaml
conexus-hub-mysql:
  image: mysql:8.0
  ports:
    - "3306:3306"
  environment:
    - MYSQL_ROOT_PASSWORD=root
    - MYSQL_DATABASE=conexushub
    - MYSQL_USER=user
    - MYSQL_PASSWORD=password
  command: --default-authentication-plugin=mysql_native_password --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
  volumes:
    - conexus-hub-mysql-data:/var/lib/mysql
    - ./back-node/data/00-charset.sql:/docker-entrypoint-initdb.d/00-charset.sql
    - ./back-node/data/create_db.sql:/docker-entrypoint-initdb.d/01-create.sql
    - ./back-node/data/insert_db.sql:/docker-entrypoint-initdb.d/02-inserts.sql
  restart: unless-stopped
  networks:
    - conexus-hub-network
  healthcheck:
    test: [ "CMD", "mysqladmin", "ping", "-h", "localhost" ]
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 30s
```

- **image**: Utilitza la imatge oficial de MySQL 8.0.
- **environment**: Configura les variables d'entorn necessàries per inicialitzar MySQL:
  - `MYSQL_ROOT_PASSWORD`: Contrasenya per a l'usuari root.
  - `MYSQL_DATABASE`: Nom de la base de dades a crear.
  - `MYSQL_USER` i `MYSQL_PASSWORD`: Credencials addicionals per a l'usuari no root.
- **command**: Configuracions addicionals per a MySQL:
  - `--default-authentication-plugin=mysql_native_password`: Utilitza l'autenticació nativa per compatibilitat.
  - `--character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci`: Configura el joc de caràcters i la col·lació.
- **volumes**:
  - `conexus-hub-mysql-data:/var/lib/mysql`: Volum per a la persistència de dades.
  - Els altres muntatges són scripts SQL que s'executaran en ordre durant la inicialització.
- **healthcheck**: Similar al backend, però amb un `start_period` per donar temps a MySQL per inicialitzar-se.

### Servei Adminer (conexus-hub-adminer)

```yaml
conexus-hub-adminer:
  image: adminer
  ports:
    - "8080:8080"
  restart: unless-stopped
  networks:
    - conexus-hub-network
```

- **image**: Utilitza la imatge oficial d'Adminer, una interfície web lleugera per gestionar bases de dades.
- **ports**: Mapeja el port 8080, accessible via http://localhost:8080.

### Serveis MongoDB (conexus-hub-mongodb i conexus-hub-mongo-express)

```yaml
conexus-hub-mongodb:
  image: mongo
  restart: always
  container_name: conexus-hub-mongodb
  ports:
    - 27017:27017
  environment:
    MONGO_INITDB_ROOT_USERNAME: root
    MONGO_INITDB_ROOT_PASSWORD: password
  volumes:
    - mongo-db:/data/db
  networks:
    - conexus-hub-network

conexus-hub-mongo-express:
  image: mongo-express
  restart: always
  ports:
    - 8081:8081
  environment:
    ME_CONFIG_MONGODB_ADMINUSERNAME: root
    ME_CONFIG_MONGODB_ADMINPASSWORD: password
    ME_CONFIG_MONGODB_URL: mongodb://root:password@conexus-hub-mongodb:27017/
    ME_CONFIG_BASICAUTH: false
  depends_on:
    - conexus-hub-mongodb
  networks:
    - conexus-hub-network
```

- **conexus-hub-mongodb**:
  - **container_name**: Nom explícit del contenidor, útil per a referències directes.
  - **environment**: Configura les credencials d'accés a MongoDB.
  - **volumes**: `mongo-db:/data/db` emmagatzema les dades de MongoDB per a persistència.

- **conexus-hub-mongo-express**:
  - Interfície web per a administració de MongoDB, accessible via http://localhost:8081.
  - **environment**:
    - Configuracions per a connectar-se a MongoDB amb les credencials apropiades.
    - `ME_CONFIG_BASICAUTH: false`: Desactiva l'autenticació bàsica HTTP.

### Configuració de Xarxes i Volums

```yaml
volumes:
  conexus-hub-mysql-data:
  mongo-db:

networks:
  conexus-hub-network:
    driver: bridge
```

- **volumes**: Defineix els volums que Docker crearà per emmagatzemar dades persistents.
- **networks**: Defineix la xarxa `conexus-hub-network` utilitzant el driver `bridge`, que és el tipus de xarxa estàndard que permet la comunicació entre contenidors en un sol host.
