/**
 * 训练会话（训练页草稿）的数据形状
 *
 * 这里存的是「这一次训练」的快照：动作名、器械、缩略图都在加进来时拍下，
 * 动作库之后改名改图都不影响正在进行的这次训练。
 */
import type { IExerciseBrief } from '@/api/exercise/types';

/** 组难度三选（产品口径：不做 RPE，只记简单 / 正常 / 困难） */
export type SetDifficulty = 'easy' | 'mid' | 'hard';

/** 一组 */
export interface IWorkoutSet {
  /** 会话内唯一，v-for key 用它 */
  id: string;
  /** kg；自重动作记 0 */
  weight: number;
  reps: number;
  /** 打过勾 */
  done: boolean;
}

/** 一个动作 = 一张动作卡 */
export interface IWorkoutExercise {
  id: string;
  /** 动作库快照 */
  exercise: IExerciseBrief;
  sets: IWorkoutSet[];
  /** 备注，空串表示没写 */
  note: string;
  /** 「每组计时」开关 */
  timed: boolean;
  /** 动作难度三选（设计稿 ② 屏底部那排），null 表示没选 */
  difficulty: SetDifficulty | null;
}

export interface IWorkoutState {
  /** 草稿是否在用：有动作或已经开始都算 */
  active: boolean;
  /** 训练标题，空串显示占位文案 */
  title: string;
  /** 开始计时的时间戳（ms），0 表示还没点播放 */
  startedAt: number;
  /** 累计暂停时长（ms） */
  pausedMs: number;
  /** 当前是否处于暂停 */
  paused: boolean;
  /** 本次暂停开始的时间戳（ms），未暂停时无意义 */
  pausedAt: number;
  exercises: IWorkoutExercise[];
  /** 自增序号，保证会话内 id 不重复 */
  seq: number;
}
