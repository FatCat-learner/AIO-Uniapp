import type { ITimerState, ITimerTarget, TimerStage } from './types';
import { defineStore } from 'pinia';

/**
 * 训练计时（设计稿 `_design/previews/workout-flow` ⑦–⑫ 屏）
 *
 * 只有两种模式：
 * - `rest`：打完一组单独休息一个（⑦ 休息计时，±10s + 完成）
 * - `sequence`：连续播放，准备 → 训练 → 休息自动轮播（⑧⑨⑩）
 *
 * 时间基准一律 `Date.now()`，`duration` 存「本阶段总时长」而不是「剩余」，
 * 这样暂停、切后台回来都不会漂。页面每 300ms 调一次 `tick()` 推 `now` 并在到点推进阶段。
 */

/** 连续播放默认值（秒）：准备 5 / 训练 60 / 休息 90，与设计稿 ⑪ 屏一致 */
export const TIMER_DEFAULTS = { prepareSec: 5, trainingSec: 60, restSec: 90 };

const STAGE_LABEL: Record<TimerStage, string> = {
  prepare: '准备',
  training: '训练',
  rest: '休息',
};

/** m:ss，超过 1 小时才升到 h:mm:ss */
function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export default defineStore('timer', {
  state: (): ITimerState => ({
    mode: null,
    stage: 'rest',
    duration: 0,
    startedAt: 0,
    pausedMs: 0,
    paused: false,
    pausedAt: 0,
    now: 0,
    prepareSec: TIMER_DEFAULTS.prepareSec,
    trainingSec: TIMER_DEFAULTS.trainingSec,
    restSec: TIMER_DEFAULTS.restSec,
    target: null,
    vibrate: true,
    expanded: true,
  }),

  getters: {
    /** 有计时在跑（含最小化） */
    visible: state => state.mode !== null,
    /** 本阶段已过时间 */
    elapsed: (state) => {
      if (!state.mode) return 0;
      const end = state.paused ? state.pausedAt : state.now;
      return Math.max(0, end - state.startedAt - state.pausedMs);
    },
    /** 本阶段剩余 */
    remaining(state): number {
      return Math.max(0, state.duration - this.elapsed);
    },
    /** 剩余比例（0–1），进度环吃这个值 */
    progress(state): number {
      if (!state.duration) return 0;
      return Math.max(0, Math.min(1, this.remaining / state.duration));
    },
    stageLabel: state => STAGE_LABEL[state.stage],
    /** 阶段色：准备红 / 训练绿 / 休息蓝（设计稿 ⑧⑨⑩） */
    stageColor: (state) => {
      if (state.stage === 'prepare') return 'var(--danger-text)';
      if (state.stage === 'training') return 'var(--brand-500)';
      return 'var(--info)';
    },
    /** 环里的大数字 */
    remainingText(): string {
      return formatClock(this.remaining);
    },
    /** 胶囊「总共 1:00」 */
    totalText: state => `总共 ${formatClock(state.duration)}`,
    /** 顶部标题：单独休息 / 连续播放 */
    titleText: state => (state.mode === 'rest' ? '休息计时' : '连续播放'),
    /** 主按钮文案随阶段变 */
    primaryText: (state) => {
      if (state.mode === 'rest') return '完成';
      if (state.stage === 'prepare') return '跳过准备';
      if (state.stage === 'training') return '跳过本组';
      return '完成休息';
    },
    /** 连续播放的「半程硬拉 · 第 1/2 组」 */
    targetText: (state) => {
      const t = state.target;
      if (!t) return '';
      return `第 ${t.setIndex}/${t.setTotal} 组`;
    },
  },

  actions: {
    /** 进入某个阶段：重置本阶段计时 */
    enter(stage: TimerStage, seconds: number) {
      this.stage = stage;
      this.duration = Math.max(0, seconds) * 1000;
      this.startedAt = Date.now();
      this.now = this.startedAt;
      this.pausedMs = 0;
      this.paused = false;
      this.pausedAt = 0;
      this.expanded = true;
      this.buzz();
    },

    /** 到点提醒（只有 App 有真震动，H5/小程序走空实现） */
    buzz() {
      if (!this.vibrate) return;
      // #ifdef APP-PLUS
      uni.vibrateShort({});
      // #endif
    },

    /** 打完一组：单独休息（⑦） */
    startRest(seconds?: number, target?: ITimerTarget) {
      this.mode = 'rest';
      this.target = target ?? null;
      this.enter('rest', seconds ?? this.restSec);
    },

    /** 连续播放（⑧）：从第 1 组的准备阶段开始 */
    startSequence(target: ITimerTarget, seconds?: Partial<Pick<ITimerState, 'prepareSec' | 'trainingSec' | 'restSec'>>) {
      if (seconds?.prepareSec !== undefined) this.prepareSec = seconds.prepareSec;
      if (seconds?.trainingSec !== undefined) this.trainingSec = seconds.trainingSec;
      if (seconds?.restSec !== undefined) this.restSec = seconds.restSec;
      this.mode = 'sequence';
      this.target = { ...target, setIndex: 1 };
      this.enter('prepare', this.prepareSec);
    },

    /** 页面每 300ms 调一次：推 now，到点自动进下一阶段 */
    tick() {
      if (!this.mode) return;
      this.now = Date.now();
      if (this.paused) return;
      if (this.elapsed >= this.duration) this.advance();
    },

    /** 阶段结束：rest 模式直接收，sequence 按 准备→训练→休息→下一组 走 */
    advance() {
      if (!this.mode) return;
      if (this.mode === 'rest') {
        this.stop();
        return;
      }
      if (this.stage === 'prepare') {
        this.enter('training', this.trainingSec);
        return;
      }
      if (this.stage === 'training') {
        this.enter('rest', this.restSec);
        return;
      }
      // 休息结束 → 下一组；已经是最后一组就收工
      const target = this.target;
      if (!target || target.setIndex >= target.setTotal) {
        this.stop();
        return;
      }
      this.target = { ...target, setIndex: target.setIndex + 1 };
      this.enter('prepare', this.prepareSec);
    },

    /** 主按钮：跳过准备 / 跳过本组 / 完成休息 / 完成（rest 模式） */
    skip() {
      if (!this.mode) return;
      // rest 模式 advance 会直接 stop；sequence 则跳到下一阶段（休息结束就进下一组）
      this.advance();
    },

    /** ±10s */
    addSeconds(delta: number) {
      if (!this.mode) return;
      this.duration = Math.max(1000, this.duration + delta * 1000);
    },

    pause() {
      if (!this.mode || this.paused) return;
      this.now = Date.now();
      this.pausedAt = this.now;
      this.paused = true;
    },

    resume() {
      if (!this.mode || !this.paused) return;
      this.pausedMs += Date.now() - this.pausedAt;
      this.paused = false;
      this.pausedAt = 0;
      this.now = Date.now();
    },

    togglePause() {
      this.paused ? this.resume() : this.pause();
    },

    /** 收掉计时（完成 / 停止连续播放都走这里） */
    stop() {
      this.mode = null;
      this.stage = 'rest';
      this.duration = 0;
      this.startedAt = 0;
      this.pausedMs = 0;
      this.paused = false;
      this.pausedAt = 0;
      this.now = 0;
      this.target = null;
      this.expanded = true;
    },

    /** 最小化：浮层收起，计时继续（首页胶囊 / 组行时间读 same store） */
    minimize() {
      if (!this.mode) return;
      this.expanded = false;
    },

    expand() {
      if (!this.mode) return;
      this.expanded = true;
    },

    setVibrate(value: boolean) {
      this.vibrate = value;
    },
  },
});
