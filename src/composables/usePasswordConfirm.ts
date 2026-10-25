import type { Ref } from 'vue';
import { computed } from 'vue';

/**
 * 两次密码一致性提示：注册② 与 忘记密码② 共用同一句（§16.12）
 * 返回空串表示通过，PasswordField 的 invalid 直接吃这个值
 */
export function usePasswordConfirm(password: Ref<string>, confirm: Ref<string>) {
  return computed(() => (confirm.value && confirm.value !== password.value ? '两次输入的密码不一致' : ''));
}
