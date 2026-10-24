/**
 * Mock 与前端共用的数据口径。
 *
 * 原则：这里的类型就是「后端契约」。接真实接口时，src/api 下的类型从这里搬过去即可，
 * 不要在页面里另起一套 interface，否则 mock 与真实返回会悄悄分叉。
 */

/** 统一响应包装（与后端 FastAPI 的 code/message/data 一致） */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  status: number;
  data: T;
}

/** 分页结果 */
export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/* ============================== 用户 ============================== */

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  created_at: string;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
  refresh_token: string;
  user: UserInfo;
}

/* ============================== 首页 ============================== */

/** 置顶指标卡的三格 */
export interface PinnedMetric {
  key: 'steps' | 'kcal' | 'minutes';
  /** MDI 图标名 */
  icon: string;
  /** 主值（已格式化，含千分位） */
  value: string;
  /** 单位 */
  unit: string;
  /** 底部标签 */
  label: string;
  /** 指标颜色 tone */
  tone: 'train' | 'cardio' | 'diet' | 'body' | 'social';
}

/** 训练结果卡的一行（§4.25 状态机） */
export interface WorkoutRow {
  id: string;
  /** 力量 / 有氧 / 其它，决定 IconTile 颜色 */
  kind: 'strength' | 'cardio' | 'other';
  icon: string;
  /** 行标题：「第 2 练」「自行车」 */
  title: string;
  /** 副行：「力量训练 · 个人模版 · 5 动作 · 14 组」 */
  meta: string;
  /**
   * idle     未开始（0%）→ GO!
   * progress 进行中（1–99%）→ 55%
   * done     已完成力量 → 62:00
   * cardio   有氧完成 → 482 千卡 / 22.4 km
   */
  state: 'idle' | 'progress' | 'done' | 'cardio';
  /** progress 用：百分比 1–99 */
  percent?: number;
  /** progress 用：容量 4.2t / 7.6t */
  capacity?: string;
  /** done 用：总时长 62:00 */
  duration?: string;
  /** done 用：总容量 8.4t 容量 */
  totalCapacity?: string;
  /** cardio 用：消耗千卡 */
  kcal?: string;
  /** cardio 用：距离 / 均速等副值 */
  detail?: string;
}

/** 饮食卡（三页横滑） */
export interface DietPage {
  key: 'kcal' | 'macro' | 'locked';
  /** 还可吃，如「1,272」 */
  remain?: string;
  /** 已吃，如「828」 */
  eaten?: string;
  /** 运动抵扣，如「0」 */
  burned?: string;
  /** 进度条百分比（已吃 ÷ 目标） */
  percent?: number;
  /** 三大营养素，页 2 用 */
  macro?: { label: string; value: string; total: string; tone: 'p' | 'c' | 'f' }[];
}

/** 饮食快捷行 */
export interface DietShortcut {
  key: string;
  label: string;
  icon: string;
  /** 有 `diet` 的走饮食色，饮水走 social，体重走 body */
  tone: 'diet' | 'social' | 'body';
}

/** 预约卡 */
export interface Reservation {
  id: string;
  /** 「周三 20:00」 */
  time: string;
  /** 副行：「推胸 + 三头 · 进阶计划 第 3 周」 */
  title: string;
}

/** AI 教练卡 */
export interface AiCoachTip {
  title: string;
  /** 两行以内的建议文案 */
  lines: string[];
}

/** GET /api/home 的完整返回 */
export interface HomeData {
  greeting: string;
  dateText: string;
  planText: string;
  streakDays: number;
  pinned: PinnedMetric[];
  workoutSummary: string;
  workouts: WorkoutRow[];
  diet: { title: string; custom: string; pages: DietPage[]; shortcuts: DietShortcut[] };
  reservation: { title: string; action: string; hint: string; items: Reservation[] };
  weight: { value: string; sub?: string; unit: string; updated: string; tag: string; points: number[] };
  water: { value: string; sub?: string; unit: string; updated: string; tag: string; points: number[] };
  ai: AiCoachTip;
}

/* ========================= 动作 / 食物 / 计划 / 路书 ========================= */

/** 动作库一行（discover「动作」分页在用） */
export interface ActionRow {
  n: string;
  part: string;
  sub?: string;
  equip: string;
  target: string;
  /** 上次重量，详情页用 */
  last: string;
  /** 个人累计训练次数（列表行展示） */
  times: number;
  pinned?: boolean;
}

/** 食物库一行（数值统一按每 100 g） */
export interface FoodRow {
  n: string;
  cat: string;
  src: string;
  kcal: number;
  c: number;
  p: number;
  f: number;
}

/** 计划一行 */
export interface PlanRow {
  n: string;
  g: string;
  goal: string;
  d: string;
  tags: string[];
  pct?: number;
}

/** 路书一行 */
export interface RouteRow {
  n: string;
  region: string;
  sport: string;
  dist: string;
  d: string;
}

/* ============================== 训练 / 体测 ============================== */

export type WorkoutStatus = 'idle' | 'progress' | 'done';

/** 一次训练（记录列表用） */
export interface WorkoutSession {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  title: string;
  kind: 'strength' | 'cardio';
  template: string;
  /** 训练时长（分钟） */
  duration: number;
  /** 容量（Σ重量×次数，吨） */
  capacity: number;
  /** 有氧消耗（千卡），力量为 0 */
  kcal: number;
  /** 有氧距离（km），力量为 0 */
  distance: number;
  status: WorkoutStatus;
  /** 动作数 */
  exerciseCount: number;
  /** 组数 */
  setCount: number;
}

/** 单组记录 */
export interface WorkoutSet {
  index: number;
  weight: number;
  reps: number;
  /** 组间休息（秒） */
  rest: number;
  done: boolean;
}

/** 单个动作的训练明细 */
export interface WorkoutExercise {
  id: string;
  name: string;
  part: string;
  equip: string;
  sets: WorkoutSet[];
  /** 该动作容量（kg） */
  volume: number;
}

/** GET /api/workouts/:id */
export interface WorkoutDetail extends WorkoutSession {
  exercises: WorkoutExercise[];
}

/** 体重 / 体脂 / 围度趋势点 */
export interface BodyMetricPoint {
  date: string;
  /** 公斤 */
  weight: number;
  /** 体脂率 % */
  bodyFat: number;
  /** 腰围 cm */
  waist: number;
  /** 臀围 cm */
  hip: number;
}
