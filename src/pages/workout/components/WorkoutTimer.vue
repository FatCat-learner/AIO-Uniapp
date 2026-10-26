<template>
  <view v-if="timer.visible && timer.expanded" class="tm">
    <view class="tm__mask" />

    <view class="tm__card">
      <view class="cp-hd">
        <text class="cp-t">{{ timer.titleText }}</text>
        <button class="cp-min" @click="timer.minimize()">
          <AppIcon name="minus" :size="14" />
        </button>
      </view>

      <view v-if="timer.mode === 'sequence'" class="cp-sub">
        <text class="cp-name">{{ timer.target?.exerciseName }}</text>
        <text class="cp-set">{{ timer.targetText }}</text>
      </view>

      <view v-if="timer.mode === 'rest'" class="cp-tools">
        <button
          class="tbtn-s"
          :class="{ 'tbtn-s--on': timer.vibrate }"
          @click="timer.setVibrate(!timer.vibrate)"
        >
          <AppIcon name="vibrate" :size="12" />
          <text>手机震动</text>
        </button>
      </view>

      <view class="cp-ring">
        <svg class="cp-ring__svg" width="214" height="214" viewBox="0 0 214 214" fill="none">
          <circle cx="107" cy="107" r="97" stroke="var(--fill)" stroke-width="11" />
          <circle
            cx="107"
            cy="107"
            r="97"
            :stroke="timer.stageColor"
            stroke-width="11"
            stroke-linecap="round"
            :stroke-dasharray="`${dash} 609`"
          />
        </svg>
        <view class="cp-mid">
          <text class="cp-stage">{{ timer.stageLabel }}</text>
          <text class="cp-num">{{ timer.remainingText }}</text>
          <text class="cp-cap">{{ timer.totalText }}</text>
        </view>
      </view>

      <view v-if="timer.mode === 'rest'" class="cp-row">
        <button class="cp-half" @click="timer.addSeconds(-10)">-10s</button>
        <button class="cp-half" @click="timer.addSeconds(10)">+10s</button>
      </view>

      <button class="cp-act" :class="{ 'cp-act--pri': timer.mode === 'rest' }" @click="timer.skip()">
        {{ timer.primaryText }}
      </button>
      <button v-if="timer.mode === 'sequence'" class="cp-act cp-act--g" @click="timer.stop()">
        停止连续播放
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 训练计时浮层（设计稿 _design/previews/workout-flow ⑦–⑩ 屏）
 *
 * 两种形态共用一张卡：休息计时（⑦，带 ±10s / 震动开关）与连续播放
 * （⑧⑨⑩，准备→训练→休息自动轮播）。状态全在 @/store/timer，这里只画。
 *
 * 环用内联 svg：与 AuthLogo / 探索页地图同一路数（小程序端待适配）。
 */
import { computed } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';
import useTimerStore from '@/store/timer';

const timer = useTimerStore();

/** 环周长 2πr（r=97），与设计稿 dasharray "594 609" 同一口径 */
const CIRCUMFERENCE = 609;

/** 点亮的弧长 = 剩余比例 × 周长 */
const dash = computed(() => (timer.progress * CIRCUMFERENCE).toFixed(1));
</script>

<style lang="scss" scoped>
.tm {
  position: fixed;
  inset: 0;
  /* 训练 sheet 传 z-index 120（压过 Dock 100），计时浮层要再高一档 */
  z-index: 130;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-5);
}

.tm__mask {
  position: absolute;
  inset: 0;
  background-color: var(--mask);
}

.tm__card {
  position: relative;
  display: flex;
  flex: none;
  flex-direction: column;
  gap: var(--sp-4);
  width: 326px;
  max-width: 100%;
  padding: var(--sp-4) var(--sp-4) var(--sp-5);
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-xxl);
  box-shadow: var(--shadow-float);
}

.cp-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cp-t {
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--text-1);
}

.cp-min {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--text-2);
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.cp-sub {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  margin-top: calc(var(--sp-1) * -1);
}

.cp-name {
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text-1);
}

.cp-set {
  font-size: var(--fs-sm);
  color: var(--text-2);
}

.cp-tools {
  display: flex;
  justify-content: flex-start;
}

.tbtn-s {
  display: inline-flex;
  gap: var(--sp-1);
  align-items: center;
  height: var(--pill-h);
  padding: 0 var(--sp-3);
  font-size: var(--fs-xs);
  color: var(--text-2);
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.tbtn-s--on {
  color: var(--brand-500);
  background-color: var(--brand-a10);
}

.cp-ring {
  position: relative;
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
  width: 214px;
  height: 214px;
  margin: var(--sp-2) 0;
}

.cp-ring__svg {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}

.cp-mid {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  align-items: center;
  text-align: center;
}

.cp-stage {
  font-size: var(--fs-body);
  color: var(--text-2);
}

.cp-num {
  font-size: calc(var(--fs-display) * 1.9);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--text-1);
}

.cp-cap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 136px;
  height: 32px;
  font-size: var(--fs-sm);
  color: var(--text-2);
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.cp-row {
  display: flex;
  gap: var(--sp-2);
}

.cp-half {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 46px;
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--text-1);
  background-color: var(--fill);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
}

.cp-act {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  font-size: var(--fs-body);
  font-weight: 600;
  color: var(--text-1);
  background-color: rgb(var(--brand-500-rgb) / 12%);
  border: 1px solid var(--brand-a35);
  border-radius: var(--radius-full);
}

.cp-act--pri {
  color: var(--on-brand);
  background-color: var(--brand-500);
  border-color: var(--brand-500);
  box-shadow: var(--glow);
}

.cp-act--g {
  height: 46px;
  color: var(--text-2);
  background-color: var(--fill);
  border-color: var(--line);
}
</style>
