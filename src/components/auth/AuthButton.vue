<template>
  <button
    class="auth-btn"
    :class="{ 'is-ghost': ghost, 'is-disabled': disabled || loading, 'is-dense': dense }"
    :disabled="disabled || loading"
    hover-class="auth-btn--hover"
    :hover-stay-time="80"
    @tap="onTap"
  >
    <view v-if="loading" class="auth-btn__spinner" />
    <text class="auth-btn__text">{{ loading ? loadingText : label }}</text>
  </button>
</template>

<script setup lang="ts">
/**
 * 主按钮
 * 默认 54px 胶囊（对齐设计稿 .btn--primary：999 圆角 + 品牌绿 + 外发光 + 按下 0.976 缩放）。
 * dense：46px 圆角矩形，只给注册②/忘记密码② 这类内容挤满一屏的页面用（§16.13 允许的下限）。
 * 任何情况下都不许被 flex 压扁。
 */
withDefaults(
  defineProps<{
    label: string
    loading?: boolean
    loadingText?: string
    disabled?: boolean
    ghost?: boolean
    dense?: boolean
  }>(),
  { loading: false, loadingText: '处理中', disabled: false, ghost: false, dense: false },
)

const emit = defineEmits<{ tap: [] }>()

function onTap() {
  emit('tap')
}
</script>

<style lang="scss" scoped>
.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 54px;
  margin: 0;
  padding: 0;
  background: var(--brand-500);
  border: none;
  border-radius: var(--radius-full);
  line-height: 1;
  /* 设计稿 --glow：0 10px 30px rgba(201,240,58,.22) */
  box-shadow: 0 10px 30px rgba(201, 240, 58, 0.22);
  transition:
    transform 0.14s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &::after {
    border: none;
  }

  /* 压成 46px 的紧凑档：只换高度与圆角，颜色/发光不变 */
  &.is-dense {
    height: 46px;
    border-radius: var(--radius-sm);
  }

  &.is-ghost {
    background: transparent;
    border: 1px solid var(--line-strong);
  }

  &.is-disabled {
    opacity: 0.55;
  }
}

.auth-btn--hover {
  background: var(--brand-600);
  box-shadow: 0 4px 16px rgba(201, 240, 58, 0.28);
  transform: scale(0.976);

  &.is-ghost {
    background: var(--surface-2);
    box-shadow: none;
  }
}

.auth-btn__text {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--on-brand);
}

.is-dense .auth-btn__text {
  font-size: 15px;
}

.is-ghost .auth-btn__text {
  color: var(--text-1);
}

.auth-btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(11, 13, 18, 0.25);
  border-top-color: var(--on-brand);
  border-radius: 50%;
  animation: auth-spin 0.8s linear infinite;
}

@keyframes auth-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
