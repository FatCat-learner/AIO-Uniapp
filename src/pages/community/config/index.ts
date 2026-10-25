import type { ICommunityPageConfig } from './types';

export * from './types';

/**
 * 社区页所有可变文案与图标都收在这张表里：
 * 页面只做「布局 + 空态」，改一句话不用翻模板。
 */
export const COMMUNITY_PAGE: ICommunityPageConfig = {
  title: '社区',
  subtitle: '练友动态与路书分享',
  tab: 'community',
  icon: 'account-group-outline',
  iconSize: 48,
  emptyTitle: '社区正在建设中',
  emptyDesc: '未来可以在这里看到练友的今日训练、路书和计划广场。',
  emptyAction: '先去记录训练',
};
