<template>
  <view v-if="visible" class="blocking">
    <view class="blocking__mask" :style="{ zIndex: overlayZ('mask') }" @touchmove.stop.prevent />
    <view class="blocking__card" :style="{ zIndex: overlayZ('dialog') }">
      <AppIcon name="loading" :size="22" class="blocking__spin" />
      <text class="blocking__text">{{ text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { overlayZ } from './overlayStack';

/**
 * AppBlocking —— 阻塞加载（提交中 / 支付中 / 批量同步）
 *
 * 设计稿：_design/previews/overlays/index.html 帧 08
 * 规则：不可点遮罩关闭、不显示关闭按钮、最长 10s 后由调用方兜底关闭。
 */
withDefaults(
  defineProps<{
    visible: boolean;
    text?: string;
  }>(),
  { text: '正在保存…' },
);
</script>

<style lang="scss" scoped>
.blocking {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blocking__mask {
  position: absolute;
  inset: 0;
  background: var(--glass-28);
}

.blocking__card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  align-items: center;
  width: 148px;
  padding: var(--sp-4) var(--sp-3);
  background: var(--surface-2);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-float), inset 0 0 0 1px var(--line-white-08);
}

.blocking__spin {
  color: var(--brand-500);
  animation: blocking-rotate 0.9s linear infinite;
}

@keyframes blocking-rotate {
  to {
    transform: rotate(360deg);
  }
}

.blocking__text {
  font-size: var(--fs-xs);
  color: var(--text-2);
}
</style>
