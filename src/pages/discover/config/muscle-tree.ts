/**
 * 肌群树（大肌群 → 小肌群）——动作「部位」维度的唯一数据源。
 *
 * 数据来源：UI/肌群数据/ 的 10 张训记截图（左栏部位列表 + 展开的二级小肌群）。
 * 一级 23 项的顺序 = 截图左栏滚动拼接后的完整顺序（前 14 项解剖/身体区域，其后是训练用途分类）。
 *
 * 约定：
 * - `label` 与动作数据（mocks/data/catalog.ts 的 part / sub 字段）**同值**，UI 直接拿来比对；
 * - `id` 是稳定的拼音/英文 slug，给后端、埋点、图标映射用，改名不影响 id；
 * - 没有二级的组不挂 `children`（单级，不渲染展开箭头）。
 */
export interface MuscleNode {
  /** 稳定 id（英文 slug，层级用点号：back / back.lat） */
  id: string;
  /** 展示名，与动作数据的 part / sub 同值 */
  label: string;
  /** anatomy=解剖部位，usage=训练用途分类 */
  kind: 'anatomy' | 'usage';
  children?: MuscleNode[];
}

export const MUSCLE_TREE: MuscleNode[] = [
  {
    id: 'chest',
    label: '胸',
    kind: 'anatomy',
    children: [
      { id: 'chest.upper', label: '上胸', kind: 'anatomy' },
      { id: 'chest.lower', label: '中下胸', kind: 'anatomy' },
    ],
  },
  {
    id: 'back',
    label: '背',
    kind: 'anatomy',
    children: [
      { id: 'back.lat', label: '背阔肌', kind: 'anatomy' },
      { id: 'back.teres-major', label: '大圆肌', kind: 'anatomy' },
      { id: 'back.rhomboid', label: '菱形肌', kind: 'anatomy' },
      { id: 'back.trap-mid-lower', label: '中下斜方', kind: 'anatomy' },
      { id: 'back.trap-upper', label: '上斜方', kind: 'anatomy' },
      { id: 'back.erector', label: '竖脊肌', kind: 'anatomy' },
    ],
  },
  {
    id: 'leg',
    label: '腿',
    kind: 'anatomy',
    children: [
      { id: 'leg.quads', label: '股四头', kind: 'anatomy' },
      { id: 'leg.hamstrings', label: '腘绳肌', kind: 'anatomy' },
      { id: 'leg.adductors', label: '内收肌', kind: 'anatomy' },
    ],
  },
  {
    id: 'shoulder',
    label: '肩',
    kind: 'anatomy',
    children: [
      { id: 'shoulder.front', label: '前束', kind: 'anatomy' },
      { id: 'shoulder.mid', label: '中束', kind: 'anatomy' },
      { id: 'shoulder.rear', label: '后束', kind: 'anatomy' },
    ],
  },
  { id: 'serratus', label: '前锯肌', kind: 'anatomy' },
  // 斜方肌有两个入口，语义不同，不要合并：
  //   trapezius            = 「斜方专项」动作的主部位（耸肩、直立划船、Y 字举）；
  //   back.trap-upper / back.trap-mid-lower = 背部训练（划船、下拉）里被带到的斜方，出现在附带肌群。
  { id: 'trapezius', label: '斜方肌', kind: 'anatomy' },
  {
    id: 'biceps',
    label: '二头',
    kind: 'anatomy',
    children: [
      { id: 'biceps.long', label: '长头', kind: 'anatomy' },
      { id: 'biceps.short', label: '短头', kind: 'anatomy' },
    ],
  },
  {
    id: 'triceps',
    label: '三头',
    kind: 'anatomy',
    children: [
      { id: 'triceps.long', label: '长头', kind: 'anatomy' },
      { id: 'triceps.lateral', label: '外侧头', kind: 'anatomy' },
      { id: 'triceps.medial', label: '内侧头', kind: 'anatomy' },
    ],
  },
  { id: 'calf', label: '小腿', kind: 'anatomy' },
  { id: 'forearm', label: '前臂', kind: 'anatomy' },
  { id: 'neck', label: '颈部', kind: 'anatomy' },
  {
    id: 'glute',
    label: '臀部',
    kind: 'anatomy',
    children: [
      { id: 'glute.upper', label: '上臀', kind: 'anatomy' },
      { id: 'glute.lower', label: '下臀', kind: 'anatomy' },
      { id: 'glute.medius', label: '臀中肌', kind: 'anatomy' },
    ],
  },
  {
    id: 'functional',
    label: '功能性',
    kind: 'usage',
    children: [
      { id: 'functional.hip', label: '髋', kind: 'usage' },
      { id: 'functional.knee', label: '膝关节', kind: 'usage' },
      { id: 'functional.shoulder', label: '肩关节', kind: 'usage' },
    ],
  },
  { id: 'core-stability', label: '核心稳定', kind: 'usage' },
  {
    id: 'abs',
    label: '腹部',
    kind: 'anatomy',
    children: [
      { id: 'abs.rectus', label: '腹直肌', kind: 'anatomy' },
      { id: 'abs.oblique', label: '侧腹', kind: 'anatomy' },
    ],
  },
  {
    id: 'warmup',
    label: '热身动作',
    kind: 'usage',
    children: [
      { id: 'warmup.chest', label: '胸', kind: 'usage' },
      { id: 'warmup.upper-back', label: '上背', kind: 'usage' },
      { id: 'warmup.lower-back', label: '下背', kind: 'usage' },
      { id: 'warmup.hamstrings', label: '腘绳肌', kind: 'usage' },
      { id: 'warmup.thigh', label: '大腿', kind: 'usage' },
      { id: 'warmup.glute', label: '臀部', kind: 'usage' },
      { id: 'warmup.shoulders', label: '肩膀', kind: 'usage' },
    ],
  },
  {
    id: 'stretch',
    label: '拉伸',
    kind: 'usage',
    children: [
      { id: 'stretch.chest', label: '胸', kind: 'usage' },
      { id: 'stretch.upper-back', label: '上背', kind: 'usage' },
      { id: 'stretch.lower-back', label: '下背', kind: 'usage' },
      { id: 'stretch.thigh', label: '大腿', kind: 'usage' },
      { id: 'stretch.hamstrings', label: '腘绳肌', kind: 'usage' },
      { id: 'stretch.glute', label: '臀部', kind: 'usage' },
      { id: 'stretch.shoulders', label: '肩膀', kind: 'usage' },
    ],
  },
  { id: 'cardio', label: '有氧', kind: 'usage' },
  { id: 'superset', label: '超级组', kind: 'usage' },
  { id: 'full-body', label: '全身', kind: 'usage' },
  { id: 'timed', label: '计时动作', kind: 'usage' },
  { id: 'tabata', label: 'Tabata', kind: 'usage' },
  { id: 'bodyweight', label: '自重', kind: 'usage' },
];
