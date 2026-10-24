<template>
  <view class="auth">
    <AuthGlow />

    <view class="auth__hero">
      <view class="auth__bar">
        <view v-if="back" class="auth__back" hover-class="auth__back--hover" :hover-stay-time="80" @tap="emit('back')">
          <AppIcon name="chevron-left" :size="18" />
          <text class="auth__back-text">返回</text>
        </view>
        <text v-if="step" class="auth__step">{{ step }}</text>
        <text v-else class="auth__wordmark">AIOSPORT</text>
      </view>
      <view class="auth__detail">
        <view class="auth__titles">
          <text
            v-for="(line, index) in title"
            :key="index"
            class="auth__title"
            :class="{ 'is-brand': line.brand }"
          >
            {{ line.text }}
          </text>
        </view>

        <text v-if="desc" class="auth__desc">{{ desc }}</text>
      </view>
    </view>

    <view class="auth__sheet">
      <view class="auth__hairline" />
      <scroll-view scroll-y class="auth__scroll">
        <view class="auth__body">
          <slot />
        </view>
      </scroll-view>
      <view v-if="$slots.foot" class="auth__foot">
        <slot name="foot" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 账号与安全 · 页面骨架
 * 结构：顶部光晕 → 返回行 → 大标题（第二行可品牌色）→ 说明 → 抬起的圆角面板（可滚动）→ 贴底文字链接
 * 五个页面（登录 / 验证码登录 / 注册两步 / 忘记密码两步）全部复用它，只换内容。
 */
import AppIcon from '@/components/base/AppIcon.vue';
import AuthGlow from './AuthGlow.vue';

defineProps<{
  title: { text: string; brand?: boolean }[];
  desc?: string;
  step?: string;
  back?: boolean;
}>();

const emit = defineEmits<{ back: [] }>();
</script>

<style lang="scss" scoped>
.auth {
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: var(--bg);
}

.auth__hero {
  position: relative;
  box-sizing: border-box;
  min-height: 286px;
  padding: 10px var(--sp-6) 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}

.auth__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
}

.auth__back {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--text-1);
}

.auth__back--hover {
  opacity: 0.6;
}

.auth__back-text {
  font-size: 13.5px;
  color: var(--text-1);
}

.auth__step {
  font-size: var(--fs-xs);
  color: var(--text-3);
}

.auth__wordmark {
  font-size: var(--fs-2xs);
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-3);
}

.auth__titles {
  margin-top: 22px;
}

.auth__title {
  display: block;
  font-size: 34px;
  font-weight: 700;
  line-height: var(--lh-tight);
  color: var(--text-1);

  &.is-brand {
    color: var(--brand-500);
  }
}

.auth__desc {
  display: block;
  margin-top: 12px;
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  color: var(--text-2);
}

.auth__sheet {
  position: relative;
  box-sizing: border-box;
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 18px 22px 12px;
  overflow: hidden;
  // background: var(--surface);
  background: linear-gradient(180deg,#1a1f2a 0,#14171f 140px);
  border-radius: var(--radius-xxl) var(--radius-xxl) 0 0;
  box-shadow: 0 -24px 48px rgba(0, 0, 0, .55), inset 0 1px 0 rgba(255, 255, 255, .06);
  &:before {
     content: "";
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: 150px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201, 240, 58, .55), transparent);
  }
}

.auth__hairline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(var(--brand-500-rgb), 0.45), transparent);
}

.auth__scroll {
  flex: 1;
  min-height: 0;
}

.auth__body {
  padding-bottom: 8px;
}

.auth__foot {
  flex: none;
  padding-top: 6px;
}
</style>
