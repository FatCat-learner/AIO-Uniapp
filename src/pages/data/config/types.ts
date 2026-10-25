/** 分段控件的一项（训练 / 身体 / 饮食） */
export interface Segment {
  key: string;
  label: string;
}

/** 本周汇总的一项 */
export interface WeeklyStat {
  value: string;
  label: string;
  tone: 'normal' | 'brand';
}
