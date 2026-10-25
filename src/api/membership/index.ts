/**
 * 会员接口（URL 只出现在这一层）
 *
 * 后端已实现 P0 三个只读接口，写操作（下单 / 续费 / 装饰装备）留到 P2。
 */
import type {
  IMembershipPlan,
  IMembershipSubscription,
  IQuotaSnapshot,
} from './types';
import { get } from '@/utils/request';

/** 套餐列表（公开，不需要登录） */
export const getMembershipPlans = () => get<IMembershipPlan[]>('/membership/plan');

/** 我的会员状态：免费用户也会 200，返回 plan_code=free */
export const getMySubscription = () =>
  get<IMembershipSubscription>('/membership/me');

/** 额度快照：会员中心顶部额度条与各业务页的降级判断都读这一份 */
export const getQuota = () => get<IQuotaSnapshot>('/membership/quota');
