import type { CatKey } from './discover';

/**
 * 列表行数据的并集：动作 / 食物 / 计划 / 路书的字段各家不同，
 * 用索引签名保持与原页面一致的宽松读取（r.part / r.times / r.kcal 等）。
 */
export interface Row {
  n: string;
  [key: string]: any;
}

/** 左栏分堆项 */
export interface RailItem {
  key: string;
  label: string;
  star?: boolean;
  kids?: boolean;
}

/** 主列表 / 搜索结果里的一个分区 */
export interface Sec {
  key: string;
  title: string;
  short: string;
  rows: Row[];
}

/** 空态里「去 X 找 N 条」 */
export interface CrossHit {
  key: CatKey;
  label: string;
  n: number;
}
