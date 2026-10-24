/**
 * 首页静态 fixture（UI 规范 V1.1 §5.1 v2 卡片流）
 *
 * 用途：后端 /api/home 未落地前，让卡片组件、状态机、空态都能真实渲染；
 * 页面直接 import 这份数据。接后端时换成 `getHome()`（同一份 HomeData 结构），
 * 卡片组件不用改。需要随机化的联调数据用 `mocks/modules/home.ts` 的 GET /api/home。
 *
 * 口径（§4.25 训练结果卡）：
 * - percent = 已完成组容量 ÷ 计划容量，Σ重量×次数，取整后 99 封顶；
 * - 未开始（0%）显示 GO!，进行中（1–99%）显示百分比，完成显示总时长。
 */
import type { HomeData } from '../types';

export const homeMock: HomeData = {
  greeting: '晚上好，聪汉',
  dateText: '10 月 20 日 周二',
  planText: '减脂第 18 天',
  streakDays: 12,
  pinned: [
    { key: 'steps', icon: 'walk', value: '8,563', unit: '步', label: '步数', tone: 'cardio' },
    { key: 'kcal', icon: 'fire', value: '2,847', unit: '千卡', label: '热量', tone: 'diet' },
    { key: 'minutes', icon: 'dumbbell', value: '48', unit: '分钟', label: '训练', tone: 'train' },
  ],
  workoutSummary: '共 2 次 · 1,860 千卡',
  workouts: [
    {
      id: 'w1',
      kind: 'cardio',
      icon: 'bike',
      title: '自行车',
      meta: '60:00 · 均速 22.4',
      state: 'cardio',
      kcal: '482',
      detail: '22.4 km',
    },
    {
      id: 'w2',
      kind: 'strength',
      icon: 'dumbbell',
      title: '第 2 练',
      meta: '个人模版 · 5 动作 · 14 组',
      state: 'done',
      duration: '62:00',
      totalCapacity: '8.4t 容量',
    },
    {
      id: 'w3',
      kind: 'strength',
      icon: 'dumbbell',
      title: '第 3 练',
      meta: '个人模版 · 12/14 组',
      state: 'progress',
      percent: 55,
      capacity: '容量 4.2t / 7.6t',
    },
    {
      id: 'w4',
      kind: 'other',
      icon: 'dumbbell',
      title: '第 4 练',
      meta: '个人模版 · 2 动作 · 9 组',
      state: 'idle',
    },
  ],
  diet: {
    title: '今日饮食',
    custom: '自定义',
    pages: [
      { key: 'kcal', remain: '1,272', eaten: '828', burned: '0', percent: 39 },
      {
        key: 'macro',
        macro: [
          { label: '碳水', value: '72', total: '210', tone: 'c' },
          { label: '蛋白质', value: '65', total: '185', tone: 'p' },
          { label: '脂肪', value: '31', total: '70', tone: 'f' },
        ],
      },
      { key: 'locked' },
    ],
    shortcuts: [
      { key: 'breakfast', label: '早餐', icon: 'coffee-outline', tone: 'diet' },
      { key: 'lunch', label: '午餐', icon: 'bowl-mix', tone: 'diet' },
      { key: 'dinner', label: '晚餐', icon: 'food-variant', tone: 'diet' },
      { key: 'snack', label: '加餐', icon: 'cookie', tone: 'diet' },
      { key: 'water', label: '饮水', icon: 'water', tone: 'social' },
      { key: 'weight', label: '体重', icon: 'scale-bathroom', tone: 'body' },
    ],
  },
  reservation: {
    title: '预约',
    action: '预约安排',
    hint: '长按可取消预约',
    items: [{ id: 'r1', time: '周三 20:00', title: '推胸 + 三头 · 进阶计划 第 3 周' }],
  },
  weight: {
    value: '92.45',
    unit: '公斤',
    updated: '2026/10/20 更新',
    tag: '智能秤',
    points: [94.6, 94.1, 94.4, 93.8, 93.2, 93.4, 93.0, 92.6, 92.45],
  },
  water: {
    value: '1,200',
    sub: '/ 2,000',
    unit: 'ml',
    updated: '2026/10/20 更新',
    tag: '智能杯',
    points: [300, 600, 900, 1100, 1400, 1300, 1200, 1200, 1200],
  },
  ai: {
    title: 'AI 教练',
    lines: [
      '昨天硬拉容量比上周同期低 12%，今天建议把组间休息压到 90 秒，主项保 4 组即可。',
      '晚饭蛋白还差 76 g，练后补一份 20 g 乳清刚好。',
    ],
  },
};
