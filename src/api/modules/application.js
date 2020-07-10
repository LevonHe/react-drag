import request from '@/api/request';

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
