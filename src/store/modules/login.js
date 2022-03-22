import { login, getRoleMenu, getOperateAuthority } from '@/api/login';
import { resetRouter } from '@/router';
let Base64 = require('js-base64').Base64;
const getDefaultState = () => {
  return {
    menus: []
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  }
};

const actions = {
  login({ commit }, userInfo) {
    const { userName, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ name: userName, password: password })
        .then(response => {
          const { data } = response;
          const userObj = JSON.parse(Base64.decode(data.accessToken.split('.')[1]));
          const userInfo = {
            userName: userObj['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            userId: parseInt(userObj['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid']),
            roleId: parseInt(userObj['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
          };
          sessionStorage.setItem('accessToken', data.accessToken);
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getMenu({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      const roleId = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleId);
      getRoleMenu({ roleId, roleId }).then(response => {
        const { data } = response;
        commit('SET_MENUS', data);
        resolve(data);
      });
    });
  },

  getButtonAuthority({ dispatch, commit }, menuId) {
    return new Promise((resolve, reject) => {
      const roleId = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleId);
      getOperateAuthority({ roleId: roleId, menuId: menuId }).then(response => {
        const { datas } = response.data;
        sessionStorage.setItem('authoritys', JSON.stringify(datas));
        resolve(datas);
      });
    });
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      this.commit('common/SET_DYNANICROUTER', []);
      sessionStorage.clear();
      commit('RESET_STATE');
      resetRouter();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
