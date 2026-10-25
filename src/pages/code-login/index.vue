<template>
  <AuthScaffold :title="title" :desc="CODE_LOGIN_DESC" back @back="back">
    <AppTopNotice
      :visible="notice.visible"
      :title="notice.title"
      :message="notice.message"
      @close="notice.visible = false"
    />
    <view class="form">
      <AccountField v-model="account" />
      <VerifyCodeField ref="codeField" v-model="code" @send="requestCode" />
      <AuthButton label="登录" :loading="loading" @tap="submit" />
    </view>

    <template #foot>
      <AuthFootLink prefix="想用密码登录？" link="切回密码" @tap="back" />
    </template>

    <CaptchaModal :visible="captchaVisible" @close="captchaVisible = false" @success="onCaptchaPass" />
  </AuthScaffold>
</template>

<script setup lang="ts">
/**
 * 验证码登录页（§16.1 P3）
 * 手机号 / 邮箱任一取码；点「获取验证码」先过图形码，通过后 60 秒冷却。
 */
import { ref } from 'vue';
import { codeLogin } from '@/api/auth';
import AccountField from '@/components/auth/AccountField.vue';
import AuthButton from '@/components/auth/AuthButton.vue';
import AuthFootLink from '@/components/auth/AuthFootLink.vue';
import AuthScaffold from '@/components/auth/AuthScaffold.vue';
import CaptchaModal from '@/components/auth/CaptchaModal.vue';
import VerifyCodeField from '@/components/auth/VerifyCodeField.vue';
import AppTopNotice from '@/components/base/AppTopNotice.vue';
import { useAuthAccount } from '@/composables/useAuthAccount';
import { useAuthCode } from '@/composables/useAuthCode';
import { setToken } from '@/utils/auth';
import { toast } from '@/utils/ui';
import { CODE_LOGIN_DESC, CODE_LOGIN_SCENE, CODE_LOGIN_TITLE } from './config';

const title = CODE_LOGIN_TITLE;

const { account, accountText } = useAuthAccount();
const code = ref('');
const loading = ref(false);
const codeField = ref<InstanceType<typeof VerifyCodeField> | null>(null);
const { notice, captchaVisible, requestCode, onCaptchaPass } = useAuthCode({
  account,
  accountText,
  scene: CODE_LOGIN_SCENE,
  codeField,
});

function back() {
  uni.navigateBack();
}

async function submit() {
  if (!accountText.value) {
    toast('请填写账号');
    return;
  }
  if (code.value.length !== 6) {
    toast('请输入 6 位验证码');
    return;
  }
  loading.value = true;
  try {
    const res = await codeLogin({
      account_type: account.value.type,
      account: accountText.value,
      code: code.value,
    });
    if (res?.access_token) setToken(res.access_token);
    uni.reLaunch({ url: '/pages/index/index' });
  }
  catch (error: any) {
    toast(error?.message || '验证码不对，或已过期');
  }
  finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/auth-form.scss';
</style>
