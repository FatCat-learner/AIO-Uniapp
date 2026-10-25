<template>
  <view class="greet">
    <view class="greet__l">
      <view class="greet__row">
        <text class="greet__t">
          {{ greeting }}
        </text>
        <AppPill v-if="streakDays > 0" tone="brand" icon="fire">
          连续 {{ streakDays }} 天
        </AppPill>
      </view>
      <text class="greet__sub">
        {{ sub }}
      </text>
    </view>
    <view class="greet__r">
      <AppIconButton icon="bell-outline" @click="emit('bell')" />
      <AppIconButton icon="message-outline" @click="emit('message')" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * HomeGreeting · 首页问候区（UI 规范 V1.1 §5.1 ①）
 * 左：问候 24/600 + 副行 11 灰；问候行右端「连续 N 天」brand-50 胶囊；
 * 右：两个 40 圆图标按钮（通知 / 消息）。
 */
import AppIconButton from '@/components/base/AppIconButton.vue';
import AppPill from '@/components/base/AppPill.vue';

withDefaults(
  defineProps<{
    /** 「晚上好，聪汉」 */
    greeting: string;
    /** 「10 月 20 日 周二 · 减脂第 18 天」 */
    sub: string;
    /** 连续训练天数，0 不显示胶囊 */
    streakDays?: number;
  }>(),
  { streakDays: 0 },
);

const emit = defineEmits<{
  (e: 'bell'): void;
  (e: 'message'): void;
}>();
</script>

<style lang="scss" scoped>
.greet {
  display: flex;
  gap: var(--sp-2);
  align-items: flex-start;
  padding-bottom: var(--sp-1);
}

.greet__l {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.greet__row {
  display: flex;
  gap: var(--sp-2);
  align-items: center;
  min-width: 0;
}

.greet__t {
  flex: none;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: var(--text-1);
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.greet__sub {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 16px;
  color: var(--text-2);
  white-space: nowrap;
}

.greet__r {
  display: flex;
  flex: none;
  gap: var(--sp-2);
}
</style>
