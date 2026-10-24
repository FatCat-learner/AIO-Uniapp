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
            placeholder="怎么称呼你"
            placeholder-class="field__ph"
            @input="onNickname"
          />
        </view>
      </view>

      <PasswordField v-model="password" label="密码" strength rules />

      <PasswordField v-model="confirm" label="确认密码" placeholder="再输一次" :invalid="mismatch" />

      <view class="terms" @tap="agreed = !agreed">
        <AppIcon :name="agreed ? 'checkbox-marked' : 'checkbox-blank-outline'" :size="16" :class="{ 'is-on': agreed }" />
        <text class="terms__text">我已阅读并同意 服务条款 与 隐私政策，训练数据只用于给我自己看。</text>
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
/**
 * 注册页（§16.1 P4，两步）
 * ① 手机号 / 邮箱 + 验证码（小程序里换成微信一键取号）
 * ② 昵称 + 密码 + 确认密码 + 条款
 */
import { computed, reactive, ref } from 'vue'
import AppTopNotice from '@/components/base/AppTopNotice.vue'
import AppIcon from '@/components/base/AppIcon.vue'
import AccountField from '@/components/auth/AccountField.vue'
import AuthButton from '@/components/auth/AuthButton.vue'
import AuthFootLink from '@/components/auth/AuthFootLink.vue'
import AuthScaffold from '@/components/auth/AuthScaffold.vue'
import CaptchaModal from '@/components/auth/CaptchaModal.vue'
import PasswordField from '@/components/auth/PasswordField.vue'
import VerifyCodeField from '@/components/auth/VerifyCodeField.vue'
import { createAccountValue, type IAccountValue } from '@/components/auth/constants'
import { registerByAccount, sendAuthCode } from '@/api/auth'
import { isMiniProgram } from '@/utils/platform'

const isMp = isMiniProgram()

const title = computed(() => (current.value === 1
  ? [{ text: '先验证' }, { text: account.value.type === 'phone' ? '手机号' : '邮箱', brand: true }]
  : [{ text: '设置' }, { text: '昵称与密码', brand: true }]))
const desc = computed(() => (current.value === 1
  ? '验证通过才建号，一个号只建一次。'
  : '建完直接登录，训练计划马上排进本周。'))
const step = computed(() => `第 ${current.value} / 2 步`)

const notice = reactive({ visible: false, title: '', message: '' })
const current = ref(1)
const account = ref<IAccountValue>(createAccountValue('phone'))
const code = ref('')
const nickname = ref('James')
const password = ref('')
const confirm = ref('')
const agreed = ref(false)
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

function onNickname(event: any) {
  nickname.value = event.detail.value
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
      scene: 'register',
    })
    codeField.value?.start(60)
    notice.visible = true
    notice.title = '模拟验证码已生成'
    notice.message = `${res?.code ?? ''}　（开发期不发送短信，直接填它继续）`
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
  if (!isMp && code.value.length !== 6) {
    uni.showToast({ title: '请输入 6 位验证码', icon: 'none' })
    return
  }
  checking.value = true
  // 真实校验交给后端：这里只做前端能判的那一层
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
  if (!agreed.value) {
    uni.showToast({ title: '请先勾选同意条款', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await registerByAccount({
      account_type: account.value.type,
      account: accountText.value,
      code: code.value,
      nickname: nickname.value.trim() || '训练者',
      password: password.value,
    })
    uni.showToast({ title: '账号已创建，请登录', icon: 'none' })
    setTimeout(() => uni.reLaunch({ url: '/pages/login/index' }), 600)
  }
  catch (error: any) {
    uni.showToast({ title: error?.message || '注册失败，请稍后再试', icon: 'none' })
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

.field__label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--fs-xs);
  color: var(--text-3);
}

.field__box {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 14px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
}

.field__icon {
  margin-right: 10px;
  color: var(--text-3);
}

.field__input {
  flex: 1;
  height: 48px;
  font-size: var(--fs-base);
  color: var(--text-1);
}

.field__ph {
  color: var(--text-3);
}

.terms {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 2px 0;
}

.terms__text {
  flex: 1;
  font-size: 11.5px;
  line-height: var(--lh-snug);
  color: var(--text-3);
}

.is-on {
  color: var(--brand-500);
}
</style>
