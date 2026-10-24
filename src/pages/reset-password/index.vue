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
/**
 * 忘记密码（§16.1 P5，两步）
 * ① 账号 + 验证码 ② 新密码 + 确认；改完会让所有已登录设备退出（回登录页重新登录）
 */
import { computed, reactive, ref } from 'vue'
import AppTopNotice from '@/components/base/AppTopNotice.vue'
import AccountField from '@/components/auth/AccountField.vue'
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthFootLink from '@/components/auth/AuthFootLink.vue'
import AuthScaffold from '@/components/auth/AuthScaffold.vue'
import CaptchaModal from '@/components/auth/CaptchaModal.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import VerifyCodeField from '@/components/auth/VerifyCodeField.vue'
import { createAccountValue, type IAccountValue } from '@/components/auth/constants'
import { resetPassword, sendAuthCode } from '@/api/auth'

const title = computed(() => (current.value === 1
  ? [{ text: '找回账号' }]
  : [{ text: '设置新密码' }]))
const desc = computed(() => (current.value === 1
  ? '先验证这条账号是你在用。'
  : '改完这个账号所有已登录设备会退出。'))
const step = computed(() => `第 ${current.value} / 2 步`)

const notice = reactive({ visible: false, title: '', message: '' })
const current = ref(1)
const account = ref<IAccountValue>(createAccountValue('phone'))
const code = ref('')
const password = ref('')
const confirm = ref('')
const checking = ref(false)
const submitting = ref(false)
const captchaVisible = ref(false)
const codeField = ref<InstanceType<typeof VerifyCodeField> | null>(null)

const accountText = computed(() => account.value.value.trim())
const mismatch = computed(() => (confirm.value && confirm.value !== password.value ? '两次输入的密码不一致' : ''))

function back() {
  if (current.value === 2) {
    current.value = 1
    return
  }
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
      scene: 'reset',
    })
    codeField.value?.start(60)
    notice.visible = true
    notice.title = '模拟验证码已生成'
    notice.message = `${res?.code ?? ''}　（开发期不发短信，直接填它继续）`
  }
  catch (error: any) {
    uni.showToast({ title: error?.message || '发送失败，请重试', icon: 'none' })
  }
}

async function next() {
  if (!accountText.value) {
    uni.showToast({ title: '请填写账号', icon: 'none' })
    return
  }
  if (code.value.length !== 6) {
    uni.showToast({ title: '请输入 6 位验证码', icon: 'none' })
    return
  }
  checking.value = true
  setTimeout(() => {
    checking.value = false
    current.value = 2
  }, 260)
}

async function submit() {
  if (password.value !== confirm.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await resetPassword({
      account_type: account.value.type,
      account: accountText.value,
      code: code.value,
      password: password.value,
    })
    uni.showToast({ title: '密码已修改', icon: 'none' })
    setTimeout(() => goLogin(), 600)
  }
  catch (error: any) {
    uni.showToast({ title: error?.message || '修改失败，请稍后再试', icon: 'none' })
  }
  finally {
    submitting.value = false
  }
}

function goLogin() {
  uni.reLaunch({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
