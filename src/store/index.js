import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import setting from './modules/setting';
import login from './modules/login';
import common from './modules/common'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    setting,
    login,
    common
  },
  getters,
});

export default store;
