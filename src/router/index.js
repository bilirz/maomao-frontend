import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: '主页',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/member',
    name: '创作中心',
    children: [
      {
        path: 'upload',
        name: '上传',
        meta: { layout: 'form' },
        component: () => import('@/views/member/upload.vue')
      },
    ]
  },
  {
    path: '/user',
    name: '我的信息',
    children: [
      {
        path: 'signin',
        name: '登录',
        meta: { layout: 'form' },
        component: () => import('@/views/user/signin.vue')
      },
      {
        path: 'signup',
        name: '注册',
        meta: { layout: 'form' },
        component: () => import('@/views/user/signup.vue')
      }
    ]
  },
  {
    path: '/video/:aid',
    component: () => import('@/views/video/detail.vue')
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})


import store from '../store/index.js';

router.beforeEach((to, from, next) => {
  document.title = `${to.name || to.params.aid} - 猫猫站`;

  const { signin } = store.state.sessionData;

  if (signin && (to.path === '/user/signup' || to.path === '/user/signin')) {
    next('/');
    return;
  }

  if (!signin && to.path === '/member/upload') {
    next('/user/signin');
    return;
  }

  next();
});

export default router