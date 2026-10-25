<template>
  <view v-if="isOpen" class="ctx">
    <view class="ctx__mask" :style="{ zIndex: overlayZ('mask') - 1 }" @tap="close" @touchmove.stop.prevent />
    <view class="ctx__menu" :style="style" @contextmenu.prevent>
      <view v-if="header" class="ctx__hd">
        <text>{{ header }}</text>
      </view>
      <template v-for="item in items" :key="item.value">
        <view v-if="item.divider" class="ctx__sep" />
        <view class="ctx__row" :class="{ 'ctx__row--danger': item.tone === 'danger' }" @tap="onSelect(item)">
          <AppIcon v-if="item.icon" :name="item.icon" :size="16" class="ctx__icon" />
          <text class="ctx__label">{{ item.label }}</text>
          <text v-if="item.shortcut" class="ctx__kbd">{{ item.shortcut }}</text>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ContextMenuItem } from './types';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { overlayZ } from './overlayStack';

/**
 * AppContextMenu —— 右键菜单（H5/桌面）/ 长按菜单（移动端）
 *
 * 设计稿：_design/previews/overlays/index.html 帧 16（右键）/ 帧 14（长按）
 * 说明：src/components/overlays/README.md
 *
 * 用法一（推荐，绑定到任意行）：
 *   <view v-bind="menu.handlers" @tap="openDetail"> 第 2 组 </view>
 *   <AppContextMenu ref="menu" :items="items" @select="onMenuSelect" />
 *
 * 用法二（受控）：`:visible` + `:x` `:y` 自己算坐标。
 *
 * 平台差异：`contextmenu` 事件只有 H5 有；App / 小程序一律靠长按（500ms）。
 */
const props = withDefaults(
  defineProps<{
    items: ContextMenuItem[];
    /** 菜单顶部标题，如「胸肩三头 · 第 2 组」 */
    header?: string;
    visible?: boolean;
    x?: number;
    y?: number;
    /** 长按触发阈值（ms） */
    longPressDelay?: number;
    zIndex?: number;
  }>(),
  { longPressDelay: 500 },
);

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'select', value: string): void;
  (e: 'close'): void;
}>();

const MENU_W = 232;
const HEAD_H = 34;
const ROW_H = 38;
const SEP_H = 9;

const inner = ref(false);
const pos = ref({ x: 0, y: 0 });
let timer: ReturnType<typeof setTimeout> | null = null;

const isOpen = computed(() => (props.visible === undefined ? inner.value : props.visible));
const anchorX = computed(() => (props.visible === undefined ? pos.value.x : (props.x ?? 0)));
const anchorY = computed(() => (props.visible === undefined ? pos.value.y : (props.y ?? 0)));

const menuH = computed(
  () => (props.header ? HEAD_H : 0) + props.items.length * ROW_H + props.items.filter(i => i.divider).length * SEP_H + 8,
);

const style = computed(() => {
  let info = { windowWidth: 390, windowHeight: 844 };
  try {
    info = uni.getSystemInfoSync() as typeof info;
  }
  catch {
    /* 取不到就用默认值 */
  }
  const pad = 8;
  // 视口翻转：右/下放不下就往左/上翻
  const x = Math.max(pad, Math.min(anchorX.value, info.windowWidth - MENU_W - pad));
  const y = Math.max(pad, Math.min(anchorY.value, info.windowHeight - menuH.value - pad));
  return { left: `${x}px`, top: `${y}px`, width: `${MENU_W}px`, zIndex: props.zIndex ?? overlayZ('menu') };
});

const close = (): void => {
  inner.value = false;
  emit('update:visible', false);
  emit('close');
};

const openAt = (x: number, y: number): void => {
  pos.value = { x, y };
  inner.value = true;
  emit('update:visible', true);
};

const pointOf = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
  const touch = (e as TouchEvent).touches?.[0] ?? (e as TouchEvent).changedTouches?.[0];
  if (touch) return { x: touch.clientX, y: touch.clientY };
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
};

const clearTimer = (): void => {
  if (timer) clearTimeout(timer);
  timer = null;
};

/** 一行绑定这组事件即可同时拿到右键与长按 */
const handlers = {
  onContextmenu: (e: MouseEvent): void => {
    e.preventDefault();
    const { x, y } = pointOf(e);
    openAt(x, y);
  },
  onTouchstart: (e: TouchEvent): void => {
    clearTimer();
    const { x, y } = pointOf(e);
    timer = setTimeout(() => {
      const api = uni as unknown as { vibrateShort?: (o: object) => void };
      api.vibrateShort?.({ type: 'light' });
      openAt(x, y);
    }, props.longPressDelay);
  },
  onTouchmove: clearTimer,
  onTouchend: clearTimer,
  onTouchcancel: clearTimer,
};

const onSelect = (item: ContextMenuItem): void => {
  emit('select', item.value);
  close();
};

const onKeydown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && isOpen.value) close();
};

onMounted(() => {
  if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  clearTimer();
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown);
});

defineExpose({ openAt, close, handlers });
</script>

<style lang="scss" scoped>
.ctx {
  position: fixed;
  inset: 0;
}

.ctx__mask {
  position: absolute;
  inset: 0;
}

.ctx__menu {
  position: fixed;
  padding: var(--sp-1);
  background: var(--surface-2);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-float), inset 0 0 0 1px var(--line-white-08);
  transform-origin: top left;
  animation: ctx-in 0.16s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes ctx-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.ctx__hd {
  padding: var(--sp-2) var(--sp-3) var(--sp-1);
  font-size: var(--fs-3xs);
  color: var(--text-3);
  letter-spacing: 0.08em;
}

.ctx__row {
  display: flex;
  gap: var(--sp-3);
  align-items: center;
  height: 38px;
  padding: 0 var(--sp-3);
  font-size: var(--fs-sm);
  color: var(--text-1);
  border-radius: var(--radius-xs);

  &:active {
    background: var(--fill);
  }

  &--danger,
  &--danger .ctx__icon {
    color: var(--danger-text);
  }
}

.ctx__icon {
  color: var(--text-2);
}

.ctx__label {
  flex: 1;
}

.ctx__kbd {
  padding: 1px 5px;
  font-size: var(--fs-3xs);
  color: var(--text-3);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-xs);
}

.ctx__sep {
  height: 1px;
  margin: var(--sp-1) var(--sp-2);
  background: var(--line);
}
</style>
