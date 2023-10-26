import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'; 
import { useUserStore } from './store/userStore';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css'
import axios from 'axios';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia); 
app.use(router);
app.use(ElementPlus);

// 全局注册element-plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');

const userStore = useUserStore();

userStore.fetchSessionData().then(() => {
  // 移除加载器
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
  
  // 全局设置 withCredentials
  axios.defaults.withCredentials = true;
});
