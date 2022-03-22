import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false });

const whiteList = ['/']; //白名单列表

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    const isToken = sessionStorage.getItem('accessToken');

    if (isToken) {
      if (!store.getters.dynamicRouter.length) {
        const routers = await store.dispatch('common/constructRouter');
        router.addRoutes([...routers]);
        next({ ...to, replace: true });
      } else {
        if (to.meta.title !== '首页') {
          await store.dispatch('login/getButtonAuthority', to.query.id);
        }
        next();
      }
    } else {
      next('/');
    }
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
