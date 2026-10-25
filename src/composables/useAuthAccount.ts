import type { IAccountValue } from '@/components/auth/constants';
import { computed, ref } from 'vue';
import { createAccountValue } from '@/components/auth/constants';

/**
 * auth 四页的账号输入态：默认手机号 + 区号，提交前统一 trim
 * 登录 / 验证码登录 / 注册① / 忘记密码① 用的是同一套
 */
export function useAuthAccount() {
  const account = ref<IAccountValue>(createAccountValue('phone'));
  const accountText = computed(() => account.value.value.trim());

  return { account, accountText };
}
