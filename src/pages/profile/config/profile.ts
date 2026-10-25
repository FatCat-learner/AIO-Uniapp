import type { ILogoutModal, ProfileMetric, ProfileSettingRow, ProfileUser } from './types';

/** 资料块：mock 阶段固定，接后端后改成读 store/auth 的用户资料 */
export const PROFILE_USER: ProfileUser = {
  initial: '汉',
  name: '黄聪汉',
  meta: '坚持就是胜利 · 2026 年 10 月加入',
};

/** 身体三指标：三列全宽小卡 */
export const PROFILE_METRICS: ProfileMetric[] = [
  { label: '体重', value: '93.0', unit: 'kg' },
  { label: '身高', value: '165', unit: 'cm' },
  { label: '目标', value: '减脂', unit: '' },
];

/** 设置组 */
export const PROFILE_SETTINGS: ProfileSettingRow[] = [
  { icon: 'target', tone: 'diet', label: '目标与计划', extra: '每周 4 练' },
  { icon: 'bluetooth', tone: 'cardio', label: '设备管理', extra: '' },
  { icon: 'book-open-page-variant-outline', tone: 'social', label: '我的路书', extra: '' },
];

/** 偏好组 */
export const PROFILE_PREFERENCES: ProfileSettingRow[] = [
  { icon: 'view-dashboard-outline', tone: 'social', label: '首页卡片布局', extra: '' },
  { icon: 'bell-outline', tone: 'diet', label: '通知提醒', extra: '' },
  { icon: 'shield-lock-outline', tone: 'body', label: '隐私与安全', extra: '' },
];

/** 未接入的设置项统一后缀 */
export const SETTINGS_PENDING_SUFFIX = '（待接入）';

/** 退出登录二次确认弹窗（confirmColor 沿用设计稿的危险色） */
export const LOGOUT_MODAL: ILogoutModal = {
  title: '退出登录',
  content: '退出后需要重新登录才能同步训练数据。',
  confirmText: '退出',
  confirmColor: '#ef4444',
};
