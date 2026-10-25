import { MUSCLE_TREE } from './muscle-tree';

export type CatKey = 'action' | 'food' | 'plan' | 'route' | 'ai';

export interface CatDef {
  key: CatKey;
  label: string;
  icon: string;
  ph: string;
  acc: string;
  soft: string;
  cam: boolean;
}

export interface Dim {
  rail: string;
  group: string;
  /** 组内分组的固定顺序 */
  order: string[];
  /** 左栏分堆的固定顺序（空 = 按数据出现顺序） */
  railOrder: string[];
}

export const CATS: CatDef[] = [
  { key: 'action', label: '动作', icon: 'dumbbell', ph: '搜索动作、器械或肌群', acc: 'var(--brand-500)', soft: 'var(--brand-50)', cam: false },
  { key: 'food', label: '食物', icon: 'food-apple-outline', ph: '搜索食物、品牌或扫码', acc: 'var(--mod-diet)', soft: 'rgba(249,115,22,.12)', cam: true },
  { key: 'route', label: '路书', icon: 'map-marker-path', ph: '搜索路书、城市或距离', acc: 'var(--mod-social)', soft: 'rgba(6,182,212,.12)', cam: false },
  { key: 'plan', label: '计划', icon: 'calendar-blank-outline', ph: '搜索计划、目标或周期', acc: 'var(--brand-500)', soft: 'var(--brand-50)', cam: false },
  { key: 'ai', label: 'AI', icon: 'creation', ph: '问 AI：帮我排个减脂周计划', acc: 'var(--brand-500)', soft: 'var(--brand-50)', cam: true },
];

/** 种子数据统一在 mocks/data/catalog.ts（页面与 mock 接口共用同一份） */

export const TIPS = [
  { icon: 'water-outline', title: '补水决定恢复', desc: '练后 500 ml，分两次喝完。' },
  { icon: 'food-apple-outline', title: '蛋白质时机', desc: '训练后 2 小时内吃够 30 g。' },
];

export const ASKS = [
  { title: '我这周练得怎么样？', desc: '结合 4 次训练容量与强度给结论' },
  { title: '深蹲卡在 100 kg 怎么办？', desc: '按你的历史组次给加练方案' },
  { title: '晚饭还差多少蛋白？', desc: '按今天已吃和 185 g 目标算' },
];

/* ============================ 分堆维度 ============================ */

/** 每个品类：左栏分堆用的字段 + 组内分组的字段 + 固定顺序 */
/**
 * 动作「部位」固定顺序（大肌群，一级分堆）——由肌群树推导，顺序即树的声明顺序。
 * 数据源见 `./muscle-tree`（UI/肌群数据/ 的 10 张截图，训记口径）。
 */
export const PARTS = MUSCLE_TREE.map(n => n.label);

/** 旧的硬编码清单已删除：一级顺序一律从 MUSCLE_TREE 推。 */

/**
 * 大肌群 → 小肌群（二级分堆），同样由肌群树推导。
 * 只有挂了 children 的组才有二级；前锯肌 / 斜方肌 / 小腿 / 前臂 / 颈部 / 核心稳定，以及
 * 超级组 / 全身 / 计时动作 / Tabata / 自重这些训练用途分类保持单级（左栏不出现展开箭头）。
 */
export const MUSCLE_SUBS: Record<string, string[]> = Object.fromEntries(
  MUSCLE_TREE.filter(n => n.children?.length).map(n => [n.label, n.children!.map(c => c.label)]),
);

/** 取某大肌群的小肌群；没有二级就返回空数组 */
export const subsOf = (part: string): string[] => MUSCLE_SUBS[part] ?? [];

export const DIM: Record<CatKey, Dim> = {
  action: { rail: 'part', group: 'equip', order: ['置顶', '杠铃', '哑铃', '壶铃', '绳索', '器械', '自重'], railOrder: PARTS },
  food: { rail: 'src', group: 'cat', order: ['主食', '肉蛋奶', '蔬果', '豆类坚果'], railOrder: ['常见', '自定义', '已购', '我的'] },
  plan: { rail: 'g', group: 'goal', order: ['增肌', '减脂', '力量', '有氧'], railOrder: ['我的', '推荐', '收藏', '社区'] },
  route: { rail: 'region', group: 'sport', order: ['骑行', '跑步', '徒步'], railOrder: ['全球', '全国', '福建', '广东', '四川'] },
  ai: { rail: '', group: '', order: [], railOrder: [] },
};

/** 兼容旧引用：胸的二级（= MUSCLE_SUBS['胸']） */
export const CHEST_SUBS = MUSCLE_SUBS['胸'];
