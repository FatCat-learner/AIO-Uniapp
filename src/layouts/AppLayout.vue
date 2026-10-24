<script setup lang="ts">
/**
 * AppLayout · 全站公共骨架（规范 §4.1 Shell）
 *
 * ┌─ 状态栏安全区（var(--status-bar-height)）
 * ├─ AppNavBar（56 高，滚动后 title 收成 17/600）
 * ├─ scroll-view 内容区（页边 16，底部预留 108 给悬浮 Dock）
 * ├─ float 插槽（悬浮层：WorkoutPill / 训练胶囊等）
 * ├─ AppTabBar（悬浮 Dock 282×60 + 独立训练按钮 60）
 * └─ overlay 插槽（Sheet / 弹层，压在最上层）
 *
 * 设计口径：390 画板、单位用 px（与设计稿 1:1，H5 桌面端被 max-width 430 收成手机框）。
 * 页边距 / 卡片 / 圆角一律走 theme.scss 的 token，禁止在此写死色值。
 */
import { computed, ref } from 'vue';
import AppNavBar from '@/components/layout/AppNavBar.vue';
import AppTabBar from '@/components/layout/AppTabBar.vue';
import type { TabKey } from './tabs';
import { navigateToTab } from './tabs';

const props = withDefaults(
  defineProps<{
    /** 导航标题（large 24/600，back 居中 17/600） */
    title?: string;
    /** 标题下一行 11 灰副信息（滚动后自动隐藏） */
    subtitle?: string;
    /** 导航形态：large 大标题 / back 返回型 / none 页面自绘 */
    nav?: 'large' | 'back' | 'none';
    /** 滚动时标题收起 */
    compactOnScroll?: boolean;
    /** 是否显示底部悬浮 Dock（训练中、二级页通常置 false） */
    showTabBar?: boolean;
    /** 当前高亮的 Tab */
    activeTab?: TabKey;
    /** 内容区额外的 class（用于页面级留白/背景调整） */
    contentClass?: string;
    /** 训练按钮是否处于展开态（图标转 × ） */
    fabOpen?: boolean;
    /** 训练进行中：按钮放大 + 上方浮出 WorkoutPill */
    workoutActive?: boolean;
    workoutTime?: string;
  }>(),
  {
    title: '',
    subtitle: '',
    nav: 'large',
    compactOnScroll: true,
    showTabBar: true,
    activeTab: 'home',
    contentClass: '',
    fabOpen: false,
    workoutActive: false,
    workoutTime: '00:00',
  },
);

const emit = defineEmits<{
  (e: 'tab-change', key: TabKey): void;
  (e: 'fab'): void;
  (e: 'resume-workout'): void;
}>();

/** 滚动阈值：超过 12px 认为「已滚动」，标题收起 + 出现分隔线 */
const SCROLL_THRESHOLD = 12;
const compact = ref(false);

function handleScroll(event: any) {
  if (!props.compactOnScroll) return;
  const scrollTop = event?.detail?.scrollTop ?? 0;
  const next = scrollTop > SCROLL_THRESHOLD;
  if (next !== compact.value) compact.value = next;
}

function handleBack() {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 });
    return;
  }
  uni.reLaunch({ url: '/pages/index/index' });
}

function handleTab(key: TabKey) {
  emit('tab-change', key);
  navigateToTab(key);
}

const contentStyle = computed(() => ({
  paddingBottom: props.showTabBar ? 'var(--content-inset-bottom)' : '24px',
}));

const bodyClass = computed(() => ({ 'is-compact': compact.value }));
</script>

<template>
  <view class="app">
    <AppNavBar
      v-if="nav !== 'none'"
      :title="title"
      :subtitle="subtitle"
      :variant="nav === 'back' ? 'back' : 'large'"
      :compact="compact"
      @back="handleBack"
    >
      <!-- 只有页面真的提供了自定义头部才接管插槽，否则让 AppNavBar 用 title 兜底 -->
      <template v-if="$slots['nav-left']" #left>
        <slot name="nav-left" />
      </template>
      <template v-if="$slots['nav-right']" #right>
        <slot name="nav-right" />
      </template>
    </AppNavBar>

    <!-- nav="none" 时也要让出状态栏高度 -->
    <view v-else class="app__status" />

    <scroll-view
      class="app__body"
      :class="bodyClass"
      scroll-y
      :show-scrollbar="false"
      :enhanced="false"
      @scroll="handleScroll"
    >
      <view class="app__content" :class="contentClass" :style="contentStyle">
        <slot />
      </view>
    </scroll-view>

    <!-- 悬浮层：Dock 上方的气泡 / 进行中提示 -->
    <view class="app__float">
      <slot name="float" />
    </view>

    <AppTabBar
      v-if="showTabBar"
      :active="activeTab"
      :fab-open="fabOpen"
      :workout-active="workoutActive"
      :workout-time="workoutTime"
      @change="handleTab"
      @fab="emit('fab')"
      @resume="emit('resume-workout')"
    />

    <!-- 弹层：Sheet / ActionSheet 压在最上层 -->
    <slot name="overlay" />
  </view>
</template>

<style lang="scss" scoped>
.app {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 430px;
  height: 100vh;
  margin: 0 auto;
  overflow: hidden;
  background-color: var(--bg);
}

/* 桌面端浏览器里收成「手机框」，避免 390 稿被拉宽 */
@media (min-width: 480px) {
  .app {
    box-shadow: 0 0 0 1px var(--line);
  }
}

.app__status {
  flex: none;
  height: var(--status-bar-height, 0px);
}

.app__body {
  flex: 1;
  height: 0;
}

.app__content {
  /* 底部留 108：Dock 60 + 距底 12 + 安全间距，否则最后一屏内容永远压在悬浮 Dock 底下 */
  padding: 8px 16px calc(108px + env(safe-area-inset-bottom));
}

/* 悬浮层：浮在 Dock 之上（Dock 60 + 距底 12 + 间距 12） */
.app__float {
  position: fixed;
  bottom: calc(84px + env(safe-area-inset-bottom));
  left: 50%;
  z-index: 99;
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 430px;
  pointer-events: none;
  transform: translateX(-50%);
}
</style>
