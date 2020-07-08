import request from '@/api/request';

// 登录
export const example = (params, data) =>
  request({
    url: '/api/v1/example',
    method: 'GET',
    params,
    data,
  });
