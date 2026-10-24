<template>
  <view v-if="visible" class="top-notice" :class="`is-${tone}`">
    <view class="top-notice__body">
      <text class="top-notice__title">{{ title }}</text>
      <text v-if="message" class="top-notice__message">{{ message }}</text>
    </view>
    <view class="top-notice__close" hover-class="top-notice__close--hover" :hover-stay-time="60" @tap="emit('close')">
      <AppIcon name="close" :size="16" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 顶部弹窗（开发期专用）
 * 后端把模拟验证码直接返回给前端，用它从顶部滑下来提示，点右侧 × 关闭。
 * 页面正文不受影响：弹窗是 fixed 层，不占文档流。
 */
import AppIcon from './AppIcon.vue'

withDefaults(
  defineProps<{
    visible: boolean
    title: string
    message?: string
    tone?: 'brand' | 'info'
  }>(),
  { message: '', tone: 'brand' },
)

const emit = defineEmits<{ close: [] }>()
</script>

<style lang="scss" scoped>
.top-notice {
  position: fixed;
  /* 压在返回行下面，别挡住返回键 */
  top: calc(var(--window-top, 0px) + 48px);
  right: 12px;
  left: 12px;
  z-index: 999;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  animation: notice-in 0.18s ease-out;
}

.top-notice.is-brand {
  /* 不透明底：弹窗盖住顶部标题区时不能透出下面的字 */
  background: var(--surface-2);
  border: 1px solid rgba(var(--brand-500-rgb), 0.55);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), inset 3px 0 0 var(--brand-500);
}

.top-notice.is-info {
  background: var(--surface-2);
  border: 1px solid var(--line-strong);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), inset 3px 0 0 var(--brand-500);
}

.top-notice__body {
  flex: 1;
}

.top-notice__title {
  display: block;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--text-1);
}

.top-notice__message {
  font-variant-numeric: tabular-nums;
  display: block;
  margin-top: 4px;
  font-size: var(--fs-xs);
  line-height: var(--lh-normal);
  color: var(--text-2);
}

.top-notice__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  color: var(--text-3);
}

.top-notice__close--hover {
  color: var(--text-1);
}

@keyframes notice-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
