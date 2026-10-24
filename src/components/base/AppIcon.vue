<template>
  <view
    class="app-icon"
    :class="`i-mdi-${props.name}`"
    :style="{
      width: typeof props.size === 'number' ? `${props.size}px` : props.size,
      height: typeof props.size === 'number' ? `${props.size}px` : props.size,
      fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
      color: props.color,
    }"
  />
</template>

<script setup lang="ts">
/**
 * AppIcon · 统一图标出口
 * 规范 §3.5：线性风格、24 网格、线宽 2、圆角端点。
 *
 * 用 unocss presetIcons（mask + currentColor）实现，颜色由父级 color 继承，
 * 所以「选中变荧光绿」只需要改父级文字颜色，不用换图。
 *
 * ⚠️ 新增图标时：把 i-mdi-xxx 同步加进 uno.config.ts 的 safelist，
 *    否则动态拼出来的类名不会被 unocss 扫描到。
 */
const props = withDefaults(
  defineProps<{
    /** MDI 图标名（不带 i-mdi- 前缀），如 home-outline */
    name: string;
    /** 尺寸，数字按 px 处理 */
    size?: number | string;
    /** 颜色，默认继承父级（currentColor） */
    color?: string;
  }>(),
  {
    size: 24,
    color: 'currentColor',
  },
);
</script>

<style lang="scss" scoped>
.app-icon {
  flex: none;
  background-color: currentColor;
}
</style>
