import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'default-passive-events';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css/normalize.css';
import '@/styles/index.scss';
Vue.use(ElementUI);
Vue.config.productionTip = false;
import '@/routerIntercept.js';

import * as hasBtn from '@/utils/buttonAuthority';
Vue.prototype.$hasBtn = hasBtn;
import LTable from '@/components/LTable';
Vue.use(LTable);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
