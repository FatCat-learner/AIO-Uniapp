<template>
  <view class="ex">
    <view class="ex__hd">
      <image class="ex__thumb" :src="item.exercise.thumb" mode="aspectFill" />
      <view class="ex__info">
        <text class="ex__name">{{ item.exercise.zh_name }}</text>
        <text class="ex__sub">{{ subtitle }}</text>
      </view>
      <text class="ex__vol">{{ volumeText }}</text>
      <button class="ex__gear" @click="emit('options')">
        <AppIcon name="cog-outline" :size="18" />
      </button>
    </view>

    <text
      class="ex__note"
      :class="{ 'ex__note--empty': !item.note }"
      @click="emit('note')"
    >
      {{ item.note || '点击输入备注' }}
    </text>

    <button
      class="pill"
      :class="{ 'pill--on': item.timed }"
      @click="emit('toggleTimed')"
    >
      <AppIcon v-if="item.timed" name="timer-outline" :size="12" />
      <text>每组计时</text>
    </button>

    <view v-for="(row, index) in item.sets" :key="row.id" class="setrow">
      <view class="setrow__no">
        <text>{{ index + 1 }}</text>
      </view>
      <input
        class="setrow__in"
        type="number"
        :value="row.weight ? String(row.weight) : ''"
        placeholder="kg"
        placeholder-class="setrow__ph"
        @input="onWeight(row.id, $event)"
      >
      <input
        class="setrow__in"
        type="number"
        :value="row.reps ? String(row.reps) : ''"
        placeholder="次"
        placeholder-class="setrow__ph"
        @input="onReps(row.id, $event)"
      >
      <button
        class="setrow__ok"
        :class="{ 'is-done': row.done }"
        @click="emit('toggleSet', row.id)"
      >
        <AppIcon v-if="row.done" name="check" :size="18" />
      </button>
      <button class="setrow__more" @click="emit('setMore', row.id)">
        <AppIcon name="dots-horizontal" :size="16" />
      </button>
    </view>

    <view class="diff">
      <view
        v-for="opt in DIFFICULTIES"
        :key="opt.value"
        class="diff__i"
        :class="[`diff__i--${opt.value}`, { 'is-on': item.difficulty === opt.value }]"
        @click="emit('difficulty', opt.value)"
      >
        <text class="diff__l">{{ opt.label }}</text>
        <view class="diff__o" />
      </view>
    </view>

    <view class="ex__btns">
      <button class="btn-s" @click="emit('addSet')">新增一组</button>
      <button class="btn-s btn-s--ghost" @click="emit('history')">动作历史</button>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 一张动作卡：缩略图 / 名字 / 器械部位 / 组行 / 难度三选 / 两个按钮
 * 对齐设计稿 _design/previews/workout-flow 第 ② 屏的 .ex
 *
 * 不做业务判断：增删组、打勾、改重量全部回抛给页面走 store。
 */
import type { IWorkoutExercise, SetDifficulty } from '@/store/workout/types';
import { computed } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';

const props = defineProps<{
  item: IWorkoutExercise;
}>();

const emit = defineEmits<{
  toggleSet: [setId: string];
  updateSet: [setId: string, patch: { weight?: number; reps?: number }];
  difficulty: [value: SetDifficulty];
  addSet: [];
  toggleTimed: [];
  setMore: [setId: string];
  note: [];
  options: [];
  history: [];
}>();

/** input 事件只用到 detail.value，uni-app x 各端都一致 */
interface InputChangeEvent {
  detail: { value: string };
}

const DIFFICULTIES: { value: SetDifficulty; label: string }[] = [
  { value: 'easy', label: '简单' },
  { value: 'mid', label: '正常' },
  { value: 'hard', label: '困难' },
];

/** 「杠铃 · 胸 · 中胸」：器械、部位、主标签第一个 */
const subtitle = computed(() => {
  const { equipment, body_part, primary_tags } = props.item.exercise;
  return [equipment, body_part, primary_tags?.[0]].filter(Boolean).join(' · ');
});

