import { login, register } from '@/api/api';
import MsgService from '@/util/MsgService';
import CookieService from '@/util/CookieService';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'user',
  state: {
    status: undefined,
    currentUser: {},
  },
  effects: {
    * login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response && response.code === 200) {
        const { token } = response.data;
        CookieService.delCookie('Drag-Token');
        CookieService.setCookie('Drag-Token', token);
        MsgService.success('登录成功');
        yield put(routerRedux.replace('/drag'));
      } else {
        MsgService.error(response.msg || '登录失败，请稍后重试');
      }
    },
    * register({ payload }, { call, put }) {
      const response = yield call(register, payload);
      if (response && response.code === 200) {
        MsgService.success(response.msg);
      } else {
        MsgService.error(response.msg || '注册失败，请稍后重试');
      }
    },
    * logout(_, { put }) {
      CookieService.delCookie('Drag-Token');
      yield put(routerRedux.replace('/login'));
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
