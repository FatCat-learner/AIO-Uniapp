# src/styles · 样式规范与设计令牌（Design Tokens）

> 设计源头：`F:\Doc\UI\uxpilot-export-10-08-26.pdf`（深色稿 5 页：Home / Discover / Health Data / Community / Profile）
> 文字依据：`AIO运动助手/AIO运动助手 UI设计规范 V1.1（Pixso AI）.md` §2 间距 / §3 颜色 / §4.3 卡片 / §4.5 图标底 / §4.9 胶囊
> 一句话规则：**色值 / 圆角 / 间距 / 字号只有一处能改 —— `theme.scss`；页面和组件里只写 `var(--x)`。**

---

## 1. 三个文件各自干什么

| 文件 | 语言 | 内容 | 谁引入 |
| --- | --- | --- | --- |
| `theme.scss` | SCSS（只装 CSS 变量） | 全站唯一的令牌定义：品牌色、模块色、文字、表面、圆角、字号、间距、行高、布局常量、tint、旧变量兼容 | **只在 `App.vue` 引入一次** |
| `common.scss` | SCSS | 全局基础样式（`page` / `.page` / `.u-hover` / `.u-ellipsis`）+ 跨页面复用的 `a-*` 规范类 | 只在 `App.vue` 引入一次 |
| `uni.scss` | SCSS | uni-app 官方的 `$uni-*` **编译期变量** + `@import 'uview-plus/theme.scss'`，会被自动注入每个 scss 文件 | 构建期自动注入，不要手动 import |

### 1.1 引入链路

```scss
// src/App.vue
<style lang="scss">
@import '@/styles/theme.scss';    // ① 令牌：全站唯一的 :root 定义
@import 'uview-plus/index.scss';  // ② 组件库样式（部分组件读 --theme-*，默认色来自 $uni-*）
@import '@/styles/common.scss';   // ③ 全局类：.page / .u-hover / .a-*
</style>
```

CSS 变量是运行时级联，顺序不影响结果；保持「令牌 → 组件库 → 全局类」只为读代码时能顺着从上往下找。

### 1.2 两条容易踩的坑（已写在 `.scss` 注释里，别改回去）

- **`theme.scss` 不能放进 `uni.scss`。** `uni.scss` 会被注入到每个 `.scss`／`<style lang="scss">`，把 `:root { …200 行 }` 复制十几份进产物。见 `src/uni.scss:17-19`。
- **`theme.scss` 里只有 CSS 变量，没有 SCSS 变量。** 想换肤／调品牌色，必须走 CSS 变量（运行时可变）；`$uni-*` 是编译期常量，改它要重新构建，且只对 uview-plus 内部生效。

### 1.3 `$uni-*` 和 `var(--*)` 的分工

| 场景 | 用哪个 | 说明 |
| --- | --- | --- |
| 传给 uview-plus 的配色（`u-button`、`u-switch` 等默认色） | `$uni-*`（`uni.scss`） | uview-plus 的 `theme.scss` 在编译期读这些变量 |
| 自己写的所有样式 | `var(--*)` | 支持 `.theme-light` 运行时换肤 |
| 组件库里能变量覆盖的部分 | `var(--theme-*)` | 见 `theme.scss:145-160` 的旧命名映射 |

⚠️ 两套值**必须手工同步**：改 `--brand-500` 时，`$uni-color-primary` 也要改成同一个色值，否则 uview-plus 组件（`u-button type="primary"` 等）还是旧绿。

---

## 2. 令牌速查

### 2.1 品牌（荧光绿）

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--brand-500` | `#c9f03a` | 主色：主按钮、选中态、关键数值、训练 |
| `--brand-600` | `#b4dc22` | 按下态 |
| `--brand-700` | `#9cc414` | 深端 / 渐变 |
| `--brand-500-rgb` | `201, 240, 58` | **唯一正确的取通道号方式**：`rgba(var(--brand-500-rgb), 0.2)` |
| `--brand-50` | `rgba(201,240,58,.12)` | 极浅品牌底：图标底、选中胶囊 |
| `--brand-100` | `rgba(201,240,58,.20)` | 浅品牌底：进度环轨道、标签 |
| `--on-brand` | `#0b0d12` | 落在品牌色上的字 / 图标 |
| `--ai-from` / `--ai-to` / `--gradient-ai` | `#c9f03a` → `#06b6d4` | AI 相关渐变 |

