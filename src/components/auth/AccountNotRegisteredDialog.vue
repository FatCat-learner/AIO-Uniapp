<template>
  <view v-if="visible" class="unu" :style="{ zIndex: overlayZ('dialog') }">
    <view class="unu__mask" @tap="close" />

    <view class="unu__panel">
      <view class="unu__head">
        <text class="unu__title">
          账号未注册
        </text>
        <view class="unu__close" @tap="close">
          <AppIcon name="close" :size="16" />
        </view>
      </view>

      <text class="unu__desc">{{ accountText }} 还没有注册，注册后就能用它登录。</text>

      <view class="unu__actions">
        <view class="unu__btn unu__btn--ghost" @tap="switchAccount">
          换个账号
        </view>
        <view class="unu__btn unu__btn--primary" @tap="goRegister">
          去注册
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 「账号未注册」确认弹窗（验证码登录 / 找回密码用）。
 * 用自绘弹窗而不是 uni.showModal：后者是系统白底弹窗，深色荧光绿主题下很跳（2026-10-25 反馈）。
 * 关闭（右上角 X / 点遮罩）什么都不做，只是收起；「换个账号」交给页面清空账号框。
 */
import type { IAccountValue } from '@/components/auth/constants';
import { computed, ref } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';
import { overlayZ } from '@/components/overlays/overlayStack';
import { setAuthPrefill } from '@/utils/auth';

const emit = defineEmits<{ switchAccount: [] }>();

const visible = ref(false);
const account = ref<IAccountValue | null>(null);
const accountText = computed(() => account.value?.value || '该账号');

function close() {
  visible.value = false;
}

function open(value: IAccountValue) {
  account.value = value;
  visible.value = true;
}

function switchAccount() {
  close();
  emit('switchAccount');
}

function goRegister() {
  // 带上账号跳注册页，用户只补验证码和密码
  if (account.value) setAuthPrefill({ account: account.value, password: '' });
  close();
  uni.navigateTo({ url: '/pages/register/index' });
}

defineExpose({ open, close });
</script>

<style lang="scss" scoped>
.unu {
  position: fixed;
  inset: 0;
}

.unu__mask {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 62%);
}

.unu__panel {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  max-width: calc(100% - 72px);
  padding: 18px 18px 16px;
  background: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-xxl);
  box-shadow: var(--shadow-float);
  transform: translate(-50%, -50%);
}

.unu__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.unu__title {
  font-size: var(--fs-lg);
  font-weight: 600;
  color: var(--text-1);
  letter-spacing: 0.2px;
}

.unu__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin: -2px -4px 0 0;
  color: var(--text-3);
  background: var(--fill);
  border-radius: var(--radius-full);
}

.unu__desc {
  display: block;
  margin-top: 10px;
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  color: var(--text-2);
}

.unu__actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.unu__btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-size: var(--fs-body);
  font-weight: 600;
  border-radius: var(--radius-full);
}

.unu__btn--ghost {
  color: var(--text-1-soft);
  background: var(--surface-2);
  border: 1px solid var(--line-strong);
}

.unu__btn--primary {
  color: var(--on-brand);
  background: var(--brand-500);
  box-shadow: var(--glow);
}
</style>
