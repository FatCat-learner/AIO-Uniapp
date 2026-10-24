/**
 * 发现页检索接口 mock —— 动作 / 食物 / 计划 / 路书
 *   GET /actions?keyword=&part=&equip=&page=&pageSize=
 *   GET /foods?keyword=&cat=&src=&page=&pageSize=
 *   GET /plans?keyword=&goal=&group=&page=&pageSize=
 *   GET /routes?keyword=&region=&sport=&page=&pageSize=
 *
 * 数据来自 `mocks/data/catalog.ts` 的种子（与页面展示用的是同一份），
 * faker 只负责把「个人数据」随机化：训练次数、上次重量、营养值、进度百分比。
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { ActionRow, FoodRow, PlanRow, RouteRow } from '../types';
import { ACTIONS, FOODS, PLANS, ROUTES } from '../data/catalog';
import { faker, floatBetween, intBetween, pickOne, reseed } from '../utils/faker';
import { matchEq, matchKeyword, paginate, toInt } from '../utils/response';

interface Query {
  keyword?: string;
  page?: string;
  pageSize?: string;
  [key: string]: string | undefined;
}

/** 动作：种子 + 随机的「我的」统计（次数 / 上次重量） */
function actionsWithStats(filterBy?: Partial<Record<'part' | 'equip', string>>): ActionRow[] {
  reseed(`actions:${filterBy?.part ?? ''}:${filterBy?.equip ?? ''}`);
  return ACTIONS.map((item) => {
    const times = Math.max(1, Math.round(intBetween(1, 80) * (item.pinned ? 1.6 : 1)));
    const weight = Math.round(intBetween(5, 140) / 2.5) * 2.5;
    const reps = intBetween(3, 15);
    return {
      ...item,
      times,
      last: item.equip === '自重' ? `自重 ${intBetween(5, 20)}` : `${reps} × ${weight} kg`,
    };
  });
}

/** 食物：种子 + 每请求追加 3 条「自定义」条目（数值按每 100 g） */
function foodsWithCustom(): FoodRow[] {
  reseed('foods:custom');
  const extra: FoodRow[] = faker.helpers.multiple(
    () => ({
      n: `${pickOne(['鸡胸', '藜麦', '紫薯', '三文鱼', '希腊酸奶', '牛肉干', '燕麦棒'], '鸡胸')}·自制`,
      cat: pickOne(['主食', '肉蛋奶', '蔬果', '豆类坚果'], '主食'),
      src: '自定义',
      kcal: intBetween(40, 380),
      c: floatBetween(0, 60),
      p: floatBetween(0, 30),
      f: floatBetween(0, 40),
    }),
    { count: 3 },
  ).map(item => ({ ...item, c: Number(item.c.toFixed(1)), p: Number(item.p.toFixed(1)), f: Number(item.f.toFixed(1)) }));
  return [...FOODS, ...extra];
}

/** 计划：进行中的计划补一个随机进度 */
function plansWithPct(): PlanRow[] {
  reseed('plans:pct');
  return PLANS.map(item => (item.tags.includes('进行中') ? { ...item, pct: intBetween(5, 95) } : item));
}

export const catalogMocks: MockMethod[] = [
  {
    url: '/actions',
    method: 'get',
    response: ({ query }: { query?: unknown }) => {
      const q = (query ?? {}) as Query;
      const list = actionsWithStats({ part: q.part, equip: q.equip }).filter(item =>
        matchKeyword(`${item.n}${item.target}${item.part}${item.equip}`, q.keyword)
        && matchEq(item.part, q.part)
        && matchEq(item.equip, q.equip),
      );
      return paginate(list, toInt(q.page, 1), toInt(q.pageSize, 20));
    },
  },
  {
    url: '/foods',
    method: 'get',
    response: ({ query }: { query?: unknown }) => {
      const q = (query ?? {}) as Query;
      const list = foodsWithCustom().filter(item =>
        matchKeyword(`${item.n}${item.cat}`, q.keyword)
        && matchEq(item.cat, q.cat)
        && matchEq(item.src, q.src),
      );
      return paginate(list, toInt(q.page, 1), toInt(q.pageSize, 20));
    },
  },
  {
    url: '/plans',
    method: 'get',
    response: ({ query }: { query?: unknown }) => {
      const q = (query ?? {}) as Query;
      const list = plansWithPct().filter(item =>
        matchKeyword(`${item.n}${item.goal}${item.tags.join('')}`, q.keyword)
        && matchEq(item.goal, q.goal)
        && matchEq(item.g, q.group),
      );
      return paginate(list, toInt(q.page, 1), toInt(q.pageSize, 20));
    },
  },
  {
    url: '/routes',
    method: 'get',
    response: ({ query }: { query?: unknown }) => {
      const q = (query ?? {}) as Query;
      const list: RouteRow[] = ROUTES.filter(item =>
        matchKeyword(`${item.n}${item.region}${item.sport}`, q.keyword)
        && matchEq(item.region, q.region)
        && matchEq(item.sport, q.sport),
      );
      return paginate(list, toInt(q.page, 1), toInt(q.pageSize, 20));
    },
  },
];
