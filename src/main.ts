import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useUserStore } from './store/userStore'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css'
import axios from 'axios'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const app = createApp(App)
const pinia = createPinia()
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  defaults: {
    VBtn: {
      color: '#61aefb',
      variant: 'outlined',
    },
  },
})

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(vuetify)

// 全局注册element-plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

const userStore = useUserStore()

userStore.fetchSessionData().then(() => {
  // 移除加载器
  const loader = document.getElementById('loader')
  if (loader) {
    loader.style.display = 'none'
  }

  // 全局设置 withCredentials
  axios.defaults.withCredentials = true
})
