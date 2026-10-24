<template>
  <view class="pwd">
    <text class="pwd__label">{{ label }}</text>

    <view class="pwd__box" :class="{ 'is-bad': invalid }">
      <AppIcon name="lock-outline" :size="18" class="pwd__icon" />
      <input
        class="pwd__input"
        :password="!visible"
        :value="modelValue"
        :placeholder="placeholder"
        placeholder-class="pwd__ph"
        @input="onInput"
      />
      <view class="pwd__eye" @tap="visible = !visible">
        <AppIcon :name="visible ? 'eye-off-outline' : 'eye-outline'" :size="18" class="pwd__eye-icon" />
      </view>
    </view>

    <template v-if="strength">
      <view class="pwd__bars">
        <view v-for="index in 4" :key="index" class="pwd__bar" :class="{ 'is-on': index <= level }" />
      </view>
      <view class="pwd__strength">
        <text class="pwd__strength-label">{{ PASSWORD_HINT }}</text>
        <text class="pwd__strength-value">强度 {{ text }}</text>
      </view>
    </template>

    <view v-if="rules" class="pwd__rules">
      <view v-for="item in ruleList" :key="item.key" class="pwd__rule">
        <AppIcon :name="item.ok ? 'check-circle' : 'circle-outline'" :size="12" :class="{ 'is-ok': item.ok }" />
        <text class="pwd__rule-text" :class="{ 'is-ok': item.ok }">{{ item.label }}</text>
      </view>
    </view>

    <text v-if="invalid" class="pwd__error">{{ invalid }}</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 密码输入模块 PasswordField（§16.12）
 * 注册② 与 忘记密码② 共用：密码框 → 4 段强度条 → 强度文案 → 规则清单
 */
import { ref } from 'vue'
import AppIcon from '@/components/base/AppIcon.vue'
import { usePasswordRules } from '@/composables/usePasswordRules'
import { PASSWORD_HINT } from './constants'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    strength?: boolean
    rules?: boolean
    invalid?: string
  }>(),
  { label: '密码', placeholder: '请输入密码', strength: false, rules: false, invalid: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const visible = ref(false)
const { rules: ruleList, level, text } = usePasswordRules(() => props.modelValue)

function onInput(event: any) {
  emit('update:modelValue', event.detail.value)
}
</script>

<style lang="scss" scoped>
.pwd {
  width: 100%;
}

.pwd__label {
  display: block;
  margin-bottom: 6px;
  font-size: var(--fs-xs);
  color: var(--text-3);
}

.pwd__box {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 10px 0 14px;
  background: var(--surface-2);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);

  &.is-bad {
    border-color: var(--danger);
  }
}

.pwd__icon {
  margin-right: 10px;
  color: var(--text-3);
}

.pwd__input {
  flex: 1;
  height: 48px;
  font-size: var(--fs-base);
  color: var(--text-1);
}

.pwd__ph {
  color: var(--text-3);
}

.pwd__eye {
  padding: 4px;
}

.pwd__eye-icon {
  color: var(--text-3);
}

.pwd__bars {
  display: flex;
  gap: 5px;
  margin-top: 10px;
}

.pwd__bar {
  flex: 1;
  height: 3px;
  background: var(--line);
  border-radius: 2px;

  &.is-on {
    background: var(--brand-500);
  }
}

.pwd__strength {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.pwd__strength-label {
  font-size: 11.5px;
  color: var(--text-3);
}

.pwd__strength-value {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--brand-500);
}

.pwd__rules {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
}

.pwd__rule {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 50%;
  padding: 2px 0;
}

.pwd__rule-text {
  font-size: 11.5px;
  color: var(--text-3);

  &.is-ok {
    color: var(--text-2);
  }
}

.is-ok {
  color: var(--brand-500);
}

.pwd__error {
  display: block;
  margin-top: 6px;
  font-size: 11.5px;
  color: var(--danger);
}
</style>
