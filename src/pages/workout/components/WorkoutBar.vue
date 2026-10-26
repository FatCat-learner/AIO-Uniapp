<template>
  <view class="bar">
    <button class="bar__i" @click="emit('minimize')">
      <AppIcon name="chevron-down" :size="20" />
      <text class="bar__t">最小化</text>
    </button>

    <button class="bar__i bar__i--solid" @click="emit('add')">
      <view class="bar__ic">
        <AppIcon name="plus" :size="18" />
      </view>
      <text class="bar__t">加动作</text>
    </button>

    <button class="bar__i" @click="emit('note')">
      <AppIcon name="pencil" set="app" :size="20" />
      <text class="bar__t">写心得</text>
    </button>

    <button class="bar__i" @click="emit('settings')">
      <AppIcon name="cog-outline" :size="20" />
      <text class="bar__t">设置</text>
    </button>
  </view>
</template>

<script setup lang="ts">
/**
 * 训练页底栏四项：最小化 / 加动作（实心）/ 写心得 / 设置
 * 对齐设计稿 _design/previews/workout-flow 第 ① / ② 屏的 .bar
 *
 * 只有点击回抛，不做任何页面跳转——跳哪里由页面决定。
 */
import AppIcon from '@/components/base/AppIcon.vue';

const emit = defineEmits<{
  minimize: [];
  add: [];
  note: [];
  settings: [];
}>();
</script>

<style lang="scss" scoped>
.bar {
  display: flex;
  flex: none;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--sp-3) var(--sp-5) var(--sp-6);
}

.bar__i {
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  align-items: center;
  width: 64px;
  font-size: var(--fs-2xs);
  color: var(--text-2);
  background-color: transparent;
}

.bar__t {
  font-size: var(--fs-2xs);
  color: inherit;
}

.bar__i--solid {
  margin-top: -8px;
  font-weight: 600;
  color: var(--brand-500);
}

.bar__ic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--on-brand);
  background-color: var(--brand-500);
  border-radius: var(--radius-xs);
  box-shadow: var(--glow);
}
</style>
