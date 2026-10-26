<template>
  <AppSheet :visible="open" height="auto" title="开始训练" :z-index="120" @close="emit('close')">
    <view class="grid">
      <view
        v-for="a in ACTIONS"
        :key="a.key"
        class="cell"
        :class="{ 'is-soon': a.soon }"
        hover-class="u-hover"
        :hover-stay-time="80"
        @tap="emit('pick', a.key)"
      >
        <view class="cell__ic">
          <AppIcon :name="a.icon" :set="a.set" :size="20" />
        </view>
        <text class="cell__t">{{ a.label }}</text>
        <text v-if="a.soon" class="cell__s">即将开放</text>
      </view>
    </view>
  </AppSheet>
</template>

<script setup lang="ts">
/**
 * HomeTrainingSheet · 训练启动面板（设计稿 home-v3 第 3 帧）
 *
 * 7 项面板：力量 / 有氧 / HIIT / 球类（占位「即将开放」）/ 身体数据 / 经期记录 / AI 教练。
 * 4+3 两排，前四项开训练 sheet，后三项跳各自页面。FAB 和首页入口卡共用这一个面板。
 */
import type { TrainingPick } from './types';
import AppIcon from '@/components/base/AppIcon.vue';
import AppSheet from '@/components/overlays/AppSheet.vue';

interface ITrainingAction {
  key: TrainingPick;
  label: string;
  icon: string;
  set?: 'mdi' | 'app';
  /** 还没做的入口：降透明度 + 「即将开放」 */
  soon?: boolean;
}

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'pick', key: TrainingPick): void;
}>();

const ACTIONS: ITrainingAction[] = [
  { key: 'strength', label: '力量训练', icon: 'dumbbell' },
  { key: 'cardio', label: '有氧训练', icon: 'run' },
  { key: 'hiit', label: 'HIIT训练', icon: 'lightning-bolt' },
  { key: 'ball', label: '球类训练', icon: 'soccer', soon: true },
  { key: 'body', label: '身体数据', icon: 'scale-bathroom' },
  { key: 'period', label: '经期记录', icon: 'calendar-blank-outline' },
  { key: 'ai', label: 'AI教练', icon: 'robot-outline' },
];
</script>

<style lang="scss" scoped>
/* 面板按内容撑高：body 不抢剩余高度，否则最后一行会被裁掉 */
:deep(.sheet__body) {
  flex: 0 0 auto;
  overflow-y: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sp-2) var(--sp-3);
  padding-bottom: var(--sp-6);
}

.cell {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  align-items: center;
  padding: var(--sp-3) 0;
  background-color: var(--fill);
  border-radius: var(--radius-md);

  &.is-soon {
    opacity: 0.62;
  }
}

.cell__ic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--brand-500);
}

.cell__t {
  font-size: var(--fs-xs);
  line-height: 1.3;
  color: var(--text-1);
  text-align: center;
}

.cell__s {
  margin-top: -4px;
  font-size: var(--fs-2xs);
  line-height: 1.2;
  color: var(--text-4);
}
</style>
