/**
 * 首页聚合接口 mock —— GET /home → HomeData（UI 规范 V1.1 §5.1 卡片流）
 *
 * 结构固定（卡片顺序、状态机、图标都由设计稿决定），只把**数字**换成 faker：
 * 步数、热量、容量、时长、体重曲线… 所以拿它就能联调，不会因为假数字不合理而看不出边界。
 *
 * 便于验收的开关（query）：
 *   ?state=idle|progress|done|cardio   把四张训练结果卡强制成某个状态
 *   ?empty=1                           空态（没有训练、没有预约）
 *   ?green=1                           新用户态（全部 0 / 未开始）
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { DietPage, HomeData, WorkoutRow } from '../types';
import { homeMock } from '../data/home';
import { dateOffset, floatBetween, fmtClock, fmtInt, intBetween, reseed } from '../utils/faker';
import { ok } from '../utils/response';

type State = WorkoutRow['state'];

function buildRow(index: number, state: State): WorkoutRow {
  const isCardio = state === 'cardio';
  const title = isCardio ? '自行车' : `第 ${index + 1} 练`;
  const meta = isCardio
    ? `${fmtClock(intBetween(30, 75))} · 均速 ${floatBetween(18, 28)}`
    : `个人模版 · ${intBetween(3, 6)} 动作 · ${intBetween(9, 18)} 组`;

  const base: WorkoutRow = {
    id: `w${index + 1}`,
    kind: isCardio ? 'cardio' : 'strength',
    icon: isCardio ? 'bike' : 'dumbbell',
    title,
    meta,
    state,
  };

  if (state === 'idle')
    return base;
  if (state === 'cardio')
    return { ...base, kcal: fmtInt(intBetween(300, 700)), detail: `${floatBetween(8, 40)} km` };
  if (state === 'progress') {
    const plan = floatBetween(6, 12);
    return {
      ...base,
      percent: intBetween(15, 95),
      capacity: `容量 ${floatBetween(2, plan - 1, 2)}t / ${plan.toFixed(1)}t`,
    };
  }
  return {
    ...base,
    duration: fmtClock(intBetween(45, 95)),
    totalCapacity: `${floatBetween(6, 12)}t 容量`,
  };
}

function buildDiet(): DietPage[] {
  const target = 2100;
  const eaten = intBetween(600, 1400);
  return [
    {
      key: 'kcal',
      remain: fmtInt(target - eaten),
      eaten: fmtInt(eaten),
      burned: fmtInt(intBetween(0, 400)),
      percent: Math.round((eaten / target) * 100),
    },
    {
      key: 'macro',
      macro: [
        { label: '碳水', value: String(intBetween(40, 180)), total: '210', tone: 'c' },
        { label: '蛋白质', value: String(intBetween(40, 170)), total: '185', tone: 'p' },
        { label: '脂肪', value: String(intBetween(10, 60)), total: '70', tone: 'f' },
      ],
    },
    { key: 'locked' },
  ];
}

function trend(last: number, count = 9, spread = 0.6): number[] {
  const list: number[] = [];
  let current = last + floatBetween(spread / 2, spread * 2);
  for (let i = 0; i < count; i++) {
    current = Number((current - floatBetween(-spread / 2, spread)).toFixed(2));
    list.push(current);
  }
  list[count - 1] = last;
  return list;
}

function buildHome(state?: State, empty = false, green = false): HomeData {
  const weight = floatBetween(90, 95, 2);
  const water = green ? 0 : intBetween(200, 2000);
  const states: State[] = green ? ['idle', 'idle', 'idle', 'idle'] : ['cardio', 'done', 'progress', 'idle'];
  const rows = (state ? [state, state, state, state] : states).map((s, i) => buildRow(i, s));

  return {
    greeting: homeMock.greeting,
    dateText: homeMock.dateText,
    planText: green ? '今天开始第 1 天' : homeMock.planText,
    streakDays: green ? 0 : intBetween(3, 40),
    pinned: [
      { key: 'steps', icon: 'walk', value: fmtInt(green ? 0 : intBetween(3000, 12_000)), unit: '步', label: '步数', tone: 'cardio' },
      { key: 'kcal', icon: 'fire', value: fmtInt(green ? 0 : intBetween(1500, 3200)), unit: '千卡', label: '热量', tone: 'diet' },
      { key: 'minutes', icon: 'dumbbell', value: String(green ? 0 : intBetween(20, 90)), unit: '分钟', label: '训练', tone: 'train' },
    ],
    workoutSummary: empty ? '今天还没有训练' : `共 ${intBetween(1, 3)} 次 · ${fmtInt(intBetween(600, 2400))} 千卡`,
    workouts: empty ? [] : rows,
    diet: {
      title: homeMock.diet.title,
      custom: homeMock.diet.custom,
      pages: buildDiet(),
      shortcuts: homeMock.diet.shortcuts,
    },
    reservation: {
      title: homeMock.reservation.title,
      action: homeMock.reservation.action,
      hint: homeMock.reservation.hint,
      items: empty
        ? []
        : [
            { id: 'r1', time: `周${['一', '二', '三', '四', '五', '六', '日'][intBetween(0, 6)]} ${intBetween(17, 21)}:00`, title: homeMock.reservation.items[0].title },
            { id: 'r2', time: `周${['一', '二', '三', '四', '五', '六', '日'][intBetween(0, 6)]} ${intBetween(17, 21)}:00`, title: '有氧基础 4 周 · 第 2 课' },
          ],
    },
    weight: {
      value: weight.toFixed(2),
      unit: '公斤',
      updated: `${dateOffset(0).replaceAll('-', '/')} 更新`,
      tag: '智能秤',
      points: trend(weight),
    },
    water: {
      value: fmtInt(water),
      sub: '/ 2,000',
      unit: 'ml',
      updated: `${dateOffset(0).replaceAll('-', '/')} 更新`,
      tag: '智能杯',
      points: trend(water / 200, 9, 2).map(n => Math.round(n)),
    },
    ai: {
      title: homeMock.ai.title,
      lines: [
        `昨天主项容量比上周同期${intBetween(3, 18)}%，今天建议把组间休息压到 ${intBetween(75, 120)} 秒，主项保 ${intBetween(3, 5)} 组。`,
        `晚饭蛋白还差 ${intBetween(20, 90)} g，练后补一份乳清刚好。`,
      ],
    },
  };
}

export const homeMockApi: MockMethod[] = [
  {
    url: '/home',
    method: 'get',
    timeout: 150,
    response: ({ query }: { query?: Record<string, unknown> }) => {
      const state = String(query?.state ?? '') as State | '';
      const known: State[] = ['idle', 'progress', 'done', 'cardio'];
      const empty = String(query?.empty ?? '') === '1';
      const green = String(query?.green ?? '') === '1';
      reseed(`home:${dateOffset(0)}:${state}:${empty}:${green}`);
      return ok(buildHome(known.includes(state as State) ? (state as State) : undefined, empty, green));
    },
  },
];
