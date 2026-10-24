import type { App } from 'vue';
import { createPinia } from 'pinia';

// pinia 持久化插件
import { createPersistedState } from 'pinia-plugin-persistedstate';
// 导入子模块
import useAuthStore from './auth';

const setupStore = (app: App) => {
  const store = createPinia();

  const piniaPersist = createPersistedState({
    storage: {
      getItem: uni.getStorageSync,
      setItem: uni.setStorageSync,
    },
  });
  store.use(piniaPersist);
  app.use(store);
};

export { useAuthStore };

export default setupStore;
