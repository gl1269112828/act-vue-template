import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/layout/index';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/index')
  },
  // {
  //   path: '/home',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/',
  //       name: 'home',
  //       component: () => import('@/views/home/index'),
  //       meta: { title: '首页' }
  //     }
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   meta: { title: '基础数据管理' },
  //   children: [
  //     {
  //       path: '/sysUser',
  //       name: 'sysUser',
  //       component: () => import('@/views/system/sysUser/index'),
  //       meta: { title: '系统用户' }
  //     },
  //     {
  //       path: '/role',
  //       name: 'role',
  //       component: () => import('@/views/system/role/index'),
  //       meta: { title: '角色管理' }
  //     },
  //     {
  //       path: '/menu',
  //       name: 'menus',
  //       component: () => import('@/views/system/menu/index'),
  //       meta: { title: '菜单管理' }
  //     },
  //     {
  //       path: '/operate',
  //       name: 'operate',
  //       component: () => import('@/views/system/operate/index'),
  //       meta: { title: '按钮管理' }
  //     }
  //   ]
  // },
  // {
  //   path: '/configManage',
  //   component: Layout,
  //   children: [
  //     {
  //       path: '/automatedConfiguration',
  //       name: 'automatedConfiguration',
  //       component: () => import('@/views/configManage/automatedConfiguration/index'),
  //       meta: { title: '配置页面' }
  //     }
  //   ]
  // },
];

const createRouter = () =>
  new Router({
    mode: 'hash', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
  });

const router = createRouter();
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
