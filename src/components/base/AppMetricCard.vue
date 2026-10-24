<template>
  <AppCard clickable @click="emit('click', $event)">
    <view class="m-head">
      <view class="m-head__l">
        <text class="m-title">
          {{ title }}
        </text>
        <text v-if="updated" class="a-card-meta a-num">
          {{ updated }}
        </text>
      </view>
      <view class="m-head__r">
        <AppPill v-if="tag" :tone="tone" size="lg" :icon="tagIcon">
          {{ tag }}
        </AppPill>
        <view class="m-add" hover-class="u-hover" :hover-stay-time="80" @tap.stop="emit('add', $event)">
          <AppIcon name="plus" :size="18" />
        </view>
      </view>
    </view>

    <view class="m-body">
      <view class="m-value">
        <text class="m-value__n a-num">
          {{ value }}
        </text>
        <text v-if="sub" class="m-value__sub a-num">
          {{ sub }}
        </text>
        <text v-if="unit" class="m-value__u">
          {{ unit }}
        </text>
      </view>
      <AppSparkline :points="points" :tone="tone" />
    </view>
  </AppCard>
</template>

<script setup lang="ts">
/**
 * AppMetricCard · 指标卡（UI 规范 V1.1 §4.26，体重 / 饮水共用）
 * 四角布局：左上 名称 17/600 + 「YYYY/MM/DD 更新」11；右上 tint 胶囊 + 32 圆「+」；
 * 左下 值 32/600 + 单位 13；右下 Sparkline 120×56。
 * 大卡约 358×176（含 20 内边距）。
 */
import AppCard from './AppCard.vue';
import AppIcon from './AppIcon.vue';
import AppPill from './AppPill.vue';
import AppSparkline from './AppSparkline.vue';

withDefaults(
  defineProps<{
    /** 指标名，如「体重」「饮水」 */
    title: string;
    /** 来源说明，如「2026/10/20 更新」 */
    updated?: string;
    /** 主值，已格式化好，如「92.45」「1,200」 */
    value: string;
    /** 主值后缀（小字，如饮水「/ 2,000」），与主值同行 */
    sub?: string;
    /** 单位，如「公斤」「ml」 */
    unit?: string;
    /** 右上 tint 胶囊文案，如「智能秤」「智能杯」 */
    tag?: string;
    /** 胶囊颜色 */
    tone?: 'brand' | 'cardio' | 'diet' | 'body' | 'social';
    /** 右上胶囊图标 */
    tagIcon?: string;
    /** 趋势序列 */
    points?: number[];
  }>(),
  {
    updated: '',
    sub: '',
    unit: '',
    tag: '',
    tone: 'body',
    tagIcon: '',
    points: () => [],
  },
);

const emit = defineEmits<{
  (e: 'add', event: Event): void;
  (e: 'click', event: Event): void;
}>();
</script>

<style lang="scss" scoped>
.m-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sp-2);
}

.m-head__l {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.m-title {
  font-size: 17px;
  font-weight: 600;
  line-height: 22px;
  color: var(--text-1);
}

.m-head__r {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--sp-2);
}

/* 32 圆「+」：brand-50 底、荧光绿加号 */
.m-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--brand-500);
  background-color: var(--brand-50);
  border-radius: var(--radius-full);
}

.m-body {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-2);
  margin-top: var(--sp-5);
}

.m-value {
  display: flex;
  flex-wrap: nowrap;
  align-items: baseline;
  gap: var(--sp-1);
  min-width: 0;
}

.m-value__n {
  font-size: 32px;
  font-weight: 600;
  line-height: 36px;
  color: var(--text-1);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.m-value__sub {
  font-size: 15px;
  line-height: 20px;
  color: var(--text-3);
  white-space: nowrap;
}

.m-value__u {
  font-size: 13px;
  color: var(--text-2);
}
</style>
