import type {
  ExerciseSort,
  IExerciseBrief,
  IExerciseFilters,
} from '@/api/exercise/types';

/** 动作库列表状态：筛选条件是「唯一真相」，翻页只追加 items */
export interface IExerciseState {
  items: IExerciseBrief[];
  total: number;
  /** 后端给的版本串，变了说明库有更新 */
  version: string;
  loading: boolean;
  /** 正在加载下一页（下拉到底时的转圈，不要盖住已有列表） */
  loadingMore: boolean;
  failed: boolean;
  keyword: string;
  bodyPart: string;
  /** 二级肌群（点号 id，如 back.lat）；空串 = 不限 */
  muscle: string;
  equipment: string;
  category: string;
  sort: ExerciseSort;
  /** 只看收藏（未登录时置 false，避免一进页就 401） */
  favoriteOnly: boolean;
  offset: number;
  limit: number;
  filters: IExerciseFilters;
  /** 收藏态的本地覆盖：id → favorited，避免为一次点击重拉整页 */
  favoriteMap: Record<string, boolean>;
}
