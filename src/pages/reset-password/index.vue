<template>
  <AuthScaffold :title="title" :desc="desc" :step="step" back @back="back">
    <AppTopNotice
      :visible="notice.visible"
      :title="notice.title"
      :message="notice.message"
      @close="notice.visible = false"
    />
    <view v-if="current === 1" class="form">
      <AccountField v-model="account" />
      <VerifyCodeField ref="codeField" v-model="code" @send="requestCode" />
      <AuthButton label="验证并继续" :loading="checking" @tap="next" />
    </view>

    <view v-else class="form">
      <PasswordField v-model="password" label="新密码" strength rules />
      <PasswordField v-model="confirm" label="确认新密码" placeholder="再输一次" :invalid="mismatch" />
      <AuthButton label="确定修改" dense :loading="submitting" @tap="submit" />
    </view>

    <template #foot>
      <AuthFootLink prefix="想起来了？" link="回登录" @tap="goLogin" />
    </template>

    <CaptchaModal :visible="captchaVisible" @close="captchaVisible = false" @success="onCaptchaPass" />
  </AuthScaffold>
</template>

<script setup lang="ts">
import type { ResetStep } from './config';
/**
 * 忘记密码（§16.1 P5，两步）
 * ① 账号 + 验证码 ② 新密码 + 确认；改完会让所有已登录设备退出（回登录页重新登录）
 */
import { computed, ref } from 'vue';
import { resetPassword } from '@/api/auth';
import AccountField from '@/components/auth/AccountField.vue';
import AuthButton from '@/components/auth/AuthButton.vue';
import AuthFootLink from '@/components/auth/AuthFootLink.vue';
import AuthScaffold from '@/components/auth/AuthScaffold.vue';
import CaptchaModal from '@/components/auth/CaptchaModal.vue';
import { AUTH_REDIRECT_DELAY, LOGIN_PAGE_URL } from '@/components/auth/constants';
import PasswordField from '@/components/auth/PasswordField.vue';
import VerifyCodeField from '@/components/auth/VerifyCodeField.vue';
import AppTopNotice from '@/components/base/AppTopNotice.vue';
import { useAuthAccount } from '@/composables/useAuthAccount';
import { useAuthCode } from '@/composables/useAuthCode';
import { useAuthSteps } from '@/composables/useAuthSteps';
import { usePasswordConfirm } from '@/composables/usePasswordConfirm';
import { toast } from '@/utils/ui';
import { RESET_DESC, RESET_SCENE, resetTitle } from './config';

// 步骤状态声明在用到它的 computed 之前（ts/no-use-before-define）
const current = ref<ResetStep>(1);
const { account, accountText } = useAuthAccount();
const { checking, stepText: step, advance, back } = useAuthSteps(current);

const title = computed(() => resetTitle(current.value));
const desc = computed(() => RESET_DESC[current.value]);

const code = ref('');
const password = ref('');
const confirm = ref('');
const submitting = ref(false);
const codeField = ref<InstanceType<typeof VerifyCodeField> | null>(null);
const mismatch = usePasswordConfirm(password, confirm);
const { notice, captchaVisible, requestCode, onCaptchaPass } = useAuthCode({
  account,
  accountText,
  scene: RESET_SCENE,
  codeField,
});

async function next() {
  if (!accountText.value) {
    toast('请填写账号');
    return;
  }
  if (code.value.length !== 6) {
    toast('请输入 6 位验证码');
    return;
  }
  advance();
}

async function submit() {
  if (password.value !== confirm.value) {
    toast('两次密码不一致');
    return;
  }
  submitting.value = true;
  try {
    await resetPassword({
      account_type: account.value.type,
      account: accountText.value,
      code: code.value,
      password: password.value,
    });
    toast('密码已修改');
    setTimeout(goLogin, AUTH_REDIRECT_DELAY);
  }
  catch (error: any) {
    toast(error?.message || '修改失败，请稍后再试');
  }
  finally {
    submitting.value = false;
  }
}

function goLogin() {
  uni.reLaunch({ url: LOGIN_PAGE_URL });
}
</script>

<style lang="scss" scoped>
@import '@/styles/auth-form.scss';
</style>
