import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import bootstrap from './bootstrap'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/css/main.css'

const app = createApp(App)
app.use(router)
app.use(bootstrap)
app.mount('#app')
