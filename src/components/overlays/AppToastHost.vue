<template>
  <view class="toast-host" :style="{ zIndex: overlayZ('toast') }">
    <view
      v-if="activeToast.current"
      :key="activeToast.current.id"
      class="toast"
      :class="[`toast--${activeToast.current.tone}`, { 'toast--snack': activeToast.current.action }]"
    >
      <view class="toast__ic">
        <AppIcon :name="iconOf(activeToast.current.tone)" :size="14" />
      </view>
      <text class="toast__text">{{ activeToast.current.text }}</text>
      <view v-if="activeToast.current.action" class="toast__act" @tap="onAction">
        <text>{{ activeToast.current.action.label }}</text>
      </view>
      <view class="toast__bar" :style="{ animationDuration: `${activeToast.current.duration}ms` }" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { activeToast, useToast } from '@/composables/useToast';
import { overlayZ } from './overlayStack';

/**
 * AppToastHost —— 全局只挂一次（App.vue 根部），负责渲染 useToast() 的提示
 *
 * 设计稿：_design/previews/overlays/index.html 帧 11（Toast）/ 帧 12（Snackbar 可撤销）
 * 说明：src/components/overlays/README.md
 */
const toast = useToast();

const onAction = (): void => {
  activeToast.current?.action?.handler();
  toast.hide();
};

const iconOf = (tone: string): string =>
  tone === 'success' ? 'check' : tone === 'error' ? 'alert-circle-outline' : tone === 'warn' ? 'alert-outline' : 'information-outline';
</script>

<style lang="scss" scoped>
/* 位置：底部 Dock 之上，不挡输入；Snackbar 与 Toast 同一位置，只多一个动作 */
.toast-host {
  position: fixed;
  right: 0;
  bottom: calc(96px + env(safe-area-inset-bottom));
  left: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.toast {
  position: relative;
  display: flex;
  gap: var(--sp-2);
  align-items: center;
  max-width: 320px;
  padding: var(--sp-3) var(--sp-4);
  overflow: hidden;
  pointer-events: auto;
  background: var(--surface-2);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-float), inset 0 0 0 1px var(--line-white-08);
  animation: toast-in 0.22s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
}

.toast--snack {
  padding-right: var(--sp-3);
  border-radius: var(--radius-md);
}

.toast__ic {
  display: flex;
  color: var(--text-2);
}

.toast--success .toast__ic {
  color: var(--brand-500);
}

.toast--error .toast__ic {
  color: var(--danger-text);
}

.toast--warn .toast__ic {
  color: var(--warn);
}

.toast__text {
  font-size: var(--fs-sm);
  color: var(--text-1);
}

.toast__act {
  padding-left: var(--sp-3);
  margin-left: var(--sp-2);
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--brand-500);
  border-left: 1px solid var(--line-strong);
}

/* 倒计时条：让「可撤销」有个可见的截止时间 */
.toast__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--brand-500);
  transform-origin: left;
  animation: toast-bar linear forwards;
}

@keyframes toast-bar {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}
</style>
