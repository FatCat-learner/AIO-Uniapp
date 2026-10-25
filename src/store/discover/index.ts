import type { IDiscoverState } from './types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchDiscoverCatalog } from '@/api/discover';

export const useDiscoverStore = defineStore('discover', () => {
  /** 品类种子数据：页面不再直接 import @mocks/data/catalog */
  const catalog = ref<IDiscoverState['catalog']>(fetchDiscoverCatalog());

  /** 收藏种子（与重构前页面里的 reactive favs 完全一致） */
  const favs = ref<Record<string, boolean>>({
    'action:杠铃卧推': true,
    'action:深蹲': true,
    'action:引体向上': true,
    'food:米饭': true,
    'food:鸡胸肉': true,
    'plan:推拉腿 · 上肢增肌': true,
    'plan:减脂启动 · 4 周': true,
    'route:阿姆斯特丹运河环线': true,
    'route:五缘湾晨跑': true,
  });

  const isFav = (key: string) => !!favs.value[key];

  const toggleFav = (key: string) => {
    if (favs.value[key]) delete favs.value[key];
    else favs.value[key] = true;
  };

  return { catalog, favs, isFav, toggleFav };
});
