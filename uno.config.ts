import type { Preset } from 'unocss';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import { presetUni } from '@uni-helper/unocss-preset-uni';
import { presetLegacyCompat } from '@unocss/preset-legacy-compat';
import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
  presets: [
    // https://uni-helper.js.org/unocss-preset-uni
    presetUni({
      attributify: {
        prefixedOnly: true,
      },
    }),
    // https://unocss.dev/presets/icons
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
      // 自定义图标
      collections: {
        // 从本地文件系统加载 svg 图标
        'my-icons': FileSystemIconLoader('./src/static/icons'),
        // 从在线图标库加载图标
        // 'my-online-icons': async (iconName) => {
        //   return await fetch(`https://example.com/icons/${iconName}.svg`).then(res => res.text());
        // },
      },
    }),
    /**
     * 启用 legacy-compat 模式(处理低端安卓机的样式问题)
     * @see https://unocss.dev/presets/legacy-compat
     */
    presetLegacyCompat({
      commaStyleColorFunction: true,
      legacyColorSpace: true,
    }) as Preset,
  ],
  /**
   * AppIcon 组件是「i-mdi-${name}」动态拼类名，扫描器看不见，
   * 所以所有用到的 mdi 图标必须在这里登记（新增图标时同步加一行）。
   * 对应规范 §3.5：底部 5 Tab + 训练按钮 + 常用操作图标。
   */
  safelist: [
    // 账号与安全（登录 / 注册 / 忘记密码）
    'i-mdi-menu-down',
    'i-mdi-email-outline',
    'i-mdi-lock-outline',
    'i-mdi-eye-outline',
    'i-mdi-eye-off-outline',
    'i-mdi-phone-outline',
    'i-mdi-check-circle',
    'i-mdi-circle-outline',
    'i-mdi-checkbox-marked',
    'i-mdi-checkbox-blank-outline',
    // TabBar（未选中 outline / 选中实心）
    'i-mdi-home-outline',
    'i-mdi-home',
    'i-mdi-compass-outline',
    'i-mdi-compass',
    'i-mdi-chart-box-outline',
    'i-mdi-chart-box',
    'i-mdi-account-group-outline',
    'i-mdi-account-group',
    'i-mdi-account-outline',
    'i-mdi-account',
    // 训练按钮 / 悬浮气泡
    'i-mdi-dumbbell',
    'i-mdi-close',
    'i-mdi-arrow-u-left-top',
    // 导航与通用操作
    'i-mdi-arrow-left',
    'i-mdi-apple',
    'i-mdi-chevron-left',
    'i-mdi-chevron-right',
    'i-mdi-bell-outline',
    'i-mdi-message-outline',
    'i-mdi-plus',
    'i-mdi-magnify',
    'i-mdi-pencil',
    'i-mdi-play',
    'i-mdi-close',
    // 模块（力量 / 有氧 / 饮食 / 身体 / 睡眠）
    'i-mdi-lightning-bolt',
    'i-mdi-fire',
    'i-mdi-run',
    'i-mdi-food-apple-outline',
    'i-mdi-scale-bathroom',
    'i-mdi-bed-outline',
    'i-mdi-timer-outline',
    'i-mdi-water-outline',
    'i-mdi-map-marker-path',
    // 我的 / 设置
    'i-mdi-target',
    'i-mdi-bluetooth',
    'i-mdi-book-open-page-variant-outline',
    'i-mdi-view-dashboard-outline',
    'i-mdi-shield-lock-outline',
    // 探索页（搜索即入口）：品类选择器 / 拍照识别 / AI
    'i-mdi-camera-outline',
    'i-mdi-chevron-down',
    'i-mdi-close-circle',
    'i-mdi-check',
    'i-mdi-calendar-blank-outline',
    'i-mdi-creation',
    'i-mdi-heart-outline',
    // 首页 v2（卡片流 + 训练结果 §5.1）：置顶指标 / 训练结果 / 饮食快捷行 / 预约 / AI 教练
    'i-mdi-walk',
    'i-mdi-bike',
    'i-mdi-coffee-outline',
    'i-mdi-bowl-mix',
    'i-mdi-food-variant',
    'i-mdi-cookie',
    'i-mdi-water',
    'i-mdi-robot-outline',
    'i-mdi-chart-line',
    'i-mdi-cog-outline',
    'i-mdi-yoga',
  ],
  /**
   * 自定义快捷语句
   * @see https://github.com/unocss/unocss#shortcuts
   */
  shortcuts: {
    'border-base': 'border border-gray-500_10',
    'center': 'flex justify-center items-center',
  },
  rules: [
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
  theme: {
    colors: {
      // 主题颜色
      'primary': 'var(--theme-primary)',
      'success': 'var(--theme-success)',
      'warning': 'var(--theme-warning)',
      'error': 'var(--theme-error)',
      // 文字颜色
      'text-main': 'var(--theme-main-color)',
      'text-content': 'var(--theme-content-color)',
      'text-tips': 'var(--theme-tips-color)',
      'text-light': 'var(--theme-light-color)',
      'text-disabled': 'var(--theme-disabled-color)',
      // 背景颜色
      'bg-main': 'var(--theme-bg-color)',
      'bg-secondary': 'var(--theme-bg-color-secondary)',
      // 边框颜色
      'border-main': 'var(--theme-border-color)',
    },
  },
  transformers: [
    // 启用指令功能：主要用于支持 @apply、@screen 和 theme() 等 CSS 指令
    transformerDirectives(),
    // 启用 () 分组功能
    transformerVariantGroup(),
  ],
});
