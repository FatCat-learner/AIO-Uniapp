/**
 * 本地图标登记表 · 唯一真相源
 *
 * - `uno.config.ts` 用它生成 safelist（`i-app-*`），否则动态类名会被摇掉；
 * - `scripts/check-icons.mjs` 用它和 `src/static/icons/` 做双向一致性校验。
 *
 * 新增图标：`pnpm icons:add lucide:<name>`（我这边从描边风格集合取）
 * 或 `pnpm icons:add --from=<本地 svg> --name=<kebab-name>`（你从 iconfont 下载的）
 * ——脚本会自动归一化、登记、校验并刷新图标墙。
 */
export const APP_ICONS = [
  'camera',
  'chart-column',
  'chart-line',
  'check',
  'chevron-right',
  'dumbbell',
  'ellipsis',
  'flask-conical',
  'grip-vertical',
  'house',
  'list',
  'maximize',
  'mic',
  'minus',
  'notebook-pen',
  'notebook-text',
  'pause',
  'pencil',
  'play',
  'plus',
  'search',
  'settings',
  'timer',
  'trash-2',
  'user',
  'users',
  'x',
] as const;

export type AppIconName = (typeof APP_ICONS)[number];
