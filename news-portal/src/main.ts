import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import router from './router' 
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

createApp(App)
  .use(pinia)
  .use(router)  
  .use(VueToast) 
  .mount('#app')