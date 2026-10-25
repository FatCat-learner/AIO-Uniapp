import type { IDiscoverCatalog } from './types';
import { ACTIONS, FOODS, PLANS, ROUTES } from '@mocks/data/catalog';

export type { IDiscoverCatalog } from './types';

/**
 * 发现页数据源。今天直接返回 mock 种子常量，
 * 接后端后把函数体改成 `get('/actions')` 等即可，调用方不用改。
 */
export function fetchDiscoverCatalog(): IDiscoverCatalog {
  return { actions: ACTIONS, foods: FOODS, plans: PLANS, routes: ROUTES };
}
