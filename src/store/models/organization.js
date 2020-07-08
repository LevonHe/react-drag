export default {
  namespace: 'organization',
  state: {
    orgArr: [],
    list: [],
    mylist: [],
  },
  effects: {},
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
