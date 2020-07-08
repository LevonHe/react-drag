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
    *setCurrentView({ payload, isPage }, { put }) {
      if (isPage) {
        yield put({ type: 'saveCurrentView', payload });
      } else {
        yield put({ type: 'saveComponentView', payload });
      }
    },
    *removeCurrentView({ payload, isPage }, { put }) {
      if (isPage) {
        yield put({ type: 'saveCurrentView', payload });
        yield put({ type: 'clearArrIndex' });
      } else {
        yield put({ type: 'saveComponentView', payload });
        yield put({ type: 'clearComArrIndex' });
      }
    },
    *setConfig({ payload, isPage }, { put }) {
      if (isPage) {
        yield put({ type: 'saveConfig', payload });
      } else {
        yield put({ type: 'saveComponentConfig', payload });
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
  },
};
