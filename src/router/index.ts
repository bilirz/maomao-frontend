import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '主页',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/log',
    name: '开发日志',
    component: () => import('@/views/log.vue')
  },
  {
    path: '/about',
    name: '关于本网站',
    component: () => import('@/views/about.vue')
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('@/views/faq.vue')
  },
  {
    path: '/member',
    name: '创作中心',
    component: () => import('@/views/fatherContainer.vue'),
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
    component: () => import('@/views/fatherContainer.vue'),
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
      },
      {
        path: 'setting',
        name: '修改个人信息',
        meta: { layout: 'form' },
        component: () => import('@/views/user/setting.vue')
      }
    ]
  },
  {
    path: '/video/:aid',
    component: () => import('@/views/video/detail.vue')
  },
  {
    path: '/space/:uid',
    component: () => import('@/views/space/index.vue')
  },
  { 
  path: '/admin',
  name: '管理员',
  component: () => import('@/views/fatherContainer.vue'),
  children: [
    {
      path: 'hidevideo',
      name: '隐藏视频',
      meta: { layout: 'form' },
      component: () => import('@/views/admin/hideVideo.vue')
    }
  ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


import { useUserStore } from '../store/userStore';

router.beforeEach(async (to, _from, next) => {
  document.title = `${String(to.name || to.params.aid || to.params.uid)} - 猫猫站`;

  const userStore = useUserStore();
  
  if (userStore.sessionData.isload == false) {
    await userStore.fetchSessionData();    
  }

  const { signin, status } = userStore.sessionData;
  

  if (signin && (to.path === '/user/signup' || to.path === '/user/signin')) {
    next('/');
    return;
  }

  if (!signin && (to.path === '/member/upload' || to.path === '/user/setting')) {
    next('/user/signin');
    return;
  }
  // TODO: 这只是一个应急方式，后续需要改成动态路由
  if (status !== 1 && to.path === '/admin/hidevideo') {
    next('/');
    return;
  }

  next();
});

export default router;