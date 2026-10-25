<template>
  <view v-if="visible" class="coach">
    <view v-if="!measured" class="coach__dim" :style="{ zIndex: overlayZ('coach') }" @tap="close" />
    <view v-else class="coach__hole" :style="holeStyle" @tap="close" />
    <view class="coach__tip" :style="tipStyle">
      <text class="coach__step">{{ step }} / {{ total }}</text>
      <text v-if="title" class="coach__title">{{ title }}</text>
      <text v-if="text" class="coach__text">{{ text }}</text>
      <view class="coach__foot">
        <view class="coach__dots">
          <text v-for="i in total" :key="i" class="coach__dot" :class="{ 'is-on': i === step }" />
        </view>
        <view class="coach__next" @tap="next">
          <text>{{ step >= total ? '知道了' : nextText }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { overlayZ } from './overlayStack';

/**
 * AppCoachmark —— 首启引导（挖洞遮罩 + 分步气泡）
 *
 * 设计稿：_design/previews/overlays/index.html 帧 15
 * 说明：src/components/overlays/README.md
 *
 * 挖洞不用 canvas：一个绝对定位的圆角方框 + `box-shadow: 0 0 0 9999px` 当遮罩，
 * 这样「洞」永远和边框对齐（试过用 JS 算 top/height 写死像素，换个机型就错位）。
 *
 * 用法：
 *   <view id="guide-capacity">本周容量卡片</view>
 *   <AppCoachmark v-model:visible="showGuide" target="#guide-capacity" :step="1" :total="3"
 *     title="本周容量在这里" text="超过上周 12% 会亮进度条" @next="..." />
 */
const props = withDefaults(
  defineProps<{
    visible: boolean;
    /** 目标节点选择器（支持 #id / .class，取第一个） */
    target?: string;
    step?: number;
    total?: number;
    title?: string;
    text?: string;
    nextText?: string;
    zIndex?: number;
  }>(),
  { nextText: '下一步', step: 1, total: 1 },
);

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'next'): void;
  (e: 'finish'): void;
}>();

const hole = ref({ top: 0, left: 0, width: 0, height: 0 });
const measured = ref(false);

const measure = async (): Promise<void> => {
  if (!props.target) {
    measured.value = false;
    return;
  }
  await nextTick();
  uni
    .createSelectorQuery()
    .select(props.target)
    .boundingClientRect((rect) => {
      const r = rect as { top: number; left: number; width: number; height: number } | null;
      if (!r) {
        measured.value = false;
        return;
      }
      const pad = 4;
      hole.value = { top: r.top - pad, left: r.left - pad, width: r.width + pad * 2, height: r.height + pad * 2 };
      measured.value = true;
    })
    .exec();
};

watch(
  () => [props.visible, props.target] as const,
  ([open]) => {
    if (open) measure();
  },
  { immediate: true },
);

const holeStyle = computed(() => ({
  top: `${hole.value.top}px`,
  left: `${hole.value.left}px`,
  width: `${hole.value.width}px`,
  height: `${hole.value.height}px`,
  zIndex: overlayZ('coach'),
}));

/** 气泡贴在洞口下方；离底部太近就翻到上方 */
const tipStyle = computed(() => {
  const base = { zIndex: overlayZ('coach') + 1 };
  if (!measured.value) return base;
  const below = hole.value.top + hole.value.height + 12;
  const flip = below > 560;
  return flip
    ? { ...base, top: `${Math.max(12, hole.value.top - 148)}px` }
    : { ...base, top: `${below}px` };
});

const close = (): void => emit('update:visible', false);
const next = (): void => {
  if (props.step >= props.total) {
    emit('finish');
    close();
    return;
  }
  emit('next');
};
</script>

<style lang="scss" scoped>
.coach {
  position: fixed;
  inset: 0;
}

.coach__dim {
  position: absolute;
  inset: 0;
  background: var(--glass-72);
}

.coach__hole {
  position: absolute;
  border: 1px solid var(--brand-a50);
  border-radius: var(--radius-lg);
  box-shadow: 0 0 0 9999px var(--glass-72);
}

.coach__tip {
  position: absolute;
  right: var(--sp-4);
  left: var(--sp-4);
  padding: var(--sp-4);
  background: var(--surface-2);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-float), inset 0 0 0 1px var(--line-white-08);
}

.coach__step {
  font-size: var(--fs-2xs);
  color: var(--text-3);
}

.coach__title {
  display: block;
  margin-top: var(--sp-1);
  font-size: var(--fs-h3);
  font-weight: 600;
  color: var(--text-1);
}

.coach__text {
  display: block;
  margin-top: var(--sp-1);
  font-size: var(--fs-sm);
  line-height: 1.55;
  color: var(--text-2);
}

.coach__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--sp-4);
}

.coach__dots {
  display: flex;
  gap: 5px;
}

.coach__dot {
  width: 5px;
  height: 5px;
  background: var(--fill);
  border-radius: var(--radius-full);

  &.is-on {
    width: 14px;
    background: var(--brand-500);
  }
}

.coach__next {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--brand-500);
}
</style>
