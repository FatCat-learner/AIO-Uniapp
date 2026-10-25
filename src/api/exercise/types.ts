/**
 * 动作库契约（对应后端 aio-backend/src/schemas/exercise.py）
 *
 * 只放接口形状，不放业务常量——部位树、器械顺序在 `@/pages/discover/config`。
 */

/** 列表项：够画一张卡（图 + 名字 + 器械 + 肌群） */
export interface IExerciseBrief {
  /** 4 位字符串主键（"0025"），入库后不可变 */
  id: string;
  zh_name: string;
  en_name: string;
  /** 力量 / 有氧 */
  category: string;
  /** 部位一级，如 背 */
  body_part: string;
  /** 器械，如 杠铃 */
  equipment: string;
  primary_tags: string[];
  secondary_tags: string[];
  usage_tags: string[];
  /** `/static/exercises/gifs/<id>.gif` */
  gif: string;
  /** `/static/exercises/thumbs/<id>.jpg` */
  thumb: string;
}

/** 详情页：多中文说明与分步要点 */
export interface IExerciseDetail extends IExerciseBrief {
  instructions: string;
  steps: string[];
  attribution: string;
}

/** 列表响应：total 用于分页，version 可判断本地快照是否过期 */
export interface IExerciseList {
  total: number;
  items: IExerciseBrief[];
  version: string;
}

/** 一个筛选维度的分组计数 */
export interface IExerciseFilterEntry {
  value: string;
  count: number;
}

/** 筛选项：三个维度各自的分组计数，左栏角标与 chips 数量都读它 */
export interface IExerciseFilters {
  body_part: IExerciseFilterEntry[];
  equipment: IExerciseFilterEntry[];
  category: IExerciseFilterEntry[];
}

/** 排序口径（后端 SORT_FIELDS 的键） */
export type ExerciseSort = 'default' | 'popular' | 'name' | 'new';

/** 列表查询参数：全部可选，传了的才进 query */
export interface IExerciseQuery {
  /** 搜中文名 / 英文名 */
  q?: string;
  body_part?: string;
  equipment?: string;
  category?: string;
  /** 肌群标签，支持一级 back 或二级 back.lat */
  muscle?: string;
  /** 只看当前用户收藏（未登录后端返回 401） */
  favorite_user?: boolean;
  sort?: ExerciseSort;
  limit?: number;
  offset?: number;
}

/** 收藏切换结果 */
export interface IExerciseFavorite {
  exercise_id: string;
  favorited: boolean;
}
