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
 * 动作「部位」固定顺序（大肌群，一级分堆）。
 * 取自 UI/肌群数据/ 的 10 张截图里左栏的完整滚动列表（训记口径）：
 * 前 12 项是解剖部位，其后是训练用途分类。
 * 左栏只渲染「当前数据里真的存在」的项，见 index.vue 的 railItems。
 */
export const PARTS = [
  '胸',
  '背',
  '腿',
  '肩',
  '前锯肌',
  '斜方肌',
  '二头',
  '三头',
  '小腿',
  '前臂',
  '颈部',
  '臀部',
  '功能性',
  '核心稳定',
  '腹部',
  '热身动作',
  '拉伸',
  '有氧',
  '超级组',
  '全身',
  '计时动作',
  'Tabata',
  '自重',
];

/**
 * 大肌群 → 小肌群（二级分堆，顺序与截图一致）。
 * 截图已覆盖：背 / 腿 / 肩 / 二头 / 三头 / 臀部 / 功能性 / 腹部 / 热身动作 / 拉伸。
 * 截图未覆盖的组（胸 / 前锯肌 / 斜方肌 / 小腿 / 前臂 / 颈部 / 核心稳定，以及超级组 /
 * 全身 / 计时动作 / Tabata / 自重这些训练用途分类）保持单级：没有小肌群就不挂 kids。
 * 胸沿用既有口径（上胸 / 中下胸），与 mocks/data/catalog.ts 的 sub 值一致。
 */
export const MUSCLE_SUBS: Record<string, string[]> = {
  胸: ['上胸', '中下胸'],
  背: ['背阔肌', '大圆肌', '菱形肌', '中下斜方', '上斜方', '竖脊肌'],
  腿: ['股四头', '腘绳肌'],
  肩: ['前束', '中束', '后束'],
  二头: ['内侧头', '外侧头'],
  三头: ['内侧头', '外侧头'],
  臀部: ['上臀', '下臀'],
  功能性: ['髋', '膝关节', '肩关节'],
  腹部: ['腹直肌', '侧腹'],
  热身动作: ['胸', '上背', '下背', '腘绳肌', '大腿', '臀部', '肩膀'],
  拉伸: ['胸', '上背', '下背', '大腿', '腘绳肌', '臀部', '肩膀'],
};

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
