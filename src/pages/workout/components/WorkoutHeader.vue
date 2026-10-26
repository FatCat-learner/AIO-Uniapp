<template>
  <view class="wk-hd">
    <view class="wk-top">
      <view class="wk-timer">
        <text class="wk-time">{{ timeText }}</text>
        <button class="wk-play" @click="emit('toggle')">
          <AppIcon :name="paused ? 'play' : 'pause'" :size="14" />
        </button>
      </view>
      <button class="wk-done" @click="emit('done')">完成</button>
    </view>

    <view class="wk-meta">
      <view class="wk-meta__title" @click="emit('rename')">
        <AppIcon name="pencil" set="app" :size="14" />
        <text class="wk-title" :class="{ 'wk-title--empty': !title }">
          {{ title || '点击输入训练标题' }}
        </text>
      </view>
      <view class="wk-caps">
        <text>{{ countText }}</text>
        <text>{{ volumeText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 训练页头部：计时 + 播放/暂停 + 完成，下面一行标题与容量
 * 对齐设计稿 _design/previews/workout-flow 第 ① / ② 屏的 .wk-top / .wk-meta
 *
 * 只负责显示：计时数值由页面算好传进来，播放暂停回抛给页面改 store。
 */
import AppIcon from '@/components/base/AppIcon.vue';

defineProps<{
  /** 已经格式化好的时长，如 12:34 */
  timeText: string;
  paused: boolean;
  title: string;
  /** 「2 组 · 1 动作」 */
  countText: string;
  /** 「容量 1.9t」 */
  volumeText: string;
}>();

const emit = defineEmits<{
  toggle: [];
  done: [];
  rename: [];
}>();
</script>

<style lang="scss" scoped>
.wk-hd {
  flex: none;
}

.wk-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--sp-4) var(--sp-4) 0;
}

.wk-timer {
  display: flex;
  gap: var(--sp-3);
  align-items: center;
}

.wk-time {
  font-size: var(--fs-display);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--text-1);
  letter-spacing: -0.5px;
}

.wk-play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--icon-btn);
  height: var(--icon-btn);
  color: var(--text-1);
  background-color: var(--surface-2);
  border-radius: var(--radius-full);
}

.wk-done {
  display: flex;
  align-items: center;
  height: var(--icon-btn);
  padding: 0 var(--sp-5);
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--on-brand);
  background-color: var(--brand-500);
  border-radius: var(--radius-full);
  box-shadow: var(--glow);
}

.wk-meta {
  display: flex;
  gap: var(--sp-2);
  align-items: center;
  padding: var(--sp-3) var(--sp-4) var(--sp-4);
}

.wk-meta__title {
  display: flex;
  gap: var(--sp-2);
  align-items: center;
  min-width: 0;
  color: var(--text-2);
}

.wk-title {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--fs-body);
  color: var(--text-1);
  white-space: nowrap;
}

.wk-title--empty {
  color: var(--text-2);
}

.wk-caps {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
  font-size: var(--fs-xs);
  font-variant-numeric: tabular-nums;
  line-height: var(--lh-snug);
  color: var(--text-3);
}
</style>
