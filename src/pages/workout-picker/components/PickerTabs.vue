<template>
  <view class="tabs">
    <view
      v-for="tab in TABS"
      :key="tab.value"
      class="tabs__tab"
      :class="{ 'tabs__tab--on': tab.value === active }"
      hover-class="u-hover"
      @tap="emit('change', tab.value)"
    >
      <text class="tabs__text">{{ tab.label }}</text>
    </view>

    <view class="tabs__clear" hover-class="u-hover" @tap="emit('clear')">
      <AppIcon name="close" :size="12" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 精选 / 常用 tab
 * 精选 = sort:'default'，常用 = sort:'popular'（后端都是 use_count desc，常用是训练激励口径）。
 * 右侧 X 一键清空筛选，文案与设计稿一致（只有图标）。
 */
import AppIcon from '@/components/base/AppIcon.vue';

type TabValue = 'default' | 'popular';

/** active 收宽成 string：调用方传的是 store.sort（ExerciseSort 超集） */
defineProps<{ active: string }>();

const emit = defineEmits<{
  (e: 'change', value: TabValue): void;
  (e: 'clear'): void;
}>();

const TABS: { value: TabValue; label: string }[] = [
  { value: 'default', label: '精选动作' },
  { value: 'popular', label: '常用动作' },
];
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  flex: none;
  gap: var(--sp-4);
  align-items: center;
}

.tabs__tab {
  padding-bottom: var(--sp-2);
  border-bottom: 2px solid transparent;
}

.tabs__tab--on {
  border-bottom-color: var(--brand-500);
}

.tabs__text {
  font-size: var(--fs-md);
  font-weight: 600;
  line-height: 1;
  color: var(--text-3);
}

.tabs__tab--on .tabs__text {
  color: var(--text-1);
}

.tabs__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: auto;
  color: var(--text-2);
  background-color: var(--fill);
  border-radius: var(--radius-full);
}
</style>
