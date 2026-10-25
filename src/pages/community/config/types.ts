import type { TabKey } from '@/layouts/tabs';

/** 社区页定值形状：布局头部 + 建设中空态文案（接 i18n 时按此表替换） */
export interface ICommunityPageConfig {
  title: string;
  subtitle: string;
  tab: TabKey;
  icon: string;
  iconSize: number;
  emptyTitle: string;
  emptyDesc: string;
  emptyAction: string;
}
