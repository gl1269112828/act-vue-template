import request from '@/utils/request'

export function getUser(data) { return request({ url: '/api/v1/sysUsers/pageSearch', method: 'post', data }) }
export function addOrEditUser(data) { return request({ url: '/api/v1/sysUsers/createOrEdit', method: 'post', data }) }
export function resetPassword(data) { return request({ url: '/api/v1/sysUsers/resetPassword', method: 'post', data }) }
export function deleteUser(params) { return request({ url: '/api/v1/sysUsers/remove', method: 'post', params }) }
export function getRole(data) { return request({ url: '/api/v1/sysRole/pageSearch', method: 'post', data }) }
export function addOrEditRole(data) { return request({ url: '/api/v1/sysRole/createOrEdit', method: 'post', data }) }
export function deleteRole(params) { return request({ url: '/api/v1/sysRole/remove', method: 'post', params }) }
export function permissionRoleTree(data) { return request({ url: "/api/v1/sysMenus/getMenusSetRole", method: "POST", data }) }
export function permissionRole(data) { return request({ url: "/api/v1/sysRole/setRolePermission", method: "POST", data }) }
export function getMenus(data) { return request({ url: '/api/v1/sysMenus/pageSearch', method: 'post', data }) }
export function addOrEditMenus(data) { return request({ url: '/api/v1/sysMenus/createOrEdit', method: 'post', data }) }
export function deleteMenus(params) { return request({ url: '/api/v1/sysMenus/remove', method: 'post', params }) }
export function getOperate(data) { return request({ url: '/api/v1/sysOperate/pageSearch', method: 'post', data }) }
export function addOrEditOperate(data) { return request({ url: '/api/v1/sysOperate/createOrEdit', method: 'post', data }) }
export function deleteOperate(params) { return request({ url: '/api/v1/sysOperate/remove', method: 'post', params }) }




