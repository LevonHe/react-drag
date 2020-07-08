import axios from 'axios';
import { message } from 'antd';
import CookieService from '@/util/CookieService';
import { baseUrl } from './baseUrl';

const service = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache',
    Pragma: 'no-cache',
  },
});

// request interceptors
service.interceptors.request.use(
  (config) => {
    if (
      config.url.indexOf('login') === -1 &&
      config.url.indexOf('verification_code') === -1 &&
      config.url.indexOf('register') === -1 &&
      config.url.indexOf('forget_credential') === -1
    ) {
      const token = CookieService.getCookie('_token');
      if (!token) {
        config.url = '';
        window.location.href = window.location.protocol + '//' + window.location.host + '/login';
      }
      config.headers.Authorization = token;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// response interceptors
service.interceptors.response.use(
  (response) => {
    let res = {};
    // 物模型导出
    if (response.config.url.includes('/features/export')) {
      res.responseHeader = response.headers['content-disposition'];
      res.data = response.data;
    } else {
      res = response.data;
    }
    if (
      response.status !== 200 &&
      res.status !== 200 &&
      response.status !== 201 &&
      res.status !== 201 &&
      response.status !== 204 &&
      res.status !== 204
    ) {
      message.error(res.message);
      return false;
    }
    return res;
  },
  (err) => {
    if (err.response && err.response.data) {
      return Promise.reject(err.response.data);
    }
    return Promise.reject(err);
  }
);

export default service;