### 2.2 模块色（分类语义）

| 变量 | 值 | 语义 |
| --- | --- | --- |
| `--mod-train` | `#c9f03a` | 力量训练 |
| `--mod-cardio` | `#3b82f6` | 有氧（跑步 / 骑行 / 步行 / 徒步） |
| `--mod-diet` | `#f97316` | 饮食 |
| `--mod-body` | `#a855f7` | 身体数据 |
| `--mod-social` | `#06b6d4` | 社区 / 路书 |

每个模块色的 **12% 底** 都有对应 tint：`--tint-train` / `--tint-cardio` / `--tint-diet` / `--tint-body` / `--tint-social` / `--tint-neutral`（中性灰兜底）。

### 2.3 语义 / 营养

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--ok` | `#22c55e` | 达成 / 已保存 |
| `--warn` | `#f59e0b` | 超标 / 注意 |
| `--danger` | `#ef4444` | 删除 / 错误 / 退出登录 |
| `--info` | `#3b82f6` | 提示 / 中性信息 |
| `--danger-soft` | `rgba(239,68,68,.12)` | 危险按钮底（Log Out 条） |
| `--nut-p` / `--nut-c` / `--nut-f` / `--nut-w` | 品牌绿 / 蓝 / 橙 / 青 | 蛋白 / 碳水 / 脂肪 / 饮水（进度环、图例） |

### 2.4 文字

| 变量 | 值（深色） | 用途 |
| --- | --- | --- |
| `--text-1` | `#ffffff` | 标题、数值、主信息 |
| `--text-2` | `#9aa2b0` | 正文、副标题、标签 |
| `--text-3` | `#6b7280` | 单位、时间戳、图例、占位符 |
| `--text-disabled` | `#3f4653` | 禁用态 |
| `--on-dark` | `#0b0d12` | 深底反白（同 `--on-brand`，语义略通用） |

### 2.5 表面 / 分割线

| 变量 | 值（深色） | 用途 |
| --- | --- | --- |
| `--bg` | `#0b0d12` | 页面画布 |
| `--surface` | `#14171f` | 卡片 / Sheet / 底部导航条 |
| `--surface-2` | `#1b1f29` | 卡内嵌套块（组行、内嵌卡） |
| `--fill` | `#232833` | 输入框、序号方块、未选中 chip |
| `--line` | `#232833` | 1px 描边 / 分隔线 |
| `--line-strong` | `#2e3546` | 强调描边（聚焦、选中卡） |
| `--line-dashed` | `#3f4653` | 虚线卡（预约 / 空态 / 「+ 添加」） |
| `--mask` | `rgba(0,0,0,.6)` | 弹层遮罩 |
| `--nav-bg` / `--dock-bg` | `rgba(20,23,31,.86)` | 悬浮 Dock 玻璃底（配合 `backdrop-filter: blur(20px)`） |

### 2.6 圆角

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--radius-xs` | `8px` | 小标签、角标 |
| `--radius-sm` | `12px` | 图标底、输入框 |
| `--radius-md` | `16px` | 组行、内嵌块、缩略图 |
| `--radius-lg` | `20px` | **标准卡片** |
| `--radius-xl` | `24px` | Sheet 顶部、大卡、Hero |
| `--radius-full` | `999px` | 按钮、Tab 胶囊、进度条 |

### 2.7 字号 / 行高

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--fs-display` | `28px` | 计时器、大数值 |
| `--fs-h1` | `24px` | 页面标题 |
| `--fs-h2` | `20px` | 卡片大数值 |
| `--fs-h3` | `17px` | 卡片标题、动作名 |
| `--fs-body` | `15px` | 正文、列表主文案 |
| `--fs-base` | `14px` | 卡片内正文 |
| `--fs-sm` | `13px` | 次要说明 |
| `--fs-xs` | `12px` | 单位、图例 |
| `--fs-2xs` | `11px` | 角标、ALL CAPS 小标题 |
| `--lh-tight` / `--lh-snug` / `--lh-normal` | `1.15` / `1.35` / `1.55` | 大数值 / 卡片标题 / 多行正文 |

