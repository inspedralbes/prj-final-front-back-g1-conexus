# Desplegament a Producció - Conexus Hub

Aquest document descriu l'arquitectura de producció del projecte Conexus Hub i el procés per realitzar desplegaments.

## Arquitectura de Producció

El sistema en producció està compost per:

- **Frontend (Vue.js)**: Servit a través de Nginx
- **Backend (Node.js)**: Múltiples serveis API independents entre ells
- **Base de dades MYSQL**: Gestió de dades de l'aplicació
- **Base de dades MongoDB**: Per a emmagatzematge de xats i missatges
- **Portainer**: Per a gestió i monitorització de contenidors a producció
- **Certificats SSL**: Per a connexions segures via HTTPS

La infraestructura està completament dockeritzada i automatitzada mitjançant GitHub Actions.

## Procés de Construcció

El sistema de desplegament es va construir seguint aquests passos:

1. **Configuració del servidor**:
   - Instal·lació de dependències (Node.js, Docker, Certbot)
   - Creació de directoris necessaris a `/opt/conexus/`

2. **Configuració de CI/CD**:
   - Creació de workflow de GitHub Actions (`.github/workflows/deploy-production.yml`)
   - Configuració de secrets per a accés SSH i variables d'entorn

3. **Creació de Dockerfiles**:
   - Frontend: `front-vue/prod.Dockerfile` (build amb Node.js i desplegament amb Nginx)
   - Backend: `back-node/node/prod.Dockerfile` (imatge Node.js per a producció)

4. **Docker Compose**:
   - Configuració de serveis a `docker-compose.prod.yml`
   - Configuració de xarxa interna i volums persistents

5. **Configuració SSL**:
   - Script automatitzat per a generació de certificats Let's Encrypt
   - Configuració de renovació automàtica

6. **WebSockets per a xat en temps real**:
   - Configuració especial a Nginx per a suportar connexions WebSocket
   - Variables d'entorn separades per a API i Socket.IO

## Com Desplegar a Producció

El desplegament a producció està completament automatitzat. Per desplegar una nova versió:

1. **Assegura't que els teus canvis funcionen correctament en desenvolupament**
   ```bash
   npm run dev       # Per provar el frontend localment
   npm run start     # Per provar el backend localment
   ```

2. **Fes commit dels teus canvis a la branca principal**
   ```bash
   git add .
   git commit -m "Descripció dels canvis"
   git push origin main
   ```

3. **Desplega a producció**
   ```bash
   git checkout deploy      # Canviar a la branca de desplegament
   git merge main           # Fusionar canvis de la branca principal
   git push origin deploy   # Empènyer canvis a la branca de desplegament
   ```

4. **El workflow de GitHub Actions s'encarregarà automàticament de:**
   - Connectar-se al servidor de producció
   - Transferir els arxius necessaris
   - Construir i desplegar les imatges Docker
   - Aixecar els contenidors amb la nova versió

5. **Verificar el desplegament**:
   - Accedeix a Portainer a `https://[ip-del-servidor]:9000` per verificar l'estat dels contenidors
   - Comprova que tots els contenidors estan en estat "running" i verificar els logs que no hi hagin errors
   - Verifica que l'aplicació funciona correctament a `https://www.conexushub.cat`

## Solució de Problemes

### Verificació de Logs

Per verificar els logs dels contenidors:

```bash
# Connectar-se al servidor
ssh usuari@servidor

# Veure logs de tots els contenidors
cd /opt/conexus
docker-compose -f docker-compose.prod.yml logs

# Veure logs d'un contenidor específic
docker-compose -f docker-compose.prod.yml logs conexus-hub-front
docker-compose -f docker-compose.prod.yml logs conexus-hub-back
```

### Reinici Manual de Contenidors

Si necessites reiniciar manualment els contenidors:

```bash
ssh usuari@servidor
cd /opt/conexus
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

Pots reiniciar els contenidors desde el portainer a `https://[ip-del-servidor]:9000`

## Variables d'Entorn

Les variables d'entorn es configuren automàticament durant el desplegament, però si necessites modificar-les:

1. Actualitza els secrets a GitHub Actions
2. O modifica manualment l'arxiu `/opt/conexus/.env` al servidor

## Manteniment de Certificats SSL

Els certificats SSL es renoven automàticament. El període de validesa és de 90 dies, però la renovació automàtica s'executa cada 60 dies aproximadament.

Si necessites forçar la renovació manualment:

```bash
ssh usuari@servidor
sudo certbot renew --force-renewal
```

## Còpia de Seguretat de Dades

Es recomana realitzar còpies de seguretat periòdiques de:

1. Els volums de Docker que contenen dades de la base de dades
2. L'arxiu `.env` amb les variables d'entorn
3. Els certificats SSL

## Estructura de Directoris en Producció

```
/opt/conexus/
├── .env                      # Variables d'entorn
├── front-vue/                # Codi font del frontend
├── back-node/                # Codi font del backend
├── webroot/                  # Directori per a validació SSL
├── letsencrypt/              # Certificats SSL
├── scripts/                  # Scripts d'utilitat
└── docker-compose.prod.yml   # Configuració de serveis
```
