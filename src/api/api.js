import request from '@/api/request';

// 登录
export async function login(data) {
  return request({
    url: '/api/user/login',
    method: 'POST',
    data,
  });
}

// 注册
export async function register(data) {
  return request({
    url: '/api/user/register',
    method: 'POST',
    data,
  });
}

// 获取当前用户的pageCode（currentView）
export async function getPageCode(params) {
  return request({
    url: '/api/page',
    method: 'GET',
    params,
  });
}

// 更新当前用户的pageCode（currentView）
export async function putPageCode(data) {
  return request({
    url: '/api/page',
    method: 'PUT',
    data,
  });
}

// 创建组织
export async function createOrganization(data) {
  return request({
    url: '/api/organization',
    method: 'POST',
    data,
  });
}

// 获取当前用户下的组织
export async function getOrgArr(params) {
  return request({
    url: '/api/organization',
    method: 'GET',
    params,
  });
}

// 获取当前组织列表
export async function getOrganizationList(params) {
  return request({
    url: '/api/organization/list/all',
    method: 'GET',
    params,
  });
}

// 获取当前个人所在组织列表
export async function getPersonalOrganizationList(params) {
  return request({
    url: '/api/organization/list/personal',
    method: 'GET',
    params,
  });
}

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
export async function getPublicComponents(params) {
  return request({
    url: '/api/component/public',
    method: 'GET',
    params,
  });
}

// 获取组织组件列表
export async function getOrganizationComponents(params) {
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

// 提出当前用的申请
export async function postApplication(data) {
  return request({
    url: '/api/application',
    method: 'POST',
    data,
  });
}

// 获取当前应用列表
export async function getApplicationList(params) {
  return request({
    url: '/api/application/all',
    method: 'GET',
    params,
  });
}

// 回复关于进入组织的申请
export async function replyApplication(data) {
  return request({
    url: '/api/application',
    method: 'PUT',
    data,
  });
}
