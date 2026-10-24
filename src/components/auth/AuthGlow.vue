<template>
  <view class="auth-glow" />
</template>

<script setup lang="ts">
/**
 * 顶部品牌光晕
 * 用 CSS 径向渐变而不是图片：一是任意尺寸都清晰，二是换品牌色只改令牌。
 */
</script>

<style lang="scss" scoped>
.auth-glow {
  position: absolute;
  top: -190px;
  left: 50%;
  width: 560px;
  height: 560px;
  margin-left: -280px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(var(--brand-500-rgb), 0.22) 0%,
    rgba(var(--brand-500-rgb), 0.08) 42%,
    rgba(var(--brand-500-rgb), 0) 72%
  );
  pointer-events: none;
}
</style>
