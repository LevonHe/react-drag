import { login, register } from '@/api/api';
import MsgService from '@/util/MsgService';
import CookieService from '@/util/CookieService';

export default {
  namespace: 'user',
  state: {
    status: undefined,
    currentUser: {},
  },
  effects: {
    // 登录
    * login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response && response.code === 200) {
        const { token } = response.data;
        CookieService.delCookie('Drag-Token');
        CookieService.setCookie('Drag-Token', token);
        MsgService.success('登录成功');
        window.location.href = window.location.protocol + '//' + window.location.host + '/drag';
      } else {
        MsgService.error(response.msg || '登录失败，请稍后重试');
      }
    },
    // 注册
    * register({ payload }, { call, put }) {
      const response = yield call(register, payload);
      if (response && response.code === 200) {
        MsgService.success(response.msg);
        window.location.href = window.location.protocol + '//' + window.location.host + '/login';
      } else {
        MsgService.error(response.msg || '注册失败，请稍后重试');
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
