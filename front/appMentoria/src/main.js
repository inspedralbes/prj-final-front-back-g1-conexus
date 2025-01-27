// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import "../node_modules/flag-icons/css/flag-icons.min.css";

import { createI18n } from 'vue-i18n'


const app = createApp(App)

const i18n = createI18n({
    locale: 'en',
    messages: {
        es: {
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
            },
            myPublications:{
                title: 'Mis publicaciones',
                noPublications: 'No tienes publicaciones',
            },
            subMenu:{
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
            },
            myPublications:{
                title: 'My publications',
                noPublications: 'You have no publications',
            },
            subMenu:{
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
            viewPost:{
                comentaris: 'Comentaris',
            },
            viewPeopleMentoria:{
                chat: 'Xat',
            },
            myRequests:{
                title: 'Les meves peticions',
                noRequests: 'No tens peticions',
            },
            myRequest:{
                availability:"Disponibilitat:",
                reports:"Reportes:",
                date:"Dates:",
                processing: "Pendent de revisar",
                reported:"Reportat",
                posted: "Publicat",
            },
            myPublications:{
                title: 'Les meves publicacions',
                noPublications: 'No tens publicacions',
            },
            subMenu:{
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
        }
    }
})

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
