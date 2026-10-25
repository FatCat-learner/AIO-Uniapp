import { reactive } from 'vue';

/**
 * Toast / Snackbar 的唯一出口（替代散落 21 处的 `uni.showToast`）
 *
 * 用法：
 *   const toast = useToast()
 *   toast.show('已复制')                       // 纯提示，1.8s
 *   toast.show('已保存到今日训练', { tone: 'success' })
 *   toast.snack('已删除 1 条记录', { label: '撤销', handler: undo })   // 带动作，4s
 *
 * 说明：src/components/overlays/README.md
 */
export type ToastTone = 'default' | 'success' | 'error' | 'warn';

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface ToastOptions {
  tone?: ToastTone;
  /** 停留时长（ms）：纯提示 1800，带动作 4000 */
  duration?: number;
  action?: ToastAction;
}

export interface ToastState {
  id: number;
  text: string;
  tone: ToastTone;
  duration: number;
  action?: ToastAction;
}

/** 全局只有一条在显示，后来的直接顶掉（避免排队积压） */
export const activeToast = reactive<{ current: ToastState | null }>({ current: null });

let seed = 0;
let timer: ReturnType<typeof setTimeout> | null = null;

const clearTimer = (): void => {
  if (timer) clearTimeout(timer);
  timer = null;
};

const hide = (): void => {
  clearTimer();
  activeToast.current = null;
};

const show = (text: string, options: ToastOptions = {}): void => {
  clearTimer();
  const tone = options.tone ?? 'default';
  const duration = options.duration ?? (options.action ? 4000 : 1800);
  seed += 1;
  activeToast.current = { id: seed, text, tone, duration, action: options.action };
  timer = setTimeout(hide, duration);
};

export interface ToastApi {
  show: (text: string, options?: ToastOptions) => void;
  success: (text: string) => void;
  error: (text: string) => void;
  snack: (text: string, action: ToastAction) => void;
  hide: () => void;
}

export const useToast = (): ToastApi => ({
  show,
  success: (text: string) => show(text, { tone: 'success' }),
  error: (text: string) => show(text, { tone: 'error' }),
  snack: (text: string, action: ToastAction) => show(text, { action, duration: 4000 }),
  hide,
});
