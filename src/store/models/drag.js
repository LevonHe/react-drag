import {
  getPageCode,
  putPageCode,
  createComponent,
  getOwnTemplate,
  getComponentCode,
  putComponentCode,
} from '@/api/api';
import MsgService from '@/util/MsgService';

export default {
  namespace: 'drag',
  state: {
    currentView: [
      {
        type: 'div',
        nested: true,
        props: {
          style: {
            border: '1px solid red',
            width: '200px',
          },
        },
        children: [],
      },
    ],
    config: {},
    componentView: [],
    componentConfig: {},
    templateList: [],
  },
  effects: {
    // 获取当前用户的currentView
    * getPageCode(_, { call, put }) {
      const response = yield call(getPageCode);
      if (response && response.code === 200) {
        const payload = JSON.parse(response.data.code);
        yield put({
          type: 'saveCurrentView',
          payload,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
    // 更新当前用户的currentView
    * putPageCode({ payload }, { call, put }) {
      const response = yield call(putPageCode, payload);
      if (response) {
        MsgService.success('保存成功' || response.msg);
      } else {
        MsgService.error(response.msg);
      }
    },
    // 获取用户当前组件的componetCode
    * getComponentCode({ payload }, { call, put }) {
      const response = yield call(getComponentCode, payload.id);
      if (response && response.code === 200) {
        const payload = [JSON.parse(response.data.code)];
        yield put({
          type: 'saveComponentView',
          payload,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
    // 更新用户当前组件的componentCode
    * putComponentCode({ payload }, { call, put }) {
      const { id, code } = payload;
      const response = yield call(putComponentCode, id, { code: code[0] });
      if (response) {
        MsgService.success(response.msg);
      } else {
        MsgService.error(response.msg);
      }
    },
    // 设置页面配置
    * setCurrentView({ payload, isPage }, { put }) {
      if (isPage) {
        yield put({ type: 'saveCurrentView', payload });
      } else {
        yield put({ type: 'saveComponentView', payload });
      }
    },
    // 删除当前页面的某个组件
    * removeCurrentView({ payload, isPage }, { put }) {
      if (isPage) {
        yield put({ type: 'saveCurrentView', payload });
        yield put({ type: 'clearArrIndex' });
      } else {
        yield put({ type: 'saveComponentView', payload });
        yield put({ type: 'clearComArrIndex' });
      }
    },
    // 保存当前的页面配置 code
    * setConfig({ payload, isPage }, { put }) {
      if (isPage) {
        yield put({ type: 'saveConfig', payload });
      } else {
        yield put({ type: 'saveComponentConfig', payload });
      }
    },
    // 将组件提交后台保存
    * setTemplateList({ payload }, { call, put }) {
      const response = yield call(createComponent, payload);
      if (response && response.code === 200) {
        MsgService.success(response.msg);
      } else {
        MsgService.error(response.msg);
      }
    },
    // 获取个人可用组件
    * getOwnTemplate(_, { call, put }) {
      const response = yield call(getOwnTemplate);
      if (response && response.code === 200) {
        yield put({
          type: 'saveTemplateList',
          payload: response.data,
        });
      } else {
        MsgService.error(response.msg);
      }
    },
  },
  reducers: {
    saveCurrentView(state, { payload }) {
      return { ...state, currentView: payload };
    },
    saveComponentView(state, { payload }) {
      return { ...state, componentView: payload };
    },
    saveConfig(state, { payload }) {
      return { ...state, config: { ...state.config, ...payload } };
    },
    saveComponentConfig(state, { payload }) {
      return { ...state, componentConfig: { ...state.componentConfig, ...payload } };
    },
    clearArrIndex(state) {
      return { ...state, config: { ...state.config, arrIndex: '' } };
    },
    clearComArrIndex(state) {
      return { ...state, componentConfig: { ...state.componentConfig, arrIndex: '' } };
    },
    saveTemplateList(state, { payload }) {
      return { ...state, templateList: payload };
    },
  },
};
