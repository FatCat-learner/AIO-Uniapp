/**
 * 动作库接口（URL 只出现在这一层）
 *
 * 读路径全部公开，写路径（收藏 / 记录选用）需要登录。
 * 媒体是 `/static/...` 的绝对路径，多端都能直接用 `<image :src>`。
 */
import type {
  IExerciseDetail,
  IExerciseFavorite,
  IExerciseFilters,
  IExerciseList,
  IExerciseQuery,
} from './types';
import { get, post } from '@/utils/request';

export type * from './types';

/** 列表：五维筛选 + 分页。空字符串参数会被滤掉，不发多余的 query */
export const fetchExercises = (query: IExerciseQuery = {}) => {
  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '')
      continue;
    params[key] = value as string | number | boolean;
  }
  return get<IExerciseList>('/exercises', { params });
};

/** 筛选项分组计数（部位 / 器械 / 类别），进页拉一次即可 */
export const fetchExerciseFilters = () =>
  get<IExerciseFilters>('/exercises/filters');

/** 详情：多 instructions / steps */
export const fetchExerciseDetail = (id: string) =>
  get<IExerciseDetail>(`/exercises/${id}`);

/** 收藏 / 取消收藏（幂等切换，返回切换后的状态） */
export const toggleExerciseFavorite = (id: string) =>
  post<IExerciseFavorite>(`/exercises/${id}/favorite`);

/** 记录一次选用：训练里加入该动作后调用，驱动「常用动作」排序 */
export const markExerciseUsed = (id: string) =>
  post<{ id: string; use_count: number }>(`/exercises/${id}/use`);
