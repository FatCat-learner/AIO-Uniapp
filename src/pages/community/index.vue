<template>
  <AppLayout :title="COMMUNITY_PAGE.title" :subtitle="COMMUNITY_PAGE.subtitle" :active-tab="COMMUNITY_PAGE.tab">
    <view class="empty">
      <view class="empty__icon-wrap">
        <AppIcon :name="COMMUNITY_PAGE.icon" :size="COMMUNITY_PAGE.iconSize" />
      </view>
      <text class="empty__title">{{ COMMUNITY_PAGE.emptyTitle }}</text>
      <text class="empty__desc">{{ COMMUNITY_PAGE.emptyDesc }}</text>
      <view class="empty__btn" hover-class="u-hover" :hover-stay-time="80">
        <text class="empty__btn-text">{{ COMMUNITY_PAGE.emptyAction }}</text>
      </view>
    </view>
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * 社区 Community（P2，示例页）
 * 规范 §5.20：社区与路书，MVP 之后再做，这里给「建设中」空态，
 * 顺便验证空态在 Layout 里的垂直居中表现。
 * 纯静态空态页：无共享状态、无接口，故不建 store / api（文案表在 config/）。
 */
import AppIcon from '@/components/base/AppIcon.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { COMMUNITY_PAGE } from './config';
</script>

<style lang="scss" scoped>
@import './styles/community.scss';
</style>
