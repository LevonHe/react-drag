const StorageService = {
  _persistRootKey: 'persist:web_2020_root',
  clear() {
    Object.keys(this).forEach((k) => {
      localStorage.removeItem(this[k]);
    });
  },
};

export default StorageService;
