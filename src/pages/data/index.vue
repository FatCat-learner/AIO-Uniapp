<script setup lang="ts">
/**
 * 数据 Data（P0，示例页）
 * 结构对齐规范 §5.11：分段控件（训练 / 身体 / 饮食）→ 周汇总 → 图表区
 */
import { ref } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import AppCard from '@/components/base/AppCard.vue';
import AppIcon from '@/components/base/AppIcon.vue';

const segments = [
  { key: 'training', label: '训练' },
  { key: 'body', label: '身体' },
  { key: 'diet', label: '饮食' },
];

const active = ref('training');

const weekly = [
  { value: '24', label: '总组数', tone: 'normal' },
  { value: '3,450', label: '总容量（kg）', tone: 'normal' },
  { value: '+12%', label: '较上周', tone: 'brand' },
];
</script>

<template>
  <AppLayout title="数据" subtitle="训练、身体、饮食的长期趋势" active-tab="data">
    <view class="seg">
      <view
        v-for="item in segments"
        :key="item.key"
        class="seg__item"
        :class="{ 'is-active': item.key === active }"
        @tap="active = item.key"
      >
        <text class="seg__text">{{ item.label }}</text>
      </view>
    </view>

    <AppCard class="mb-12" padding="lg">
      <view class="card-head">
        <text class="card-title">本周汇总</text>
        <view class="card-more">
          <text class="card-more__text">统计</text>
          <AppIcon name="chevron-right" :size="16" />
        </view>
      </view>

      <view class="weekly">
        <view v-for="item in weekly" :key="item.label" class="weekly__item">
          <text class="weekly__value" :class="{ 'is-brand': item.tone === 'brand' }">{{ item.value }}</text>
          <text class="weekly__label">{{ item.label }}</text>
        </view>
      </view>
    </AppCard>

    <AppCard class="mb-12" padding="lg">
      <text class="card-title">训练容量趋势</text>
      <view class="chart">
        <view v-for="(height, index) in [38, 56, 44, 72, 60, 88, 66]" :key="index" class="chart__bar-wrap">
          <view class="chart__bar" :class="{ 'is-last': index === 6 }" :style="{ height: `${height}%` }" />
        </view>
      </view>
      <view class="chart__axis">
        <text v-for="day in ['一', '二', '三', '四', '五', '六', '日']" :key="day" class="chart__axis-label">{{ day }}</text>
      </view>
    </AppCard>

    <view class="empty">
      <AppIcon name="chart-box-outline" :size="40" class="empty__icon" />
      <text class="empty__title">今天还没有记录</text>
      <text class="empty__desc">完成一次训练后，这里会出现组数与容量明细。</text>
    </view>
  </AppLayout>
</template>

<style lang="scss" scoped>
.mb-12 {
  margin-bottom: 12px;
}

/* 分段控件 §4.9：轨道 fill、选中绿实底 + on-brand 字 */
.seg {
  display: flex;
  gap: 2px;
  align-items: center;
  height: 40px;
  padding: 4px;
  margin-bottom: 12px;
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.seg__item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 32px;
  border-radius: var(--radius-full);
  transition: background-color 0.18s ease;
}

.seg__item.is-active {
  background-color: var(--brand-500);
}

.seg__text {
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  color: var(--text-2);
}

.seg__item.is-active .seg__text {
  font-weight: 600;
  color: var(--on-brand);
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  color: var(--text-1);
}

.card-more {
  display: flex;
  gap: 2px;
  align-items: center;
  color: var(--brand-500);
}

.card-more__text {
  font-size: 11px;
  line-height: 16px;
}

.weekly {
  display: flex;
}

.weekly__item {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.weekly__value {
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  color: var(--text-1);
  font-variant-numeric: tabular-nums;
}

.weekly__value.is-brand {
  color: var(--brand-500);
}

.weekly__label {
  font-size: 11px;
  line-height: 16px;
  color: var(--text-3);
}

/* 柱状：卡内均分、圆角 8、最后一天实心绿 */
.chart {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  height: 96px;
  margin-top: 16px;
}

.chart__bar-wrap {
  display: flex;
  flex: 1;
  align-items: flex-end;
  height: 100%;
}

.chart__bar {
  width: 100%;
  background-color: var(--surface-2);
  border-radius: 8px;
}

.chart__bar.is-last {
  background-color: var(--brand-500);
}

.chart__axis {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.chart__axis-label {
  flex: 1;
  font-size: 11px;
  color: var(--text-3);
  text-align: center;
}

.empty {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  padding: 32px 16px;
  text-align: center;
}

.empty__icon {
  color: var(--text-3);
}

.empty__title {
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  color: var(--text-1);
}

.empty__desc {
  font-size: 13px;
  line-height: 18px;
  color: var(--text-2);
}
</style>
