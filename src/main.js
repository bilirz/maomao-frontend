import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css'

store.dispatch('fetchSessionData').then(() => {
  const app = createApp(App);

  app.use(store);
  app.use(router);
  app.use(ElementPlus);

  // 全局注册element-plus icon
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  app.mount('#app');

  // 移除加载器
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none';
  }
});