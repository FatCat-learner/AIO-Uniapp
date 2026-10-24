<script setup lang="ts">
/**
 * AppIconTile · 图标块（规范 §4.5，PDF 签名组件）
 * 40×40 / 30×30 / 48×48，圆角 12，底为「模块色 12%」，图标为模块色线稿。
 * 禁止实色填充。
 */
import { computed } from 'vue';
import AppIcon from './AppIcon.vue';

const props = withDefaults(
  defineProps<{
    /** MDI 图标名，如 dumbbell */
    icon: string;
    /** 模块色：train 力量 / cardio 有氧 / diet 饮食 / body 身体 / social 社区 */
    tone?: 'train' | 'cardio' | 'diet' | 'body' | 'social';
    /** 40 / 30 / 48 */
    size?: 30 | 40 | 48;
  }>(),
  {
    tone: 'train',
    size: 40,
  },
);

/** 块尺寸 → 图标尺寸：40 内 20，30 内 16，48 内 24 */
const iconSize = computed(() => Math.round(props.size / 2));

const tileStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));
</script>

<template>
  <view class="icon-tile" :class="`icon-tile--${tone}`" :style="tileStyle">
    <AppIcon :name="icon" :size="iconSize" />
  </view>
</template>

<style lang="scss" scoped>
.icon-tile {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.icon-tile--train {
  color: var(--mod-train);
  background-color: rgba(201, 240, 58, 0.12);
}

.icon-tile--cardio {
  color: var(--mod-cardio);
  background-color: rgba(59, 130, 246, 0.12);
}

.icon-tile--diet {
  color: var(--mod-diet);
  background-color: rgba(249, 115, 22, 0.12);
}

.icon-tile--body {
  color: var(--mod-body);
  background-color: rgba(168, 85, 247, 0.12);
}

.icon-tile--social {
  color: var(--mod-social);
  background-color: rgba(6, 182, 212, 0.12);
}
</style>
