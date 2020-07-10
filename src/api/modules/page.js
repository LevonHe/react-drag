import request from '@/api/request';

// 获取当前用户的pageCode（currentView）
export async function getPageCode(params) {
  return request({
    url: '/api/page',
    method: 'GET',
    params,
  });
}

// 更新当前用户的pageCode
export async function putPageCode(data) {
  return request({
    url: '/api/page',
    method: 'PUT',
    data,
  });
}
