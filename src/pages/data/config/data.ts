import type { Segment, WeeklyStat } from './types';

/** 分段控件（规范 §4.9）：训练 / 身体 / 饮食 */
export const DATA_SEGMENTS: Segment[] = [
  { key: 'training', label: '训练' },
  { key: 'body', label: '身体' },
  { key: 'diet', label: '饮食' },
];

/** 默认选中的分段 */
export const DATA_SEGMENT_DEFAULT = 'training';

/** 本周汇总三项 */
export const DATA_WEEKLY: WeeklyStat[] = [
  { value: '24', label: '总组数', tone: 'normal' },
  { value: '3,450', label: '总容量（kg）', tone: 'normal' },
  { value: '+12%', label: '较上周', tone: 'brand' },
];

/** 训练容量趋势柱高（%） */
export const DATA_CHART_BARS = [38, 56, 44, 72, 60, 88, 66];

/** 最后一天的下标（实心绿） */
export const DATA_CHART_LAST = 6;

/** 图表的星期轴 */
export const DATA_CHART_AXIS = ['一', '二', '三', '四', '五', '六', '日'];
