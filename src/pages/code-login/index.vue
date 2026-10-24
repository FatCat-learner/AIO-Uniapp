<template>
  <AuthScaffold :title="title" desc="一条验证码登录，换设备也不用慌。" back @back="back">
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
import { computed, reactive, ref } from 'vue'
import AppTopNotice from '@/components/base/AppTopNotice.vue'
import AccountField from '@/components/auth/AccountField.vue'
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthFootLink from '@/components/auth/AuthFootLink.vue'
import AuthScaffold from '@/components/auth/AuthScaffold.vue'
import CaptchaModal from '@/components/auth/CaptchaModal.vue'
import VerifyCodeField from '@/components/auth/VerifyCodeField.vue'
import { createAccountValue, type IAccountValue } from '@/components/auth/constants'
import { codeLogin, sendAuthCode } from '@/api/auth'
import { setToken } from '@/utils/auth'

const title = [
  { text: '不用记密码' },
]

const notice = reactive({ visible: false, title: '', message: '' })
const account = ref<IAccountValue>(createAccountValue('phone'))
const code = ref('')
const loading = ref(false)
const captchaVisible = ref(false)
const codeField = ref<InstanceType<typeof VerifyCodeField> | null>(null)

const accountText = computed(() => account.value.value.trim())

function back() {
  uni.navigateBack()
}

function requestCode() {
  if (!accountText.value) {
    uni.showToast({ title: '请先填写账号', icon: 'none' })
    return
  }
  captchaVisible.value = true
}

async function onCaptchaPass() {
  captchaVisible.value = false
  try {
    const res = await sendAuthCode({
      account_type: account.value.type,
      account: accountText.value,
      scene: 'login',
    })
    codeField.value?.start(60)
    // 开发期：后端直接把模拟码返回，顶部弹窗展示
    notice.visible = true
    notice.title = '模拟验证码已生成'
    notice.message = `${res?.code ?? ''}　（开发期不发短信，直接用它登录）`
  }
  catch (error: any) {
    uni.showToast({ title: error?.message || '发送失败，请重试', icon: 'none' })
  }
}

async function submit() {
  if (!accountText.value) {
    uni.showToast({ title: '请填写账号', icon: 'none' })
    return
  }
  if (code.value.length !== 6) {
    uni.showToast({ title: '请输入 6 位验证码', icon: 'none' })
    return
  }
  loading.value = true
  try {
    const res = await codeLogin({
      account_type: account.value.type,
      account: accountText.value,
      code: code.value,
    })
    if (res?.access_token) setToken(res.access_token)
    uni.reLaunch({ url: '/pages/index/index' })
  }
  catch (error: any) {
    uni.showToast({ title: error?.message || '验证码不对，或已过期', icon: 'none' })
  }
  finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
