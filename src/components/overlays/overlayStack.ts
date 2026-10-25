/**
 * 浮层层叠与滚动锁（唯一来源）
 *
 * 为什么不用 theme.scss 变量：小程序 / App 的 `style` 属性里 CSS 变量可用，
 * 但 z-index 需要参与 JS 计算（比如同时打开 Toast 与 Sheet 时谁在上），
 * 所以层叠值放在 TS 常量表里，组件用 `:style="{ zIndex: overlayZ('sheet') }"` 注入。
 *
 * 层级只允许这 7 档，禁止在组件里再写裸数字（现状 AppTopNotice 999 / CaptchaModal 950 /
 * CountrySheet 900 就是没有这张表造成的）。
 */
export const OVERLAY_Z = {
  /** 遮罩：只压页面，不压任何面板 */
  mask: 20,
  /** 底部半屏 / 全屏（AppSheet） */
  sheet: 30,
  /** 中心弹窗（AppDialog） */
  dialog: 32,
  /** 菜单：右键菜单、ActionSheet、选择工具条（要压在 Sheet 之上） */
  menu: 34,
  /** Toast / Snackbar：永远最上面，但低于系统弹窗 */
  toast: 40,
  /** 引导挖洞：要盖住 Toast 之外的整屏 */
  coach: 44,
  /** 顶部通知条：贴顶，独立于遮罩层（不参与遮罩） */
  topNotice: 48,
} as const;

export type OverlayLayer = keyof typeof OVERLAY_Z;

export const overlayZ = (layer: OverlayLayer): number => OVERLAY_Z[layer];

/**
 * 页面滚动锁。同一时刻可能叠着两层浮层（Sheet 里再开 Dialog），
 * 用计数而不是布尔，避免里层关闭时把外层也解锁。
 */
let lockCount = 0;

export const lockPageScroll = (): void => {
  lockCount += 1;
  if (lockCount === 1 && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};

export const unlockPageScroll = (): void => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0 && typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};
