<template>
  <view
    class="app-icon"
    :class="`i-${props.set}-${props.name}`"
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
 * 两个图标集：
 * - `set="mdi"`（默认）：iconify 远程集合，类名 `i-mdi-*`，safelist 写在 uno.config.ts；
 * - `set="app"`：本地集合 `src/static/icons/*.svg`（素材来自 iconfont 线性图标），
 *   类名 `i-app-*`，safelist 由 `src/components/base/icons.ts` 的 APP_ICONS 生成。
 *
 * ⚠️ 新增图标时：mdi 走 uno.config.ts safelist；app 走 icons.ts 登记表 + `pnpm icons:check`，
 *    否则动态拼出来的类名不会被 unocss 扫描到。
 */
const props = withDefaults(
  defineProps<{
    /** 图标名（不带 i-<set>- 前缀），如 home-outline */
    name: string;
    /** 图标集：mdi = iconify 远程集合；app = src/static/icons 本地集合 */
    set?: 'mdi' | 'app';
    /** 尺寸，数字按 px 处理 */
    size?: number | string;
    /** 颜色，默认继承父级（currentColor） */
    color?: string;
  }>(),
  {
    set: 'mdi',
    size: 24,
    color: 'currentColor',
  },
);
</script>

<style lang="scss" scoped>
.app-icon {
  flex: none;
  background-color: currentcolor;
}
</style>
