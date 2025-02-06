import { createApp } from 'vue'
import App from './App.vue'
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

const messages = {
  es,
  ca,
  zh,
  de,
  ur,
  pt,
  ja,
  eu,
  gl
}

const i18n = createI18n({
  locale: 'ca', // idioma por defecto
  fallbackLocale: 'es',
  messages,
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')