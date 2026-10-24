<template>
  <AppMetricCard
    :title="title"
    :updated="updated"
    :value="value"
    :sub="sub"
    :unit="unit"
    :tag="tag"
    :tag-icon="tagIcon"
    :tone="tone"
    :points="points"
    @add="emit('add')"
    @click="emit('detail')"
  />
</template>

<script setup lang="ts">
/**
 * HomeMetricCard · 首页体重 / 饮水卡（UI 规范 V1.1 §4.26 + §5.1 ⑥⑦）
 * 两种卡结构完全一致（四角布局），差别只在文案、模块色和趋势序列，
 * 所以按规范复用同一个 AppMetricCard，这里只负责把「体重 / 饮水」的语义映射进去。
 */
import { computed } from 'vue';
import AppMetricCard from '@/components/base/AppMetricCard.vue';

const props = defineProps<{
  /** weight 体重（紫）/ water 饮水（青） */
  kind: 'weight' | 'water';
  value: string;
  /** 饮水「/ 2,000」这类小字后缀 */
  sub?: string;
  unit: string;
  updated: string;
  tag: string;
  points: number[];
}>();

const emit = defineEmits<{
  (e: 'add'): void;
  (e: 'detail'): void;
}>();

const title = computed(() => (props.kind === 'weight' ? '体重' : '饮水'));
const tone = computed(() => (props.kind === 'weight' ? 'body' : 'social'));
const tagIcon = computed(() => (props.kind === 'weight' ? 'scale-bathroom' : 'water'));
</script>
