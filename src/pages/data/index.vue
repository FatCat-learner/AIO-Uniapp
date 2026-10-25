<template>
  <AppLayout title="数据" subtitle="训练、身体、饮食的长期趋势" active-tab="data">
    <view class="seg">
      <view
        v-for="item in DATA_SEGMENTS"
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
        <view v-for="item in DATA_WEEKLY" :key="item.label" class="weekly__item">
          <text class="weekly__value" :class="{ 'is-brand': item.tone === 'brand' }">{{ item.value }}</text>
          <text class="weekly__label">{{ item.label }}</text>
        </view>
      </view>
    </AppCard>

    <AppCard class="mb-12" padding="lg">
      <text class="card-title">训练容量趋势</text>
      <view class="chart">
        <view v-for="(height, index) in DATA_CHART_BARS" :key="index" class="chart__bar-wrap">
          <view class="chart__bar" :class="{ 'is-last': index === DATA_CHART_LAST }" :style="{ height: `${height}%` }" />
        </view>
      </view>
      <view class="chart__axis">
        <text v-for="day in DATA_CHART_AXIS" :key="day" class="chart__axis-label">{{ day }}</text>
      </view>
    </AppCard>

    <view class="empty">
      <AppIcon name="chart-box-outline" :size="40" class="empty__icon" />
      <text class="empty__title">今天还没有记录</text>
      <text class="empty__desc">完成一次训练后，这里会出现组数与容量明细。</text>
    </view>
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * 数据 Data（P0，示例页）
 * 结构对齐规范 §5.11：分段控件（训练 / 身体 / 饮食）→ 周汇总 → 图表区
 */
import { ref } from 'vue';
import AppCard from '@/components/base/AppCard.vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import {
  DATA_CHART_AXIS,
  DATA_CHART_BARS,
  DATA_CHART_LAST,
  DATA_SEGMENT_DEFAULT,
  DATA_SEGMENTS,
  DATA_WEEKLY,
} from './config';

const active = ref(DATA_SEGMENT_DEFAULT);
</script>

<style lang="scss" scoped>
@import './styles/data.scss';
</style>
