# 浮层组件（overlays）

一套只从这里出的弹层：**遮罩、层级、动效、输入法避让、无障碍关闭** 全部内置，页面里不再手写 `position: fixed` 的遮罩，也不再直接用 `uni.showToast` / `uni.showModal`。

- 视觉基准：`_design/previews/overlays/index.html`（19 帧 + 清单表）
- 规范条款：`aio-uni-app-x/docs/前端开发规范.md` §13 浮层与输入法
- 设计画布与令牌：`_design/tokens.css` / `src/styles/theme.scss`

## 1. 组件一览

| 组件 | 场景 | 设计稿帧 |
| --- | --- | --- |
| `AppSheet` | 底部半屏（52/64/76/92%），唯一底座，支持下拉关闭、键盘上移 | 03 / 04 / 05 / 18 |
| `AppDialog` | 中心弹窗：危险确认、表单、安全验证 | 06 / 07 / 19 |
| `AppActionSheet` | 动作列表，危险项置底、取消独立成块 | 13 |
| `AppContextMenu` | 右键菜单（H5）/ 长按菜单（App、小程序），带快捷键提示 | 14 / 16 |
| `AppBlocking` | 阻塞加载：提交中、支付中 | 08 |
| `AppCoachmark` | 首启引导：挖洞 + 分步气泡 | 15 |
| `AppToastHost` + `useToast()` | Toast / Snackbar（可撤销） | 11 / 12 |

未组件化（设计有、按需再建）：`AppLightbox`（全屏看图，帧 02）、`AppTopCapsule`（帧 10）、`AppSelectionBar`（帧 17）。三者上线前先在这里补一行，再写组件。

## 2. 层叠：只认一张表

```ts
import { overlayZ } from '@/components/overlays/overlayStack'

overlayZ('mask') // 20
overlayZ('sheet') // 30
overlayZ('dialog') // 32
overlayZ('menu') // 34
overlayZ('toast') // 40
overlayZ('coach') // 44
overlayZ('topNotice') // 48
```

- 组件内部已用这张表；页面里**不要再写 `z-index: 999`**（历史遗留：`AppTopNotice.vue:41` 999、`CaptchaModal.vue:100` 950、`CountrySheet.vue:49` 900，迁移时改为表里的值）。
- `theme.scss` 里没有 `--z-*` 变量：z-index 要参与 JS 判断（谁在上、何时翻转），所以放在 TS 常量里，不放 CSS。
- 页面滚动锁走 `lockPageScroll()` / `unlockPageScroll()`，计数式，嵌套两层不会互相解锁。

## 3. 颜色与语气

统一用令牌，不写色值：

| 语气 | 底色 | 前景 | 用在 |
| --- | --- | --- | --- |
| 危险 | `--danger-soft` | `--danger-text` | 删除记录、退出登录、危险菜单项 |
| 危险描边 | `--danger-line` | — | `AppDialog tone="danger"` 的卡片边 |
| 警告 | `--warn-soft` | `--warn-text` | 权限提示、待同步、`tone="warn"` |
| 信息 | `--info-soft` | `--info` | 引导说明、`tone="info"` |

`--danger-line` / `--warn-soft` / `--info-soft` 是 2026-10-25 随本组件一起新增的（theme.scss 共 152 个令牌，`node _design/sync-tokens.mjs --check` 已通过）。

## 4. 输入法（这一节是硬约束）

真机问题：软键盘弹起时，`position: fixed` 的浮层不动，输入框被键盘压住；如果改用系统 `adjust-position`，整页（含遮罩）被顶上去，遮罩会跑出屏幕。

统一做法：

1. **上移量只从 `useKeyboardInset()` 取**，不要自己监听 `uni.onKeyboardHeightChange`（多次注册会互相打架）：

```ts
const kb = useKeyboardInset()
// kb.height: Ref<number>  键盘高度
// kb.lift: ComputedRef<string>  形如 translateY(-320px)
// kb.padBottom / kb.safeBottom / kb.isOpen / kb.hide() / kb.reset()
```

2. `AppSheet`：面板 `translateY(-键盘高度)`，`height` 不变，正文区自己滚——画面是「Sheet 骑在键盘上」。
3. `AppDialog`：整体上移到顶部安全距离（`is-lifted`），不做缩小。
4. 所有 `<input>` / `<textarea>` 必须写：

