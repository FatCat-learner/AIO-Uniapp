/** 计时阶段：准备 → 训练 → 休息，连续播放就是这样一轮一轮往下走 */
export type TimerStage = 'prepare' | 'training' | 'rest';

/** rest = 打完一组单独歇一个；sequence = 连续播放，三阶段自动轮播 */
export type TimerMode = 'rest' | 'sequence';

/** 连续播放当前盯的是哪一组 */
export interface ITimerTarget {
  exerciseId: string;
  exerciseName: string;
  /** 1-based 组号 */
  setIndex: number;
  setTotal: number;
}

export interface ITimerState {
  mode: TimerMode | null;
  stage: TimerStage;
  /** 本阶段总时长（ms） */
  duration: number;
  /** 本阶段起点（Date.now()） */
  startedAt: number;
  /** 本阶段累计暂停（ms），暂停再继续会累加 */
  pausedMs: number;
  paused: boolean;
  pausedAt: number;
  /** 由 tick 刷新的「现在」，getters 都基于它算，避免模板里各算各的 */
  now: number;
  /** 连续播放参数（秒） */
  prepareSec: number;
  trainingSec: number;
  restSec: number;
  target: ITimerTarget | null;
  /** 到点提醒：App 才有真震动，H5/小程序只当开关记着 */
  vibrate: boolean;
  /** 最小化后仍在计时，只是浮层收起（首页胶囊读它） */
  expanded: boolean;
}
