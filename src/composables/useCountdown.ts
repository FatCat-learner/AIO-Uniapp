import { computed, onUnmounted, ref } from 'vue';

/**
 * 验证码倒计时（60 秒冷却，不是延迟发送）
 * 用法：const { left, running, start } = useCountdown(); start(60)
 */
export function useCountdown() {
  const left = ref(0);
  let timer: ReturnType<typeof setInterval> | null = null;

  const running = computed(() => left.value > 0);

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    left.value = 0;
  }

  function start(seconds = 60) {
    stop();
    left.value = seconds;
    timer = setInterval(() => {
      left.value -= 1;
      if (left.value <= 0) stop();
    }, 1000);
  }

  onUnmounted(stop);

  return { left, running, start, stop };
}
