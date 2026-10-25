/**
 * 会员 / 权益 mock —— 与 aio-backend/src/core/entitlements.py 同口径
 *
 *   GET /membership/plan              → IMembershipPlan[]（¥18 月付 / ¥198 永久，划线 ¥298）
 *   GET /membership/me                → IMembershipSubscription
 *   GET /membership/quota             → IQuotaSnapshot
 *
 * 便于验收的开关（query）：
 *   ?pro=1        当会员（plan=pro_monthly，全部额度 ok）
 *   ?mode=degraded 强制降级（ai.chat.monthly 用满、lib.plans 用满）——用来调「精简模式」的展示
 *   ?mode=expired 会员到期（is_active=false，但装饰栏仍显示原装备）
 */
import type { MockMethod } from 'vite-plugin-mock';
import { ok } from '../utils/response';

/** 与后端 FREE_LIMITS / PRO_LIMITS 逐项对齐，改价改量时两边一起改 */
const FREE_LIMITS = {
  'ai.model': 'fast',
  'ai.chat.monthly': 60,
  'ai.plan.daily': 1,
  'ai.plan.cooldown_days': 3,
  'lib.plans': 5,
  'lib.routes': 8,
  'lib.favorites': 10,
  'cardio.depth_items': 0,
  'decor.member_pool': false,
};

/** 会员侧 AI 对话的隐性上限，前端显示「不限」 */
const PRO_LIMITS = {
  'ai.model': 'flagship',
  'ai.chat.monthly': 2000,
  'ai.plan.daily': 5,
  'ai.plan.cooldown_days': 0,
  'lib.plans': null,
  'lib.routes': null,
  'lib.favorites': null,
  'cardio.depth_items': 4,
  'decor.member_pool': true,
};

const PLANS = [
  {
    code: 'pro_monthly',
    name: 'Pro 月付',
    price: 18,
    original_price: null,
    period: 'monthly',
    duration_days: 31,
    highlights: [
      '旗舰模型 · 每天 5 次生成计划',
      '计划 / 路书 / 收藏 无上限',
      '2.5D 轨迹 · 高程剖面 · 训练负荷',
      '会员专属装饰 16 件，每月新增',
    ],
    limits: PRO_LIMITS,
  },
  {
    code: 'pro_lifetime',
    name: 'Pro 永久',
    price: 198,
    original_price: 298,
    period: 'lifetime',
    duration_days: null,
    highlights: ['一次买断，不做续费提醒', '含月付全部权益', '早鸟价，限前 1000 名'],
    limits: PRO_LIMITS,
  },
];

/** 额度项顺序与后端 QUOTA_KEYS 一致 */
const QUOTA_ORDER: Array<[string, number]> = [
  ['ai.chat.monthly', 18],
  ['ai.plan.daily', 1],
  ['lib.plans', 3],
  ['lib.routes', 6],
  ['lib.favorites', 4],
];

export const membershipMocks: MockMethod[] = [
  {
    url: '/membership/plan',
    method: 'get',
    response: () => ok(PLANS),
  },
  {
    url: '/membership/me',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      if (query?.mode === 'expired') {
        return ok({
          plan_code: 'pro_monthly',
          plan_name: 'Pro 月付',
          is_active: false,
          source: 'monthly',
          started_at: '2026-09-24T02:00:00Z',
          expires_at: '2026-10-24T02:00:00Z',
        });
      }
      const pro = query?.pro === '1';
      return ok({
        plan_code: pro ? 'pro_monthly' : 'free',
        plan_name: pro ? 'Pro 月付' : '免费版',
        is_active: pro,
        source: pro ? 'monthly' : null,
        started_at: pro ? '2026-10-24T02:00:00Z' : null,
        expires_at: pro ? '2026-11-24T02:00:00Z' : null,
      });
    },
  },
  {
    url: '/membership/quota',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const degraded = query?.mode === 'degraded';
      const pro = query?.pro === '1';
      const limits = pro ? PRO_LIMITS : FREE_LIMITS;
      const items = QUOTA_ORDER.map(([key, used]) => {
        // 权益表里混着字符串（ai.model）和布尔（decor.member_pool），只有数字才是额度
        const raw = (limits as Record<string, unknown>)[key];
        const limit = typeof raw === 'number' ? raw : null;
        // 只有免费侧会被压降级：会员不存在"用超"这回事
        const hitCap = !pro && degraded && (key === 'ai.chat.monthly' || key === 'lib.plans');
        return {
          key,
          used: limit === null ? used : hitCap ? limit : Math.min(used, limit),
          limit,
          mode: hitCap ? 'degraded' : 'ok',
        };
      });
      return ok({
        plan_code: pro ? 'pro_monthly' : 'free',
        is_active: pro,
        mode: items.some(item => item.mode !== 'ok') ? 'degraded' : 'ok',
        limits,
        items,
      });
    },
  },
];
