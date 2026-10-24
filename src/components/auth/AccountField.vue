<template>
  <view class="acc">
    <view v-if="tabs" class="acc__tabs">
      <view class="acc__tab" :class="{ 'is-on': modelValue.type === 'phone' }" @tap="switchType('phone')">
        <text class="acc__tab-text">手机号</text>
      </view>
      <view class="acc__tab" :class="{ 'is-on': modelValue.type === 'email' }" @tap="switchType('email')">
        <text class="acc__tab-text">邮箱</text>
      </view>
    </view>

    <text v-if="showLabel" class="acc__label">{{ modelValue.type === 'phone' ? '手机号' : '邮箱' }}</text>

    <view class="acc__box">
      <AppIcon v-if="modelValue.type === 'email'" name="email-outline" :size="18" class="acc__icon" />
      <template v-else>
        <view class="acc__dial" @tap="sheetVisible = true">
          <text class="acc__dial-text">{{ modelValue.dial }}</text>
          <AppIcon name="menu-down" :size="16" class="acc__caret" />
        </view>
        <view class="acc__divider" />
      </template>

      <input
        class="acc__input"
        :value="modelValue.value"
        :type="modelValue.type === 'phone' ? 'number' : 'text'"
        :placeholder="placeholder"
        placeholder-class="acc__ph"
        @input="onInput"
      />
    </view>

    <CountrySheet
      :visible="sheetVisible"
      :active-dial="modelValue.dial"
      @close="sheetVisible = false"
      @select="onPickCountry"
    />
  </view>
</template>

<script setup lang="ts">
/**
 * 账号输入组件 AccountField（§16.11）
 * 一处实现，四处调用：登录 / 验证码登录 / 注册① / 忘记密码①
 * - 手机号：区号选择 + 11 位号码；切邮箱自动隐藏区号、换信封图标
 * - 切换 tab 清空输入，避免「手机号残留进邮箱」
 */
import { computed, ref } from 'vue'
import AppIcon from '@/components/base/AppIcon.vue'
import CountrySheet from './CountrySheet.vue'
import { DEFAULT_COUNTRY, type AccountType, type IAccountValue, type ICountry } from './constants'

const props = withDefaults(
  defineProps<{
    modelValue: IAccountValue
    label?: string
    tabs?: boolean
  }>(),
  { label: '', tabs: true },
)

const emit = defineEmits<{ 'update:modelValue': [value: IAccountValue] }>()

const sheetVisible = ref(false)

const placeholder = computed(() => (props.modelValue.type === 'phone' ? '11 位手机号' : 'you@example.com'))
/** 不传 label 时按类型自动显示，传空字符串才是真的不要 */
const showLabel = computed(() => props.label !== 'none')

function patch(partial: Partial<IAccountValue>) {
  emit('update:modelValue', { ...props.modelValue, ...partial })
}

function switchType(type: AccountType) {
  if (type === props.modelValue.type) return
  patch({ type, value: '', dial: props.modelValue.dial || DEFAULT_COUNTRY.dial })
}

function onInput(event: any) {
  patch({ value: event.detail.value })
}

function onPickCountry(item: ICountry) {
  patch({ dial: item.dial })
  sheetVisible.value = false
}
</script>

<style lang="scss" scoped>
.acc {
  width: 100%;
}

.acc__tabs {
  display: flex;
  height: 44px;
  margin-bottom: 14px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
}

.acc__tab {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: transparent;

  &.is-on {
    background: var(--fill);
  }
}

.acc__tab-text {
  font-size: var(--fs-base);
  color: var(--text-2);
}

.is-on .acc__tab-text {
  font-weight: 600;
  color: var(--text-1);
}

.acc__label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--fs-xs);
  color: var(--text-3);
}

.acc__box {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 14px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
}

.acc__icon {
  margin-right: 10px;
  color: var(--text-3);
}

.acc__dial {
  display: flex;
  align-items: center;
  gap: 2px;
}

.acc__dial-text {
  font-size: var(--fs-base);
  color: var(--text-1);
}

.acc__caret {
  color: var(--text-3);
}

.acc__divider {
  width: 1px;
  height: 26px;
  margin: 0 12px;
  background: var(--line-strong);
}

.acc__input {
  flex: 1;
  height: 48px;
  font-size: var(--fs-base);
  color: var(--text-1);
}

.acc__ph {
  color: var(--text-3);
}
</style>
