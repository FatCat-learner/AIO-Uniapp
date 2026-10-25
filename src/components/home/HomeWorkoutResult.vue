<template>
  <AppCard padding="none">
    <view class="wk__hd">
      <AppCardHeader :title="title" :meta="summary" chevron @action="emit('more')" />
    </view>

    <view
      v-for="row in props.rows"
      :key="row.id"
      class="wk-row"
      hover-class="u-hover"
      :hover-stay-time="80"
      @tap="emit('select', row)"
    >
      <AppIconTile :icon="row.icon" :tone="toneOf(row.kind)" :size="40" />

      <view class="wk-row__txt">
        <text class="wk-row__t">
          {{ row.title }}
        </text>
        <text class="wk-row__m">
          {{ row.meta }}
        </text>
      </view>

      <view class="wk-row__slot">
        <!-- 未开始 -->
        <template v-if="row.state === 'idle'">
          <view class="slot__go">
            <text class="slot__go-t">
              GO!
            </text>
            <AppIcon name="dumbbell" :size="20" />
          </view>
        </template>

        <!-- 进行中 -->
        <template v-else-if="row.state === 'progress'">
          <text class="slot__v a-num">
            {{ row.percent }}%
          </text>
          <text class="slot__cap">
            {{ row.capacity }}
          </text>
        </template>

        <!-- 已完成 · 力量 -->
        <template v-else-if="row.state === 'done'">
          <text class="slot__v a-num">
            {{ row.duration }}
          </text>
          <text class="slot__sub">
            {{ row.totalCapacity }}
          </text>
        </template>

        <!-- 已完成 · 有氧 -->
        <template v-else>
          <view class="slot__vrow">
            <text class="slot__v a-num">
              {{ row.kcal }}
            </text>
            <text class="slot__u">
              千卡
            </text>
          </view>
          <text class="slot__sub a-num">
            {{ row.detail }}
          </text>
        </template>
      </view>

      <AppIcon v-if="hasChevron(row)" class="slot__chev" name="chevron-right" :size="14" />
    </view>
  </AppCard>
</template>

<script setup lang="ts">
import type { WorkoutRow } from '@mocks/types';
/**
 * HomeWorkoutResult · 今日训练结果卡（UI 规范 V1.1 §4.25）
 *
 * 状态机（右槽统一 88 宽右对齐两行，除 GO! 外都带 ›）：
 * - idle     未开始 0%   → GO! 15/700 荧光绿 + 哑铃图标，无 ›
 * - progress 1–99%      → 55% 22/600 + 「容量 4.2t / 7.6t」10 灰
 * - done     已完成力量   → 62:00 17/600 + 「8.4t 容量」11
 * - cardio   有氧完成     → 482（17/600）+ 千卡 10 + 22.4 km 11
 *
 * 卡内不放按钮、不放进度条、不写「已完成 3/5 组」。
 */
import { computed } from 'vue';
import AppCard from '@/components/base/AppCard.vue';
import AppCardHeader from '@/components/base/AppCardHeader.vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppIconTile from '@/components/base/AppIconTile.vue';

const props = defineProps<{
  rows: WorkoutRow[];
  /** 卡头右侧「共 2 次 · 1,860 千卡」 */
  summary?: string;
}>();

const emit = defineEmits<{
  (e: 'select', row: WorkoutRow): void;
  (e: 'more'): void;
}>();

const toneOf = (kind: WorkoutRow['kind']) =>
  kind === 'cardio' ? 'cardio' : kind === 'other' ? 'body' : 'train';

/** GO! 与已完成之外都要 › */
const hasChevron = (row: WorkoutRow) => row.state !== 'idle';

const title = computed(() => '今日训练');
</script>

<style lang="scss" scoped>
.wk__hd {
  padding: var(--sp-5) var(--sp-5) var(--sp-2);
}

/* 行：64 高、行间 1px、左右 20 */
.wk-row {
  display: flex;
  gap: var(--sp-2);
  align-items: center;
  height: var(--row-h);
  padding: 0 var(--sp-5);
  border-top: 1px solid var(--line);
}

.wk-row__txt {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.wk-row__t {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  color: var(--text-1);
  white-space: nowrap;
}

.wk-row__m {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 14px;
  color: var(--text-2);
  white-space: nowrap;
}

.wk-row__slot {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: 1px;
  align-items: flex-end;
  min-width: 88px;
}

.slot__v {
  font-size: 17px;
  font-weight: 600;
  line-height: 20px;
  color: var(--text-1);
  letter-spacing: -0.01em;
}

/* 进行中的百分比是这行里唯一的大字 */
.slot__sub {
  font-size: 11px;
  line-height: 14px;
  color: var(--text-2);
}

.slot__cap {
  font-size: 10px;
  line-height: 13px;
  color: var(--text-3);
}

.slot__vrow {
  display: flex;
  gap: 2px;
  align-items: baseline;
}

.slot__u {
  font-size: 10px;
  color: var(--text-3);
}

.slot__go {
  display: flex;
  gap: var(--sp-1);
  align-items: center;
  color: var(--brand-500);
}

.slot__go-t {
  font-size: 15px;
  font-weight: 700;
  line-height: 18px;
  letter-spacing: 0.02em;
}

.slot__chev {
  flex: none;
  color: var(--text-disabled);
}
</style>
