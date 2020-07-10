import { getPersonalComponents, getOrganizationComponents, getPublicComponents, uploadFiles } from '@/api/api';
import MsgService from '@/util/MsgService';

export default {
  namespace: 'components',
  state: {
    personalList: [],
    publicList: [],
    organizationList: [],
    filePath: '',
  },
  effects: {
    * getPersonalComponents(_, { call, put }) {
      const response = yield call(getPersonalComponents);
      if (response && response.code === 200) {
        yield put({
          type: 'savePersonalComponents',
          payload: response.data,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
    * getPublicComponents(_, { call, put }) {
      const response = yield call(getPublicComponents);
      if (response && response.code === 200) {
        yield put({
          type: 'savePublicComponents',
          payload: response.data,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
    * getOrganizationComponents(_, { call, put }) {
      const response = yield call(getOrganizationComponents);
      if (response && response.code === 200) {
        yield put({
          type: 'saveOrganizationComponents',
          payload: response.data,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
    * uploadFile({ payload }, { call, put }) {
      const response = yield call(uploadFiles, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveFileImg',
          payload: response.data.filename,
        });
        return payload;
      }
      MsgService.error(response.msg);
    },
  },
  reducers: {
    savePersonalComponents(state, { payload }) {
      return { ...state, personalList: payload };
    },
    savePublicComponents(state, { payload }) {
      return { ...state, publicList: payload };
    },
    saveOrganizationComponents(state, { payload }) {
      return { ...state, organizationList: payload };
    },
    saveFileImg(state, { payload }) {
      return { ...state, filePath: payload };
    },
  },
};
