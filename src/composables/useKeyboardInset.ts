import type { ComputedRef, Ref } from 'vue';
import { computed, onBeforeUnmount, ref } from 'vue';

/**
 * 输入法高度（软键盘）——全工程唯一入口
 *
 * 背景：仓库里此前 0 处处理键盘（`onKeyboardHeightChange` / `cursor-spacing` /
 * `adjust-position` 全无命中），带输入框的半屏与中心弹窗在真机上会被键盘压住。
 *
 * 用法：
 *   const kb = useKeyboardInset()
 *   <view :style="{ transform: kb.lift }">   // 直接给浮层上移量
 *
 * 注意：
 * 1. 只监听一次（模块级共享 listener），多个浮层同时挂载不会重复注册。
 * 2. H5 没有 `uni.onKeyboardHeightChange`，用 `window.visualViewport` 兜底；
 *    H5 下拿到 0 属正常，布局不能假设它必然 > 0。
 * 3. 安卓部分机型收起键盘后不上报 0，浮层关闭时必须 `kb.reset()`。
 */

const listeners = new Set<(h: number) => void>();
let bound = false;

const emitAll = (h: number): void => {
  listeners.forEach(fn => fn(h));
};

const bind = (): void => {
  if (bound) return;
  bound = true;

  const uniApi = (uni as unknown as {
    onKeyboardHeightChange?: (cb: (res: { height: number }) => void) => void;
  }).onKeyboardHeightChange;

  if (typeof uniApi === 'function') {
    uniApi(res => emitAll(Math.max(0, res?.height ?? 0)));
    return;
  }

  if (typeof window !== 'undefined' && window.visualViewport) {
    const vv = window.visualViewport;
    const sync = (): void => emitAll(Math.max(0, window.innerHeight - vv.height));
    vv.addEventListener('resize', sync);
    vv.addEventListener('scroll', sync);
    sync();
  }
};

const safeBottomOf = (): number => {
  try {
    const info = uni.getSystemInfoSync() as { safeAreaInsets?: { bottom?: number } };
    return info?.safeAreaInsets?.bottom ?? 0;
  }
  catch {
    return 0;
  }
};

export interface KeyboardInset {
  /** 键盘高度（px），0 表示收起 */
  height: Ref<number>;
  isOpen: ComputedRef<boolean>;
  /** 给浮层用的上移量（px，负数） */
  lift: ComputedRef<string>;
  /** 给面板用的底部留白（键盘 + 安全区） */
  padBottom: ComputedRef<string>;
  /** 底部安全区（px），刘海屏为 34 */
  safeBottom: number;
  /** 收起键盘 */
  hide: () => void;
  /** 强制复位（浮层关闭时调用） */
  reset: () => void;
}

export const useKeyboardInset = (): KeyboardInset => {
  bind();

  const height = ref(0);
  const handler = (h: number): void => {
    height.value = h;
  };
  listeners.add(handler);

  onBeforeUnmount(() => {
    listeners.delete(handler);
    height.value = 0;
  });

  const safeBottom = safeBottomOf();

  return {
    height,
    isOpen: computed(() => height.value > 0),
    lift: computed(() => `translateY(${-height.value}px)`),
    padBottom: computed(() => `${height.value + safeBottom}px`),
    safeBottom,
    hide: () => {
      const api = uni as unknown as { hideKeyboard?: () => void };
      api.hideKeyboard?.();
      handler(0);
    },
    reset: () => handler(0),
  };
};
