// import './assets/m</div>ain.css'
// import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import "../node_modules/flag-icons/css/flag-icons.min.css";

import { createI18n } from 'vue-i18n'
import es from './assets/languages/es.json'
import ca from './assets/languages/ca.json'
import zh from './assets/languages/zh.json'
import de from './assets/languages/de.json'
import ur from './assets/languages/ur.json'
import pt from './assets/languages/pt.json'
import ja from './assets/languages/ja.json'
import eu from './assets/languages/eu.json'
import gl from './assets/languages/gl.json'
import en from './assets/languages/en.json'





const app = createApp(App)

const i18n = createI18n({
    locale: 'ca',
    messages: {
        "en":en,
        "es": es,
        "ca": ca,
        "zh": zh,
        "de": de,
        "ur": ur,
        "pt": pt,
        "ja": ja,
        "eu": eu,
        "gl": gl 
        
    },
    
})

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')

export function changeLocale(locale) {
    i18n.global.locale = locale
}