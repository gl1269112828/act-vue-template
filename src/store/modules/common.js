import Layout from '@/layout/index';

const getDefaultState = () => {
  return {
    dynamicRouter: []
  };
};
const state = getDefaultState();
const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_DYNANICROUTER: (state, dynamicRouter) => {
    state.dynamicRouter = dynamicRouter;
  }
};
const actions = {
  initObj({}, parm) {
    return new Promise((resolve, reject) => {
      Object.keys(parm).forEach(key => {
        parm[key] = undefined;
      });
      resolve(parm);
    });
  },
  //构建路由
  constructRouter({ dispatch, commit }) {
    return new Promise(async (resolve, reject) => {
      const menus = await this.dispatch('login/getMenu');
      // console.log(JSON.parse(JSON.stringify(menus)));

      let defaultRouters = [];
      let dynamicConfigurations = [{ path: '/configPage', component: Layout, children: [] }];

      const getRouters = (array, parentObj, parentPath) => {
        for (let i = 0; i < array.length; i++) {
          let item = array[i],
            purePath = item.path,
            currentPath;

          // item.path.indexOf('?') > -1 ? (purePath = item.path.substring(0, item.path.indexOf('?'))) : (purePath = item.path);

          parentPath ? (currentPath = `${parentPath}${purePath}`) : (currentPath = item.path);

          let currentObj = {
            path: purePath,
            meta: { title: item.title, icon: item.icon, key: item.key, id: item.id },
            children: []
          };

          if (parentObj) {
            if (!!item.key) {
              currentObj['component'] = resolve => require(['@/components/configPage/pages/index.vue'], resolve);
              dynamicConfigurations[0].children.push(currentObj);
            } else {
              currentObj['component'] = resolve => require([`@/views${currentPath}/index.vue`], resolve);
              parentObj.children.push(currentObj);
            }
          } else {
            if (!!item.key) {
              currentObj['component'] = resolve => require(['@/components/configPage/pages/index.vue'], resolve);
              dynamicConfigurations[0].children.push(currentObj);
            } else {
              currentObj['component'] = Layout;
              defaultRouters.push(currentObj);
            }
          }

          if (item.children && item.children.length) {
            getRouters(item.children, currentObj, purePath);
          } else {
            if (!item.key && !parentObj) {
              delete defaultRouters[i].meta;
              defaultRouters[i].children.push({
                path: '/',
                component: () => import(`@/views${purePath}/index.vue`),
                meta: { title: item.title, icon: item.icon, key: item.key, id: item.id },
                children: []
              });
            }
          }
        }
        return [...defaultRouters, ...dynamicConfigurations];
      };

      const routers = getRouters(menus);

      // console.log(JSON.parse(JSON.stringify(routers)));

      commit('SET_DYNANICROUTER', routers);

      resolve(routers);
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
