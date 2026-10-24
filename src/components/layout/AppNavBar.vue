<script setup lang="ts">
/**
 * AppNavBar · 顶部导航（规范 §4.2）
 *
 * 三种形态：
 *  - large：大标题型（首页/探索/数据/我的）——左 24/600 白标题 + 下一行 11 灰副信息，右侧 40 圆形图标按钮
 *  - back ：返回型（二级页）——左 ← 40 热区、居中 17/600 标题、右文字/图标按钮
 *  - none ：不渲染（页面自绘头部）
 *
 * 滚动后（compact）：标题缩为 17/600、副信息隐藏、出现 1px 分隔线；标题区不加遮罩。
 */
import { computed } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    variant?: 'large' | 'back';
    /** 由父级滚动监听传入：内容已滚过阈值，标题收起 */
    compact?: boolean;
  }>(),
  {
    title: '',
    subtitle: '',
    variant: 'large',
    compact: false,
  },
);

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const rootClass = computed(() => [
  'nav',
  `nav--${props.variant}`,
  { 'is-compact': props.compact },
]);

function handleBack() {
  emit('back');
}
</script>

<template>
  <view class="nav" :class="rootClass">
    <!-- 状态栏安全区：H5 为 0，App/小程序自动取系统高度 -->
    <view class="nav__status" />

    <view class="nav__bar">
      <template v-if="variant === 'back'">
        <view class="nav__back" hover-class="u-hover" :hover-stay-time="80" @tap="handleBack">
          <AppIcon name="arrow-left" :size="24" />
        </view>
        <text class="nav__center-title">{{ title }}</text>
      </template>

      <view v-else class="nav__titles">
        <slot name="left">
          <text class="nav__title">{{ title }}</text>
          <text v-if="subtitle && !compact" class="nav__subtitle">{{ subtitle }}</text>
        </slot>
      </view>

      <view class="nav__actions">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.nav {
  z-index: 50;
  flex: none;
  background-color: var(--bg);
}

.nav__status {
  height: var(--status-bar-height, 0px);
}

.nav__bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
}

.nav__titles {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.nav__title {
  overflow: hidden;
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  color: var(--text-1);
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: font-size 0.18s ease;
}

.nav.is-compact .nav__title {
  font-size: 17px;
  line-height: 24px;
}

.nav__subtitle {
  font-size: 11px;
  line-height: 16px;
  color: var(--text-2);
}

.nav__actions {
  display: flex;
  flex: none;
  gap: 8px;
  align-items: center;
}

/* 返回型 */
.nav__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-left: -8px;
  color: var(--text-1);
  border-radius: var(--radius-full);
}

.nav__center-title {
  position: absolute;
  left: 50%;
  max-width: 200px;
  overflow: hidden;
  font-size: 17px;
  font-weight: 600;
  line-height: 24px;
  color: var(--text-1);
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: translateX(-50%);
}
</style>