/** 右上角「12 次 · 60kg」，读最后一组 */
const volumeText = computed(() => {
  const last = props.item.sets[props.item.sets.length - 1];
  if (!last || (!last.reps && !last.weight)) return '';
  const reps = last.reps ? `${last.reps} 次` : '';
  const weight = last.weight ? `${last.weight}kg` : '自重';
  return [reps, weight].filter(Boolean).join(' · ');
});

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function onWeight(setId: string, event: InputChangeEvent) {
  emit('updateSet', setId, { weight: toNumber(event.detail.value) });
}

function onReps(setId: string, event: InputChangeEvent) {
  emit('updateSet', setId, { reps: toNumber(event.detail.value) });
}
</script>

<style lang="scss" scoped>
.ex {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: var(--card-pad-sm);
  background-color: var(--surface-2);
  border-radius: var(--radius-lg);
}

.ex__hd {
  display: flex;
  gap: var(--sp-3);
  align-items: center;
}

.ex__thumb {
  flex: none;
  width: 56px;
  height: 56px;
  background-color: var(--fill);
  border-radius: var(--radius-sm);
}

.ex__info {
  flex: 1;
  min-width: 0;
}

.ex__name {
  font-size: var(--fs-h3);
  font-weight: 600;
  line-height: var(--lh-snug);
  color: var(--text-1);
}

.ex__sub {
  display: block;
  margin-top: var(--sp-1);
  font-size: var(--fs-xs);
  color: var(--text-3);
}

.ex__vol {
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
  color: var(--text-3);
}

.ex__gear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--text-2);
  border-radius: var(--radius-full);
}

.ex__note {
  font-size: var(--fs-base);
  color: var(--text-1);
}

.ex__note--empty {
  color: var(--text-3);
}

.pill {
  display: inline-flex;
  gap: var(--sp-1);
  align-items: center;
  align-self: flex-start;
  height: var(--pill-h);
  padding: 0 var(--sp-3);
  margin: 0 auto 0 0;
  font-size: var(--fs-xs);
  color: var(--text-2);
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.pill--on {
  color: var(--brand-500);
  background-color: var(--brand-50);
}

.setrow {
  display: grid;
  grid-template-columns: 44px 1fr 1fr 44px 24px;
  gap: var(--sp-2);
  align-items: center;
}

.setrow__no {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text-1);
  background-color: var(--fill);
  border-radius: var(--radius-sm);
}

.setrow__in {
  height: 44px;
  padding: 0 var(--sp-3);
  font-size: var(--fs-base);
  color: var(--text-1);
  text-align: left;
  background-color: var(--fill);
  border-radius: var(--radius-sm);
}

.setrow__ph {
  color: var(--text-3);
}

.setrow__ok {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  color: var(--text-3);
  background-color: var(--fill);
  border-radius: var(--radius-sm);
}

.setrow__ok.is-done {
  color: var(--on-brand);
  background-color: var(--brand-500);
}

.setrow__more {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 44px;
  color: var(--text-3);
}

.diff {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
  padding: var(--sp-1) 0;
}

.diff__i {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  align-items: center;
  background: none;
  border: none;
}

.diff__l {
  font-size: var(--fs-xs);
  font-weight: 600;
}

.diff__o {
  width: 24px;
  height: 24px;
  border: 2px solid currentcolor;
  border-radius: var(--radius-full);
}

.diff__i--easy {
  color: var(--ok-text);
}

.diff__i--mid {
  color: var(--warn-text);
}

.diff__i--hard {
  color: var(--danger-text);
}

.diff__i.is-on .diff__o {
  background-color: currentcolor;
}

.ex__btns {
  display: flex;
  gap: var(--sp-2);
}

.btn-s {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 44px;
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text-1);
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.btn-s--ghost {
  color: var(--text-2);
  background-color: transparent;
  border: 1px solid var(--line-strong);
}
</style>
