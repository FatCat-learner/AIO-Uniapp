<template>
  <view v-if="visible" class="sheet" :style="rootStyle">
    <view class="sheet__mask" :style="maskStyle" @tap="onMaskTap" @touchmove.stop.prevent />
    <view
      class="sheet__panel"
      :class="[`sheet__panel--${height}`, { 'is-dragging': dragging }]"
      :style="panelStyle"
    >
      <view class="sheet__grip" @touchstart="onTouchStart" @touchmove.stop.prevent="onTouchMove" @touchend="onTouchEnd" />
      <view v-if="title || kicker" class="sheet__hd">
        <view class="sheet__hd-main">
          <text v-if="kicker" class="sheet__kicker">{{ kicker }}</text>
          <text v-if="title" class="sheet__title">{{ title }}</text>
          <text v-if="subtitle" class="sheet__subtitle">{{ subtitle }}</text>
        </view>
        <view v-if="closable" class="sheet__close" @tap="close">
          <AppIcon name="close" :size="16" />
        </view>
      </view>
      <view class="sheet__body">
        <slot />
      </view>
      <view v-if="$slots.footer" class="sheet__ft">
        <slot name="footer" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useKeyboardInset } from '@/composables/useKeyboardInset';
import { lockPageScroll, overlayZ, unlockPageScroll } from './overlayStack';

/**
 * AppSheet —— 底部半屏 / 全屏浮层（唯一底座）
 *
 * 设计稿：_design/previews/overlays/index.html 帧 03 / 04 / 05 / 18（半屏 + 键盘）
 * 说明：src/components/overlays/README.md
 */
const props = withDefaults(
  defineProps<{
    visible: boolean;
    /** 语境小标签（设计稿的 ov__k），如「力量 · 胸」 */
    kicker?: string;
    title?: string;
    subtitle?: string;
    /** 高度档：auto 随内容 / half 52% / mid 64% / tall 76% / full 92% / screen 94%（训练页整屏 sheet） */
    height?: 'auto' | 'half' | 'mid' | 'tall' | 'full' | 'screen';
    /** 右上角关闭按钮 */
    closable?: boolean;
    /** 点遮罩关闭 */
    maskClosable?: boolean;
    /** 键盘弹出时整块上移（默认开） */
    keyboardAware?: boolean;
    /** 是否允许下拉关闭 */
    dragClose?: boolean;
    zIndex?: number;
  }>(),
  {
    height: 'auto',
    closable: true,
    maskClosable: true,
    keyboardAware: true,
    dragClose: true,
  },
);

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'close'): void;
}>();

const kb = useKeyboardInset();
const dragY = ref(0);
const dragging = ref(false);
let startY = 0;

const panelHeight = computed(
  () =>
    ({
      auto: 'auto',
      half: '52vh',
      mid: '64vh',
      tall: '76vh',
      full: '92vh',
      screen: '94vh',
    })[props.height],
);

/**
 * 根节点必须带 zIndex：`.sheet` 是 position:fixed，自身会生成 stacking context，
 * 只给面板设 zIndex 的话层级会被关在根节点里（auto=0），压不住 Dock(100)。
 */
const rootStyle = computed(() => ({
  zIndex: props.zIndex ?? overlayZ('sheet'),
}));

const panelStyle = computed(() => ({
  zIndex: props.zIndex ?? overlayZ('sheet'),
  height: panelHeight.value,
  paddingBottom: `${kb.safeBottom}px`,
  transform: kb.height.value && props.keyboardAware ? kb.lift.value : `translateY(${dragY.value}px)`,
}));

/** 遮罩跟面板同一层、低一档：传了高于 Dock(100) 的 zIndex 时遮罩也要压上去 */
const maskStyle = computed(() => ({
  zIndex: props.zIndex ? props.zIndex - 1 : overlayZ('mask'),
}));

const close = (): void => {
  kb.reset();
  emit('update:visible', false);
  emit('close');
};

const onMaskTap = (): void => {
  if (props.maskClosable) close();
};

const onTouchStart = (e: TouchEvent): void => {
  if (!props.dragClose) return;
  dragging.value = true;
  startY = e.touches[0]?.clientY ?? 0;
};

const onTouchMove = (e: TouchEvent): void => {
  if (!dragging.value) return;
  const delta = (e.touches[0]?.clientY ?? 0) - startY;
  dragY.value = Math.max(0, delta);
};

const onTouchEnd = (): void => {
  if (!dragging.value) return;
  dragging.value = false;
  if (dragY.value > 96) close();
  dragY.value = 0;
};

// 打开时锁页面滚动，关闭时解锁并复位键盘高度
watch(
  () => props.visible,
  (open, prev) => {
    if (open && !prev) lockPageScroll();
    if (!open && prev) {
      unlockPageScroll();
      kb.reset();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (props.visible) unlockPageScroll();
});
</script>

<style lang="scss" scoped>
.sheet {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.sheet__mask {
  position: absolute;
  inset: 0;
  background: var(--glass-62);
  backdrop-filter: blur(2px);
}

.sheet__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  background: var(--surface);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  box-shadow: var(--shadow-sheet), inset 0 1px 0 var(--line-white-08);
  transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1);

  &.is-dragging {
    transition: none;
  }
}

.sheet__grip {
  flex: none;
  width: 36px;
  height: 4px;
  margin: var(--sp-2) auto 0;
  background: var(--text-disabled);
  border-radius: var(--radius-full);
}

.sheet__hd {
  display: flex;
  flex: none;
  gap: var(--sp-3);
  align-items: flex-start;
  padding: var(--sp-4);
}

.sheet__hd-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.sheet__kicker {
  font-size: var(--fs-2xs);
  color: var(--text-3);
  letter-spacing: 0.08em;
}

.sheet__title {
  font-size: var(--fs-h2);
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-1);
}

.sheet__subtitle {
  font-size: var(--fs-sm);
  color: var(--text-2);
}

.sheet__close {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text-2);
  background: var(--fill);
  border-radius: var(--radius-full);
}

.sheet__body {
  flex: 1;
  min-height: 0;
  padding: 0 var(--sp-4);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.sheet__ft {
  display: flex;
  flex: none;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-4);
}
</style>
