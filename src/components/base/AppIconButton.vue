<template>
  <view class="icon-btn-wrap">
    <view class="icon-btn" :class="rootClass" hover-class="u-hover" :hover-stay-time="80" @tap="emit('click', $event)">
      <AppIcon :name="icon" :size="size" />
    </view>
    <view v-if="dot" class="icon-btn__dot" />
  </view>
</template>

<script setup lang="ts">
/**
 * AppIconButton · 40×40 圆形图标按钮（规范 §4.8 IconButton）
 * 用于 NavBar 右侧「通知 / 消息 / +」，卡内「更多」。
 */
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    /** MDI 图标名，如 bell-outline */
    icon: string;
    /** 图标尺寸，默认 20 */
    size?: number;
    /** 视觉样式：默认 surface 底 + 1px 描边；ghost 透明底 */
    variant?: 'default' | 'ghost';
    /** 是否显示右上角小红点 */
    dot?: boolean;
  }>(),
  {
    size: 20,
    variant: 'default',
    dot: false,
  },
);

const emit = defineEmits<{
  (e: 'click', event: Event): void;
}>();

const rootClass = computed(() => [`icon-btn--${props.variant}`]);
</script>

<style lang="scss" scoped>
.icon-btn-wrap {
  position: relative;
  display: flex;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-1);
  border-radius: var(--radius-full);
}

.icon-btn--default {
  background-color: var(--surface);
  border: 1px solid var(--line);
}

.icon-btn--ghost {
  background-color: transparent;
}

.icon-btn__dot {
  position: absolute;
  top: 8px;
  right: 9px;
  width: 6px;
  height: 6px;
  background-color: var(--brand-500);
  border-radius: var(--radius-full);
  box-shadow: 0 0 0 2px var(--surface);
}
</style>