| 属性 | 值 | 原因 |
| --- | --- | --- |
| `adjust-position` | `false` | 禁止系统整页顶上去，位置由我们算 |
| `cursor-spacing` | `24`（表单）/ `12`（搜索） | 光标与键盘的最小间距，防「贴着键盘打字」 |
| `confirm-type` | `done` / `next` / `search` | 键盘右下角语义，减少一次收起动作 |
| `:focus` | 受控 | 关闭浮层前先 `kb.hide()` 再关，避免 Android 键盘残留 |

5. 浮层关闭时必须 `kb.reset()`（组件内已做）：部分 Android 收起键盘不上报 0，不复位会留下一条空白。
6. H5 没有软键盘，`useKeyboardInset` 用 `window.visualViewport` 兜底，拿不到 0 属正常，布局不能假设它必然 > 0。

## 5. 用法

### 半屏

```vue
<AppSheet v-model:visible="sheetOpen" kicker="力量 · 胸" title="杠铃卧推" height="mid">
  <div class="meta">…</div>
  <template #footer>
    <view class="btn btn--brand" @tap="save">保存</view>
  </template>
</AppSheet>
```

### 中心确认

```vue
<AppDialog
  v-model:visible="confirmOpen"
  tone="danger"
  icon="trash-can-outline"
  title="删除这条训练记录？"
  message="胸肩三头 · 10月24日的 6 个动作、总容量 12,480 kg 将被永久删除，无法恢复。"
  confirm-text="删除记录"
  cancel-text="取消"
  @confirm="remove"
/>
```

### 右键 / 长按菜单

```vue
<view v-bind="menu.handlers" @tap="openDetail">胸肩三头 · 第 2 组</view>

<AppContextMenu
  ref="menu"
  header="胸肩三头 · 第 2 组"
  :items="[
    { label: '查看详情', value: 'detail', icon: 'information-outline' },
    { label: '复制此组', value: 'copy', icon: 'content-copy', shortcut: '⌘C' },
    { label: '修改重量', value: 'edit', icon: 'pencil-outline', shortcut: 'E' },
    { label: '删除此组', value: 'remove', icon: 'trash-can-outline', divider: true, tone: 'danger', shortcut: 'Del' }
  ]"
  @select="onMenuSelect"
/>
```

- `menu.handlers` 同时绑定 `contextmenu`（H5 右键）与 `touchstart/move/end`（500ms 长按），小程序只有长按。
- 坐标超出视口会自动左/上翻转；`Esc` 与点外部关闭。
- 图标名是 **不带 `i-mdi-` 前缀** 的 MDI 名（`close` 而不是 `mdi:close`），并且必须加进 `uno.config.ts` 的 safelist，否则动态类名扫不到。

### Toast / Snackbar

```ts
const toast = useToast()
toast.show('已复制')                                        // 1.8s
toast.success('已保存到「今日训练」')
toast.error('网络异常，请重试')
toast.snack('已删除 1 条记录', { label: '撤销', handler: undo }) // 4s，带倒计时条
```

`AppToastHost` 全局挂一次，已挂在 `App.vue` 根部；页面里只调 `useToast()`。

### 引导

```vue
<AppCoachmark
  v-model:visible="guideOpen"
  target="#guide-capacity"
  :step="1"
  :total="3"
  title="本周容量在这里"
  text="超过上周 12% 会亮进度条，长按卡片可以复制整周计划。"
  @next="step = 2"
/>
```

挖洞是「圆角框 + `box-shadow: 0 0 0 9999px` 遮罩」，不用 canvas，也不用 JS 写死像素。

## 6. 边界与反例

- **不要**在页面里再写 `uni.showModal`：`HomeReservationCard.vue:59`、`profile/index.vue:104` 待迁移到 `AppDialog`。
- **不要**在页面里直接 `uni.showToast`：全仓库已清零（2026-10-25 迁完 20 处），统一走 `useToast()`；`src/utils/ui.ts` 只剩兼容层（内部转 `useToast().show`），新代码不要再引。
- **不要**用 `u-popup` 自己写遮罩：uview-plus 的浮层在本项目里 0 使用，视觉无法与设计稿对齐；确有需要时按本文档「组合封装」的写法，把 u-* 包在 `AppSheet` 里面。
- 页面滚动锁只由浮层组件负责；页面里手动 `overflow: hidden` 会和浮层计数冲突。
