<template>
  <view class="card" :class="rootClass" :hover-class="clickable || danger ? 'u-hover' : 'none'" :hover-stay-time="80" @tap="handleClick">
    <slot />
  </view>
</template>

<script setup lang="ts">
/**
 * AppCard · 通用卡片骨架（规范 §4.3）
 * #14171F 底、20 圆角、1px #232833 描边、内边距 16（大卡 20）、无阴影。
 * 所有业务卡都套这层，保证「描边分层、不用投影」不跑偏。
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** 内边距档位：lg 20（规范默认）/ md 16（紧凑）/ none 0（自行控制） */
    padding?: 'md' | 'lg' | 'none';
    /** 可点卡：右侧出现 › */
    clickable?: boolean;
    /** 危险态（如「退出登录」条）：12% 红底 */
    danger?: boolean;
    /** 虚线卡：预约 / 空态（1px dashed #3F4653） */
    dashed?: boolean;
  }>(),
  {
    padding: 'lg',
    clickable: false,
    danger: false,
    dashed: false,
  },
);

const emit = defineEmits<{
  (e: 'click', event: Event): void;
}>();

const rootClass = computed(() => [
  `card--pad-${props.padding}`,
  { 'card--danger': props.danger, 'card--dashed': props.dashed },
]);

function handleClick(event: Event) {
  if (!props.clickable && !props.danger) return;
  emit('click', event);
}
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  overflow: hidden;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.card--pad-md {
  padding: 16px;
}

.card--pad-lg {
  padding: 20px;
}

.card--pad-none {
  padding: 0;
}

.card--danger {
  background-color: var(--danger-soft);
  border-color: rgb(239 68 68 / 18%);
}

.card--dashed {
  border-color: var(--line-dashed);
  border-style: dashed;
}
</style>
