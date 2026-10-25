<template>
  <view class="foot-link" @tap="emit('tap')">
    <text class="foot-link__text">{{ prefix }}<text class="foot-link__link">{{ link || '' }}</text></text>
  </view>
</template>

<script setup lang="ts">
/**
 * 页面底部文字链接：所有视图统一贴底、居中、13px（§16.13）
 */
withDefaults(defineProps<{ prefix?: string; link?: string }>(), { prefix: '', link: '' });

const emit = defineEmits<{ tap: [] }>();
</script>

<style lang="scss" scoped>
.foot-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
}

.foot-link__text {
  font-size: var(--fs-sm);
  color: var(--text-3);
}

.foot-link__link {
  font-weight: 600;
  color: var(--brand-500);
}
</style>
