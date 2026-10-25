<template>
  <AppSheet
    :visible="visible"
    :title="title"
    :subtitle="subtitle"
    height="auto"
    :mask-closable="maskClosable"
    @update:visible="(v: boolean) => emit('update:visible', v)"
    @close="emit('close')"
  >
    <view class="as">
      <view
        v-for="(item, index) in items"
        :key="item.value"
        class="as__row"
        :class="{ 'as__row--danger': item.tone === 'danger', 'as__row--first': index === 0 }"
        @tap="onSelect(item)"
      >
        <AppIcon v-if="item.icon" :name="item.icon" :size="18" class="as__icon" />
        <text class="as__label">{{ item.label }}</text>
      </view>
    </view>
    <template #footer>
      <view class="as__cancel" @tap="close">
        <text>{{ cancelText }}</text>
      </view>
    </template>
  </AppSheet>
</template>

<script setup lang="ts">
import type { ActionSheetItem } from './types';
import AppSheet from './AppSheet.vue';

/**
 * AppActionSheet —— 动作列表（危险项置底、取消独立成块）
 *
 * 设计稿：_design/previews/overlays/index.html 帧 13
 * 说明：src/components/overlays/README.md
 *
 * 为什么不用 uview-plus 的 u-action-sheet：
 * 1. 它把「取消」和动作混在一个圆角块里，而设计稿要求取消独立成一块（iOS 惯例）；
 * 2. 危险项要红字 + 红色图标，u-action-sheet 只能整体改色；
 * 3. 没有键盘避让，输入型场景直接废。
 * 所以这里用 AppSheet 组合封装，样式与层级仍然只有一处来源。
 */
withDefaults(
  defineProps<{
    visible: boolean;
    title?: string;
    subtitle?: string;
    items: ActionSheetItem[];
    cancelText?: string;
    /** 点遮罩关闭 */
    maskClosable?: boolean;
  }>(),
  { cancelText: '取消', maskClosable: true },
);

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'close'): void;
  (e: 'select', value: string): void;
}>();

const close = (): void => {
  emit('update:visible', false);
  emit('close');
};

const onSelect = (item: ActionSheetItem): void => {
  emit('select', item.value);
  close();
};
</script>

<style lang="scss" scoped>
.as {
  overflow: hidden;
  background: var(--surface-2);
  border-radius: var(--radius-md);
}

.as__row {
  display: flex;
  gap: var(--sp-3);
  align-items: center;
  height: 56px;
  padding: 0 var(--sp-4);
  font-size: var(--fs-body);
  color: var(--text-1);

  & + & {
    border-top: var(--hair);
  }

  &--danger,
  &--danger .as__icon {
    color: var(--danger-text);
  }
}

.as__icon {
  color: var(--text-2);
}

.as__cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  margin-top: var(--sp-2);
  font-size: var(--fs-body);
  font-weight: 500;
  color: var(--text-2);
  background: var(--surface-2);
  border-radius: var(--radius-md);
}
</style>
