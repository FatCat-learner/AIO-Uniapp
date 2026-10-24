/**
 * 训练记录 + 身体数据 mock
 *   GET  /workouts?page=&pageSize=      → PageResult<WorkoutSession>
 *   GET  /workouts/:id                  → WorkoutDetail（含每组重量/次数）
 *   POST /workouts                      → 提交训练记录（回显 + 新 id）
 *   GET  /body/metrics?days=30          → BodyMetricPoint[]（体重/体脂/腰臀围趋势）
 *
 * 容量口径与 App 一致：Σ(重量 × 次数)，不算单侧翻倍（和健康插件 `health` 的算法对齐）。
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { BodyMetricPoint, WorkoutDetail, WorkoutExercise, WorkoutSession } from '../types';
import { ACTIONS } from '../data/catalog';
import { dateOffset, floatBetween, hashSeed, intBetween, pickOne, reseed } from '../utils/faker';
import { ok, paginate, toInt } from '../utils/response';

const TEMPLATES = ['推胸 + 三头 · 进阶', '下肢力量', '推拉腿 · 上肢增肌', '有氧基础', '个人模版'];
const CARDIO_TITLES = ['自行车', '跑步', '椭圆机', '划船机'];

/** 生成一次力量训练 */
function buildStrengthSession(dayOffset: number, index: number): WorkoutSession {
  const id = `wk_${Math.abs(dayOffset)}_${index}`;
  const exerciseCount = intBetween(3, 6);
  const setCount = exerciseCount * intBetween(3, 5);
  // 容量由 id 推导：列表和详情拿到同一个数与同一组明细，不会自相矛盾
  const capacity = Number((3 + (hashSeed(id) % 900) / 100).toFixed(2));
  return {
    id,
    date: dateOffset(dayOffset),
    title: `第 ${index + 1} 练`,
    kind: 'strength',
    template: pickOne(TEMPLATES, '个人模版'),
    duration: intBetween(40, 95),
    capacity,
    kcal: 0,
    distance: 0,
    status: 'done',
    exerciseCount,
    setCount,
  };
}

/** 生成一次有氧训练 */
function buildCardioSession(dayOffset: number, index: number): WorkoutSession {
  return {
    id: `wk_${Math.abs(dayOffset)}_${index}`,
    date: dateOffset(dayOffset),
    title: pickOne(CARDIO_TITLES, '跑步'),
    kind: 'cardio',
    template: '有氧基础',
    duration: intBetween(25, 70),
    capacity: 0,
    kcal: intBetween(180, 700),
    distance: Number(floatBetween(3, 30).toFixed(1)),
    status: 'done',
    exerciseCount: 1,
    setCount: 1,
  };
}

/** 最近 N 天的训练（按日期倒序，同一天可能有两练） */
function buildSessions(maxDays = 45): WorkoutSession[] {
  const list: WorkoutSession[] = [];
  for (let i = 0; i < maxDays; i++) {
    if (intBetween(0, 100) > 55)
      continue;
    const index = list.filter(item => item.date === dateOffset(-i)).length;
    list.push(i % 4 === 0 ? buildCardioSession(-i, index) : buildStrengthSession(-i, index));
    if (intBetween(0, 100) > 75) {
      list.push(buildCardioSession(-i, index + 1));
    }
  }
  return list;
}

/**
 * 详情：把列表里的总容量摊到 3–6 个动作上，每个动作 3–5 组直上直下。
 * 这样列表显示 5.18t、点进去明细加起来也是 5.18t，不会自相矛盾。
 */
