import request from '@/api/request';

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

// 获取当前个人所在组织列表
export async function getPersonalOrganizationList(params) {
  return request({
    url: '/api/organization/list/personal',
    method: 'GET',
    params,
  });
}
