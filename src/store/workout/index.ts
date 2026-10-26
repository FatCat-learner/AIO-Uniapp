import type {
  IWorkoutExercise,
  IWorkoutSet,
  IWorkoutState,
  SetDifficulty,
} from './types';
import type { IExerciseBrief } from '@/api/exercise/types';

import { defineStore } from 'pinia';

/** 新加一组：重量次数留空等用户填，不自作主张继承上一组 */
function createSet(id: string): IWorkoutSet {
  return { id, weight: 0, reps: 0, done: false };
}

/**
 * 训练草稿
 *
 * 只放「这一次训练」的本地状态，不碰接口：写入训记要等后端 §6.11
 * 的 8 条写接口落地，那之前 action 都只改本地。
 */
const useWorkoutStore = defineStore('workout', {
  state: (): IWorkoutState => ({
    active: false,
    title: '',
    startedAt: 0,
    pausedMs: 0,
    paused: true,
    pausedAt: 0,
    exercises: [],
    seq: 0,
  }),

  getters: {
    /** 动作数 */
    exerciseCount: (state): number => state.exercises.length,

    /** 总组数 */
    setCount: (state): number =>
      state.exercises.reduce((sum, item) => sum + item.sets.length, 0),

    /** 已打勾的组数 */
    doneCount: (state): number =>
      state.exercises.reduce(
        (sum, item) => sum + item.sets.filter(row => row.done).length,
        0,
      ),

    /** 训练容量（kg），只算打勾的组 */
    volume: (state): number =>
      state.exercises.reduce(
        (sum, item) =>
          sum
          + item.sets.reduce(
            (acc, row) => (row.done ? acc + row.weight * row.reps : acc),
            0,
          ),
        0,
      ),

    /** 一条数据都没有 */
    isEmpty: (state): boolean => state.exercises.length === 0,
  },

  actions: {
    /** 从动作库选完带回来：同 id 的已经在列表里就跳过 */
    addExercises(list: IExerciseBrief[]) {
      list.forEach((exercise) => {
        if (this.exercises.some(item => item.exercise.id === exercise.id)) return;
        this.seq += 1;
        const exId = `ex-${this.seq}`;
        this.seq += 1;
        const next: IWorkoutExercise = {
          id: exId,
          exercise,
          sets: [createSet(`set-${this.seq}`)],
          note: '',
          timed: false,
          difficulty: null,
        };
        this.exercises.push(next);
      });
      this.active = this.exercises.length > 0;
    },

    /** 追加一组（复制上一组的重量次数，方便连着做） */
    addSet(exerciseId: string) {
      const target = this.exercises.find(item => item.id === exerciseId);
      if (!target) return;
      const last = target.sets[target.sets.length - 1];
      this.seq += 1;
      const row = createSet(`set-${this.seq}`);
      if (last) {
        row.weight = last.weight;
        row.reps = last.reps;
      }
      target.sets.push(row);
    },

    /** 删掉最后一组，至少留一组 */
    removeLastSet(exerciseId: string) {
      const target = this.exercises.find(item => item.id === exerciseId);
      if (!target || target.sets.length <= 1) return;
      target.sets.pop();
    },

    /** 打勾 / 取消打勾 */
    toggleSet(exerciseId: string, setId: string) {
      const row = this.findSet(exerciseId, setId);
      if (row) row.done = !row.done;
    },

    /** 改重量或次数 */
    updateSet(
      exerciseId: string,
      setId: string,
      patch: Partial<Pick<IWorkoutSet, 'weight' | 'reps'>>,
    ) {
      const row = this.findSet(exerciseId, setId);
      if (!row) return;
      if (typeof patch.weight === 'number') row.weight = patch.weight;
      if (typeof patch.reps === 'number') row.reps = patch.reps;
    },

    /** 选难度（再点一次取消） */
    setDifficulty(exerciseId: string, value: SetDifficulty) {
      const target = this.exercises.find(item => item.id === exerciseId);
      if (!target) return;
      target.difficulty = target.difficulty === value ? null : value;
    },

    /** 备注与「每组计时」开关 */
    setNote(exerciseId: string, note: string) {
      const target = this.exercises.find(item => item.id === exerciseId);
      if (target) target.note = note;
    },

    toggleTimed(exerciseId: string) {
      const target = this.exercises.find(item => item.id === exerciseId);
      if (target) target.timed = !target.timed;
    },

    /** 改标题 */
    setTitle(title: string) {
      this.title = title;
    },

    /** 播放 / 暂停；第一次播放才落 startedAt */
    togglePause() {
      if (!this.startedAt) {
        this.startedAt = Date.now();
        this.paused = false;
        this.active = true;
        return;
      }
      if (this.paused) {
        this.pausedMs += Date.now() - this.pausedAt;
        this.paused = false;
      }
      else {
        this.pausedAt = Date.now();
        this.paused = true;
      }
    },

    /** 结束并清空 */
    reset() {
      this.active = false;
      this.title = '';
      this.startedAt = 0;
      this.pausedMs = 0;
      this.paused = false;
      this.exercises = [];
      this.seq = 0;
    },

    findSet(exerciseId: string, setId: string): IWorkoutSet | undefined {
      const target = this.exercises.find(item => item.id === exerciseId);
      return target?.sets.find(row => row.id === setId);
    },
  },

  /** 草稿要跨 App 重启活下来：练到一半退出不该丢 */
  persist: true,
});

export default useWorkoutStore;
