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
      <VerifyCodeField ref="codeField" v-model="code" :tip="!isMp" @send="requestCode" />
      <AuthButton label="验证并继续" :loading="checking" @tap="next" />
    </view>

    <view v-else class="form">
      <view class="field">
        <text class="field__label">昵称</text>
        <view class="field__box">
          <AppIcon name="account-outline" :size="18" class="field__icon" />
          <input
            class="field__input"
            :value="nickname"
            :placeholder="NICKNAME_PLACEHOLDER"
            placeholder-class="field__ph"
            @input="onNickname"
          >
        </view>
      </view>

      <PasswordField v-model="password" label="密码" strength rules />

      <PasswordField v-model="confirm" label="确认密码" placeholder="再输一次" :invalid="mismatch" />

      <view class="terms" @tap="agreed = !agreed">
        <AppIcon :name="agreed ? 'checkbox-marked' : 'checkbox-blank-outline'" :size="16" :class="{ 'is-on': agreed }" />
        <text class="terms__text">{{ TERMS_TEXT }}</text>
      </view>

      <AuthButton label="创建账号" dense :loading="submitting" @tap="submit" />
    </view>

    <template #foot>
      <AuthFootLink v-if="current === 1" prefix="已经有账号了？" link="登录" @tap="goLogin" />
      <AuthFootLink v-else link="上一步" @tap="current = 1" />
    </template>

    <CaptchaModal :visible="captchaVisible" @close="captchaVisible = false" @success="onCaptchaPass" />
  </AuthScaffold>
</template>

<script setup lang="ts">
import type { RegisterStep } from './config';
/**
 * 注册页（§16.1 P4，两步）
 * ① 手机号 / 邮箱 + 验证码（小程序里换成微信一键取号）
 * ② 昵称 + 密码 + 确认密码 + 条款
 */
import { computed, ref } from 'vue';
import { registerByAccount } from '@/api/auth';
import AccountField from '@/components/auth/AccountField.vue';
import AuthButton from '@/components/auth/AuthButton.vue';
import AuthFootLink from '@/components/auth/AuthFootLink.vue';
import AuthScaffold from '@/components/auth/AuthScaffold.vue';
import CaptchaModal from '@/components/auth/CaptchaModal.vue';
import { AUTH_REDIRECT_DELAY, LOGIN_PAGE_URL } from '@/components/auth/constants';
import PasswordField from '@/components/auth/PasswordField.vue';
import VerifyCodeField from '@/components/auth/VerifyCodeField.vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppTopNotice from '@/components/base/AppTopNotice.vue';
import { useAuthAccount } from '@/composables/useAuthAccount';
import { useAuthCode } from '@/composables/useAuthCode';
import { useAuthSteps } from '@/composables/useAuthSteps';
import { usePasswordConfirm } from '@/composables/usePasswordConfirm';
import { isMiniProgram } from '@/utils/platform';
import { toast } from '@/utils/ui';
import {
  NICKNAME_FALLBACK,
  NICKNAME_PLACEHOLDER,
  NICKNAME_SEED,
  REGISTER_DESC,
  REGISTER_SCENE,
  registerTitle,
  TERMS_TEXT,
} from './config';

const isMp = isMiniProgram();

// 步骤状态声明在用到它的 computed 之前（ts/no-use-before-define）
const current = ref<RegisterStep>(1);
const { account, accountText } = useAuthAccount();
const { checking, stepText: step, advance, back } = useAuthSteps(current);

const title = computed(() => registerTitle(current.value, account.value.type));
const desc = computed(() => REGISTER_DESC[current.value]);

const code = ref('');
const nickname = ref(NICKNAME_SEED);
const password = ref('');
const confirm = ref('');
const agreed = ref(false);
const submitting = ref(false);
const codeField = ref<InstanceType<typeof VerifyCodeField> | null>(null);
const mismatch = usePasswordConfirm(password, confirm);
const { notice, captchaVisible, requestCode, onCaptchaPass } = useAuthCode({
  account,
  accountText,
  scene: REGISTER_SCENE,
  codeField,
});

function onNickname(event: any) {
  nickname.value = event.detail.value;
}

async function next() {
  if (!accountText.value) {
    toast('请填写账号');
    return;
  }
  if (!isMp && code.value.length !== 6) {
    toast('请输入 6 位验证码');
    return;
  }
  // 真实校验交给后端：这里只做前端能判的那一层
  advance();
}

async function submit() {
  if (password.value !== confirm.value) {
    toast('两次密码不一致');
    return;
  }
  if (!agreed.value) {
    toast('请先勾选同意条款');
    return;
  }
  submitting.value = true;
  try {
    await registerByAccount({
      account_type: account.value.type,
      account: accountText.value,
      code: code.value,
      nickname: nickname.value.trim() || NICKNAME_FALLBACK,
      password: password.value,
    });
    toast('账号已创建，请登录');
    setTimeout(() => uni.reLaunch({ url: LOGIN_PAGE_URL }), AUTH_REDIRECT_DELAY);
  }
  catch (error: any) {
    toast(error?.message || '注册失败，请稍后再试');
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
@import './styles/index.scss';
</style>
