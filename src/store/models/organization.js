import {
  createOrganization,
  getOrgArr,
  getOrganizationList,
  getPersonalOrganizationList,
  postApplication,
} from '@/api/api';
import MsgService from '@/util/MsgService';

export default {
  namespace: 'organization',
  state: {
    orgArr: [],
    list: [],
    mylist: [],
  },
  effects: {
    // 创建组织，每个用户都可以创建组织
    * createOrganization({ payload }, { call, put }) {
      const response = yield call(createOrganization, payload);
      if (response) {
        MsgService.success(response.msg);
      } else {
        MsgService.error(response.msg);
      }
    },
    * getOrgArr(_, { call, put }) {
      const response = yield call(getOrgArr);
      if (response && response.code === 200) {
        yield put({
          type: 'setOrgArr',
          payload: response.data.orgArr,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
    * getOrganizationList(_, { call, put }) {
      const response = yield call(getOrganizationList);
      if (response && response.code === 200) {
        yield put({
          type: 'setOrganizationList',
          payload: response.data.list,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
    * getPersonalOrganizationList(_, { call, put }) {
      const response = yield call(getPersonalOrganizationList);
      if (response && response.code === 200) {
        yield put({
          type: 'setPersonalOrganizationList',
          payload: response.data.list,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
    * postApplication({ payload }, { call, put }) {
      const response = yield call(postApplication, payload);
      if (response && response.code === 200) {
        MsgService.success('已发送请求' || response.msg);
      } else {
        MsgService.error(response.msg);
      }
    },
  },
  reducers: {
    setOrgArr(state, { payload }) {
      return { ...state, orgArr: payload };
    },
    setOrganizationList(state, { payload }) {
      return { ...state, list: payload };
    },
    setPersonalOrganizationList(state, { payload }) {
      return { ...state, mylist: payload };
    },
  },
};