function buildDetail(session: WorkoutSession): WorkoutDetail {
  reseed(`detail:${session.id}`);
  const count = Math.max(1, session.exerciseCount);
  const picked = ACTIONS.filter(item => item.part !== '核心').slice(0, count);
  const totalKg = Math.max(1000, session.capacity * 1000);

  const exercises: WorkoutExercise[] = picked.map((item) => {
    const setCount = intBetween(3, 5);
    const reps = intBetween(6, 10);
    const share = totalKg / picked.length;
    const rawWeight = share / setCount / reps;
    const weight = Math.max(2.5, Math.round(rawWeight / 2.5) * 2.5);
    const sets = Array.from({ length: setCount }, (_, i) => ({
      index: i + 1,
      weight,
      reps,
      rest: item.part === '腿' ? intBetween(120, 180) : intBetween(60, 120),
      done: true,
    }));
    return {
      id: `ex_${item.n}`,
      name: item.n,
      part: item.part,
      equip: item.equip,
      sets,
      volume: weight * reps * setCount,
    };
  });

  const capacity = Number((exercises.reduce((sum, e) => sum + e.volume, 0) / 1000).toFixed(2));
  return { ...session, capacity, exercises, setCount: exercises.reduce((n, e) => n + e.sets.length, 0) };
}

/** 体重/体脂/腰臀围趋势：缓慢下降 + 小幅抖动，符合减脂期的真实形态 */
function buildMetrics(days: number): BodyMetricPoint[] {
  const points: BodyMetricPoint[] = [];
  let weight = floatBetween(94, 96, 1);
  let bodyFat = floatBetween(30, 32, 1);
  let waist = floatBetween(103, 106, 1);
  let hip = floatBetween(105, 107, 1);
  for (let i = days - 1; i >= 0; i--) {
    // 每天净掉 0.05–0.15 kg，再叠 0.1 的抖动；保留两位小数，否则四舍五入后曲线会被抹平
    weight = Number((weight - floatBetween(0.05, 0.15, 2)).toFixed(2));
    bodyFat = Number((bodyFat - floatBetween(0.02, 0.07, 2)).toFixed(2));
    waist = Number((waist - floatBetween(0.01, 0.05, 2)).toFixed(2));
    hip = Number((hip - floatBetween(0.005, 0.03, 2)).toFixed(2));
    points.push({ date: dateOffset(-i), weight, bodyFat, waist, hip });
  }
  return points;
}

export const workoutMocks: MockMethod[] = [
  {
    url: '/workouts',
    method: 'get',
    response: ({ query }: { query?: Record<string, unknown> }) => {
      const page = toInt(query?.page, 1);
      reseed(`workouts:${page}:${String(query?.month ?? '')}`);
      const list = buildSessions();
      return paginate(list, page, toInt(query?.pageSize, 20));
    },
  },
  {
    url: '/workouts',
    method: 'post',
    response: ({ body }: { body?: Record<string, unknown> }) => {
      reseed(Date.now());
      const session: WorkoutSession = {
        id: `wk_new_${Date.now()}`,
        date: dateOffset(0),
        title: String(body?.title ?? '新建训练'),
        kind: (body?.kind as WorkoutSession['kind']) ?? 'strength',
        template: String(body?.template ?? '个人模版'),
        duration: Number(body?.duration ?? 60),
        capacity: Number(body?.capacity ?? 0),
        kcal: Number(body?.kcal ?? 0),
        distance: Number(body?.distance ?? 0),
        status: 'done',
        exerciseCount: Number(body?.exerciseCount ?? 0),
        setCount: Number(body?.setCount ?? 0),
      };
      return ok(session, '保存成功');
    },
  },
  {
    url: '/workouts/:id',
    method: 'get',
    response: ({ query }: { query?: Record<string, unknown> }) => {
      const id = String(query?.id ?? '');
      reseed(`detail:${id}`);
      const matched = /^wk_(\d+)_(\d+)$/.exec(id);
      const day = Number(matched?.[1] ?? 0);
      const index = Number(matched?.[2] ?? 0);
      const session = buildStrengthSession(-day, index);
      return ok(buildDetail({ ...session, id }));
    },
  },
  {
    url: '/body/metrics',
    method: 'get',
    response: ({ query }: { query?: Record<string, unknown> }) => {
      const days = Math.min(180, toInt(query?.days, 30));
      reseed(`body:${days}`);
      return ok(buildMetrics(days));
    },
  },
];
