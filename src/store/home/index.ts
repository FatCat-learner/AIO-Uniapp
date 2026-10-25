import type { IHomeState } from './types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchHomeData } from '@/api/home';

export const useHomeStore = defineStore('home', () => {
  /** 卡片流数据：页面与 9 张卡片共用，页面不再直接 import @mocks/data/home */
  const data = ref<IHomeState['data']>(fetchHomeData());

  /** Dock FAB 开合：由 AppTabBar 触发、HomeTrainingSheet 消费 */
  const fabOpen = ref<IHomeState['fabOpen']>(false);

  const openFab = () => {
    fabOpen.value = true;
  };

  const closeFab = () => {
    fabOpen.value = false;
  };

  const toggleFab = () => {
    fabOpen.value = !fabOpen.value;
  };

  return { data, fabOpen, openFab, closeFab, toggleFab };
});
