<template>
  <view v-if="visible" class="cap" :style="{ zIndex: overlayZ('dialog') }">
    <view class="cap__mask" @tap="emit('close')" />
    <view class="cap__panel">
      <view class="cap__head">
        <text class="cap__title">安全验证</text>
        <text class="cap__close" @tap="emit('close')">关闭</text>
      </view>
      <text class="cap__desc">请输入图中 4 位字符，确认不是机器人后才会发送验证码。</text>

      <view class="cap__row">
        <view class="cap__img" @tap="refresh">
          <text
            v-for="(char, index) in chars"
            :key="index"
            class="cap__char"
            :class="`cap__char--${index}`"
          >
            {{ char }}
          </text>
        </view>
        <view class="cap__input-box">
          <input
            class="cap__input"
            :value="input"
            maxlength="4"
            placeholder="4 位字符"
            placeholder-class="cap__ph"
            @input="onInput"
          >
        </view>
      </view>

      <text v-if="error" class="cap__error">{{ error }}</text>

      <AuthButton :label="loading ? '发送中' : '确认并发送'" :loading="loading" @tap="submit" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 图形码弹窗：任何「获取验证码」都先过这一道（自研字符图形码，§16.6）
 * 输错自动换一张，不弹 toast，错误就地显示。
 */
import { ref, watch } from 'vue';
import { overlayZ } from '@/components/overlays/overlayStack';
import AuthButton from './AuthButton.vue';

const props = withDefaults(defineProps<{ visible: boolean; loading?: boolean }>(), { loading: false });

const emit = defineEmits<{ close: []; success: [] }>();

const POOL = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const chars = ref<string[]>([]);
const input = ref('');
const error = ref('');

function refresh() {
  const next: string[] = [];
  while (next.length < 4) {
    const char = POOL[Math.floor(Math.random() * POOL.length)];
    next.push(char);
  }
  chars.value = next;
  input.value = '';
  error.value = '';
}

watch(
  () => props.visible,
  (value) => {
    if (value) refresh();
  },
  { immediate: true },
);

function onInput(event: any) {
  input.value = String(event.detail.value || '').toUpperCase();
  error.value = '';
}

function submit() {
  if (input.value.length !== 4) {
    error.value = '请输入 4 位字符';
    return;
  }
  if (input.value !== chars.value.join('')) {
    error.value = '字符不对，已换一张，请重新输入';
    refresh();
    return;
  }
  emit('success');
}
</script>

<style lang="scss" scoped>
.cap {
  position: fixed;
  inset: 0;
}

.cap__mask {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 60%);
}

.cap__panel {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20px 22px 26px;
  background: var(--surface-2);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.cap__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cap__title {
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text-1);
}

.cap__close {
  font-size: var(--fs-sm);
  color: var(--text-3);
}

.cap__desc {
  display: block;
  margin-top: 8px;
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  color: var(--text-2);
}

.cap__row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 14px 0 6px;
}

.cap__img {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 108px;
  height: 44px;
  background: var(--fill);
  border-radius: var(--radius-xs);
}

.cap__char {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-1);

  &--0 {
    color: var(--brand-500);
    transform: rotate(-9deg);
  }

  &--1 {
    transform: rotate(7deg);
  }

  &--2 {
    color: var(--text-2);
    transform: rotate(-6deg);
  }

  &--3 {
    color: var(--brand-500);
    transform: rotate(10deg);
  }
}

.cap__input-box {
  display: flex;
  flex: 1;
  align-items: center;
  height: 44px;
  padding: 0 14px;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-xs);
}

.cap__input {
  flex: 1;
  height: 44px;
  font-size: var(--fs-base);
  color: var(--text-1);
}

.cap__ph {
  color: var(--text-3);
}

.cap__error {
  display: block;
  margin-bottom: 10px;
  font-size: 11.5px;
  color: var(--danger);
}
</style>
