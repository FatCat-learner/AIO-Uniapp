/**
 * 会员 / 权益契约（与 aio-backend/src/schemas/membership.py 对齐）
 *
 * 三条约定，写页面时必须守住：
 * 1. 价格单位是**元**。后端把分换好了，前端不做任何换算、不碰 `_cents`。
 * 2. 上限 `null` = 不限，不是 0。`limit === null` 时不要画进度条。
 * 3. `mode` 是"降级"不是"报错"。接口永远 200，degraded 只代表"该走精简版"，
 *    页面不许把它当失败弹 toast。
 */

/** 额度 / 权益键（与后端 core/entitlements.py 的 KEY_* 一一对应） */
export type QuotaKey
  = | 'ai.model'
    | 'ai.chat.monthly'
    | 'ai.plan.daily'
    | 'ai.plan.cooldown_days'
    | 'lib.plans'
    | 'lib.routes'
    | 'lib.favorites'
    | 'cardio.depth_items'
    | 'decor.member_pool';

/** ok = 正常；degraded = 降级可用（精简模式）；blocked = 不可用（仅 B 端协作场景） */
export type QuotaMode = 'ok' | 'degraded' | 'blocked';

/**
 * 权益表的单个值。**不是只有数字**：
 * `ai.model` 是 'fast' / 'flagship'，`decor.member_pool` 是 boolean，
 * 额度类才是数字（`null` = 不限）。读之前先判类型。
 */
export type LimitValue = number | string | boolean | null;

/** 权益上限表 */
export type QuotaLimits = Record<string, LimitValue>;

/** 会员套餐卡（GET /membership/plan） */
export interface IMembershipPlan {
  /** pro_monthly / pro_lifetime */
  code: string;
  name: string;
  /** 售价，单位元 */
  price: number;
  /** 划线价，null = 不展示 */
  original_price: number | null;
  period: 'monthly' | 'lifetime';
  /** 月付 = 31，永久 = null */
  duration_days: number | null;
  /** 权益条目文案，直接渲染 */
  highlights: string[];
  limits: QuotaLimits;
}

/** 当前订阅摘要（GET /membership/me）：免费用户返回 plan_code=free + is_active=false */
export interface IMembershipSubscription {
  plan_code: string;
  plan_name: string;
  is_active: boolean;
  /** monthly / lifetime / trial；免费用户为 null */
  source: string | null;
  started_at: string | null;
  /** 永久会员为 null（不靠定时任务失效，渲染时按 is_active 判定） */
  expires_at: string | null;
}

/** 单项额度 */
export interface IQuotaItem {
  key: string;
  used: number;
  /** null = 不限 */
  limit: number | null;
  mode: QuotaMode;
}

/** 额度快照（GET /membership/quota）：会员中心与各业务页共用 */
export interface IQuotaSnapshot {
  plan_code: string;
  is_active: boolean;
  /** 全站粗粒度开关：任一项 degraded 即降级展示 */
  mode: QuotaMode;
  limits: QuotaLimits;
  items: IQuotaItem[];
}
