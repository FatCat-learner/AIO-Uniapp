<template>
  <AppCard padding="none" dashed clickable @click="emit('add')">
    <view class="add">
      <AppIcon name="plus" :size="16" />
      <text class="add__t">
        添加卡片
      </text>
    </view>
  </AppCard>
</template>

<script setup lang="ts">
/**
 * HomeAddCard · 「+ 添加卡片」虚线槽（UI 规范 V1.1 §5.1 ⑨）
 * 56 高、1px 虚线、圆角 20，是全页唯一的「可增删卡片」入口。
 */
import AppCard from '@/components/base/AppCard.vue';
import AppIcon from '@/components/base/AppIcon.vue';

const emit = defineEmits<{
  (e: 'add'): void;
}>();
</script>

<style lang="scss" scoped>
.add {
  display: flex;
  gap: var(--sp-1);
  align-items: center;
  justify-content: center;
  height: 56px;
  color: var(--text-3);
}

.add__t {
  font-size: 13px;
}
</style>
