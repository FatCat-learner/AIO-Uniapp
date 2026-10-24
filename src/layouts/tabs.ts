/**
 * AIO 运动助手 · 一级 Tab 配置（唯一数据源）
 * 规范：AIO运动助手 UI设计规范 V1.1 §4.14（底部悬浮胶囊 Dock + 右侧独立训练按钮）
 *
 * 说明：
 * 1. 本 App 不使用原生 tabBar（原生 tabBar 无法做半透明悬浮 + 独立 FAB），
 *    5 个一级页各是一个普通页面，切换用 uni.reLaunch（保证栈干净）。
 * 2. 图标名不带 i-mdi- 前缀，AppIcon 组件会拼成 unocss 类名；
 *    uno.config.ts 的 safelist 里必须同步登记，否则运行时类名不会生成。
 */
export type TabKey = 'home' | 'discover' | 'data' | 'community' | 'profile';

export interface TabItem {
  /** 唯一键，页面通过 activeTab 传入 */
  key: TabKey;
  /** 图标下方 10px 标签 */
  label: string;
  /** 未选中：线性图标 */
  icon: string;
  /** 选中：实心图标 */
  iconActive: string;
  /** 页面路径（以 / 开头） */
  path: string;
}

export const TABS: TabItem[] = [
  { key: 'home', label: '首页', icon: 'home-outline', iconActive: 'home', path: '/pages/index/index' },
  { key: 'discover', label: '探索', icon: 'compass-outline', iconActive: 'compass', path: '/pages/discover/index' },
  { key: 'data', label: '数据', icon: 'chart-box-outline', iconActive: 'chart-box', path: '/pages/data/index' },
  { key: 'community', label: '社区', icon: 'account-group-outline', iconActive: 'account-group', path: '/pages/community/index' },
  { key: 'profile', label: '我的', icon: 'account-outline', iconActive: 'account', path: '/pages/profile/index' },
];

export const TAB_MAP = Object.fromEntries(TABS.map(item => [item.key, item])) as Record<TabKey, TabItem>;

/** 当前页面路径（不含开头的 /） */
function currentRoute(): string {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1] as unknown as { route?: string } | undefined;
  return (page?.route ?? '').replace(/^\//, '');
}

/**
 * 切换 Tab：已经在目标页则不动，避免重复 reLaunch 触发页面重建
 */
export function navigateToTab(key: TabKey) {
  const target = TAB_MAP[key];
  if (!target) return;
  if (currentRoute() === target.path.replace(/^\//, '')) return;
  uni.reLaunch({
    url: target.path,
    fail: () => {
      // reLaunch 失败（极少数平台限制）时兜底为 redirectTo
      uni.redirectTo({ url: target.path });
    },
  });
}
