<template>
  <view class="pk-foot">
    <view class="pk-foot__btn pk-foot__btn--ghost" hover-class="u-hover" @tap="emit('superSet')">
      <text class="pk-foot__text">临时超级组</text>
    </view>
    <view class="pk-foot__btn pk-foot__btn--main" hover-class="u-hover" @tap="emit('done')">
      <text class="pk-foot__text pk-foot__text--main">完成</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 底部固定条
 * 「临时超级组」本期只做点击态；「完成」= 把选择带回上一页（navigateBack）。
 */
const emit = defineEmits<{
  (e: 'superSet'): void;
  (e: 'done'): void;
}>();
</script>

<style lang="scss" scoped>
.pk-foot {
  display: flex;
  flex: none;
  gap: var(--sp-3);
  align-items: center;
  padding: var(--sp-3) var(--sp-4) var(--sp-5);
  background-color: var(--surface);
  border-top: 1px solid var(--line);
}

.pk-foot__btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 46px;
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.pk-foot__btn--ghost {
  background-color: transparent;
  border: 1px solid var(--line-strong);
}

.pk-foot__btn--main {
  background-color: var(--brand-500);
}

.pk-foot__text {
  font-size: var(--fs-base);
  font-weight: 600;
  line-height: 1;
  color: var(--text-1);
}

.pk-foot__btn--ghost .pk-foot__text {
  color: var(--text-2);
}

.pk-foot__text--main {
  color: var(--on-brand);
}
</style>
