import type { IHomeData } from '@/api/home/types';

/** home store 的 state 形状 */
export interface IHomeState {
  /** 首页卡片流聚合数据，由 fetchHomeData 初始化 */
  data: IHomeData;
  /** Dock「+」训练面板开合：AppTabBar 与 HomeTrainingSheet 两处共用 */
  fabOpen: boolean;
}
