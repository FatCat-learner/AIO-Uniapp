import type { Ref } from 'vue';
import { computed, ref } from 'vue';

/** 「验证并继续」的过场：只为按钮 loading 留一点视觉反馈，不代表真实校验 */
const STEP_SWITCH_DELAY = 260;

/**
 * 两步式 auth 流程（注册 / 忘记密码）
 * back：第 2 步先退回第 1 步，第 1 步才真正返回上一页
 */
export function useAuthSteps(current: Ref<1 | 2>) {
  const checking = ref(false);

  const stepText = computed(() => `第 ${current.value} / 2 步`);

  function advance() {
    checking.value = true;
    setTimeout(() => {
      checking.value = false;
      current.value = 2;
    }, STEP_SWITCH_DELAY);
  }

  function back() {
    if (current.value === 2) {
      current.value = 1;
      return;
    }
    uni.navigateBack();
  }

  return { checking, stepText, advance, back };
}