字号由 PDF 画板 1080pt ↔ 1440px 按 ×4/3 换算得来。

### 2.8 间距（4 / 8pt 栅格）

`--sp-0: 0` · `--sp-1: 4` · `--sp-2: 8` · `--sp-3: 12` · `--sp-4: 16` · `--sp-5: 20` · `--sp-6: 24` · `--sp-8: 32`（单位 px）

**只用这 9 档。** 7 / 9 / 13 / 18 / 22 这类随手数一律不允许（规范 §2）。

### 2.9 布局常量

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--page-x` | `16px` | 页面左右边距 |
| `--page-top` | `14px` | 导航与首条内容间距 |
| `--card-gap` | `12px` | 卡片之间 |
| `--card-pad` / `--card-pad-sm` | `20px` / `16px` | 标准 / 紧凑卡内边距 |
| `--row-h` | `64px` | 卡内列表行高 |
| `--pill-h` / `--pill-h-lg` | `28px` / `32px` | 普通胶囊 / 卡头 tint 胶囊 |
| `--icon-btn` | `40px` | 圆形图标按钮 |
| `--progress-h` | `6px` | 进度条高度 |
| `--dock-w` / `--dock-h` / `--dock-inset` / `--dock-bottom` / `--dock-gap` | `282 / 60 / 16 / 12 / 8`（px） | 悬浮 Dock 尺寸 |
| `--content-inset-bottom` | `108px` | 页面内容底部预留（60 + 12 + 34 安全区 + 2），别手算 |

### 2.10 阴影 / 发光

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--shadow-card` | `none` | **深色下卡片不用投影**，靠描边 + 底色差分 |
| `--shadow-float` | `0 12px 32px rgba(0,0,0,.55)` | 悬浮气泡 / 弹层 |
| `--shadow-sheet` | `0 -12px 40px rgba(0,0,0,.6)` | BottomSheet |
| `--glow` | `0 0 24px rgba(var(--brand-500-rgb),.35)` | FAB、进行中气泡 |
| `--ring-glow` | `0 0 0 1px rgba(var(--brand-500-rgb),.5)` | 选中描边 |

### 2.11 旧命名（兼容，**勿删**）

`--theme-primary/success/warning/error`、`--theme-main-color/content/tips/light/disabled`、`--theme-bg-color/-secondary`、`--theme-border-color` 全部 `var()` 指向新令牌，给老组件兜底；`uno.config.ts` 的 `theme.colors`（`bg-main` / `text-content` 等原子类）也是映射到这组名字。
`--dark-bg/card/line/text/text-2` 供动作详情等沉浸页使用。**新代码不要再用这两组名字。**

---

## 3. 硬规则

