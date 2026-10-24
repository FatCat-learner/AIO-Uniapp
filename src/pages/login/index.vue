<template>
  <AuthScaffold :title="title" desc="回来继续，上次的计划还排在原来的位置。" back @back="back">
    <view class="form">
      <AccountField v-model="account" />
      <PasswordField v-model="password" label="密码" />

      <view class="form__row">
        <text class="form__link" @tap="goCodeLogin">用验证码登录</text>
        <text class="form__link" @tap="goReset">忘记密码?</text>
      </view>

      <AuthButton label="登录" :loading="loading" @tap="submit" />
      <OAuthRow :platform="platform" @select="onOauth" />
    </view>

    <template #foot>
      <AuthFootLink prefix="还没有账号？" link="立即注册" @tap="goRegister" />
    </template>
  </AuthScaffold>
</template>

<script setup lang="ts">
/**
 * 登录页（§16.1 P2）
 * 账号 / 密码 → 验证码登录与忘记密码 → 登录 → 快捷登录（微信 / QQ / 抖音 / 支付宝 + Apple|Google）
 */
import { computed, ref } from 'vue'
import AccountField from '@/components/auth/AccountField.vue'
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthFootLink from '@/components/auth/AuthFootLink.vue'
import AuthScaffold from '@/components/auth/AuthScaffold.vue'
import OAuthRow from '@/components/auth/OAuthRow.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import { createAccountValue, type IAccountValue, type OAuthProvider } from '@/components/auth/constants'
import { oauthLogin } from '@/api/auth'
import useAuthStore from '@/store/auth'
import { detectPlatform } from '@/utils/platform'
import { setToken } from '@/utils/auth'

const title = [
  { text: '今天练的每一组' },
  { text: '明天都算数', brand: true },
]

const authStore = useAuthStore()
const account = ref<IAccountValue>(createAccountValue('phone'))
const password = ref('')
const loading = ref(false)
const platform = detectPlatform()

const accountText = computed(() => account.value.value.trim())

function back() {
  uni.navigateBack()
}

async function submit() {
  if (!accountText.value) {
    uni.showToast({ title: '请填写账号', icon: 'none' })
    return
  }
  if (!password.value) {
    uni.showToast({ title: '请填写密码', icon: 'none' })
    return
  }
  loading.value = true
  try {
    await authStore.login({ username: accountText.value, password: password.value })
    await enterApp()
  }
  catch (error: any) {
    uni.showToast({ title: error?.message || '登录失败，请稍后再试', icon: 'none' })
  }
  finally {
    loading.value = false
  }
}

function onOauth(provider: OAuthProvider) {
  void doOauth(provider)
}

async function doOauth(provider: OAuthProvider) {
  loading.value = true
  try {
    // 真机上这里是 uni.login / 开放平台拿到的临时 code，开发期用假 code
    const res: any = await oauthLogin({ provider, code: `dev_${Date.now()}` })
    if (res?.access_token) {
      setToken(res.access_token)
      await enterApp()
    }
  }
  catch (error: any) {
    uni.showToast({ title: error?.message || '快捷登录失败', icon: 'none' })
  }
  finally {
    loading.value = false
  }
}

/**
 * 过一遍权限守卫再进首页：
 * 先确认 token 能换回用户信息（拦截器负责 401 刷新/踢出），再 reLaunch。
 */
async function enterApp() {
  await authStore.info()
  uni.reLaunch({ url: '/pages/index/index' })
}

function goCodeLogin() {
  uni.navigateTo({ url: '/pages/code-login/index' })
}

function goReset() {
  uni.navigateTo({ url: '/pages/reset-password/index' })
}

function goRegister() {
  uni.navigateTo({ url: '/pages/register/index' })
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form__link {
  font-size: var(--fs-xs);
  color: var(--text-2);
}
</style>
