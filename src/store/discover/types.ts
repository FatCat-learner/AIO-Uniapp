import type { IDiscoverCatalog } from '@/api/discover/types';

/** discover store 的 state 形状 */
export interface IDiscoverState {
  /** 四个品类的数据集合，由 fetchDiscoverCatalog 初始化 */
  catalog: IDiscoverCatalog;
  /** 收藏：key = `${cat}:${name}`，接后端后走 /api/favorites */
  favs: Record<string, boolean>;
}
