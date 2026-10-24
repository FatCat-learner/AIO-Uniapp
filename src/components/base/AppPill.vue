<template>
  <view class="a-pill" :class="[`a-pill--${tone}`, { 'a-pill--lg': size === 'lg' }]">
    <AppIcon v-if="icon" :name="icon" :size="size === 'lg' ? 14 : 12" />
    <slot />
  </view>
</template>

<script setup lang="ts">
/**
 * AppPill · 胶囊标签（UI 规范 V1.1 §4.9）
 * 28 高（导航「连续 12 天」）/ 32 高（卡头 tint 胶囊「智能秤」「自定义」），
 * 底一律为模块色 12%，文字为模块色 —— 不用实色填充。
 */
import AppIcon from './AppIcon.vue';

withDefaults(
  defineProps<{
    /** 颜色：品牌荧光绿 / 模块色 / 中性灰 */
    tone?: 'brand' | 'neutral' | 'train' | 'cardio' | 'diet' | 'body' | 'social';
    /** sm 28 高（默认）/ lg 32 高 */
    size?: 'sm' | 'lg';
    /** 前置图标（MDI 名） */
    icon?: string;
  }>(),
  {
    tone: 'neutral',
    size: 'sm',
    icon: '',
  },
);
</script>
