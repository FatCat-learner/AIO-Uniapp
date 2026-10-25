import type {
  IMembershipPlan,
  IMembershipSubscription,
  IQuotaSnapshot,
} from '@/api/membership/types';

export interface IMembershipState {
  /** 套餐卡（会员中心价格区） */
  plans: IMembershipPlan[];
  /** 当前订阅；没拉到时为 null，此时一律按免费处理 */
  subscription: IMembershipSubscription | null;
  /** 额度快照；null = 未知，页面先别画额度条 */
  quota: IQuotaSnapshot | null;
  /** 任一请求在飞 */
  loading: boolean;
  /** 上次拉取成功的时间戳（毫秒），用于"进页 5 分钟内不重复拉" */
  fetchedAt: number;
  /** 拉取失败标记：true 时会员中心显示重试，不弹 toast */
  failed: boolean;
}
