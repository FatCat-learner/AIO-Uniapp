import type { ActionRow, FoodRow, PlanRow, RouteRow } from '@mocks/types';

/** 发现页四个品类的数据集合 */
export interface IDiscoverCatalog {
  actions: ActionRow[];
  foods: FoodRow[];
  plans: PlanRow[];
  routes: RouteRow[];
}
