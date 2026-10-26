<template>
  <AppCard padding="none" clickable @click="emit('start')">
    <view class="entry">
      <view class="entry__ic">
        <AppIcon name="dumbbell" :size="22" />
      </view>

      <view class="entry__txt">
        <text class="entry__e">开始训练</text>
        <text class="entry__n">今天练什么</text>
        <text class="entry__m">力量 · 有氧 · HIIT · 球类 等 7 种</text>
      </view>

      <view class="entry__go">
        <text class="entry__go-t">开始</text>
      </view>
    </view>
  </AppCard>
</template>

<script setup lang="ts">
/**
 * HomeWorkoutEntry · 首页「开始训练」入口卡（设计稿 home-v3 第 3 帧）
 *
 * 今日训练还没开始时占这个位置；点整卡或「开始」都弹 7 项面板。
 * 已有训练记录时它仍然在最上面，原来的结果卡跟在下面（历史入口不丢）。
 */
import AppCard from '@/components/base/AppCard.vue';
import AppIcon from '@/components/base/AppIcon.vue';

const emit = defineEmits<{
  (e: 'start'): void;
}>();
</script>

<style lang="scss" scoped>
.entry {
  display: flex;
  gap: var(--sp-3);
  align-items: center;
  padding: var(--sp-4);
}

.entry__ic {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--brand-500);
  background-color: var(--brand-a10);
  border-radius: var(--radius-md);
}

.entry__txt {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.entry__e {
  font-size: var(--fs-2xs);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-3);
  letter-spacing: 0.06em;
}

.entry__n {
  font-size: var(--fs-h3);
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-1);
}

.entry__m {
  font-size: var(--fs-xs);
  line-height: 1.35;
  color: var(--text-3);
}

.entry__go {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 0 var(--sp-4);
  background-color: var(--brand-500);
  border-radius: var(--radius-full);
}

.entry__go-t {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--on-brand);
}
</style>
