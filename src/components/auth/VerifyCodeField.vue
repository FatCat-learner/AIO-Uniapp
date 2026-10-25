<template>
  <view class="code">
    <text class="code__label">{{ label }}</text>
    <view class="code__box">
      <AppIcon name="lock-outline" :size="18" class="code__icon" />
      <input
        class="code__input"
        type="number"
        :maxlength="length"
        :value="modelValue"
        placeholder="6 位数字"
        placeholder-class="code__ph"
        @input="onInput"
      >
      <view
        class="code__send"
        :class="{ 'is-disabled': running || loading }"
        @tap="onSend"
      >
        <text class="code__send-text">{{ running ? `重新发送 (${left}s)` : '获取验证码' }}</text>
      </view>
    </view>
    <text v-if="tip" class="code__tip">{{ CODE_TIP }}</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 验证码模块 VerifyCodeField（§16.14）
 * 四个入口共用：验证码登录 / 注册① / 忘记密码① /（小程序短信回落）
 * 发送前由父级先弹图形码，验证通过后再调 start() 进入 60 秒冷却。
 */
import AppIcon from '@/components/base/AppIcon.vue';
import { useCountdown } from '@/composables/useCountdown';
import { CODE_TIP } from './constants';

withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    length?: number;
    tip?: boolean;
    loading?: boolean;
  }>(),
  { label: '验证码', length: 6, tip: true, loading: false },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; 'send': [] }>();

const { left, running, start } = useCountdown();

function onInput(event: any) {
  emit('update:modelValue', event.detail.value);
}

function onSend() {
  if (running.value) return;
  emit('send');
}

defineExpose({ start, stop: () => undefined, running });
</script>

<style lang="scss" scoped>
.code {
  width: 100%;
}

.code__label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--fs-xs);
  color: var(--text-3);
}

.code__box {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 10px 0 14px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
}

.code__icon {
  margin-right: 10px;
  color: var(--text-3);
}

.code__input {
  flex: 1;
  height: 48px;
  font-size: var(--fs-base);
  color: var(--text-1);
}

.code__ph {
  color: var(--text-3);
}

.code__send {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 12px;
  background: rgb(var(--brand-500-rgb), 0.09);
  border-radius: var(--radius-xs);

  &.is-disabled {
    opacity: 0.6;
  }
}

.code__send-text {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--brand-500);
}

.code__tip {
  display: block;
  margin-top: 8px;
  font-size: 11.5px;
  line-height: var(--lh-snug);
  color: var(--text-3);
}
</style>
