// import './assets/m</div>ain.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import "../node_modules/flag-icons/css/flag-icons.min.css";

import { createI18n } from 'vue-i18n'






const app = createApp(App)

const i18n = createI18n({
    locale: 'ja',
    messages: {
        es: {
            chatContent:{
                writeMessage:"Escribe un mensaje...",
            },
            languageSelector:{
                spanish: 'Español',
                english: 'Inglés',
                catalan: 'Catalán',
                chinese: 'Chino',
                urdu: 'Urdu',
                german: 'Alemán',
                portuguese: 'Portugués',
                japanese: 'Japonés',
                euskera: 'Euskera',
                gallego: 'Gallego',
            },
            StadisticsPage:{
                title: 'Estadísticas',
                userGraph: "Graficos de usuarios",
                commentsGraph: "Graficos de comentarios",
                postGraph: "Graficos de publicaciones"  
            },
            serviceListPage:{
                title: 'Servicios',
                noDescription: 'No hay descripción disponible'
            },
            profilePage:{
                placeWhereYouLive:"Lugar donde vives...",
                pendant:"Pendiente de asignar"
            },
            LoginRegisterPage:{
                subTitle:"Correo @inspedralbes.cat",
                accessGoogle:"Acceder con Google",
                accessGithub:"Acceder con Github",
                logIn:"O inicia sesión",
                mailPlaceholder:"Correo electrónico",
                passwordPlaceholder:"Contraseña",
                loginButton:"Inicia sesión",
                projectBy:"Proyecto realizado por el equipo de",
                withTheHelpOf:", con la ayuda de",
                error:"Ha ocurrido un error al iniciar sesión",
                errorFields:"Error al iniciar sesión, comprueba los datos introducidos",
                invalidMail:"Error al iniciar sesión, el correo no es válido"
            },
            AddComunityPost:{
                create: 'Crear una publicación',
                title: 'Título:',
                titlePlaceholder: 'Escribe el título de la publicación',
                description: 'Descripción:',
                descriptionPlaceholder: 'Escribe la descripción de la publicación',
                postImage:"Subir Imagen:",
                preview: 'Vista previa:',
                publish: 'Publicar',
                publishing: 'Publicando...',
                notAllFields:"Por favor, completa todos los campos y sube una imagen.",
                error:"Ha ocurrido un error al publicar la publicación:",
            },
            viewValidationUser:{
                title: 'Validar usuarios',
                user: 'Usuario Nº ',
                userType: 'Tipo de usuario: ',
                student: 'Estudiante',
                teacher: 'Profesor',
                admin: 'Administrador',
                class: 'Clase: ',
                user: 'Usuario: ',
                banner: 'Cabecera: ',
                profile: "Perfil: ",
                validate: 'Validar',
                delete: 'Eliminar',
                unknown: 'Desconocido',
            },
            ViewValidationUpdate:{
                title: 'Validar/Actualizar usuarios',
                user: 'Usuario Nº: ',
                userType: 'Tipo de usuario: ',
                student: 'Estudiante',
                teacher: 'Profesor',
                admin: 'Administrador',
                class: 'Clase: ',
                user: 'Usuario: ',
                banner: 'Cabecera: ',
                profile: "Perfil: ",
                validate: 'Validar',
                delete: 'Eliminar',
                unknown: 'Desconocido',
            },
            viewRequest:{
                coments: 'Comentarios',
                comentPlaceholder: 'Escribe un comentario!',
                seeMore: 'Ver más',
                seeLess: 'Ver menos',
                availability: 'Disponibilidad',
                from: 'De',
                to: 'a',
            },
            ViewReportUser:{
                title: 'Usuarios reportados',
                report: 'Informe Nº',
                status: 'Estado:',
                pending: 'Pendiente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Fecha:',
                userReporting: 'Usuario que reporta:',
                userReported: 'Usuario reportado:',
                report: 'Informe:',
                delete: 'Eliminar',
            },
            ViewReportPublicacio:{
                title: 'Publicaciones reportadas',
                report: 'Informe Nº',
                status: 'Estado:',
                pending: 'Pendiente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Fecha:',
                userReporting: 'Usuario que reporta:',
                userPost: 'Usuario de la publicación:',
                postTitle: 'Título de la publicación:',
                postDescription: 'Descripción de la publicación:',
                report:"Informe:",
                reportedImage: "Imagen reportada:",
                viewImage: "Ver imagen",
                delete: 'Eliminar',
            },
            ViewMyPublicationItem:{
                availability:"Disponibilidad:",
                reports:"Reportes: ",
                date:"Fecha: ",
                pending: "Pendiente de revisar",
                reported:"Reportado",
                published: "Publicado", 
                textNotVerified: "Texto no verificado por IA",
                textVerified: "Texto verificado por IA",
                imgNotVerified: "Imagen no verificada por IA",  
                imgVerified: "Imagen verificada por IA",
                available: "Disponible",
                notAvailable: "No disponible",	
            },
            ViewReportComments:{
                title: 'Comentarios reportados',
                report: 'Informe Nº',
                status: 'Estado:',
                pending: 'Pendiente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Fecha:',
                comment: 'Comentario:',
                reportingUser: 'Usuario que reporta:',
                commentUser: 'Usuario que escribio el comentario:',
                report:"Informe:",
                delete: 'Eliminar',
            },
            viewPost:{
                comentaris: 'Comentarios',
            },
            viewPeopleMentoria:{
                chat: 'Chat',
            },
            myRequests:{
                title: 'Mis peticiones',
                noRequests: 'No tienes peticiones',
            },
            myRequest:{
                availability:"Disponibilitat:",
                reports:"Reportes:",
                date:"Fechas:",
                processing: "Pendiente de revisar",
                reported:"Reportado",
                posted: "Publicado",
                textNotVerified: "Texto no verificado por IA",
                textVerified: "Texto verificado por IA",
                imgNotVerified: "Imagen no verificada por IA",
                imgVerified: "Imagen verificada por IA",
            },
            myPublications:{
                title: 'Mis publicaciones',
                noPublications: 'No tienes publicaciones',
            },
            subMenu:{
                hi:"Hola,",
                profile:"Perfil",
                publications:"Mis publicaciones",
                request:"Mis peticiones",
                admin:"Admin",
                statistics:"Estadísticas",
            },
            requestPost:{
                title: 'Añadir una petición:',
                uploadImage: 'Subir imagen:',
                availability: 'Disponible:',
                addAvailability: '+ Añadir disponibilidad',
                selectDay: 'Selecciona un día',
                startTime: 'Hora de inicio',
                endTime: 'Hora de fin',
                publishing: 'Publicando...',
                titlePlaceholder: 'Título',
                DescriptionPlaceholder:'En que piensas?',
            },
            norificationList:{
                title:"Notificaciones",
                all: "Todas",
                comments: "Comentarios",
                publications: "Publicaciones",
                noNotifications: "No hay notificaciones que mostrar",
            },
            navBar: {
                home: 'Inicio',
                search: 'Buscar',
                upload: 'Subir',
                chat: 'Chat',
            },
            loading:{
                title: 'Cargando...',
            },
            headerVerification:{
                title:"Pagina de reportes",
                validationUser:"Verificación de usuario",
                validationPost:"Validacion de post",
            },
            headerReport:{
                title:"Pagina de reportes",
                reportUser:"Ver reporte de usuario",
                reportPost:"Ver reporte de publicación",
                reportComment:"Ver reporte de comentario",
            },
            header:{
                report: 'Reportar',
                validation: 'Validación',
                services: 'Servicios',
                comunity: 'Comunidad',
                mentors: 'Mentores',
                request: 'Peticiones',
            },
            formNewDataUsers:{
                title: 'Formulario de usuario',
                showForm: 'Mostrar formulario',
                hideForm: 'Ocultar formulario',
                name: 'Nombre',
                profilePicture: 'Foto de perfil',
                banner: 'Cabecera',
                city: 'Ciudad',
                linkDiscord: 'Enlace a Discord',
                linkGithub: 'Enlace a Github',
                submit:'Guardar usuario',
                tags: 'Etiquetas (JSON)',
                tagsExample:'Ejemplo de formato: ["JavaScript", "Python", "React"]',
                availability: 'Disponibilidad (JSON)',
                availabilityExample: 'Ejemplo de formato: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post:{
                title: 'Añade una publicación',
                titlePlaceholder: 'Título',
                postDescriptionPlaceholder:'En que piensas?',
                maxChar:'Máximo 230 caracteres',
                publish: 'Publicar',
            },
            calendar: {
                title: 'Horario de disponibilidad',
                day: 'Día',
                availability: 'Horas disponibles',
                monday: 'Lunes',
                tuesday: 'Martes',
                wednesday: 'Miércoles',
                thursday: 'Jueves',
                friday: 'Viernes',
                saturday: 'Sábado',
                sunday: 'Domingo'
            },
            menu: {
                comunity: 'Comunidad',
                mentors: 'Mentores',
                request: 'Peticiones',
                share: 'Compartir'
            },
        },
        en: {
            chatContent:{
                writeMessage:"Write a message...",
            },
            languageSelector:{
                spanish: 'Spanish',
                english: 'English',
                catalan: 'Catalan',
                chinese: 'Chinese',
                urdu: 'Urdu',
                german: 'German',
                portuguese: 'Portuguese',
                japanese: 'Japanese',
                euskera: 'Euskera',
                gallego: 'Galician',
            },
            StadisticsPage:{
                title: 'Statistics',
                userGraph: "User graphs",
                commentsGraph: "Comments graphs",
                postGraph: "Post graphs"
            },
            serviceListPage:{
                title: 'Services',
                noDescription: 'No description available'
            },
            profilePage:{
                placeWhereYouLive:"Place where you live...",
                pendant:"Pending to assign"
            },
            LoginRegisterPage:{
                subTitle:"@inspedralbes.cat mail",
                accessGoogle:"Access with Google",
                accessGithub:"Access with Github",
                logIn:"Or log in",
                mailPlaceholder:"Email",
                passwordPlaceholder:"Password",
                loginButton:"Log in",
                projectBy:"Project made by the team of",
                withTheHelpOf:", with the help of",
                error:"An error occurred while logging in",
                errorFields:"Error logging in, check the data entered",
                invalidMail:"Error logging in, the email is not valid"
            },
            AddComunityPost:{
                create: 'Create a post',
                title: 'Title:',
                titlePlaceholder: 'Write the title of the post',
                description: 'Description:',
                descriptionPlaceholder: 'Write the description of the post',
                postImage:"Upload Image:",
                preview: 'Preview:',
                publish: 'Publish',
                publishing: 'Publishing...',
                notAllFields:"Please, complete all fields and upload an image.",
                error:"An error occurred while publishing the post:",
            },
            viewValidationUser: {
                title: 'Validate users',
                user: 'User Nº ',
                userType: 'User type: ',
                student: 'Student',
                teacher: 'Teacher',
                admin: 'Admin',
                class: 'Class: ',
                user: 'User: ',
                banner: 'Banner: ',
                profile: "Profile: ",
                validate: 'Validate',
                delete: 'Delete',
                unknown: 'Unknown',
            },
            ViewValidationUpdate:{
                title: 'Validate/Update users',
                user: 'User Nº: ',
                userType: 'User type: ',
                student: 'Student',
                teacher: 'Teacher',
                admin: 'Admin',
                class: 'Class: ',
                user: 'User: ',
                banner: 'Banner: ',
                profile: "Profile: ",
                validate: 'Validate',
                delete: 'Delete',
                unknown: 'Unknown',
            },
            viewRequest: {
                coments: 'Comments',
                comentPlaceholder: 'Write a comment!',
                seeMore: 'See more',
                seeLess: 'See less',
                availability: 'Availability',
                from: 'From',
                to: 'to',
            },
            ViewReportUser:{
                title: 'Reported users',
                report: 'Report Nº',
                status: 'Status:',
                pending: 'Pending',
                reviewing: 'Reviewing',
                reviewed: 'Reviewed',
                date: 'Date:',
                userReporting: 'User reporting:',
                userReported: 'Reported user:',
                report: 'Report:',
                delete: 'Delete',
            },
            ViewReportPublicacio:{
                title: 'Reported posts',
                report: 'Report Nº',
                status: 'Status:',
                pending: 'Pending',
                reviewing: 'Reviewing',
                reviewed: 'Reviewed',
                date: 'Date:',
                userReporting: 'User reporting:',
                userPost: 'User of the post:',
                postTitle: 'Post title:',
                postDescription: 'Post description:',
                report:"Report:",
                reportedImage: "Reported image:",
                viewImage: "View image",
                delete: 'Delete',
            },
            ViewMyPublicationItem:{
                availability:"Availability: ",
                reports:"Reports: ",
                date:"Date: ",
                pending: "Pending review",
                reported:"Reported",
                published: "Published",
                textNotVerified: "Text not verified by AI",
                textVerified: "Text verified by AI",
                imgNotVerified: "Image not verified by AI",
                imgVerified: "Image verified by AI",
                available: "Available",
                notAvailable: "Not available",
            },
            ViewReportComments:{
                title: 'Reported comments',
                report: 'Report Nº',
                status: 'Status:',
                pending: 'Pending',
                reviewing: 'Reviewing',
                reviewed: 'Reviewed',
                date: 'Date:',
                comment: 'Comment:',
                reportingUser: 'Reporting user:',
                commentUser: 'User who wrote the comment:',
                report:"Report:",
                delete: 'Delete',
            },
            viewPost:{
                comentaris: 'Comments',
            },
            viewPeopleMentoria:{
                chat: 'Chat',
            },
            myRequests:{
                title: 'My requests',
                noRequests: 'You have no requests',
            },
            myRequest:{
                availability:"Availability",
                reports:"Reports:",
                date:"Dates:",
                processing: "Pending review",
                reported:"Reported",
                posted: "Posted",
                textNotVerified: "Text not verified by AI",
                textVerified: "Text verified by AI",
                imgNotVerified: "Image not verified by AI",
                imgVerified: "Image verified by AI",
            },
            myPublications:{
                title: 'My publications',
                noPublications: 'You have no publications',
            },
            subMenu:{
                hi:"Hi,",
                profile:"Profile",
                publications:"My publications",
                request:"My requests",
                admin:"Admin",
                statistics:"Statistics",
            },
            requestPost:{
                title: 'Add a request:',
                uploadImage: 'Upload image:',
                availability: 'Available:',
                addAvailability: '+ Add availability',
                selectDay: 'Select a day',
                startTime: 'Start time',
                endTime: 'End time',
                publishing: 'Publishing...',
                titlePlaceholder: 'Title',
                DescriptionPlaceholder:'What are you thinking?',
            },
            notificationList:{
                title:"Notifications",
                all: "All",
                comments: "Comments",
                publications: "Publications",
                noNotifications: "No notifications to show",
            },
            navBar: {
                home: 'Home',
                search: 'Search',
                upload: 'Upload',
                chat: 'Chat',
            },
            loading:{
                title: 'Loading...',
            },
            headerVerification:{
                title: "Verification page",
                validationUser: "User verification",
                validationPost: "Post verification",
            },
            headerReport:{
                title:"Report page",
                reportUser:"See user report",
                reportPost:"See post report",
                reportComment:"See comment report",
            },
            header:{
                report: 'Report',
                validation: 'Validation',
                services: 'Services',
                comunity: 'Comunity',
                mentors: 'Mentors',
                request: 'Requests',
            },
            formNewDataUsers:{
                title: 'User form',
                showForm: 'Show form',
                hideForm: 'Hide form',
                name: 'Name',
                profilePicture: 'Profile picture',
                banner: 'Banner',
                city: 'City',
                linkDiscord: 'Discord link',
                linkGithub: 'Github link',
                submit:'Save user',
                tags: 'Tags (JSON)',
                tagsExample:'Example format: ["JavaScript", "Python", "React"]',
                availability: 'Availability (JSON)',
                availabilityExample: 'Example format: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post:{
                title: 'Add a post',
                titlePlaceholder: 'Title',
                postDescriptionPlaceholder:'What are you thinking?',
                maxChar:'Max 230 characters',
                publish: 'Publish',
            },
            calendar: {
                title: 'Availability schedule',
                day: 'Day',
                availability: 'Available hours',
                monday: 'Monday',
                tuesday: 'Tuesday',
                wednesday: 'Wednesday',
                thursday: 'Thursday',
                friday: 'Friday',
                saturday: 'Saturday',
                sunday: 'Sunday'
            },
            menu: {
                comunity: 'Comunity',
                mentors: 'Mentors',
                request: 'Requests',
                share: 'Share'
            },
        },
        ca: {
            chatContent:{
                writeMessage:"Escriu un missatge...",
            },
            languageSelector:{
                spanish: 'Espanyol',
                english: 'Anglès',
                catalan: 'Català',
                chinese: 'Xinès',
                urdu: 'Urdu',
                german: 'Alemany',
                portuguese: 'Portuguès',
                japanese: 'Japonès',
                euskera: 'Euskera',
                gallego: 'Gallec',
            },
            StadisticsPage:{
                title: 'Estadístiques',
                userGraph: "Gràfics d'usuaris",
                commentsGraph: "Gràfics de comentaris",
                postGraph: "Gràfics de publicacions"
            },
            serviceListPage:{
                title: 'Serveis',
                noDescription: 'No hi ha descripció disponible'
            },
            profilePage:{
                placeWhereYouLive:"Lloc on vius...",
                pendant:"Pendent d'assignar"
            },
            LoginRegisterPage:{
                subTitle:"Correu @inspedralbes.cat",
                accessGoogle:"Accedeix amb Google",
                accessGithub:"Accedeix amb Github",
                logIn:"O inicia sessió",
                mailPlaceholder:"Correu electrònic",
                passwordPlaceholder:"Contrasenya",
                loginButton:"Inicia sessió",
                projectBy:"Projecte realitzat per l'equip de",
                withTheHelpOf:", amb l'ajuda de",
                error:"Ha ocorregut un error en iniciar sessió",
                errorFields:"Error en iniciar sessió, comprova les dades introduïdes",
                invalidMail:"Error en iniciar sessió, el correu no és vàlid"
            },
            AddComunityPost:{
                create: 'Crear una publicació',
                title: 'Títol:',
                titlePlaceholder: 'Escriu el títol de la publicació',
                description: 'Descripció:',
                descriptionPlaceholder: 'Escriu la descripció de la publicació',
                postImage:"Pujar Imatge:",
                preview: 'Vista prèvia:',
                publish: 'Publicar',
                publishing: 'Publicant...',
                notAllFields:"Si us plau, completa tots els camps i puja una imatge.",
                error:"Ha ocorregut un error al publicar la publicació:",
            },
            viewValidationUser: {
                title: 'Validar usuaris',
                user: 'Usuari Nº ',
                userType: 'Tipus d\'usuari: ',
                student: 'Estudiant',
                teacher: 'Professor',
                admin: 'Administrador',
                class: 'Classe: ',
                user: 'Usuari: ',
                banner: 'Banner: ',
                profile: "Perfil: ",
                validate: 'Validar',
                delete: 'Eliminar',
                unknown: 'Desconegut',
            },
            ViewValidationUpdate:{
                title: 'Validar/Actualitzar usuaris',
                user: 'Usuari Nº: ',
                userType: 'Tipus d\'usuari: ',
                student: 'Estudiant',
                teacher: 'Professor',
                admin: 'Administrador',
                class: 'Classe: ',
                user: 'Usuari: ',
                banner: 'Banner: ',
                profile: "Perfil: ",
                validate: 'Validar',
                delete: 'Eliminar',
                unknown: 'Desconegut',
            },
            viewRequest: {
                coments: 'Comentaris',
                comentPlaceholder: 'Escriu un comentari!',
                seeMore: 'Veure més',
                seeLess: 'Veure menys',
                availability: 'Disponibilitat',
                from: 'De',
                to: 'a',
            },
            ViewReportUser:{
                title: 'Usuaris reportats',
                report: 'Informe Nº',
                status: 'Estat:',
                pending: 'Pendent',
                reviewing: 'Revisant',
                reviewed: 'Revisat',
                date: 'Data:',
                userReporting: 'Usuari que reporta:',
                userReported: 'Usuari reportat:',
                report: 'Informe:',
                delete: 'Eliminar',
            },
            ViewReportPublicacio:{
                title: 'Publicacions reportades',
                report: 'Informe Nº',
                status: 'Estat:',
                pending: 'Pendent',
                reviewing: 'Revisant',
                reviewed: 'Revisat',
                date: 'Data:',
                userReporting: 'Usuari que reporta:',
                userPost: 'Usuari de la publicació:',
                postTitle: 'Títol de la publicació:',
                postDescription: 'Descripció de la publicació:',
                report: 'Informe:',
                reportedImage: 'Imatge reportada:',
                viewImage: 'Veure imatge',
                delete: 'Eliminar',
            },
            ViewMyPublicationItem:{
                availability:"Disponibilitat: ",
                reports:"Reportes: ",
                date:"Data: ",
                pending: "Pendent de revisar",
                reported:"Reportat",
                published: "Publicat",
                textNotVerified: "Text no verificat per IA",
                textVerified: "Text verificat per IA",
                imgNotVerified: "Imatge no verificada per IA",
                imgVerified: "Imatge verificada per IA",
                available: "Disponible",
                notAvailable: "No disponible",
            },
            ViewReportComments:{
                title: 'Comentaris reportats',
                report: 'Informe Nº',
                status: 'Estat:',
                pending: 'Pendent',
                reviewing: 'Revisant',
                reviewed: 'Revisat',
                date: 'Data:',
                comment: 'Comentari:',
                reportingUser: 'Usuari que reporta:',
                commentUser: 'Usuari que va escriure el comentari:',
                report: 'Informe:',
                delete: 'Eliminar',
            },
            viewPost:{
                comentaris: 'Comentaris',
            },
            viewPeopleMentoria:{
                chat: 'Xat',
            },
            myRequests:{
                title: 'Les meves peticions',
                noRequests: 'No tens peticions',
                textNotVerified: "Text no verificat per IA",
                textVerified: "Text verificat per IA",
                imgNotVerified: "Imatge no verificada per IA",
                imgVerified: "Imatge verificada per IA",
            },
            myRequest:{
                availability:"Disponibilitat:",
                reports:"Reportes:",
                date:"Dates:",
                processing: "Pendent de revisar",
                reported:"Reportat",
                posted: "Publicat",
                textNotVerified: "Text no verificat per IA",
                textVerified: "Text verificat per IA",
                imgNotVerified: "Imatge no verificada per IA",
                imgVerified: "Imatge verificada per IA",
            },
            myPublications:{
                title: 'Les meves publicacions',
                noPublications: 'No tens publicacions',
            },
            subMenu:{
                hi:"Hola,",
                profile:"Perfil",
                publications:"Les meves publicacions",
                request:"Les meves peticions",
                admin:"Admin",
                statistics:"Estadístiques",
            },
            requestPost:{
                title: 'Afegeix una petició:',
                uploadImage: 'Puja una imatge:',    
                availability: 'Disponible:',
                addAvailability: '+ Afegeix disponibilitat',
                selectDay: 'Selecciona un dia',
                startTime: 'Hora d\'inici',
                endTime: 'Hora de fi',
                publishing: 'Publicant...',
                titlePlaceholder: 'Títol',
                DescriptionPlaceholder:'En què penses?',
            },
            notificationList:{
                title:"Notificacions",
                all: "Totes",
                comments: "Comentaris",
                publications: "Publicacions",
                noNotifications: "No hi ha notificacions per mostrar",
            },
            navBar: {
                home: 'Inici',
                search: 'Cerca',
                upload: 'Pujar',
                chat: 'Xat',
            },
            loading:{
                title: 'Carregant...',
            },
            headerVerification:{
                title:"Pagina de report",
                validationUser:"Validació d'usuari",
                validationPost:"Validació de publicació",
            },
            headerReport:{
                title:"Pagina de report",
                reportUser:"Veure report d'usuari",
                reportPost:"Veure report de publicació",
                reportComment:"Veure report de comentari",
            },
            header:{
                report: 'Reportar',
                validation: 'Validació',
                services: 'Serveis',
                comunity: 'Comunitat',
                mentors: 'Mentors',
                request: 'Peticions',
            },
            formNewDataUsers:{
                title: 'Formulari d\'usuari',
                showForm: 'Mostra formulari',
                hideForm: 'Amaga formulari',
                name: 'Nom',
                profilePicture: 'Foto de perfil',
                banner: 'Banner',
                city: 'Ciutat',
                linkDiscord: 'Enllaç a Discord',
                linkGithub: 'Enllaç a Github',
                submit:'Desa usuari',
                tags: 'Etiquetes (JSON)',
                tagsExample:'Exemple de format: ["JavaScript", "Python", "React"]',
                availability: 'Disponibilitat (JSON)',
                availabilityExample: 'Exemple de format: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post:{
                title: 'Afegeix una publicació',
                titlePlaceholder: 'Títol',
                postDescriptionPlaceholder:'En què penses?',
                maxChar:'Màxim 230 caràcters',
                publish: 'Publicar',
            },	
            calendar: {
                title: 'Horari de disponibilitat',
                day: 'Dia',
                availability: 'Hores disponibles',
                monday: 'Dilluns',
                tuesday: 'Dimarts',
                wednesday: 'Dimecres',
                thursday: 'Dijous',
                friday: 'Divendres',
                saturday: 'Dissabte',
                sunday: 'Diumenge'
            },
            menu: {
                comunity: 'Comunitat',
                mentors: 'Mentors',
                request: 'Peticions',
                share: 'Compartir'
            },
        },
        zh: {
            chatContent:{
                writeMessage:"写信息...",
            },
            languageSelector:{
                spanish: '西班牙语',
                english: '英语',
                catalan: '加泰罗尼亚语',
                chinese: '中文',
                urdu: '乌尔都语',
                german: '德语',
                portuguese: '葡萄牙语',
                japanese: '日语',
                euskera: '巴斯克语',
                gallego: '加利西亚语',
            },
            StadisticsPage: {
                title: '统计',
                userGraph: "用户图表",
                commentsGraph: "评论图表",
                postGraph: "帖子图表"
            },
            serviceListPage: {
                title: '服务',
                noDescription: '没有可用的描述'
            },
            profilePage: {
                placeWhereYouLive: "你住的地方...",
                pendant: "待分配"
            },
            LoginRegisterPage: {
                subTitle: "@inspedralbes.cat 邮箱",
                accessGoogle: "使用 Google 登录",
                accessGithub: "使用 Github 登录",
                logIn: "或登录",
                mailPlaceholder: "电子邮件",
                passwordPlaceholder: "密码",
                loginButton: "登录",
                projectBy: "项目由团队完成",
                withTheHelpOf: "，在...的帮助下",
                error: "登录时发生错误",
                errorFields: "登录错误，请检查输入的数据",
                invalidMail: "登录错误，电子邮件无效"
            },
            AddComunityPost: {
                create: '创建帖子',
                title: '标题:',
                titlePlaceholder: '写下帖子的标题',
                description: '描述:',
                descriptionPlaceholder: '写下帖子的描述',
                postImage: "上传图片:",
                preview: '预览:',
                publish: '发布',
                publishing: '发布中...',
                notAllFields: "请填写所有字段并上传图片。",
                error: "发布帖子时发生错误:"
            },
            viewValidationUser: {
                title: '验证用户',
                user: '用户编号',
                userType: '用户类型:',
                student: '学生',
                teacher: '老师',
                admin: '管理员',
                class: '班级:',
                user: '用户:',
                banner: '横幅:',
                profile: "个人资料:",
                validate: '验证',
                delete: '删除',
                unknown: '未知'
            },
            ViewValidationUpdate: {
                title: '验证/更新用户',
                user: '用户编号:',
                userType: '用户类型:',
                student: '学生',
                teacher: '老师',
                admin: '管理员',
                class: '班级:',
                user: '用户:',
                banner: '横幅:',
                profile: "个人资料:",
                validate: '验证',
                delete: '删除',
                unknown: '未知'
            },
            viewRequest: {
                coments: '评论',
                comentPlaceholder: '写评论!',
                seeMore: '查看更多',
                seeLess: '收起',
                availability: '可用性',
                from: '从',
                to: '到'
            },
            ViewReportUser: {
                title: '被举报的用户',
                report: '报告编号',
                status: '状态:',
                pending: '待处理',
                reviewing: '审核中',
                reviewed: '已审核',
                date: '日期:',
                userReporting: '举报用户:',
                userReported: '被举报用户:',
                report: '报告:',
                delete: '删除'
            },
            ViewReportPublicacio: {
                title: '被举报的帖子',
                report: '报告编号',
                status: '状态:',
                pending: '待处理',
                reviewing: '审核中',
                reviewed: '已审核',
                date: '日期:',
                userReporting: '举报用户:',
                userPost: '帖子用户:',
                postTitle: '帖子标题:',
                postDescription: '帖子描述:',
                report: '报告:',
                reportedImage: '被举报的图片:',
                viewImage: '查看图片',
                delete: '删除'
            },
            ViewMyPublicationItem: {
                availability: "可用性:",
                reports: "报告:",
                date: "日期:",
                pending: "待审核",
                reported: "已举报",
                published: "已发布",
                textNotVerified: "文本未通过 AI 验证",
                textVerified: "文本已通过 AI 验证",
                imgNotVerified: "图片未通过 AI 验证",
                imgVerified: "图片已通过 AI 验证",
                available: "可用",
                notAvailable: "不可用"
            },
            ViewReportComments: {
                title: '被举报的评论',
                report: '报告编号',
                status: '状态:',
                pending: '待处理',
                reviewing: '审核中',
                reviewed: '已审核',
                date: '日期:',
                comment: '评论:',
                reportingUser: '举报用户:',
                commentUser: '评论用户:',
                report: '报告:',
                delete: '删除'
            },
            viewPost: {
                comentaris: '评论'
            },
            viewPeopleMentoria: {
                chat: '聊天'
            },
            myRequests: {
                title: '我的请求',
                noRequests: '你没有请求'
            },
            myRequest: {
                availability: "可用性",
                reports: "报告:",
                date: "日期:",
                processing: "待审核",
                reported: "已举报",
                posted: "已发布",
                textNotVerified: "文本未通过 AI 验证",
                textVerified: "文本已通过 AI 验证",
                imgNotVerified: "图片未通过 AI 验证",
                imgVerified: "图片已通过 AI 验证"
            },
            myPublications: {
                title: '我的发布',
                noPublications: '你没有发布'
            },
            subMenu: {
                hi: "你好,",
                profile: "个人资料",
                publications: "我的发布",
                request: "我的请求",
                admin: "管理员",
                statistics: "统计"
            },
            requestPost: {
                title: '添加请求:',
                uploadImage: '上传图片:',
                availability: '可用:',
                addAvailability: '+ 添加可用性',
                selectDay: '选择一天',
                startTime: '开始时间',
                endTime: '结束时间',
                publishing: '发布中...',
                titlePlaceholder: '标题',
                DescriptionPlaceholder: '你在想什么?'
            },
            notificationList: {
                title: "通知",
                all: "所有",
                comments: "评论",
                publications: "发布",
                noNotifications: "没有通知显示"
            },
            navBar: {
                home: '首页',
                search: '搜索',
                upload: '上传',
                chat: '聊天'
            },
            loading: {
                title: '加载中...'
            },
            headerVerification: {
                title: "验证页面",
                validationUser: "用户验证",
                validationPost: "帖子验证"
            },
            headerReport: {
                title: "报告页面",
                reportUser: "查看用户报告",
                reportPost: "查看帖子报告",
                reportComment: "查看评论报告"
            },
            header: {
                report: '报告',
                validation: '验证',
                services: '服务',
                comunity: '社区',
                mentors: '导师',
                request: '请求'
            },
            formNewDataUsers: {
                title: '用户表单',
                showForm: '显示表单',
                hideForm: '隐藏表单',
                name: '姓名',
                profilePicture: '个人资料图片',
                banner: '横幅',
                city: '城市',
                linkDiscord: 'Discord 链接',
                linkGithub: 'Github 链接',
                submit: '保存用户',
                tags: '标签 (JSON)',
                tagsExample: '示例格式: ["JavaScript", "Python", "React"]',
                availability: '可用性 (JSON)',
                availabilityExample: '示例格式: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post: {
                title: '添加帖子',
                titlePlaceholder: '标题',
                postDescriptionPlaceholder: '你在想什么?',
                maxChar: '最多 230 个字符',
                publish: '发布'
            },
            calendar: {
                title: '可用时间表',
                day: '天',
                availability: '可用时间',
                monday: '星期一',
                tuesday: '星期二',
                wednesday: '星期三',
                thursday: '星期四',
                friday: '星期五',
                saturday: '星期六',
                sunday: '星期日'
            },
            menu: {
                comunity: '社区',
                mentors: '导师',
                request: '请求',
                share: '分享'
            }
        },
        de: {
            chatContent: {
                writeMessage: "Schreibe eine Nachricht..."
            },
            languageSelector: {
                spanish: 'Spanisch',
                english: 'Englisch',
                catalan: 'Katalanisch',
                chinese: 'Chinesisch',
                urdu: 'Urdu',
                german: 'Deutsch',
                portuguese: 'Portugiesisch',
                japanese: 'Japanisch',
                euskera: 'Baskisch',
                gallego: 'Galizisch'
            },
            StadisticsPage: {
                title: 'Statistiken',
                userGraph: "Benutzergrafiken",
                commentsGraph: "Kommentar-Grafiken",
                postGraph: "Beitragsgrafiken"
            },
            serviceListPage: {
                title: 'Dienstleistungen',
                noDescription: 'Keine Beschreibung verfügbar'
            },
            profilePage: {
                placeWhereYouLive: "Ort, an dem du lebst...",
                pendant: "Noch zugewiesen"
            },
            LoginRegisterPage: {
                subTitle: "@inspedralbes.cat E-Mail",
                accessGoogle: "Mit Google anmelden",
                accessGithub: "Mit Github anmelden",
                logIn: "Oder einloggen",
                mailPlaceholder: "E-Mail",
                passwordPlaceholder: "Passwort",
                loginButton: "Einloggen",
                projectBy: "Projekt erstellt vom Team von",
                withTheHelpOf: ", mit der Hilfe von",
                error: "Beim Einloggen ist ein Fehler aufgetreten",
                errorFields: "Fehler beim Einloggen, überprüfe die eingegebenen Daten",
                invalidMail: "Fehler beim Einloggen, die E-Mail ist ungültig"
            },
            AddComunityPost: {
                create: 'Einen Beitrag erstellen',
                title: 'Titel:',
                titlePlaceholder: 'Schreibe den Titel des Beitrags',
                description: 'Beschreibung:',
                descriptionPlaceholder: 'Schreibe die Beschreibung des Beitrags',
                postImage: "Bild hochladen:",
                preview: 'Vorschau:',
                publish: 'Veröffentlichen',
                publishing: 'Veröffentlichen...',
                notAllFields: "Bitte fülle alle Felder aus und lade ein Bild hoch.",
                error: "Beim Veröffentlichen des Beitrags ist ein Fehler aufgetreten:"
            },
            viewValidationUser: {
                title: 'Benutzer validieren',
                user: 'Benutzer Nr.',
                userType: 'Benutzertyp:',
                student: 'Student',
                teacher: 'Lehrer',
                admin: 'Administrator',
                class: 'Klasse:',
                user: 'Benutzer:',
                banner: 'Banner:',
                profile: "Profil:",
                validate: 'Validieren',
                delete: 'Löschen',
                unknown: 'Unbekannt'
            },
            ViewValidationUpdate: {
                title: 'Benutzer validieren/aktualisieren',
                user: 'Benutzer Nr.:',
                userType: 'Benutzertyp:',
                student: 'Student',
                teacher: 'Lehrer',
                admin: 'Administrator',
                class: 'Klasse:',
                user: 'Benutzer:',
                banner: 'Banner:',
                profile: "Profil:",
                validate: 'Validieren',
                delete: 'Löschen',
                unknown: 'Unbekannt'
            },
            viewRequest: {
                coments: 'Kommentare',
                comentPlaceholder: 'Schreibe einen Kommentar!',
                seeMore: 'Mehr sehen',
                seeLess: 'Weniger sehen',
                availability: 'Verfügbarkeit',
                from: 'Von',
                to: 'bis'
            },
            ViewReportUser: {
                title: 'Gemeldete Benutzer',
                report: 'Bericht Nr.',
                status: 'Status:',
                pending: 'Ausstehend',
                reviewing: 'Überprüfung',
                reviewed: 'Überprüft',
                date: 'Datum:',
                userReporting: 'Meldender Benutzer:',
                userReported: 'Gemeldeter Benutzer:',
                report: 'Bericht:',
                delete: 'Löschen'
            },
            ViewReportPublicacio: {
                title: 'Gemeldete Beiträge',
                report: 'Bericht Nr.',
                status: 'Status:',
                pending: 'Ausstehend',
                reviewing: 'Überprüfung',
                reviewed: 'Überprüft',
                date: 'Datum:',
                userReporting: 'Meldender Benutzer:',
                userPost: 'Benutzer des Beitrags:',
                postTitle: 'Beitragstitel:',
                postDescription: 'Beitragsbeschreibung:',
                report: 'Bericht:',
                reportedImage: 'Gemeldetes Bild:',
                viewImage: 'Bild ansehen',
                delete: 'Löschen'
            },
            ViewMyPublicationItem: {
                availability: "Verfügbarkeit:",
                reports: "Berichte:",
                date: "Datum:",
                pending: "Ausstehende Überprüfung",
                reported: "Gemeldet",
                published: "Veröffentlicht",
                textNotVerified: "Text nicht von KI verifiziert",
                textVerified: "Text von KI verifiziert",
                imgNotVerified: "Bild nicht von KI verifiziert",
                imgVerified: "Bild von KI verifiziert",
                available: "Verfügbar",
                notAvailable: "Nicht verfügbar"
            },
            ViewReportComments: {
                title: 'Gemeldete Kommentare',
                report: 'Bericht Nr.',
                status: 'Status:',
                pending: 'Ausstehend',
                reviewing: 'Überprüfung',
                reviewed: 'Überprüft',
                date: 'Datum:',
                comment: 'Kommentar:',
                reportingUser: 'Meldender Benutzer:',
                commentUser: 'Benutzer, der den Kommentar geschrieben hat:',
                report: 'Bericht:',
                delete: 'Löschen'
            },
            viewPost: {
                comentaris: 'Kommentare'
            },
            viewPeopleMentoria: {
                chat: 'Chat'
            },
            myRequests: {
                title: 'Meine Anfragen',
                noRequests: 'Du hast keine Anfragen'
            },
            myRequest: {
                availability: "Verfügbarkeit",
                reports: "Berichte:",
                date: "Daten:",
                processing: "Ausstehende Überprüfung",
                reported: "Gemeldet",
                posted: "Veröffentlicht",
                textNotVerified: "Text nicht von KI verifiziert",
                textVerified: "Text von KI verifiziert",
                imgNotVerified: "Bild nicht von KI verifiziert",
                imgVerified: "Bild von KI verifiziert"
            },
            myPublications: {
                title: 'Meine Veröffentlichungen',
                noPublications: 'Du hast keine Veröffentlichungen'
            },
            subMenu: {
                hi: "Hallo,",
                profile: "Profil",
                publications: "Meine Veröffentlichungen",
                request: "Meine Anfragen",
                admin: "Admin",
                statistics: "Statistiken"
            },
            requestPost: {
                title: 'Eine Anfrage hinzufügen:',
                uploadImage: 'Bild hochladen:',
                availability: 'Verfügbar:',
                addAvailability: '+ Verfügbarkeit hinzufügen',
                selectDay: 'Wähle einen Tag',
                startTime: 'Startzeit',
                endTime: 'Endzeit',
                publishing: 'Veröffentlichen...',
                titlePlaceholder: 'Titel',
                DescriptionPlaceholder: 'Woran denkst du?'
            },
            notificationList: {
                title: "Benachrichtigungen",
                all: "Alle",
                comments: "Kommentare",
                publications: "Veröffentlichungen",
                noNotifications: "Keine Benachrichtigungen anzuzeigen"
            },
            navBar: {
                home: 'Startseite',
                search: 'Suche',
                upload: 'Hochladen',
                chat: 'Chat'
            },
            loading: {
                title: 'Laden...'
            },
            headerVerification: {
                title: "Verifizierungsseite",
                validationUser: "Benutzerverifizierung",
                validationPost: "Beitragsverifizierung"
            },
            headerReport: {
                title: "Berichtsseite",
                reportUser: "Benutzerbericht anzeigen",
                reportPost: "Beitragsbericht anzeigen",
                reportComment: "Kommentarbericht anzeigen"
            },
            header: {
                report: 'Bericht',
                validation: 'Verifizierung',
                services: 'Dienstleistungen',
                comunity: 'Gemeinschaft',
                mentors: 'Mentoren',
                request: 'Anfragen'
            },
            formNewDataUsers: {
                title: 'Benutzerformular',
                showForm: 'Formular anzeigen',
                hideForm: 'Formular ausblenden',
                name: 'Name',
                profilePicture: 'Profilbild',
                banner: 'Banner',
                city: 'Stadt',
                linkDiscord: 'Discord-Link',
                linkGithub: 'Github-Link',
                submit: 'Benutzer speichern',
                tags: 'Tags (JSON)',
                tagsExample: 'Beispielformat: ["JavaScript", "Python", "React"]',
                availability: 'Verfügbarkeit (JSON)',
                availabilityExample: 'Beispielformat: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post: {
                title: 'Einen Beitrag hinzufügen',
                titlePlaceholder: 'Titel',
                postDescriptionPlaceholder: 'Woran denkst du?',
                maxChar: 'Maximal 230 Zeichen',
                publish: 'Veröffentlichen'
            },
            calendar: {
                title: 'Verfügbarkeitsplan',
                day: 'Tag',
                availability: 'Verfügbare Stunden',
                monday: 'Montag',
                tuesday: 'Dienstag',
                wednesday: 'Mittwoch',
                thursday: 'Donnerstag',
                friday: 'Freitag',
                saturday: 'Samstag',
                sunday: 'Sonntag'
            },
            menu: {
                comunity: 'Gemeinschaft',
                mentors: 'Mentoren',
                request: 'Anfragen',
                share: 'Teilen'
            }
        },
        ur: {
            chatContent: {
                writeMessage: "پیغام لکھیں..."
            },
            languageSelector: {
                spanish: 'ہسپانوی',
                english: 'انگریزی',
                catalan: 'کیٹالان',
                chinese: 'چینی',
                urdu: 'اردو',
                german: 'جرمن',
                portuguese: 'پرتگالی',
                japanese: 'جاپانی',
                euskera: 'باسک',
                gallego: 'گالیشیائی'
            },
            StadisticsPage: {
                title: 'اعداد و شمار',
                userGraph: "صارف کے گراف",
                commentsGraph: "تبصرے کے گراف",
                postGraph: "پوسٹ کے گراف"
            },
            serviceListPage: {
                title: 'خدمات',
                noDescription: 'کوئی تفصیل دستیاب نہیں'
            },
            profilePage: {
                placeWhereYouLive: "جہاں آپ رہتے ہیں...",
                pendant: "تفویض کرنے کے لئے زیر التواء"
            },
            LoginRegisterPage: {
                subTitle: "@inspedralbes.cat ای میل",
                accessGoogle: "گوگل کے ساتھ رسائی حاصل کریں",
                accessGithub: "گٹ ہب کے ساتھ رسائی حاصل کریں",
                logIn: "یا لاگ ان کریں",
                mailPlaceholder: "ای میل",
                passwordPlaceholder: "پاس ورڈ",
                loginButton: "لاگ ان کریں",
                projectBy: "پروجیکٹ ٹیم کے ذریعہ بنایا گیا",
                withTheHelpOf: "، کی مدد سے",
                error: "لاگ ان کرتے وقت ایک خرابی پیش آگئی",
                errorFields: "لاگ ان میں خرابی، درج کردہ ڈیٹا چیک کریں",
                invalidMail: "لاگ ان میں خرابی، ای میل درست نہیں ہے"
            },
            AddComunityPost: {
                create: 'ایک پوسٹ بنائیں',
                title: 'عنوان:',
                titlePlaceholder: 'پوسٹ کا عنوان لکھیں',
                description: 'تفصیل:',
                descriptionPlaceholder: 'پوسٹ کی تفصیل لکھیں',
                postImage: "تصویر اپ لوڈ کریں:",
                preview: 'پیش نظارہ:',
                publish: 'شائع کریں',
                publishing: 'شائع ہو رہا ہے...',
                notAllFields: "براہ کرم تمام فیلڈز کو مکمل کریں اور ایک تصویر اپ لوڈ کریں۔",
                error: "پوسٹ شائع کرتے وقت ایک خرابی پیش آگئی:"
            },
            viewValidationUser: {
                title: 'صارفین کی توثیق کریں',
                user: 'صارف نمبر',
                userType: 'صارف کی قسم:',
                student: 'طالب علم',
                teacher: 'استاد',
                admin: 'ایڈمن',
                class: 'کلاس:',
                user: 'صارف:',
                banner: 'بینر:',
                profile: "پروفائل:",
                validate: 'توثیق کریں',
                delete: 'حذف کریں',
                unknown: 'نامعلوم'
            },
            ViewValidationUpdate: {
                title: 'صارفین کی توثیق/اپ ڈیٹ کریں',
                user: 'صارف نمبر:',
                userType: 'صارف کی قسم:',
                student: 'طالب علم',
                teacher: 'استاد',
                admin: 'ایڈمن',
                class: 'کلاس:',
                user: 'صارف:',
                banner: 'بینر:',
                profile: "پروفائل:",
                validate: 'توثیق کریں',
                delete: 'حذف کریں',
                unknown: 'نامعلوم'
            },
            viewRequest: {
                coments: 'تبصرے',
                comentPlaceholder: 'ایک تبصرہ لکھیں!',
                seeMore: 'مزید دیکھیں',
                seeLess: 'کم دیکھیں',
                availability: 'دستیابی',
                from: 'سے',
                to: 'تک'
            },
            ViewReportUser: {
                title: 'رپورٹ شدہ صارفین',
                report: 'رپورٹ نمبر',
                status: 'حالت:',
                pending: 'زیر التواء',
                reviewing: 'جائزہ لے رہے ہیں',
                reviewed: 'جائزہ لیا گیا',
                date: 'تاریخ:',
                userReporting: 'رپورٹ کرنے والا صارف:',
                userReported: 'رپورٹ شدہ صارف:',
                report: 'رپورٹ:',
                delete: 'حذف کریں'
            },
            ViewReportPublicacio: {
                title: 'رپورٹ شدہ پوسٹس',
                report: 'رپورٹ نمبر',
                status: 'حالت:',
                pending: 'زیر التواء',
                reviewing: 'جائزہ لے رہے ہیں',
                reviewed: 'جائزہ لیا گیا',
                date: 'تاریخ:',
                userReporting: 'رپورٹ کرنے والا صارف:',
                userPost: 'پوسٹ کا صارف:',
                postTitle: 'پوسٹ کا عنوان:',
                postDescription: 'پوسٹ کی تفصیل:',
                report: 'رپورٹ:',
                reportedImage: 'رپورٹ شدہ تصویر:',
                viewImage: 'تصویر دیکھیں',
                delete: 'حذف کریں'
            },
            ViewMyPublicationItem: {
                availability: "دستیابی:",
                reports: "رپورٹس:",
                date: "تاریخ:",
                pending: "زیر التواء جائزہ",
                reported: "رپورٹ شدہ",
                published: "شائع شدہ",
                textNotVerified: "متن کی تصدیق AI سے نہیں ہوئی",
                textVerified: "متن کی تصدیق AI سے ہوئی",
                imgNotVerified: "تصویر کی تصدیق AI سے نہیں ہوئی",
                imgVerified: "تصویر کی تصدیق AI سے ہوئی",
                available: "دستیاب",
                notAvailable: "دستیاب نہیں"
            },
            ViewReportComments: {
                title: 'رپورٹ شدہ تبصرے',
                report: 'رپورٹ نمبر',
                status: 'حالت:',
                pending: 'زیر التواء',
                reviewing: 'جائزہ لے رہے ہیں',
                reviewed: 'جائزہ لیا گیا',
                date: 'تاریخ:',
                comment: 'تبصرہ:',
                reportingUser: 'رپورٹ کرنے والا صارف:',
                commentUser: 'تبصرہ لکھنے والا صارف:',
                report: 'رپورٹ:',
                delete: 'حذف کریں'
            },
            viewPost: {
                comentaris: 'تبصرے'
            },
            viewPeopleMentoria: {
                chat: 'چیٹ'
            },
            myRequests: {
                title: 'میری درخواستیں',
                noRequests: 'آپ کی کوئی درخواست نہیں ہے'
            },
            myRequest: {
                availability: "دستیابی",
                reports: "رپورٹس:",
                date: "تاریخیں:",
                processing: "زیر التواء جائزہ",
                reported: "رپورٹ شدہ",
                posted: "شائع شدہ",
                textNotVerified: "متن کی تصدیق AI سے نہیں ہوئی",
                textVerified: "متن کی تصدیق AI سے ہوئی",
                imgNotVerified: "تصویر کی تصدیق AI سے نہیں ہوئی",
                imgVerified: "تصویر کی تصدیق AI سے ہوئی"
            },
            myPublications: {
                title: 'میری اشاعتیں',
                noPublications: 'آپ کی کوئی اشاعت نہیں ہے'
            },
            subMenu: {
                hi: "ہیلو,",
                profile: "پروفائل",
                publications: "میری اشاعتیں",
                request: "میری درخواستیں",
                admin: "ایڈمن",
                statistics: "اعداد و شمار"
            },
            requestPost: {
                title: 'ایک درخواست شامل کریں:',
                uploadImage: 'تصویر اپ لوڈ کریں:',
                availability: 'دستیاب:',
                addAvailability: '+ دستیابی شامل کریں',
                selectDay: 'ایک دن منتخب کریں',
                startTime: 'شروع ہونے کا وقت',
                endTime: 'ختم ہونے کا وقت',
                publishing: 'شائع ہو رہا ہے...',
                titlePlaceholder: 'عنوان',
                DescriptionPlaceholder: 'آپ کیا سوچ رہے ہیں؟'
            },
            notificationList: {
                title: "اطلاعات",
                all: "سب",
                comments: "تبصرے",
                publications: "اشاعتیں",
                noNotifications: "دکھانے کے لئے کوئی اطلاع نہیں"
            },
            navBar: {
                home: 'ہوم',
                search: 'تلاش کریں',
                upload: 'اپ لوڈ کریں',
                chat: 'چیٹ'
            },
            loading: {
                title: 'لوڈ ہو رہا ہے...'
            },
            headerVerification: {
                title: "تصدیق کا صفحہ",
                validationUser: "صارف کی تصدیق",
                validationPost: "پوسٹ کی تصدیق"
            },
            headerReport: {
                title: "رپورٹ کا صفحہ",
                reportUser: "صارف کی رپورٹ دیکھیں",
                reportPost: "پوسٹ کی رپورٹ دیکھیں",
                reportComment: "تبصرہ کی رپورٹ دیکھیں"
            },
            header: {
                report: 'رپورٹ',
                validation: 'تصدیق',
                services: 'خدمات',
                comunity: 'کمیونٹی',
                mentors: 'سرپرست',
                request: 'درخواستیں'
            },
            formNewDataUsers: {
                title: 'صارف کا فارم',
                showForm: 'فارم دکھائیں',
                hideForm: 'فارم چھپائیں',
                name: 'نام',
                profilePicture: 'پروفائل تصویر',
                banner: 'بینر',
                city: 'شہر',
                linkDiscord: 'Discord لنک',
                linkGithub: 'Github لنک',
                submit: 'صارف کو محفوظ کریں',
                tags: 'ٹیگز (JSON)',
                tagsExample: 'مثال فارمیٹ: ["JavaScript", "Python", "React"]',
                availability: 'دستیابی (JSON)',
                availabilityExample: 'مثال فارمیٹ: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post: {
                title: 'ایک پوسٹ شامل کریں',
                titlePlaceholder: 'عنوان',
                postDescriptionPlaceholder: 'آپ کیا سوچ رہے ہیں؟',
                maxChar: 'زیادہ سے زیادہ 230 حروف',
                publish: 'شائع کریں'
            },
            calendar: {
                title: 'دستیابی کا شیڈول',
                day: 'دن',
                availability: 'دستیاب گھنٹے',
                monday: 'پیر',
                tuesday: 'منگل',
                wednesday: 'بدھ',
                thursday: 'جمعرات',
                friday: 'جمعہ',
                saturday: 'ہفتہ',
                sunday: 'اتوار'
            },
            menu: {
                comunity: 'کمیونٹی',
                mentors: 'سرپرست',
                request: 'درخواستیں',
                share: 'شیئر کریں'
            }
        },
        pt: {
            chatContent: {
                writeMessage: "Escreva uma mensagem..."
            },
            languageSelector: {
                spanish: 'Espanhol',
                english: 'Inglês',
                catalan: 'Catalão',
                chinese: 'Chinês',
                urdu: 'Urdu',
                german: 'Alemão',
                portuguese: 'Português',
                japanese: 'Japonês',
                euskera: 'Basco',
                gallego: 'Galego'
            },
            StadisticsPage: {
                title: 'Estatísticas',
                userGraph: "Gráficos de usuários",
                commentsGraph: "Gráficos de comentários",
                postGraph: "Gráficos de postagens"
            },
            serviceListPage: {
                title: 'Serviços',
                noDescription: 'Nenhuma descrição disponível'
            },
            profilePage: {
                placeWhereYouLive: "Lugar onde você mora...",
                pendant: "Pendente de atribuição"
            },
            LoginRegisterPage: {
                subTitle: "Email @inspedralbes.cat",
                accessGoogle: "Acessar com Google",
                accessGithub: "Acessar com Github",
                logIn: "Ou faça login",
                mailPlaceholder: "Email",
                passwordPlaceholder: "Senha",
                loginButton: "Entrar",
                projectBy: "Projeto realizado pela equipe de",
                withTheHelpOf: ", com a ajuda de",
                error: "Ocorreu um erro ao fazer login",
                errorFields: "Erro ao fazer login, verifique os dados inseridos",
                invalidMail: "Erro ao fazer login, o email não é válido"
            },
            AddComunityPost: {
                create: 'Criar uma postagem',
                title: 'Título:',
                titlePlaceholder: 'Escreva o título da postagem',
                description: 'Descrição:',
                descriptionPlaceholder: 'Escreva a descrição da postagem',
                postImage: "Carregar imagem:",
                preview: 'Pré-visualização:',
                publish: 'Publicar',
                publishing: 'Publicando...',
                notAllFields: "Por favor, complete todos os campos e carregue uma imagem.",
                error: "Ocorreu um erro ao publicar a postagem:"
            },
            viewValidationUser: {
                title: 'Validar usuários',
                user: 'Usuário Nº',
                userType: 'Tipo de usuário:',
                student: 'Estudante',
                teacher: 'Professor',
                admin: 'Administrador',
                class: 'Classe:',
                user: 'Usuário:',
                banner: 'Banner:',
                profile: "Perfil:",
                validate: 'Validar',
                delete: 'Excluir',
                unknown: 'Desconhecido'
            },
            ViewValidationUpdate: {
                title: 'Validar/Atualizar usuários',
                user: 'Usuário Nº:',
                userType: 'Tipo de usuário:',
                student: 'Estudante',
                teacher: 'Professor',
                admin: 'Administrador',
                class: 'Classe:',
                user: 'Usuário:',
                banner: 'Banner:',
                profile: "Perfil:",
                validate: 'Validar',
                delete: 'Excluir',
                unknown: 'Desconhecido'
            },
            viewRequest: {
                coments: 'Comentários',
                comentPlaceholder: 'Escreva um comentário!',
                seeMore: 'Ver mais',
                seeLess: 'Ver menos',
                availability: 'Disponibilidade',
                from: 'De',
                to: 'a'
            },
            ViewReportUser: {
                title: 'Usuários reportados',
                report: 'Relatório Nº',
                status: 'Status:',
                pending: 'Pendente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Data:',
                userReporting: 'Usuário que reporta:',
                userReported: 'Usuário reportado:',
                report: 'Relatório:',
                delete: 'Excluir'
            },
            ViewReportPublicacio: {
                title: 'Postagens reportadas',
                report: 'Relatório Nº',
                status: 'Status:',
                pending: 'Pendente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Data:',
                userReporting: 'Usuário que reporta:',
                userPost: 'Usuário da postagem:',
                postTitle: 'Título da postagem:',
                postDescription: 'Descrição da postagem:',
                report: 'Relatório:',
                reportedImage: 'Imagem reportada:',
                viewImage: 'Ver imagem',
                delete: 'Excluir'
            },
            ViewMyPublicationItem: {
                availability: "Disponibilidade:",
                reports: "Relatórios:",
                date: "Data:",
                pending: "Pendente de revisão",
                reported: "Reportado",
                published: "Publicado",
                textNotVerified: "Texto não verificado por IA",
                textVerified: "Texto verificado por IA",
                imgNotVerified: "Imagem não verificada por IA",
                imgVerified: "Imagem verificada por IA",
                available: "Disponível",
                notAvailable: "Não disponível"
            },
            ViewReportComments: {
                title: 'Comentários reportados',
                report: 'Relatório Nº',
                status: 'Status:',
                pending: 'Pendente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Data:',
                comment: 'Comentário:',
                reportingUser: 'Usuário que reporta:',
                commentUser: 'Usuário que escreveu o comentário:',
                report: 'Relatório:',
                delete: 'Excluir'
            },
            viewPost: {
                comentaris: 'Comentários'
            },
            viewPeopleMentoria: {
                chat: 'Chat'
            },
            myRequests: {
                title: 'Minhas solicitações',
                noRequests: 'Você não tem solicitações'
            },
            myRequest: {
                availability: "Disponibilidade",
                reports: "Relatórios:",
                date: "Datas:",
                processing: "Pendente de revisão",
                reported: "Reportado",
                posted: "Publicado",
                textNotVerified: "Texto não verificado por IA",
                textVerified: "Texto verificado por IA",
                imgNotVerified: "Imagem não verificada por IA",
                imgVerified: "Imagem verificada por IA"
            },
            myPublications: {
                title: 'Minhas publicações',
                noPublications: 'Você não tem publicações'
            },
            subMenu: {
                hi: "Olá,",
                profile: "Perfil",
                publications: "Minhas publicações",
                request: "Minhas solicitações",
                admin: "Admin",
                statistics: "Estatísticas"
            },
            requestPost: {
                title: 'Adicionar uma solicitação:',
                uploadImage: 'Carregar imagem:',
                availability: 'Disponível:',
                addAvailability: '+ Adicionar disponibilidade',
                selectDay: 'Selecione um dia',
                startTime: 'Hora de início',
                endTime: 'Hora de término',
                publishing: 'Publicando...',
                titlePlaceholder: 'Título',
                DescriptionPlaceholder: 'O que você está pensando?'
            },
            notificationList: {
                title: "Notificações",
                all: "Todas",
                comments: "Comentários",
                publications: "Publicações",
                noNotifications: "Nenhuma notificação para mostrar"
            },
            navBar: {
                home: 'Início',
                search: 'Buscar',
                upload: 'Carregar',
                chat: 'Chat'
            },
            loading: {
                title: 'Carregando...'
            },
            headerVerification: {
                title: "Página de verificação",
                validationUser: "Verificação de usuário",
                validationPost: "Verificação de postagem"
            },
            headerReport: {
                title: "Página de relatórios",
                reportUser: "Ver relatório de usuário",
                reportPost: "Ver relatório de postagem",
                reportComment: "Ver relatório de comentário"
            },
            header: {
                report: 'Relatar',
                validation: 'Validação',
                services: 'Serviços',
                comunity: 'Comunidade',
                mentors: 'Mentores',
                request: 'Solicitações'
            },
            formNewDataUsers: {
                title: 'Formulário de usuário',
                showForm: 'Mostrar formulário',
                hideForm: 'Ocultar formulário',
                name: 'Nome',
                profilePicture: 'Foto de perfil',
                banner: 'Banner',
                city: 'Cidade',
                linkDiscord: 'Link do Discord',
                linkGithub: 'Link do Github',
                submit: 'Salvar usuário',
                tags: 'Tags (JSON)',
                tagsExample: 'Formato de exemplo: ["JavaScript", "Python", "React"]',
                availability: 'Disponibilidade (JSON)',
                availabilityExample: 'Formato de exemplo: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post: {
                title: 'Adicionar uma postagem',
                titlePlaceholder: 'Título',
                postDescriptionPlaceholder: 'O que você está pensando?',
                maxChar: 'Máximo de 230 caracteres',
                publish: 'Publicar'
            },
            calendar: {
                title: 'Agenda de disponibilidade',
                day: 'Dia',
                availability: 'Horas disponíveis',
                monday: 'Segunda-feira',
                tuesday: 'Terça-feira',
                wednesday: 'Quarta-feira',
                thursday: 'Quinta-feira',
                friday: 'Sexta-feira',
                saturday: 'Sábado',
                sunday: 'Domingo'
            },
            menu: {
                comunity: 'Comunidade',
                mentors: 'Mentores',
                request: 'Solicitações',
                share: 'Compartilhar'
            }
        },
        ja: {
            chatContent: {
                writeMessage: "メッセージを書く..."
            },
            languageSelector: {
                spanish: 'スペイン語',
                english: '英語',
                catalan: 'カタロニア語',
                chinese: '中国語',
                urdu: 'ウルドゥー語',
                german: 'ドイツ語',
                portuguese: 'ポルトガル語',
                japanese: '日本語',
                euskera: 'バスク語',
                gallego: 'ガリシア語'
            },
            StadisticsPage: {
                title: '統計',
                userGraph: "ユーザーグラフ",
                commentsGraph: "コメントグラフ",
                postGraph: "投稿グラフ"
            },
            serviceListPage: {
                title: 'サービス',
                noDescription: '説明はありません'
            },
            profilePage: {
                placeWhereYouLive: "あなたが住んでいる場所...",
                pendant: "割り当て待ち"
            },
            LoginRegisterPage: {
                subTitle: "@inspedralbes.cat メール",
                accessGoogle: "Googleでログイン",
                accessGithub: "Githubでログイン",
                logIn: "またはログイン",
                mailPlaceholder: "メールアドレス",
                passwordPlaceholder: "パスワード",
                loginButton: "ログイン",
                projectBy: "プロジェクトはチームによって作成されました",
                withTheHelpOf: "の助けを借りて",
                error: "ログイン中にエラーが発生しました",
                errorFields: "ログインエラー、入力したデータを確認してください",
                invalidMail: "ログインエラー、メールが無効です"
            },
            AddComunityPost: {
                create: '投稿を作成',
                title: 'タイトル:',
                titlePlaceholder: '投稿のタイトルを入力してください',
                description: '説明:',
                descriptionPlaceholder: '投稿の説明を入力してください',
                postImage: "画像をアップロード:",
                preview: 'プレビュー:',
                publish: '公開',
                publishing: '公開中...',
                notAllFields: "すべてのフィールドを入力し、画像をアップロードしてください。",
                error: "投稿の公開中にエラーが発生しました:"
            },
            viewValidationUser: {
                title: 'ユーザーを検証',
                user: 'ユーザー番号',
                userType: 'ユーザータイプ:',
                student: '学生',
                teacher: '教師',
                admin: '管理者',
                class: 'クラス:',
                user: 'ユーザー:',
                banner: 'バナー:',
                profile: "プロフィール:",
                validate: '検証',
                delete: '削除',
                unknown: '不明'
            },
            ViewValidationUpdate: {
                title: 'ユーザーを検証/更新',
                user: 'ユーザー番号:',
                userType: 'ユーザータイプ:',
                student: '学生',
                teacher: '教師',
                admin: '管理者',
                class: 'クラス:',
                user: 'ユーザー:',
                banner: 'バナー:',
                profile: "プロフィール:",
                validate: '検証',
                delete: '削除',
                unknown: '不明'
            },
            viewRequest: {
                coments: 'コメント',
                comentPlaceholder: 'コメントを入力してください!',
                seeMore: 'もっと見る',
                seeLess: '少なく見る',
                availability: '可用性',
                from: 'から',
                to: 'まで'
            },
            ViewReportUser: {
                title: '報告されたユーザー',
                report: '報告番号',
                status: 'ステータス:',
                pending: '保留中',
                reviewing: 'レビュー中',
                reviewed: 'レビュー済み',
                date: '日付:',
                userReporting: '報告ユーザー:',
                userReported: '報告されたユーザー:',
                report: '報告:',
                delete: '削除'
            },
            ViewReportPublicacio: {
                title: '報告された投稿',
                report: '報告番号',
                status: 'ステータス:',
                pending: '保留中',
                reviewing: 'レビュー中',
                reviewed: 'レビュー済み',
                date: '日付:',
                userReporting: '報告ユーザー:',
                userPost: '投稿ユーザー:',
                postTitle: '投稿タイトル:',
                postDescription: '投稿説明:',
                report: '報告:',
                reportedImage: '報告された画像:',
                viewImage: '画像を見る',
                delete: '削除'
            },
            ViewMyPublicationItem: {
                availability: "可用性:",
                reports: "報告:",
                date: "日付:",
                pending: "保留中のレビュー",
                reported: "報告済み",
                published: "公開済み",
                textNotVerified: "AIによって検証されていないテキスト",
                textVerified: "AIによって検証されたテキスト",
                imgNotVerified: "AIによって検証されていない画像",
                imgVerified: "AIによって検証された画像",
                available: "利用可能",
                notAvailable: "利用不可"
            },
            ViewReportComments: {
                title: '報告されたコメント',
                report: '報告番号',
                status: 'ステータス:',
                pending: '保留中',
                reviewing: 'レビュー中',
                reviewed: 'レビュー済み',
                date: '日付:',
                comment: 'コメント:',
                reportingUser: '報告ユーザー:',
                commentUser: 'コメントユーザー:',
                report: '報告:',
                delete: '削除'
            },
            viewPost: {
                comentaris: 'コメント'
            },
            viewPeopleMentoria: {
                chat: 'チャット'
            },
            myRequests: {
                title: '私のリクエスト',
                noRequests: 'リクエストはありません'
            },
            myRequest: {
                availability: "可用性",
                reports: "報告:",
                date: "日付:",
                processing: "保留中のレビュー",
                reported: "報告済み",
                posted: "投稿済み",
                textNotVerified: "AIによって検証されていないテキスト",
                textVerified: "AIによって検証されたテキスト",
                imgNotVerified: "AIによって検証されていない画像",
                imgVerified: "AIによって検証された画像"
            },
            myPublications: {
                title: '私の投稿',
                noPublications: '投稿はありません'
            },
            subMenu: {
                hi: "こんにちは,",
                profile: "プロフィール",
                publications: "私の投稿",
                request: "私のリクエスト",
                admin: "管理者",
                statistics: "統計"
            },
            requestPost: {
                title: 'リクエストを追加:',
                uploadImage: '画像をアップロード:',
                availability: '利用可能:',
                addAvailability: '+ 可用性を追加',
                selectDay: '日を選択',
                startTime: '開始時間',
                endTime: '終了時間',
                publishing: '公開中...',
                titlePlaceholder: 'タイトル',
                DescriptionPlaceholder: '何を考えていますか？'
            },
            notificationList: {
                title: "通知",
                all: "すべて",
                comments: "コメント",
                publications: "投稿",
                noNotifications: "表示する通知はありません"
            },
            navBar: {
                home: 'ホーム',
                search: '検索',
                upload: 'アップロード',
                chat: 'チャット'
            },
            loading: {
                title: '読み込み中...'
            },
            headerVerification: {
                title: "検証ページ",
                validationUser: "ユーザー検証",
                validationPost: "投稿検証"
            },
            headerReport: {
                title: "報告ページ",
                reportUser: "ユーザー報告を見る",
                reportPost: "投稿報告を見る",
                reportComment: "コメント報告を見る"
            },
            header: {
                report: '報告',
                validation: '検証',
                services: 'サービス',
                comunity: 'コミュニティ',
                mentors: 'メンター',
                request: 'リクエスト'
            },
            formNewDataUsers: {
                title: 'ユーザーフォーム',
                showForm: 'フォームを表示',
                hideForm: 'フォームを非表示',
                name: '名前',
                profilePicture: 'プロフィール画像',
                banner: 'バナー',
                city: '都市',
                linkDiscord: 'Discordリンク',
                linkGithub: 'Githubリンク',
                submit: 'ユーザーを保存',
                tags: 'タグ (JSON)',
                tagsExample: '例の形式: ["JavaScript", "Python", "React"]',
                availability: '可用性 (JSON)',
                availabilityExample: '例の形式: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post: {
                title: '投稿を追加',
                titlePlaceholder: 'タイトル',
                postDescriptionPlaceholder: '何を考えていますか？',
                maxChar: '最大230文字',
                publish: '公開'
            },
            calendar: {
                title: '可用性スケジュール',
                day: '日',
                availability: '利用可能時間',
                monday: '月曜日',
                tuesday: '火曜日',
                wednesday: '水曜日',
                thursday: '木曜日',
                friday: '金曜日',
                saturday: '土曜日',
                sunday: '日曜日'
            },
            menu: {
                comunity: 'コミュニティ',
                mentors: 'メンター',
                request: 'リクエスト',
                share: '共有'
            }
        },
        eu: {
            chatContent: {
                writeMessage: "Idatzi mezua..."
            },
            languageSelector: {
                spanish: 'Espainiera',
                english: 'Ingelesa',
                catalan: 'Katalana',
                chinese: 'Txinera',
                urdu: 'Urdua',
                german: 'Alemana',
                portuguese: 'Portugesa',
                japanese: 'Japoniera',
                euskera: 'Euskara',
                gallego: 'Galegoa'
            },
            StadisticsPage: {
                title: 'Estatistikak',
                userGraph: "Erabiltzaileen grafikoak",
                commentsGraph: "Iruzkin grafikoak",
                postGraph: "Post grafikoak"
            },
            serviceListPage: {
                title: 'Zerbitzuak',
                noDescription: 'Ez dago deskribapenik eskuragarri'
            },
            profilePage: {
                placeWhereYouLive: "Bizilekua...",
                pendant: "Esleitzeko zain"
            },
            LoginRegisterPage: {
                subTitle: "@inspedralbes.cat posta",
                accessGoogle: "Google-rekin sartu",
                accessGithub: "Github-rekin sartu",
                logIn: "Edo saioa hasi",
                mailPlaceholder: "Posta elektronikoa",
                passwordPlaceholder: "Pasahitza",
                loginButton: "Saioa hasi",
                projectBy: "Proiektua taldeak egina",
                withTheHelpOf: ", laguntzarekin",
                error: "Errore bat gertatu da saioa hastean",
                errorFields: "Saioa hasteko errorea, sartutako datuak egiaztatu",
                invalidMail: "Saioa hasteko errorea, posta elektronikoa baliogabea da"
            },
            AddComunityPost: {
                create: 'Post bat sortu',
                title: 'Izenburua:',
                titlePlaceholder: 'Idatzi postaren izenburua',
                description: 'Deskribapena:',
                descriptionPlaceholder: 'Idatzi postaren deskribapena',
                postImage: "Irudia igo:",
                preview: 'Aurrebista:',
                publish: 'Argitaratu',
                publishing: 'Argitaratzen...',
                notAllFields: "Mesedez, bete eremu guztiak eta igo irudi bat.",
                error: "Errore bat gertatu da post argitaratzean:"
            },
            viewValidationUser: {
                title: 'Erabiltzaileak balioztatu',
                user: 'Erabiltzaile zenbakia',
                userType: 'Erabiltzaile mota:',
                student: 'Ikaslea',
                teacher: 'Irakaslea',
                admin: 'Administratzailea',
                class: 'Klasea:',
                user: 'Erabiltzailea:',
                banner: 'Banner:',
                profile: "Profila:",
                validate: 'Balioztatu',
                delete: 'Ezabatu',
                unknown: 'Ezezaguna'
            },
            ViewValidationUpdate: {
                title: 'Erabiltzaileak balioztatu/eguneratu',
                user: 'Erabiltzaile zenbakia:',
                userType: 'Erabiltzaile mota:',
                student: 'Ikaslea',
                teacher: 'Irakaslea',
                admin: 'Administratzailea',
                class: 'Klasea:',
                user: 'Erabiltzailea:',
                banner: 'Banner:',
                profile: "Profila:",
                validate: 'Balioztatu',
                delete: 'Ezabatu',
                unknown: 'Ezezaguna'
            },
            viewRequest: {
                coments: 'Iruzkinak',
                comentPlaceholder: 'Idatzi iruzkin bat!',
                seeMore: 'Gehiago ikusi',
                seeLess: 'Gutxiago ikusi',
                availability: 'Eskuragarritasuna',
                from: 'Tik',
                to: 'Ra'
            },
            ViewReportUser: {
                title: 'Erreportatutako erabiltzaileak',
                report: 'Erreport zenbakia',
                status: 'Egoera:',
                pending: 'Zain',
                reviewing: 'Berrikusten',
                reviewed: 'Berrikusita',
                date: 'Data:',
                userReporting: 'Erreportatzen duen erabiltzailea:',
                userReported: 'Erreportatutako erabiltzailea:',
                report: 'Erreporta:',
                delete: 'Ezabatu'
            },
            ViewReportPublicacio: {
                title: 'Erreportatutako postak',
                report: 'Erreport zenbakia',
                status: 'Egoera:',
                pending: 'Zain',
                reviewing: 'Berrikusten',
                reviewed: 'Berrikusita',
                date: 'Data:',
                userReporting: 'Erreportatzen duen erabiltzailea:',
                userPost: 'Postaren erabiltzailea:',
                postTitle: 'Postaren izenburua:',
                postDescription: 'Postaren deskribapena:',
                report: 'Erreporta:',
                reportedImage: 'Erreportatutako irudia:',
                viewImage: 'Irudia ikusi',
                delete: 'Ezabatu'
            },
            ViewMyPublicationItem: {
                availability: "Eskuragarritasuna:",
                reports: "Erreportak:",
                date: "Data:",
                pending: "Berrikusteko zain",
                reported: "Erreportatuta",
                published: "Argitaratuta",
                textNotVerified: "AI-k egiaztatu gabeko testua",
                textVerified: "AI-k egiaztatutako testua",
                imgNotVerified: "AI-k egiaztatu gabeko irudia",
                imgVerified: "AI-k egiaztatutako irudia",
                available: "Eskuragarri",
                notAvailable: "Eskuragarri ez"
            },
            ViewReportComments: {
                title: 'Erreportatutako iruzkinak',
                report: 'Erreport zenbakia',
                status: 'Egoera:',
                pending: 'Zain',
                reviewing: 'Berrikusten',
                reviewed: 'Berrikusita',
                date: 'Data:',
                comment: 'Iruzkina:',
                reportingUser: 'Erreportatzen duen erabiltzailea:',
                commentUser: 'Iruzkina idatzi duen erabiltzailea:',
                report: 'Erreporta:',
                delete: 'Ezabatu'
            },
            viewPost: {
                comentaris: 'Iruzkinak'
            },
            viewPeopleMentoria: {
                chat: 'Txata'
            },
            myRequests: {
                title: 'Nire eskaerak',
                noRequests: 'Ez duzu eskaerarik'
            },
            myRequest: {
                availability: "Eskuragarritasuna",
                reports: "Erreportak:",
                date: "Datak:",
                processing: "Berrikusteko zain",
                reported: "Erreportatuta",
                posted: "Argitaratuta",
                textNotVerified: "AI-k egiaztatu gabeko testua",
                textVerified: "AI-k egiaztatutako testua",
                imgNotVerified: "AI-k egiaztatu gabeko irudia",
                imgVerified: "AI-k egiaztatutako irudia"
            },
            myPublications: {
                title: 'Nire argitalpenak',
                noPublications: 'Ez duzu argitalpenik'
            },
            subMenu: {
                hi: "Kaixo,",
                profile: "Profila",
                publications: "Nire argitalpenak",
                request: "Nire eskaerak",
                admin: "Admin",
                statistics: "Estatistikak"
            },
            requestPost: {
                title: 'Eskaera bat gehitu:',
                uploadImage: 'Irudia igo:',
                availability: 'Eskuragarri:',
                addAvailability: '+ Eskuragarritasuna gehitu',
                selectDay: 'Egun bat aukeratu',
                startTime: 'Hasiera ordua',
                endTime: 'Amaiera ordua',
                publishing: 'Argitaratzen...',
                titlePlaceholder: 'Izenburua',
                DescriptionPlaceholder: 'Zer pentsatzen ari zara?'
            },
            notificationList: {
                title: "Jakinarazpenak",
                all: "Guztiak",
                comments: "Iruzkinak",
                publications: "Argitalpenak",
                noNotifications: "Ez dago erakusteko jakinarazpenik"
            },
            navBar: {
                home: 'Hasiera',
                search: 'Bilatu',
                upload: 'Igo',
                chat: 'Txata'
            },
            loading: {
                title: 'Kargatzen...'
            },
            headerVerification: {
                title: "Egiaztapen orria",
                validationUser: "Erabiltzailearen egiaztapena",
                validationPost: "Postaren egiaztapena"
            },
            headerReport: {
                title: "Erreporten orria",
                reportUser: "Erabiltzailearen erreporta ikusi",
                reportPost: "Postaren erreporta ikusi",
                reportComment: "Iruzkinaren erreporta ikusi"
            },
            header: {
                report: 'Erreportatu',
                validation: 'Egiaztapena',
                services: 'Zerbitzuak',
                comunity: 'Komunitatea',
                mentors: 'Mentoreak',
                request: 'Eskaerak'
            },
            formNewDataUsers: {
                title: 'Erabiltzailearen formularioa',
                showForm: 'Formularioa erakutsi',
                hideForm: 'Formularioa ezkutatu',
                name: 'Izena',
                profilePicture: 'Profilaren argazkia',
                banner: 'Banner',
                city: 'Hiria',
                linkDiscord: 'Discord esteka',
                linkGithub: 'Github esteka',
                submit: 'Erabiltzailea gorde',
                tags: 'Etiketak (JSON)',
                tagsExample: 'Adibide formatua: ["JavaScript", "Python", "React"]',
                availability: 'Eskuragarritasuna (JSON)',
                availabilityExample: 'Adibide formatua: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post: {
                title: 'Post bat gehitu',
                titlePlaceholder: 'Izenburua',
                postDescriptionPlaceholder: 'Zer pentsatzen ari zara?',
                maxChar: 'Gehienez 230 karaktere',
                publish: 'Argitaratu'
            },
            calendar: {
                title: 'Eskuragarritasun ordutegia',
                day: 'Eguna',
                availability: 'Eskuragarri orduak',
                monday: 'Astelehena',
                tuesday: 'Asteartea',
                wednesday: 'Asteazkena',
                thursday: 'Osteguna',
                friday: 'Ostirala',
                saturday: 'Larunbata',
                sunday: 'Igandea'
            },
            menu: {
                comunity: 'Komunitatea',
                mentors: 'Mentoreak',
                request: 'Eskaerak',
                share: 'Partekatu'
            }
        },
        gl: {
            chatContent: {
                writeMessage: "Escribe un mensaje..."
            },
            languageSelector: {
                spanish: 'Español',
                english: 'Inglés',
                catalan: 'Catalán',
                chinese: 'Chino',
                urdu: 'Urdu',
                german: 'Alemán',
                portuguese: 'Portugués',
                japanese: 'Japonés',
                euskera: 'Euskera',
                gallego: 'Galego'
            },
            StadisticsPage: {
                title: 'Estatísticas',
                userGraph: "Gráficos de usuarios",
                commentsGraph: "Gráficos de comentarios",
                postGraph: "Gráficos de publicacións"
            },
            serviceListPage: {
                title: 'Servizos',
                noDescription: 'Non hai descrición dispoñible'
            },
            profilePage: {
                placeWhereYouLive: "Lugar onde vives...",
                pendant: "Pendente de asignar"
            },
            LoginRegisterPage: {
                subTitle: "Correo @inspedralbes.cat",
                accessGoogle: "Acceder con Google",
                accessGithub: "Acceder con Github",
                logIn: "Ou inicia sesión",
                mailPlaceholder: "Correo electrónico",
                passwordPlaceholder: "Contrasinal",
                loginButton: "Inicia sesión",
                projectBy: "Proxecto realizado polo equipo de",
                withTheHelpOf: ", coa axuda de",
                error: "Ocorreu un erro ao iniciar sesión",
                errorFields: "Erro ao iniciar sesión, comproba os datos introducidos",
                invalidMail: "Erro ao iniciar sesión, o correo non é válido"
            },
            AddComunityPost: {
                create: 'Crear unha publicación',
                title: 'Título:',
                titlePlaceholder: 'Escribe o título da publicación',
                description: 'Descrición:',
                descriptionPlaceholder: 'Escribe a descrición da publicación',
                postImage: "Subir Imaxe:",
                preview: 'Vista previa:',
                publish: 'Publicar',
                publishing: 'Publicando...',
                notAllFields: "Por favor, completa todos os campos e sube unha imaxe.",
                error: "Ocorreu un erro ao publicar a publicación:"
            },
            viewValidationUser: {
                title: 'Validar usuarios',
                user: 'Usuario Nº',
                userType: 'Tipo de usuario:',
                student: 'Estudante',
                teacher: 'Profesor',
                admin: 'Administrador',
                class: 'Clase:',
                user: 'Usuario:',
                banner: 'Cabeceira:',
                profile: "Perfil:",
                validate: 'Validar',
                delete: 'Eliminar',
                unknown: 'Descoñecido'
            },
            ViewValidationUpdate: {
                title: 'Validar/Actualizar usuarios',
                user: 'Usuario Nº:',
                userType: 'Tipo de usuario:',
                student: 'Estudante',
                teacher: 'Profesor',
                admin: 'Administrador',
                class: 'Clase:',
                user: 'Usuario:',
                banner: 'Cabeceira:',
                profile: "Perfil:",
                validate: 'Validar',
                delete: 'Eliminar',
                unknown: 'Descoñecido'
            },
            viewRequest: {
                coments: 'Comentarios',
                comentPlaceholder: 'Escribe un comentario!',
                seeMore: 'Ver máis',
                seeLess: 'Ver menos',
                availability: 'Dispoñibilidade',
                from: 'De',
                to: 'a'
            },
            ViewReportUser: {
                title: 'Usuarios reportados',
                report: 'Informe Nº',
                status: 'Estado:',
                pending: 'Pendente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Data:',
                userReporting: 'Usuario que reporta:',
                userReported: 'Usuario reportado:',
                report: 'Informe:',
                delete: 'Eliminar'
            },
            ViewReportPublicacio: {
                title: 'Publicacións reportadas',
                report: 'Informe Nº',
                status: 'Estado:',
                pending: 'Pendente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Data:',
                userReporting: 'Usuario que reporta:',
                userPost: 'Usuario da publicación:',
                postTitle: 'Título da publicación:',
                postDescription: 'Descrición da publicación:',
                report: 'Informe:',
                reportedImage: 'Imaxe reportada:',
                viewImage: 'Ver imaxe',
                delete: 'Eliminar'
            },
            ViewMyPublicationItem: {
                availability: "Dispoñibilidade:",
                reports: "Reportes:",
                date: "Data:",
                pending: "Pendente de revisar",
                reported: "Reportado",
                published: "Publicado",
                textNotVerified: "Texto non verificado por IA",
                textVerified: "Texto verificado por IA",
                imgNotVerified: "Imaxe non verificada por IA",
                imgVerified: "Imaxe verificada por IA",
                available: "Dispoñible",
                notAvailable: "Non dispoñible"
            },
            ViewReportComments: {
                title: 'Comentarios reportados',
                report: 'Informe Nº',
                status: 'Estado:',
                pending: 'Pendente',
                reviewing: 'Revisando',
                reviewed: 'Revisado',
                date: 'Data:',
                comment: 'Comentario:',
                reportingUser: 'Usuario que reporta:',
                commentUser: 'Usuario que escribiu o comentario:',
                report: 'Informe:',
                delete: 'Eliminar'
            },
            viewPost: {
                comentaris: 'Comentarios'
            },
            viewPeopleMentoria: {
                chat: 'Chat'
            },
            myRequests: {
                title: 'As miñas peticións',
                noRequests: 'Non tes peticións'
            },
            myRequest: {
                availability: "Dispoñibilidade",
                reports: "Reportes:",
                date: "Datas:",
                processing: "Pendente de revisar",
                reported: "Reportado",
                posted: "Publicado",
                textNotVerified: "Texto non verificado por IA",
                textVerified: "Texto verificado por IA",
                imgNotVerified: "Imaxe non verificada por IA",
                imgVerified: "Imaxe verificada por IA"
            },
            myPublications: {
                title: 'As miñas publicacións',
                noPublications: 'Non tes publicacións'
            },
            subMenu: {
                hi: "Ola,",
                profile: "Perfil",
                publications: "As miñas publicacións",
                request: "As miñas peticións",
                admin: "Admin",
                statistics: "Estatísticas"
            },
            requestPost: {
                title: 'Engadir unha petición:',
                uploadImage: 'Subir imaxe:',
                availability: 'Dispoñible:',
                addAvailability: '+ Engadir dispoñibilidade',
                selectDay: 'Selecciona un día',
                startTime: 'Hora de inicio',
                endTime: 'Hora de fin',
                publishing: 'Publicando...',
                titlePlaceholder: 'Título',
                DescriptionPlaceholder: 'En que pensas?'
            },
            notificationList: {
                title: "Notificacións",
                all: "Todas",
                comments: "Comentarios",
                publications: "Publicacións",
                noNotifications: "Non hai notificacións que mostrar"
            },
            navBar: {
                home: 'Inicio',
                search: 'Buscar',
                upload: 'Subir',
                chat: 'Chat'
            },
            loading: {
                title: 'Cargando...'
            },
            headerVerification: {
                title: "Páxina de verificación",
                validationUser: "Verificación de usuario",
                validationPost: "Verificación de publicación"
            },
            headerReport: {
                title: "Páxina de reportes",
                reportUser: "Ver reporte de usuario",
                reportPost: "Ver reporte de publicación",
                reportComment: "Ver reporte de comentario"
            },
            header: {
                report: 'Reportar',
                validation: 'Validación',
                services: 'Servizos',
                comunity: 'Comunidade',
                mentors: 'Mentores',
                request: 'Peticiones'
            },
            formNewDataUsers: {
                title: 'Formulario de usuario',
                showForm: 'Mostrar formulario',
                hideForm: 'Ocultar formulario',
                name: 'Nome',
                profilePicture: 'Foto de perfil',
                banner: 'Cabeceira',
                city: 'Cidade',
                linkDiscord: 'Enlace a Discord',
                linkGithub: 'Enlace a Github',
                submit: 'Gardar usuario',
                tags: 'Etiquetas (JSON)',
                tagsExample: 'Exemplo de formato: ["JavaScript", "Python", "React"]',
                availability: 'Dispoñibilidade (JSON)',
                availabilityExample: 'Exemplo de formato: {"monday":"9:00-12:00", "friday":"9:00-12:00"}'
            },
            post: {
                title: 'Engadir unha publicación',
                titlePlaceholder: 'Título',
                postDescriptionPlaceholder: 'En que pensas?',
                maxChar: 'Máximo 230 caracteres',
                publish: 'Publicar'
            },
            calendar: {
                title: 'Horario de dispoñibilidade',
                day: 'Día',
                availability: 'Horas dispoñibles',
                monday: 'Luns',
                tuesday: 'Martes',
                wednesday: 'Mércores',
                thursday: 'Xoves',
                friday: 'Venres',
                saturday: 'Sábado',
                sunday: 'Domingo'
            },
            menu: {
                comunity: 'Comunidade',
                mentors: 'Mentores',
                request: 'Peticiones',
                share: 'Compartir'
            }
        }
        
    },
    
})

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')

export function changeLocale(locale) {
    i18n.global.locale = locale
}