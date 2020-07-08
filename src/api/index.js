// eslint-disable-next-line
const files = require.context('./modules', true, /index\.js$/);
const modules = {};

files.keys().forEach((key) => {
  Object.assign(modules, files(key).default);
});

const $api = {
  ...modules,
};

export default $api;
