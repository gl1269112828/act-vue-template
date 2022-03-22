import request from '@/utils/request'

export function login(data) { return request({ url: '/api/v1/sysUsers/auth/token', method: 'POST', data }) }
export function getUserInfo(data) { return request({ url: '/api/v1/sysUsers/auth/token', method: 'POST', data }) }
export function getRoleMenu(data) { return request({ url: '/api/v1/sysMenus/getMenusByRole', method: 'POST', data }) }
export function getOperateAuthority(data) { return request({ url: "/api/v1/sysOperate/getMenuOfOperate", method: "POST", data }) }

export function uploadFile(data) { return request({ url: "/api/v1/utils/uploadImages", method: "POST", data }) }

