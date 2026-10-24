# 公共 Layout（AppLayout）

> 依据：`F:\Doc\UI\uxpilot-export-10-08-26.pdf`（深色稿 5 页）+ `AIO运动助手 UI设计规范 V1.1` §4.1 / §4.2 / §4.14 / §4.15。
> 设计令牌全部在 `src/styles/theme.scss`，本目录只负责「骨架 + 位置」，不写色值。

## 1. 骨架结构

```
┌───────────────────────────────────────┐
│ AppNavBar                             │  ← 状态栏安全区 + 56 高
│   left: 大标题(+副信息) / 自定义插槽   │    滚动 >12px → 标题 24→17、副信息隐藏
│   right: 40 圆形图标按钮               │
├───────────────────────────────────────┤
│ scroll-view  (flex:1, height:0)       │  ← 唯一的滚动容器
│   .app__content  padding 16           │
│   └─ slot（页面卡片流）                │
│      padding-bottom: 108px            │  ← 让出悬浮 Dock（如需改，用 --content-inset-bottom）
├───────────────────────────────────────┤
│ #float 插槽（浮在 Dock 之上，z 99）     │
│ AppTabBar 悬浮层（z 100）              │
│   ┌──────── Dock 282×60 ────────┐ ┌─┐ │
│   │ 首页 探索 数据 社区 我的     │ │⚡│ │  ← 60 训练按钮（独立，间距 8）
│   └──────────────────────────────┘ └─┘ │
│   #overlay 插槽（Sheet / 弹层，z 200）  │
└───────────────────────────────────────┘
```

- 画板 390×844；H5 桌面端由 `.app { max-width: 430px }` 收成手机框，≥480px 时补一圈描边。
- 单位统一用 **px**（与设计稿 1:1），未用 rpx —— 桌面端预览时 rpx 会被屏幕宽度拉宽。
- 底部导航**不用原生 tabBar**：原生 tabBar 只能是通栏实色条，做不了「玻璃胶囊 + 独立训练按钮」。
  5 个一级页是普通页面，切换走 `uni.reLaunch`（见 `src/layouts/tabs.ts`）。

## 2. 页面怎么写

```vue
<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import AppCard from '@/components/base/AppCard.vue';
</script>

<template>
  <AppLayout title="数据" subtitle="训练、身体、饮食的长期趋势" active-tab="data">
    <!-- 需要自定义头部时（例如首页的头像问候）才写 #nav-left -->
    <template #nav-right>
      <AppIconButton icon="bell-outline" dot />
    </template>

    <AppCard>页面内容</AppCard>

    <!-- 需要压住 Dock 的弹层放这里 -->
    <template #overlay>…</template>
  </AppLayout>
</template>
```

| 能力 | 用法 |
| --- | --- |
| 导航形态 | `nav="large"`（默认）/ `nav="back"`（二级页，自动返回，栈底回首页）/ `nav="none"` |
| 自定义头部 | `#nav-left`（不写则用 `title`/`subtitle` 兜底）、`#nav-right` |
| 训练按钮状态 | `:fab-open`（图标转 ×）、`:workout-active` + `:workout-time`（按钮 64 + 上方浮出 WorkoutPill） |
| 悬浮内容 | `#float` |
| 弹层 | `#overlay` |
| 事件 | `@fab`、`@tab-change`、`@resume-workout` |
| 隐藏 Dock | `:show-tab-bar="false"`（训练中、二级页） |

## 3. 组件清单

| 文件 | 作用 |
| --- | --- |
| `AppLayout.vue` | 全站骨架：NavBar + 滚动区 + 悬浮层 + Dock |
| `tabs.ts` | 5 个 Tab 的唯一数据源（key/label/icon/path）+ `navigateToTab` |
| `components/layout/AppNavBar.vue` | 顶部导航（large / back，滚动收起） |
| `components/layout/AppTabBar.vue` | 悬浮胶囊 Dock + 独立训练按钮 |
| `components/layout/WorkoutPill.vue` | 训练进行中的悬浮计时气泡 |
| `components/base/AppIcon.vue` | 图标出口（unocss presetIcons，`i-mdi-*`，颜色跟随父级 color） |
| `components/base/AppIconButton.vue` | 40 圆形图标按钮 |
| `components/base/AppIconTile.vue` | 48/40/30 圆角图标底（按模块色 12% 上色） |
| `components/base/AppCard.vue` | 卡片骨架（20 圆角 / 1px 描边 / 无阴影 / 可点 / 危险态） |

## 4. 加图标必须同步 safelist

`AppIcon` 的类名是 `i-mdi-${name}` 动态拼出来的，unocss 静态扫描看不到。
新增图标时 **必须** 在 `uno.config.ts` 的 `safelist` 里补一行 `'i-mdi-xxx'`，否则页面上会是一个实心色块。

## 5. 已知待办

- `src/layouts/layput.vue` 是历史拼写错误的空文件，已改为占位注释，待可执行命令时删除。
- 训练启动 Sheet 目前写在 `pages/index/index.vue` 里占位，后续抽成 `components/business/StartSheet.vue`。
- 一级页切换用 `reLaunch`，页面不保留滚动位置；如需保留，后续换成 `switchTab` 方案或自定义保活栈。
