<template>
  <view class="empty" :class="{ 'is-fill': fill }">
    <view class="empty__ic">
      <AppIcon :name="icon" :size="22" />
    </view>
    <text class="empty__t">{{ title }}</text>
    <text v-if="desc" class="empty__d">{{ desc }}</text>
  </view>
</template>

<script setup lang="ts">
/**
 * AppEmptyState · 通用空态 / 建设中占位
 *
 * 身体数据、经期记录、AI 教练三页还没做，先用它把路由撑起来（别白屏）。
 * 图标名必须是 uno.config.ts safelist 里登记过的，否则动态类名扫不到。
 */
import AppIcon from './AppIcon.vue';

withDefaults(
  defineProps<{
    /** 图标名（mdi，需在 safelist 登记） */
    icon: string;
    title: string;
    desc?: string;
    /** 撑满一屏居中（详情页整页占位用） */
    fill?: boolean;
  }>(),
  { desc: '', fill: false },
);
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  align-items: center;
  padding: 64px var(--sp-5);
  text-align: center;
}

/* 整页占位：垂直居中，别让空态贴着头 */
.empty.is-fill {
  justify-content: center;
  min-height: calc(100vh - 150px);
}

.empty__ic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  color: var(--text-3);
  background-color: var(--fill);
  border-radius: var(--radius-md);
}

.empty__t {
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--text-1);
}

.empty__d {
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  color: var(--text-3);
}
</style>
