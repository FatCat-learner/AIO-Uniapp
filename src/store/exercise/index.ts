import type { IExerciseState } from './types';
import type { IExerciseBrief, IExerciseQuery } from '@/api/exercise/types';
import { defineStore } from 'pinia';
import {
  fetchExerciseFilters,
  fetchExercises,
  toggleExerciseFavorite,
} from '@/api/exercise';
import useAuthStore from '@/store/auth';
/** 一页 20：1267 条不要一次拉全，列表与选择器都按这个尺寸翻 */
const PAGE_SIZE = 20;

/** 筛选条件的唯一出处：列表 / 翻页 / z-paging 分页都从这里拼 query，避免三处漂移 */
type QueryState = Pick<
  IExerciseState,
  'keyword' | 'bodyPart' | 'muscle' | 'equipment' | 'category' | 'favoriteOnly' | 'sort'
>;

function buildQuery(state: QueryState, limit: number, offset: number): IExerciseQuery {
  return {
    q: state.keyword,
    body_part: state.bodyPart,
    muscle: state.muscle,
    equipment: state.equipment,
    category: state.category,
    favorite_user: state.favoriteOnly || undefined,
    sort: state.sort,
    limit,
    offset,
  };
}

const useExerciseStore = defineStore('exercise', {
  state: (): IExerciseState => ({
    items: [],
    total: 0,
    version: '',
    loading: false,
    loadingMore: false,
    failed: false,
    keyword: '',
    bodyPart: '',
    muscle: '',
    equipment: '',
    category: '',
    sort: 'default',
    favoriteOnly: false,
    offset: 0,
    limit: PAGE_SIZE,
    filters: { body_part: [], equipment: [], category: [] },
    favoriteMap: {},
  }),

  getters: {
    /** 还有没有下一页 */
    hasMore(state): boolean {
      return state.items.length < state.total;
    },
    /** 是否处于筛选态（决定列表顶部要不要出「清空筛选」） */
    isFiltered(state): boolean {
      return Boolean(
        state.keyword || state.bodyPart || state.muscle || state.equipment || state.category || state.favoriteOnly,
      );
    },
    /** 部位计数：左栏角标直接读，没有该部位时不显示 0 */
    countOfBodyPart(state) {
      return (value: string) =>
        state.filters.body_part.find(entry => entry.value === value)?.count ?? 0;
    },
    countOfEquipment(state) {
      return (value: string) =>
        state.filters.equipment.find(entry => entry.value === value)?.count ?? 0;
    },
    /** 当前收藏态：本地覆盖优先（列表不返回收藏字段，默认 false） */
    isFavorited(state) {
      return (id: string): boolean => state.favoriteMap[id] ?? false;
    },
  },

  actions: {
    /** 拉第一页：筛选变化 / 进页都走这里，会把 offset 归零 */
    async fetchList(): Promise<void> {
      this.loading = true;
      this.failed = false;
      this.offset = 0;
      try {
        const page = await fetchExercises(buildQuery(this, this.limit, 0));
        this.items = page.items;
        this.total = page.total;
        this.version = page.version;
      }
      catch {
        // 报错文案由 request 层统一 toast，这里只留状态给空态用
        this.failed = true;
        this.items = [];
        this.total = 0;
      }
      finally {
        this.loading = false;
      }
    },

    /** 触底加载下一页 */
    async loadMore(): Promise<void> {
      if (this.loading || this.loadingMore || !this.hasMore)
        return;
      this.loadingMore = true;
      try {
        const page = await fetchExercises(buildQuery(this, this.limit, this.items.length));
        this.items = [...this.items, ...page.items];
        this.total = page.total;
      }
      finally {
        this.loadingMore = false;
      }
    },

    /** z-paging 分页口径：pageNo 从 1 起，不改 items（z-paging 自己管 list） */
    async fetchPage(pageNo: number, pageSize: number): Promise<{ list: IExerciseBrief[]; total: number }> {
      const page = await fetchExercises(buildQuery(this, pageSize, (pageNo - 1) * pageSize));
      return { list: page.items, total: page.total };
    },

    /** 筛选项计数：进页拉一次就够，切筛选不用重拉 */
    async fetchFilters(): Promise<void> {
      try {
        this.filters = await fetchExerciseFilters();
      }
      catch {
        // 计数拉不到不影响列表本身，静默降级成「不显示角标」
      }
    },

    /** 换部位 / 器械 / 品类：都是单选，重复点同一个等于取消该筛选 */
    setBodyPart(value: string): void {
      this.bodyPart = this.bodyPart === value ? '' : value;
      // 换一级部位时二级肌群必须归零，否则会出现「腿 + back.lat」这种互斥组合
      this.muscle = '';
      this.offset = 0;
    },
    /** 二级肌群：点号 id（back.lat），空串 = 该部位全部 */
    setMuscle(value: string): void {
      this.muscle = value;
      this.offset = 0;
    },
    setEquipment(value: string): void {
      this.equipment = this.equipment === value ? '' : value;
      this.offset = 0;
    },
    setCategory(value: string): void {
      this.category = this.category === value ? '' : value;
      this.offset = 0;
    },
    setKeyword(value: string): void {
      this.keyword = value.trim();
      this.offset = 0;
    },
    setSort(value: IExerciseState['sort']): void {
      this.sort = value;
      this.offset = 0;
    },
    setFavoriteOnly(value: boolean): void {
      // 未登录点「只看收藏」直接不生效：后端会 401，不如在这里挡掉
      if (value && !useAuthStore().access_token) {
        uni.showToast({ title: '登录后可查看收藏', icon: 'none' });
        return;
      }
      this.favoriteOnly = value;
      this.offset = 0;
    },
    /** 一键清空筛选，保留排序 */
    clearFilters(): void {
      this.keyword = '';
      this.bodyPart = '';
      this.muscle = '';
      this.equipment = '';
      this.category = '';
      this.favoriteOnly = false;
      this.offset = 0;
    },

    /** 收藏切换：先乐观更新本地，失败回滚（不重拉列表，否则整页跳动） */
    async toggleFavorite(id: string): Promise<void> {
      const before = this.isFavorited(id);
      this.favoriteMap[id] = !before;
      try {
        const result = await toggleExerciseFavorite(id);
        this.favoriteMap[id] = result.favorited;
      }
      catch {
        this.favoriteMap[id] = before;
      }
    },
  },
});

export default useExerciseStore;
