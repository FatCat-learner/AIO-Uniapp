/**
 * 本地图标登记表 · 唯一真相源
 *
 * - `uno.config.ts` 用它生成 safelist（`i-app-*`），否则动态类名会被摇掉；
 * - `scripts/check-icons.mjs` 用它和 `src/static/icons/` 做双向一致性校验。
 *
 * 新增图标顺序：从 iconfont 挑一个符合 `_design/SPEC.md` 图标规范的 SVG →
 * 存成 `src/static/icons/<kebab-name>.svg` → 在这里登记 → `pnpm icons:check`。
 */
export const APP_ICONS = [
  'dumbbell',
  'pencil',
  'play',
  'timer',
] as const;

export type AppIconName = (typeof APP_ICONS)[number];