1. **色值只写 `var()`**，禁止 `#hex` / `rgb()` / 颜色名。需要透明品牌底 → `rgba(var(--brand-500-rgb), .n)` 或直接用 `--tint-*` / `--brand-50`。
2. **间距只用 `--sp-*` 九档**；页面横向边距用 `--page-x`，卡间用 `--card-gap`，卡内用 `--card-pad(-sm)`。
3. **圆角只用 `--radius-*`**；卡片固定 `--radius-lg`（20）。
4. **单位只用 `px`，不用 `rpx`。** 画稿 390×844，桌面 H5 预览时 rpx 会被视口宽度拉宽，与设计稿 1:1 就失真了。
5. **深色下不加投影。** 分层靠 `--surface` / `--surface-2` / `--line` 三层，`--shadow-card` 就是 `none`。
6. **卡片必须套 `<AppCard>`**，不要在页面里手写 `background-color` + `border-radius` + `padding`。
7. **图标底必须用 `<AppIconTile>`**（12% 模块色，禁实色填充）；胶囊用 `<AppPill>`；图标只用 `<AppIcon>`（iconify/mdi）。
8. **`AppIcon` 的颜色优先靠父级 `color` 继承**（默认 `currentColor`）；确实要单独改色时传 CSS 变量字符串，例如 `color="var(--text-3)"`，不要传 `#8f98a8`。
9. **一次性的样式留在页面 `<style scoped>` 里**，不要为「未来可能复用」提前抽类；抽通用类的门槛是至少 2 处真实复用。
10. **改 uview-plus 内部样式** 用 `:deep()` 局部覆盖 + 变量兜底；`!important` 和大范围覆写要写注释说明理由。
11. **属性顺序交给 stylelint**（`stylelint-config-recess-order`），写完跑 `pnpm stylelint:fix`，别手排。

---

## 4. 常用配方（直接抄）

### 卡片

```vue
<AppCard>…</AppCard>                    <!-- 默认 lg 20 内边距 -->
<AppCard padding="md">…</AppCard>       <!-- 紧凑 16 -->
<AppCard dashed>…</AppCard>             <!-- 预约 / 空态 1px 虚线 -->
<AppCard danger>…</AppCard>             <!-- 退出登录条，12% 红底 -->
```

```scss
/* 只有确实需要自建容器时才这么写 */
.my-card {
  padding: var(--card-pad);
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}
```

### 卡内嵌套块

```scss
.my-row {
  gap: var(--sp-3);
  padding: var(--sp-3);
  background-color: var(--surface-2);
  border-radius: var(--radius-md);
}
```

### 透明品牌底 / 选中胶囊

```scss
.on {
  color: var(--brand-500);
  background-color: var(--brand-50);
  box-shadow: var(--ring-glow);
}
```

### 进度条

```scss
.bar {
  height: var(--progress-h);
  overflow: hidden;
  background-color: var(--brand-100);
  border-radius: var(--radius-full);
}

.bar__fill {
  height: 100%;
  background-color: var(--nut-p);      /* 或 --brand-500 */
  border-radius: inherit;
}
```

### 数值不抖动

```vue
<text class="a-num">{{ capacity }}</text>
```

```scss
.a-num { font-variant-numeric: tabular-nums; font-feature-settings: 'tnum'; }
```

### 按压反馈

```vue
<view hover-class="u-hover" :hover-stay-time="80">…</view>
```

`.u-hover` 必须定义在全局（`common.scss`）——小程序端 `hover-class` 只从全局样式里找类，写在 `scoped` 里会失效。

---

## 5. 全局规范类（`common.scss` 的 `a-*`）

命名用 `a-` 前缀，避开 uview-plus 的 `u-` 和 UnoCSS 原子类。

| 类 | 说明 |
| --- | --- |
| `.page` | 页面根容器：`flex column` + `max-width: 440px` + `height: 100vh` + 居中 |
| `.u-hover` | 全局按压态（`opacity: .72`），`hover-class` 用 |
| `.u-ellipsis` | 单行省略 |
| `.a-card-hd` | 卡片头：两端对齐，`gap: var(--sp-2)` |
| `.a-card-title` | 卡头标题：15 / 600 / 行高 20 / `--text-1` |
| `.a-card-meta` | 卡头右侧说明：11 / `--text-3` / 不换行 |
| `.a-divider` | 1px 分隔线（`--line`），别到处写 `border-top` |
| `.a-pill` / `.a-pill--lg` | 胶囊 28 / 32 高，底为 tint |
| `.a-pill--brand` / `--train` / `--cardio` / `--diet` / `--body` / `--social` | 胶囊配色（模块色字 + 12% 底） |
| `.a-num` | 等宽数字（`tabular-nums`） |
| `.a-dashed` | 虚线槽：`1px dashed var(--line-dashed)` + `--radius-lg` |
| `.a-link` | 品牌色文字链接（13 / 600） |

