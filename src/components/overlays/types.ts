/**
 * 浮层公共类型（SFC 的 <script setup> 里不能 export，所以类型集中放这里）
 */

export interface ActionSheetItem {
  label: string;
  value: string;
  icon?: string;
  tone?: 'default' | 'danger';
}

export interface ContextMenuItem {
  label: string;
  value: string;
  icon?: string;
  tone?: 'default' | 'danger';
  /** 快捷键提示，仅桌面显示，如 '⌘C' / 'E' / 'Del' */
  shortcut?: string;
  /** 该项之前插一条分隔线 */
  divider?: boolean;
}
