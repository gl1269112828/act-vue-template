import axios from 'axios';
import { Notification } from 'element-ui';
import router from '@/router';
import { resetRouter } from '@/router';
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 15000 // request timeout
});

service.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/*
 *请求状态
 * @param { code } 1: 请求成功  401: 表示token失效  其余抛出错误message
 */

service.interceptors.response.use(
  response => {
    const data = response.data;
    if (data.code === 200) {
      return data;
    } else if (data.code == 401) {
      Notification.error({ title: '错误', message: '登陆超时,请重新登录' });
      sessionStorage.clear(); //token失效后这边需要把token清除掉
      router.push({ name: 'login' });
    } else {
      Notification.error({ title: '错误', message: data.msg });
      return Promise.reject(data.msg);
    }
  },
  error => {
    if (error.response.status == 401) {
      sessionStorage.clear(); //token失效后这边需要把token清除掉
      resetRouter();
      Notification.error({ title: '错误', message: '登陆超时,请重新登录' });
      router.push({ name: 'login' });
    } else {
      return Promise.reject(error);
    }
  }
);

export default service;
