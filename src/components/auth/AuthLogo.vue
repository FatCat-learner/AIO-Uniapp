<template>
  <view class="logo">
    <view class="logo__rule" />
    <text class="logo__word">AIOSPORT</text>

    <view class="logo__ring">
      <!-- 轨道：两条极淡的同心圆 + 一段品牌绿弧线（进场时顺时针描出）+ 弧头的光点 -->
      <svg class="logo__track" viewBox="0 0 212 212" fill="none">
        <circle cx="106" cy="106" r="88" stroke="rgba(255,255,255,.06)" stroke-width="1" />
        <circle cx="106" cy="106" r="70" stroke="rgba(255,255,255,.05)" stroke-width="1" />
        <circle
          class="logo__arc"
          cx="106"
          cy="106"
          r="88"
          :stroke="`url(#${gradientId})`"
          stroke-width="2.5"
          stroke-linecap="round"
          transform="rotate(-90 106 106)"
          stroke-dasharray="520"
          stroke-dashoffset="520"
        />
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#c9f03a" />
            <stop offset=".65" stop-color="rgba(201,240,58,.35)" />
            <stop offset="1" stop-color="rgba(201,240,58,0)" />
          </linearGradient>
        </defs>
        <circle class="logo__dot" cx="106" cy="18" r="3.5" fill="#c9f03a" />
      </svg>

      <!-- 呼吸光圈：从 1 扩到 1.42 并淡出，3.6s 一轮 -->
      <view class="logo__pulse" />

      <!-- 中心品牌块 + A 字标（图形与 src/assets/image/logo/logo-mark.svg 同源，改图形请同步改两边） -->
      <view class="logo__mark">
        <svg class="logo__glyph" viewBox="8.13 6.63 31.74 31.74" fill="none" aria-hidden="true">
          <path
            d="M12 33 24 12 36 33"
            stroke="#c9f03a"
            stroke-width="3.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M18 33 24 23 30 33"
            stroke="#c9f03a"
            stroke-opacity=".35"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 首屏品牌标记（字标 + 轨道动效）
 *
 * 结构自上而下：竖线 → AIOSPORT 字标 → 212×212 轨道（两条淡圆 + 一段描出的绿弧 + 弧头光点）
 * → 呼吸光圈 → 104×104 中心块（渐变底 + 内描边 + 外发光）+ A 字标。
 *
 * 动效两条：
 * - 弧线：stroke-dashoffset 520 → 120，1.5s cubic-bezier(.22,.8,.3,1) 延迟 .15s，只跑一次；
 * - 光圈：scale 1 → 1.42 并淡出，3.6s ease-out 无限循环。
 * 两个动画都只改 transform / stroke-dashoffset / opacity，不触发重排。
 */
import { getCurrentInstance } from 'vue';

// 同一页面可能出现多个实例，渐变 id 必须唯一，否则第二个会把第一个的弧线染成空
const gradientId = `logo-arc-${getCurrentInstance()?.uid ?? 0}`;
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 字标上方那道极短的竖线：从透明渐入品牌绿 */
.logo__rule {
  width: 1px;
  height: 16px;
  background: linear-gradient(to bottom, transparent, rgb(201 240 58 / 70%));
}

.logo__word {
  margin-top: 10px;
  font-size: 11px;
  font-weight: 600;
  color: rgb(255 255 255 / 62%);
  /* letter-spacing 会在最后一个字母后多留一格，用等量缩进抵消，视觉才真正居中 */
  text-indent: 0.42em;
  letter-spacing: 0.42em;
}

.logo__ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 212px;
  height: 212px;
  margin: 34px 0 0;
}

.logo__track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.logo__arc {
  animation: logo-draw 1.5s cubic-bezier(0.22, 0.8, 0.3, 1) 0.15s forwards;
}

@keyframes logo-draw {
  to {
    stroke-dashoffset: 120;
  }
}

.logo__dot {
  animation: logo-dot 1.5s cubic-bezier(0.22, 0.8, 0.3, 1) 0.15s both;
}

@keyframes logo-dot {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.logo__pulse {
  position: absolute;
  width: 104px;
  height: 104px;
  border: 1px solid rgb(201 240 58 / 28%);
  border-radius: 32px;
  animation: logo-pulse 3.6s ease-out infinite;
}

@keyframes logo-pulse {
  0% {
    opacity: 0.7;
    transform: scale(1);
  }

  70% {
    opacity: 0;
    transform: scale(1.42);
  }

  100% {
    opacity: 0;
    transform: scale(1.42);
  }
}

.logo__mark {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  background: linear-gradient(160deg, #1e2530, #12161d);
  border-radius: 32px;
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 7%),
    0 18px 40px rgb(0 0 0 / 50%),
    0 0 34px rgb(201 240 58 / 14%);
}

/* 字标：logo-mark.svg 的视图框已经收到字形外沿，66% 才等于预演里 57% 的字形占比 */
.logo__glyph {
  display: block;
  width: 66%;
  height: 66%;
}
</style>
