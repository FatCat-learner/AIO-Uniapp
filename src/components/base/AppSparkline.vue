<template>
  <view class="spark" :class="`spark--${tone}`" :style="{ width: `${width}px`, height: `${height}px` }">
    <view
      v-for="(s, i) in segments"
      :key="`s${i}`"
      class="spark__seg"
      :style="{ left: s.left, top: s.top, width: s.width, transform: s.transform }"
    />
    <view
      v-for="(d, i) in dots ? midDots : []"
      :key="`d${i}`"
      class="spark__dot"
      :style="{ left: `${d.x - 2.5}px`, top: `${d.y - 2.5}px` }"
    />
    <view class="spark__last" :style="{ left: `${lastDot.x - 3.5}px`, top: `${lastDot.y - 3.5}px` }" />
  </view>
</template>

<script setup lang="ts">
/**
 * AppSparkline · 迷你趋势线（UI 规范 V1.1 §4.26 指标卡右下角）
 * 120×56，2px 模块色折线，中间点 5，末点 7 实心，无坐标轴、无网格、无渐变填充。
 *
 * 实现说明：不依赖 canvas / svg（小程序端 svg 不可用、canvas 尺寸换算麻烦），
 * 用「绝对定位 + rotate 的细条」拼折线，H5 与小程序表现一致。
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** 数值序列，左→右按时间顺序 */
    points: number[];
    /** 模块色（决定线的颜色） */
    tone?: 'brand' | 'cardio' | 'diet' | 'body' | 'social';
    width?: number;
    height?: number;
    /** 是否画中间小圆点（点太多时可关掉） */
    dots?: boolean;
  }>(),
  {
    tone: 'body',
    width: 120,
    height: 56,
    dots: true,
  },
);

/** 留边，保证端点圆点不被裁掉 */
const PAD = 5;

const coords = computed(() => {
  const list = props.points && props.points.length ? props.points : [0, 0];
  const min = Math.min(...list);
  const max = Math.max(...list);
  const span = max - min || 1;
  const innerW = props.width - PAD * 2;
  const innerH = props.height - PAD * 2;
  return list.map((v, i) => ({
    x: list.length === 1 ? props.width / 2 : PAD + (i * innerW) / (list.length - 1),
    y: props.height - PAD - ((v - min) / span) * innerH,
  }));
});

const segments = computed(() =>
  coords.value.slice(1).map((p, i) => {
    const a = coords.value[i];
    const dx = p.x - a.x;
    const dy = p.y - a.y;
    return {
      left: `${a.x}px`,
      top: `${a.y - 1}px`,
      width: `${Math.sqrt(dx * dx + dy * dy)}px`,
      transform: `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`,
    };
  }),
);

const midDots = computed(() => coords.value.slice(0, -1));
const lastDot = computed(() => coords.value[coords.value.length - 1]);
</script>

<style lang="scss" scoped>
.spark {
  position: relative;
  flex: none;
}

.spark--brand {
  color: var(--mod-train);
}

.spark--cardio {
  color: var(--mod-cardio);
}

.spark--diet {
  color: var(--mod-diet);
}

.spark--body {
  color: var(--mod-body);
}

.spark--social {
  color: var(--mod-social);
}

.spark__seg {
  position: absolute;
  height: 2px;
  background-color: currentColor;
  border-radius: 1px;
  transform-origin: left center;
}

.spark__dot {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: currentColor;
  border-radius: var(--radius-full);
  opacity: 0.55;
}

.spark__last {
  position: absolute;
  width: 7px;
  height: 7px;
  background-color: currentColor;
  border-radius: var(--radius-full);
  box-shadow: 0 0 0 3px var(--surface);
}
</style>
