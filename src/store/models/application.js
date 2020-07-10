import { getApplicationList, replyApplication } from '@/api/api';

export default {
  namespace: 'application',
  state: {
    list: [],
  },
  effects: {
    * getApplicationList(_, { call, put }) {
      const response = yield call(getApplicationList);
      if (response && response.code === 200) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
        return Promise.resolve(response.msg || '请求成功');
      }
      return Promise.reject(response.msg || '请求失败');
    },
    * replyApplication({ payload }, { call }) {
      const response = yield call(replyApplication, payload);
      if (response && response.code === 200) {
        return Promise.resolve(response.msg || '请求成功');
      }
      return Promise.reject(response.msg || '请求失败');
    },
  },
  reducers: {
    saveList(state, { payload }) {
      return { ...state, list: payload };
    },
  },
};
