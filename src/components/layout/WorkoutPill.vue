<template>
  <view class="pill" :class="rootClass" hover-class="u-hover" :hover-stay-time="80" @tap="handleResume">
    <view class="pill__text">
      <text class="pill__label">
        {{ label }}
      </text>
      <text class="pill__time">
        {{ time }}
      </text>
    </view>
    <view class="pill__btn">
      <AppIcon name="arrow-u-left-top" :size="16" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * WorkoutPill · 训练悬浮气泡（规范 §4.15，R7）
 * 高 48、pill，#14171F 底 + 1px rgba(201,240,58,.4) + glow；
 * 左两行（训练进行中 11 灰 / 00:00 17/600 荧光绿），右 28 圆形「返回训练」。
 * 悬浮在 Dock 上方 12，右边距 16，上浮于内容之上。
 */
import { computed } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';

const props = withDefaults(
  defineProps<{
    visible?: boolean;
    /** 已进行时长，如 00:00 */
    time?: string;
    /** 状态文案 */
    label?: string;
  }>(),
  {
    visible: false,
    time: '00:00',
    label: '训练进行中',
  },
);

const emit = defineEmits<{
  (e: 'resume'): void;
}>();

const rootClass = computed(() => ['pill', { 'is-visible': props.visible }]);

function handleResume() {
  emit('resume');
}
</script>

<style lang="scss" scoped>
.pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 176px;
  height: 48px;
  padding: 0 10px 0 14px;
  visibility: hidden;
  background-color: var(--surface);
  border: 1px solid rgba(201, 240, 58, 0.4);
  border-radius: var(--radius-full);
  box-shadow: var(--glow);
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0.2s;
}

.pill.is-visible {
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
}

.pill__text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.pill__label {
  font-size: 11px;
  line-height: 14px;
  color: var(--text-2);
}

.pill__time {
  font-size: 17px;
  font-weight: 600;
  line-height: 20px;
  color: var(--brand-500);
  font-variant-numeric: tabular-nums;
}

.pill__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--brand-500);
  background-color: var(--brand-50);
  border-radius: var(--radius-full);
}
</style>
