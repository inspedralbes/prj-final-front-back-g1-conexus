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
    locale: 'ca',
    messages: {
        es: {
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
