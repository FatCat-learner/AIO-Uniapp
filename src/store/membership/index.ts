import type { IMembershipState } from './types';
import type { QuotaKey, QuotaMode } from '@/api/membership/types';
import { defineStore } from 'pinia';
import { getMembershipPlans, getMySubscription, getQuota } from '@/api/membership';

/** 进页 5 分钟内不重复拉：会员状态变化不频繁，没必要每次切 tab 都打一遍 */
const CACHE_TTL = 5 * 60 * 1000;

const useMembershipStore = defineStore('membership', {
  state: (): IMembershipState => ({
    plans: [],
    subscription: null,
    quota: null,
    loading: false,
    fetchedAt: 0,
    failed: false,
  }),

  getters: {
    /** 真·会员（未登录 / 拉取失败一律 false，免费功能不能因为接口挂了就锁死） */
    isPro(state): boolean {
      return state.subscription?.is_active === true;
    },
    /** 全站降级开关：额度没拉到时按 ok 处理，别一进页就挂横幅 */
    mode(state): QuotaMode {
      return state.quota?.mode ?? 'ok';
    },
    quotaItems(state) {
      return state.quota?.items ?? [];
    },

    /**
     * 取单项额度。`limit === null` 表示不限，调用方要单独判断，
     * 不要用 `limit === 0` 当作"没有额度"。
     */
    quotaOf(state) {
      return (key: QuotaKey) => state.quota?.items.find(item => item.key === key);
    },
  },

  actions: {
    async fetchPlans(): Promise<void> {
      this.plans = await getMembershipPlans();
    },

    async fetchSubscription(): Promise<void> {
      this.subscription = await getMySubscription();
    },

    async fetchQuota(): Promise<void> {
      this.quota = await getQuota();
    },

    /**
     * 一次拉齐会员中心需要的数据。
     *
     * 三个接口**互不牵连**：套餐挂了仍要能看自己的额度，所以用 allSettled 的语义，
     * 只有全部失败才算整页失败（failed = true）。失败不抛给页面，由页面读 failed 决定是否显示重试。
     */
    async refresh(force = false): Promise<void> {
      if (this.loading) return;
      if (!force && this.fetchedAt && Date.now() - this.fetchedAt < CACHE_TTL) return;

      this.loading = true;
      const results = await Promise.allSettled([
        this.fetchPlans(),
        this.fetchSubscription(),
        this.fetchQuota(),
      ]);
      this.loading = false;

      this.failed = results.every(item => item.status === 'rejected');
      if (!this.failed) this.fetchedAt = Date.now();
    },

    /** 退出登录 / 切账号时调用，避免看到上一个账号的会员态 */
    reset(): void {
      this.$reset();
    },
  },
});

export default useMembershipStore;
export { useMembershipStore };
