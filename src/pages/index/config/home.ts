import type { GreetingStep } from './types';

/** 问候里的用户名（mock 阶段固定，接后端后换成 store 里的 profile.name） */
export const HOME_USER_NAME = '聪汉';

/** 时段问候：hour 落在某个 until 之前就用该词，最后一段兜底 */
export const GREETING_WORDS: GreetingStep[] = [
  { until: 6, word: '夜深了' },
  { until: 11, word: '早上好' },
  { until: 14, word: '中午好' },
  { until: 18, word: '下午好' },
  { until: 24, word: '晚上好' },
];

/** 按小时取问候词（纯映射，无副作用） */
export function greetingWord(hour: number): string {
  const hit = GREETING_WORDS.find(step => hour < step.until);
  return (hit || GREETING_WORDS[GREETING_WORDS.length - 1]).word;
}

/** 卡片点击后的占位提示（功能未接入前统一 toast 兜底，文案集中在这里） */
export const HOME_TOASTS = {
  bell: '暂无新通知',
  message: '消息中心待接入',
  metricsEdit: '指标编辑待接入',
  workoutMore: '训练历史待接入',
  dietCustom: '饮食目标自定义待接入',
  dietPhoto: '拍照识别待接入',
  reservationManage: '预约安排待接入',
  reservationSelect: '预约详情待接入',
  weightAdd: '记录体重待接入',
  weightDetail: '体重详情待接入',
  waterAdd: '记一杯水待接入',
  waterDetail: '饮水详情待接入',
  aiAccept: '已接受 AI 建议',
  aiIgnore: '已忽略本次建议',
  addCard: '卡片管理待接入',
} as const;
