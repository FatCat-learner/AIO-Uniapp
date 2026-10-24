# AIOSPORT Logo 资源

来源：`_design/previews/onboarding-login/index.html` 的顶部双峰 chevron（原 `viewBox 0 0 48 48`，`#C9F03A`）。
所有位图均由 `aio-uni-app-x/scripts/gen-logo-assets.py` 从同源 SVG 栅格化生成（无头 Chrome + Pillow），改色或改尺寸请重新跑脚本，不要手改位图。

```
python scripts/gen-logo-assets.py
```

**渲染方式**：每一档像素尺寸都由矢量在目标像素上*原生渲染*，不从 1024 缩下来——LANCZOS 降采样会在真实边缘外拖出一圈半透明灰晕（毛边）。32/64/128 另做一次 alpha 预乘锐化（radius 0.6），把边缘收紧一格；`badge` 因整片渐变底不做锐化，避免把色阶抖动放大成噪点。`favicon.ico` 的 16/32/48/64 四帧也各自原生渲染后手写 ICO 打包，不经二次重采样。

## 选用哪个

| 场景 | 文件 |
| --- | --- |
| 页面内 logo / 内联图标（深色 UI） | `logo-mark.svg` |
| 需要跟随文字颜色（`currentColor`） | `logo-mark-mono.svg` |
| 浅色背景 / 打印 / 深色文档 | `logo-mark-ink.svg` |
| ≤48px（favicon、列表角标） | `logo-mark-compact.svg`（内峰提亮，缩小不糊） |
| App 图标 / 启动图 / 分享卡 | `logo-badge.svg` → `png/logo-badge-*.png` |
| 不支持 SVG 或需要位图 | `png/` `jpg/` `webp/` 同名不同后缀 |

## 规范

- 品牌绿 `#C9F03A`，内峰 `stroke-opacity .35`（小尺寸版 `.68`）。
- 安全区：图形四周留 ≥ 图形宽度 6% 的空白，不要裁切到描边圆角。
- 最小尺寸：完整版 ≥ 64px；32px 以下改用 `logo-mark-compact` 或 `logo-badge`。
- 不要拉伸、加描边、改渐变；`logo-badge` 圆角半径 232/1024 ≈ 22.6%，四周留白 ≥ 22.6%。
- JPG 为压暗底（`#0B0F0C`）不透明版，仅用于不支持透明通道的场景。

## 目录

```
logo/
├─ logo-mark.svg              品牌绿 · 透明底
├─ logo-mark-mono.svg        单色 currentColor
├─ logo-mark-ink.svg         深墨 #0F1A0B · 浅色底用
├─ logo-mark-compact.svg     小尺寸版
├─ logo-badge.svg            应用图标（圆角深底 + 荧光晕）
├─ favicon.ico               16/32/48/64 多尺寸
├─ favicon-32.png
├─ apple-touch-icon-180.png
├─ png/                      透明底位图（mark 32→1024，badge 32→1024）
├─ jpg/                      压暗底不透明位图
└─ webp/                     带透明通道的 webp
```
