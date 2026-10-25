<template>
  <AppCard>
    <AppCardHeader title="置顶指标" link="编辑" chevron @action="emit('edit')" />
    <view class="pin">
      <view v-for="m in metrics" :key="m.key" class="pin__col">
        <AppIconTile :icon="m.icon" :tone="m.tone" :size="30" />
        <view class="pin__vrow">
          <text class="pin__v a-num">
            {{ m.value }}
          </text>
          <text class="pin__u">
            {{ m.unit }}
          </text>
        </view>
        <text class="pin__l">
          {{ m.label }}
        </text>
      </view>
    </view>
  </AppCard>
</template>

<script setup lang="ts">
import type { PinnedMetric } from '@mocks/types';
/**
 * HomePinnedMetrics · 置顶指标卡（UI 规范 V1.1 §5.1 ②）
 * 3 列：30 IconTile + 值 28/600 + 单位 11 灰 + 标签 11。
 * 卡头右侧「编辑」为品牌色链接。
 */
import AppCard from '@/components/base/AppCard.vue';
import AppCardHeader from '@/components/base/AppCardHeader.vue';
import AppIconTile from '@/components/base/AppIconTile.vue';

defineProps<{
  metrics: PinnedMetric[];
}>();

const emit = defineEmits<{
  (e: 'edit'): void;
}>();
</script>

<style lang="scss" scoped>
.pin {
  display: flex;
  margin-top: var(--sp-4);
}

.pin__col {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--sp-1);
  align-items: center;
  min-width: 0;
}

.pin__vrow {
  display: flex;
  gap: 2px;
  align-items: baseline;
  margin-top: var(--sp-1);
}

.pin__v {
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  color: var(--text-1);
  letter-spacing: -0.01em;
}

.pin__u {
  font-size: 11px;
  color: var(--text-3);
}

.pin__l {
  font-size: 11px;
  line-height: 14px;
  color: var(--text-2);
}
</style>