> 多数场景已经有组件封装（`AppPill`、`AppCard` 等），类只在**不能**用组件的地方（比如给第三方库的插槽内容）兜底用。

---

## 6. 主题切换

- **默认就是深色**（PDF 稿），无需加类。
- 浅色：给页面根节点加 `class="theme-light"`（`theme.scss:195-222` 只重定义「品牌 / 文字 / 表面」三层，其余靠 `var()` 级联）。荧光绿在浅底对比不足，浅色下 `--brand-500` 下沉到 `#a8cc22`。
- 显式深色：`class="theme-dark"`，用于浅色作用域内切回深色。
- 主题工具类：`.theme-bg` / `.theme-surface` / `.theme-fill` / `.theme-line` / `.theme-brand` / `.theme-text` / `.theme-text-content` / `.theme-text-tips` / `.theme-border` / `.theme-divider` / `.theme-gradient-ai` / `.theme-shadow-float` / `.theme-glow`。

---

## 7. 新增 / 修改令牌的流程

1. 在 `theme.scss` 的 `:root, page` 里加一行，**行尾写中文注释说明用途**（现有令牌都这么写，别只加变量）。
2. 若属于「品牌 / 文字 / 表面」三层，同步在 `.theme-light` 里加覆盖值（否则浅色下会穿帮）。
3. 若它是给 uview-plus 用的配色，同步改 `uni.scss` 的 `$uni-*`。
4. 在上面的速查表里补一行 —— **代码和文档一次改完**。
5. 全局搜一遍确认没有等价硬编码值残留：`grep -rn "#c9f03a" src --include=*.vue`。

改品牌色只需动 `--brand-500` / `--brand-500-rgb`（以及 `$uni-color-primary`），全站按钮、进度环、选中态一起变色 —— 这是当初把所有色值收进令牌的唯一目的。

---

## 8. 已知偏差（比上面的规范松的地方，改到哪儿算哪儿）

| 位置 | 偏差 |
| --- | --- |
| `src/components/base/AppIconTile.vue:51-71` | 五组模块色 12% 底写成 `rgba(201,240,58,.12)` 这类字面量，应直接用 `var(--tint-train)` 等 |
| `src/pages/discover/index.vue` | 18 处硬编码色：`#0b0d12` ×7、`#8f98a8` ×4、`#c9d2e0` ×3、`#6b7280`、`#4b5361`、`#12151c`、`#101420`。其中 `#8f98a8` / `#c9d2e0` / `#4b5361` 不在调色板里（应就近收敛到 `--text-2` / `--text-3`），`#0b0d12` 应写 `var(--on-brand)` |
| 全站字号 | `--fs-*` / `--lh-*` 已定义但页面仍多写 px 字面量（`11px` ×38、`15px` ×16、`13px` ×12）；新代码优先 `var(--fs-2xs)` 这类令牌 |
| `--theme-*` / `--dark-*` | 为兼容老组件保留的别名，新代码不要主动使用 |
| UnoCSS | 实际只用到 `presetIcons`（`AppIcon` 的 `i-mdi-*` + `safelist`）；`uno.config.ts` 里的 `bg-main` / `text-content` 原子类与 `pb-safe` 规则**没有**被采用（0 处使用）。统一以 `<style>` 里写 `var()` 为准，别再引入第二套写法 |

---

## 9. 校验

```bash
cd aio-uni-app-x
pnpm stylelint        # 检查
pnpm stylelint:fix    # 自动修（含属性顺序重排）
```

规则见 `stylelint.config.js`：`stylelint-config-standard-scss` + `recess-order`，已放行 `rpx`、小程序标签（`page`/`view`/`text`…）、`@apply`、`:deep()` 等 uni-app / UnoCSS 特有写法。

> 提交前自检三件事：有没有新写的硬编码色值？间距是不是落了 9 档以内？改 uview-plus 有没有加注释说明理由？
