<template>
  <view class="tabbar" :class="rootClass">
    <WorkoutPill :visible="workoutActive" :time="workoutTime" @resume="handleResume" />

    <view class="tabbar__row">
      <view class="tabbar__dock">
        <view
          v-for="tab in TABS"
          :key="tab.key"
          class="tabbar__item"
          :class="{ 'is-active': tab.key === active }"
          hover-class="u-hover"
          :hover-stay-time="80"
          @tap="handleTab(tab.key)"
        >
          <view class="tabbar__icon">
            <AppIcon :name="tab.key === active ? tab.iconActive : tab.icon" :size="22" />
          </view>
          <text class="tabbar__label">
            {{ tab.label }}
          </text>
        </view>
      </view>

      <view
        class="tabbar__fab"
        :class="{ 'is-open': fabOpen }"
        hover-class="tabbar__fab--pressed"
        :hover-stay-time="80"
        @tap="handleFab"
      >
        <AppIcon :name="fabOpen ? 'close' : 'dumbbell'" :size="26" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { TabKey } from '@/layouts/tabs';
/**
 * AppTabBar · 底部悬浮胶囊 Dock + 右侧独立训练按钮（规范 §4.14，R6）
 *
 * 结构：左边一条 282×60 的悬浮胶囊装 5 个 Tab，右边一个 60 的圆形训练按钮。
 * 两者都浮在内容之上（position: fixed），Dock 为玻璃态（dock-bg + blur 20），
 * 内容从下方透出——禁止整条通栏、禁止底部渐变压暗遮罩。
 *
 * 位置：左右 16、距底 12 + 安全区；Dock 与按钮间距 8；垂直居中。
 * 选中：图标外套 40×26 pill（brand-50 底），图标与标签 brand-500；不实心绿。
 */
import { computed } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';
import { TABS } from '@/layouts/tabs';
import WorkoutPill from './WorkoutPill.vue';

const props = withDefaults(
  defineProps<{
    active?: TabKey;
    /** 训练按钮是否处于「展开」态（点了训练按钮，Sheet 已弹出，图标转 45°） */
    fabOpen?: boolean;
    /** 训练进行中：按钮放大到 64 + 2px brand-100 外圈，上方浮出 WorkoutPill */
    workoutActive?: boolean;
    workoutTime?: string;
  }>(),
  {
    active: 'home',
    fabOpen: false,
    workoutActive: false,
    workoutTime: '00:00',
  },
);

const emit = defineEmits<{
  (e: 'change', key: TabKey): void;
  (e: 'fab'): void;
  (e: 'resume'): void;
}>();

const rootClass = computed(() => [
  'tabbar',
  {
    'is-workout': props.workoutActive,
    'is-expanded': props.fabOpen,
  },
]);

const handleTab = (key: TabKey): void => {
  if (key === props.active) return;
  emit('change', key);
};

const handleFab = (): void => {
  emit('fab');
};

const handleResume = (): void => {
  emit('resume');
};
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;
  box-sizing: border-box;
  width: 100%;
  max-width: 430px;
  padding: 0 16px calc(12px + env(safe-area-inset-bottom));
  pointer-events: none;
  transform: translateX(-50%);
}

.tabbar__row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

/* ============ Dock ============ */
.tabbar__dock {
  box-sizing: border-box;
  display: flex;
  flex: 1;
  align-items: center;
  max-width: 282px;
  height: 60px;
  padding-right: 2px;
  pointer-events: auto;
  background-color: var(--dock-bg);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  backdrop-filter: blur(20px);
}

/* Android 低版本 WebView 不支持 backdrop-filter：退化为近实色 */
@supports not (backdrop-filter: blur(20px)) {
  .tabbar__dock {
    background-color: rgb(11 13 18 / 96%);
  }
}

.tabbar__item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-2);
}

.tabbar__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 26px;
  border-radius: var(--radius-full);
  transition: background-color 0.18s ease;
}

.tabbar__label {
  margin-top: 1px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
}

.tabbar__item.is-active {
  color: var(--brand-500);
}

// .tabbar__item.is-active .tabbar__icon {
//   background-color: var(--brand-50);
// }

.tabbar__item.is-active .tabbar__label {
  font-weight: 600;
}

/* ============ 训练按钮 ============ */
.tabbar__fab {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  color: var(--on-brand);
  pointer-events: auto;
  background-color: var(--brand-500);
  border-radius: var(--radius-full);
  box-shadow: var(--glow);
  transition:
    background-color 0.18s ease,
    transform 0.18s ease,
    width 0.18s ease,
    height 0.18s ease;
}

.tabbar__fab--pressed {
  background-color: var(--brand-600);
}

.tabbar__fab.is-open {
  transform: rotate(45deg);
}

/* 训练中：按钮放大到 64 + 2px brand-100 外圈 */
.tabbar.is-workout .tabbar__fab {
  width: 64px;
  height: 64px;
  box-shadow:
    var(--glow),
    0 0 0 2px var(--brand-100);
}

/* ============ WorkoutPill 定位 ============ */
.pill {
  position: absolute;
  right: 16px;
  bottom: calc(12px + env(safe-area-inset-bottom) + 72px);
  z-index: 1;
  pointer-events: auto;
}
</style>
