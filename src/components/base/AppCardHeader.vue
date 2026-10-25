<template>
  <view class="a-card-hd">
    <text class="a-card-title">
      {{ title }}
    </text>
    <view class="hd__right" hover-class="u-hover" :hover-stay-time="80" @tap="emit('action', $event)">
      <!-- 需要胶囊等复杂内容时走 right 插槽 -->
      <slot name="right">
        <text v-if="link" class="a-link">
          {{ link }}
        </text>
        <text v-else-if="meta" class="a-card-meta a-num">
          {{ meta }}
        </text>
        <AppIcon v-if="chevron" class="hd__chev" name="chevron-right" :size="14" />
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * AppCardHeader · 卡片头（UI 规范 V1.1 §4.2）
 * 左：标题 15/600 白；右：11 灰说明（meta）/ 品牌色链接（link）/ 自定义插槽，可带 ›。
 * 全站卡片统一用这一层，保证「卡片头只有一种长相」。
 */
import AppIcon from './AppIcon.vue';

withDefaults(
  defineProps<{
    /** 卡片标题，如「今日训练」「营养」 */
    title: string;
    /** 右侧 11 灰说明，如「共 2 次 · 1,860 千卡」「2026/10/20 更新」 */
    meta?: string;
    /** 右侧品牌色链接文案，如「预约安排」「编辑」 */
    link?: string;
    /** 右侧是否显示 › */
    chevron?: boolean;
  }>(),
  {
    meta: '',
    link: '',
    chevron: false,
  },
);

const emit = defineEmits<{
  (e: 'action', event: Event): void;
}>();
</script>

<style lang="scss" scoped>
.hd__right {
  display: flex;
  flex: none;
  gap: var(--sp-1);
  align-items: center;
  min-height: 20px;
}

.hd__chev {
  color: var(--text-disabled);
}
</style>
