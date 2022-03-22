import request from '@/utils/request'

export function getPageDetail(data) { return request({ url: `/api/v1/pages/getPageDetail?key=${data}`, method: 'get' }) }

export function getAutomatedConfiguration(data) { return request({ url: '/api/v1/pages/pageSearch', method: 'post', data }) }
export function addOrEditAutomatedConfiguration(data) { return request({ url: '/api/v1/pages/createOrEdit', method: 'post', data }) }
export function deleteConfiguration(params) { return request({ url: '/api/v1/pages/remove', method: 'post', params }) }



export function getConfigTable(data) { return request({ url: '/api/v1/pageConfigs/pageSearch', method: 'post', data }) }
export function addOrEditAutomatedConfigTable(data) { return request({ url: '/api/v1/pageConfigs/createOrEdit', method: 'post', data }) }



export function getMenuButtons(data) { return request({ url: '/api/v1/sysOperate/getMenuOfOperateByRole', method: 'post', data }) }

export function getDictionaryByGroup(data) { return request({ url: `/api/v1/sysDataDictionaries/getDictionaryByGroup?groupName=${data}`, method: 'get' }) }



