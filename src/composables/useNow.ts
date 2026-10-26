import { ref } from 'vue';

/**
 * 全局 300ms 心跳
 *
 * 训练时长、休息计时浮层都要一个「现在」的时间戳。原来心跳挂在训练页组件里，
 * 页面一卸载（训练面板收成首页胶囊）时间就停住 —— 所以提到 App 层，
 * 由 App.vue 的 onLaunch 启动一次，所有消费者共享同一个 now。
 */
export const now = ref(Date.now());

let ticker: ReturnType<typeof setInterval> | undefined;

/** 启动心跳（重复调用只生效一次）；onTick 用来推计时状态机 */
export function startNowClock(onTick?: () => void, interval = 300) {
  if (ticker) return;
  now.value = Date.now();
  ticker = setInterval(() => {
    now.value = Date.now();
    onTick?.();
  }, interval);
}

export function stopNowClock() {
  if (!ticker) return;
  clearInterval(ticker);
  ticker = undefined;
}
