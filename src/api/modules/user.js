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
