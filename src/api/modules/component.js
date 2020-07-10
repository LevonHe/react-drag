import request from '@/api/request';

// 创建组件
export async function createComponent(data) {
  return request({
    url: '/api/component',
    method: 'POST',
    data,
  });
}

// 获取可用组件
export async function getOwnTemplate(params) {
  return request({
    url: '/api/component',
    method: 'GET',
    params,
  });
}

// 获取个人组件列表
export async function getPersonalComponents(params) {
  return request({
    url: '/api/component/personal',
    method: 'GET',
    params,
  });
}

// 获取公共组件列表
export async function getPublicComponets(params) {
  return request({
    url: '/api/component/public',
    method: 'GET',
    params,
  });
}

// 获取组织组件列表
export async function gerPrganizationComponets(params) {
  return request({
    url: '/api/component/organization',
    method: 'GET',
    params,
  });
}

// 上传图片
export async function uploadFiles(data) {
  return request({
    url: '/api/component/img',
    method: 'POST',
    data,
  });
}

// 获取当前用户的componetCode
export async function getComponentCode(id) {
  return request({
    url: `/api/component/${id}`,
    method: 'GET',
  });
}

// 更新当前用户的componentCode
export async function putComponentCode(id, data) {
  return request({
    url: `/api/component/${id}`,
    method: 'PUT',
    data,
  });
}
