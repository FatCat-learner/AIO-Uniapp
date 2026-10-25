<template>
  <view v-if="visible" class="dialog">
    <view class="dialog__mask" :style="{ zIndex: overlayZ('mask') }" @tap="onMaskTap" @touchmove.stop.prevent />
    <view class="dialog__panel" :class="{ 'is-lifted': lifted, 'is-danger': tone === 'danger' }" :style="{ zIndex: zIndex ?? overlayZ('dialog') }">
      <view v-if="closable" class="dialog__close" @tap="close">
        <AppIcon name="close" :size="14" />
      </view>
      <view v-if="icon" :class="iconTileClass">
        <AppIcon :name="icon" :size="20" />
      </view>
      <text v-if="title" class="dialog__title">{{ title }}</text>
      <text v-if="message" class="dialog__msg">{{ message }}</text>
      <view class="dialog__content">
        <slot />
      </view>
      <view class="dialog__acts">
        <slot name="actions">
          <view v-if="confirmText" class="dialog__btn" :class="`dialog__btn--${tone}`" @tap="onConfirm">
            <text>{{ confirmText }}</text>
          </view>
          <view v-if="cancelText" class="dialog__btn dialog__btn--text" @tap="onCancel">
            <text>{{ cancelText }}</text>
          </view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { useKeyboardInset } from '@/composables/useKeyboardInset';
import { lockPageScroll, overlayZ, unlockPageScroll } from './overlayStack';

/**
 * AppDialog —— 中心弹窗（确认 / 表单）
 *
 * 设计稿：_design/previews/overlays/index.html 帧 06 / 07 / 19（键盘上移）
 * 说明：src/components/overlays/README.md
 *
 * 键盘规则（帧 19）：弹窗含输入框时整体上移到顶部安全距离，
 * 而不是让系统 `adjust-position` 把整页顶上去（那会把遮罩顶飞）。
 */
const props = withDefaults(
  defineProps<{
    visible: boolean;
    /** 标题 */
    title?: string;
    /** 正文，支持一段；复杂内容用默认插槽 */
    message?: string;
    tone?: 'brand' | 'danger' | 'neutral' | 'warn' | 'info';
    /** 顶部图标（iconify 名），如 mdi:trash-can-outline */
    icon?: string;
    /** 点遮罩是否可关（危险操作建议 false） */
    maskClosable?: boolean;
    /** 是否显示右上角关闭 */
    closable?: boolean;
    /** 主按钮文案；不传则只渲染插槽里的按钮 */
    confirmText?: string;
    cancelText?: string;
    /** 键盘弹出时上移（含输入框时开） */
    keyboardAware?: boolean;
    zIndex?: number;
  }>(),
  {
    tone: 'brand',
    maskClosable: false,
    closable: false,
    keyboardAware: false,
  },
);

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'close'): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const kb = useKeyboardInset();

const iconTileClass = computed(() => `dialog__ic dialog__ic--${props.tone}`);
const lifted = computed(() => props.keyboardAware && kb.height.value > 0);

const close = (): void => {
  emit('update:visible', false);
  emit('close');
};

const onConfirm = (): void => emit('confirm');
const onCancel = (): void => {
  emit('cancel');
  close();
};
const onMaskTap = (): void => {
  if (props.maskClosable) close();
};

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
.dialog {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-6);
}

.dialog__mask {
  position: absolute;
  inset: 0;
  background: var(--glass-62);
  backdrop-filter: blur(2px);
}

.dialog__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 320px;
  max-height: calc(100vh - 96px);
  padding: var(--sp-4);
  overflow-y: auto;
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-float), inset 0 0 0 1px var(--line-white-08);
  transition: transform 0.26s cubic-bezier(0.32, 0.72, 0, 1);

  /* 危险操作：红描边区分（不靠底色，避免与普通卡混淆） */
  &.is-danger {
    box-shadow: var(--shadow-float), inset 0 0 0 1px var(--danger-line);
  }

  /* 键盘弹出：贴顶，避免被键盘半遮 */
  &.is-lifted {
    align-self: flex-start;
    margin-top: var(--sp-2);
  }
}

.dialog__close {
  position: absolute;
  top: var(--sp-3);
  right: var(--sp-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text-2);
  background: var(--fill);
  border-radius: var(--radius-full);
}

.dialog__ic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--sp-3);
  border-radius: var(--radius-md);

  &--brand {
    color: var(--brand-500);
    background: var(--brand-50);
  }

  &--danger {
    color: var(--danger-text);
    background: var(--danger-soft);
  }

  &--neutral {
    color: var(--text-2);
    background: var(--fill);
  }

  &--warn {
    color: var(--warn-text);
    background: var(--warn-soft);
  }

  &--info {
    color: var(--info);
    background: var(--info-soft);
  }
}

.dialog__title {
  font-size: var(--fs-h2);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-1);
}

.dialog__msg {
  margin-top: var(--sp-2);
  font-size: var(--fs-base);
  line-height: 1.55;
  color: var(--text-2);
}

.dialog__content:empty {
  display: none;
}

.dialog__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: var(--fs-body);
  font-weight: 600;
  border-radius: var(--radius-full);

  &--brand {
    color: var(--on-brand);
    background: var(--brand-500);
  }

  &--danger {
    color: var(--danger-text);
    background: var(--danger-soft);
  }

  &--neutral {
    color: var(--text-1);
    background: var(--surface-2);
    box-shadow: inset 0 0 0 1px var(--line);
  }

  &--text {
    height: 40px;
    font-size: var(--fs-base);
    font-weight: 500;
    color: var(--text-3);
  }
}

.dialog__acts {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-top: var(--sp-4);
}
</style>
