# Documentació bàsica del projecte Conexus Hub

## Continguts
- [Objectius](#objectius)
- [Arquitectura bàsica](#arquitectura-bàsica)
  - [Tecnologies utilitzades](#tecnologies-utilitzades)
  - [Interrelació entre els diversos components](#interrelació-entre-els-diversos-components)
- ![Com crear l'entorn de desenvolupament]()
- ![Com desplegar l'aplicació a producció](https://github.com/inspedralbes/prj-final-front-back-g1-conexus/blob/develop/doc/producci%C3%B3/README.md)
- [Llistat d'endpoints de l'API de backend](https://github.com/inspedralbes/prj-final-front-back-g1-conexus/tree/develop/doc/endpoints)
- [Altres elements importants](#consideracions-de-seguretat)

## Objectius
Conexus Hub és una plataforma educativa integral dissenyada per a facilitar la comunicació i la gestió en centres educatius. Els principals objectius són:

- Centralitzar totes les gestions acadèmiques en una única plataforma.
- Millorar la comunicació entre els diferents membres de la comunitat educativa (profesorat).
- Automatitzar processos administratius per optimitzar recursos.
- Oferir una experiència d'usuari intuïtiva i accessible.
- Facilitar el seguiment acadèmic d'estudiants per part de professors.
- Proporcionar eines de gestió eficients per a l'administració del centre.

## Arquitectura bàsica

### Tecnologies utilitzades
- **Frontend**: 
  - Vue.js: Framework progressiu per a la construcció d'interfícies d'usuari.
  - Tailwind CSS: Framework CSS d'utilitats per a estilització ràpida.
  - Socket.IO Client: Per a comunicació en temps real.

- **Backend**: 
  - Node.js: Entorn d'execució per JavaScript del costat del servidor.
  - Express: Framework web per a Node.js.
  - Socket.IO: Biblioteca per a comunicació en temps real.
  - Sequelize: ORM per a la base de dades MySQL.
  - Mongoose: ODM per a la base de dades MongoDB.

- **Bases de Dades**:
  - MySQL: Emmagatzematge principal de dades relacionals.
  - MongoDB: Emmagatzematge de xats i missatges.

- **Infraestructura**:
  - Docker: Contenidors per a desenvolupament i producció.
  - Docker Compose: Orquestració de contenidors.
  - Nginx: Servidor web i proxy invers.
  - GitHub Actions: CI/CD per a desplegament automàtic.

### Interrelació entre els diversos components
1. **Flux de dades**:
   - El frontend es comunica amb el backend mitjançant crides API RESTful.
   - La comunicació en temps real es realitza a través de WebSockets (Socket.IO).
   - El backend interactua amb les bases de dades segons el tipus de dades:
     - MySQL per a dades estructurades (usuaris, cursos, assistències, etc.)
     - MongoDB per a xats i missatges.

2. **Estructura de microserveis**:
   - Cada funcionalitat important està separada en el seu propi servei.
   - Els serveis es comuniquen entre si a través d'una xarxa Docker interna.
   - Nginx actua com a punt d'entrada, redirigint les peticions als serveis corresponents.

3. **Autorització i autenticació**:
   - Sistema de tokens JWT per a l'autenticació d'usuaris.
   - Middleware de verificació de tokens per a protegir les rutes.
   - Control d'accés basat en rols per a diferents tipus d'usuaris.

## Llistat d'endpoints de l'API de backend
L'API de backend disposa de diversos endpoints organitzats per àrees funcionals. Cada endpoint té la seva documentació detallada disponible a la carpeta `doc/endpoints/`.

Alguns dels principals grups d'endpoints són:

- **Usuaris**: `/api/users` - Gestió d'usuaris, autenticació i perfils.
- **Cursos**: `/api/courses` - Gestió de cursos i assignatures.
- **Assistències**: `/api/assistences` - Control d'assistència a classes.
- **Notes**: `/api/grades` - Gestió de qualificacions.
- **Reserves d'aules**: `/api/roomReservations` - Reserva d'espais i recursos.
- **Incidències**: `/api/reports` - Gestió d'incidències i sol·licituds.
- **Objectes perduts**: `/api/lostObjects` - Registre i reclamació d'objectes perduts.

Cada grup d'endpoints suporta operacions CRUD estàndard i algunes funcionalitats especials. Per a veure exemples de peticions, respostes i codis d'estat, consulta els arxius JSON corresponents a la carpeta `doc/endpoints/`.

### Consideracions de seguretat
- Totes les connexions s'encripten mitjançant HTTPS.
- Les contrasenyes s'emmagatzemen de forma segura utilitzant hashing amb sal.
- Els tokens d'autenticació caduquen després d'un període d'inactivitat.
- S'implementen limitacions de taxa per prevenir atacs de força bruta.

### Escalabilitat
El sistema ha estat dissenyat pensant en l'escalabilitat:
- L'arquitectura basada en contenidors permet escalar horitzontalment.
- Els serveis es poden escalar independentment segons les necessitats.

