<template>
  <AppLayout title="我的" subtitle="资料、目标与偏好设置" active-tab="profile">
    <template #nav-right>
      <AppIconButton icon="bell-outline" />
    </template>

    <!-- 资料块 -->
    <view class="profile">
      <view class="profile__avatar">
        <text class="profile__initial">{{ PROFILE_USER.initial }}</text>
        <view class="profile__edit">
          <AppIcon name="pencil" :size="14" />
        </view>
      </view>
      <text class="profile__name">{{ PROFILE_USER.name }}</text>
      <text class="profile__meta">{{ PROFILE_USER.meta }}</text>
    </view>

    <!-- 身体三指标：三列全宽小卡 -->
    <view class="metrics">
      <AppCard v-for="item in PROFILE_METRICS" :key="item.label" class="metrics__card">
        <text class="metrics__label">{{ item.label }}</text>
        <view class="metrics__value-row">
          <text class="metrics__value" :class="{ 'is-brand': item.unit === '' }">{{ item.value }}</text>
          <text v-if="item.unit" class="metrics__unit">{{ item.unit }}</text>
        </view>
      </AppCard>
    </view>

    <!-- 设置组 -->
    <text class="group-title">设置</text>
    <AppCard padding="none" class="mb-20">
      <view
        v-for="(item, index) in PROFILE_SETTINGS"
        :key="item.label"
        class="row"
        :class="{ 'row--divided': index !== 0 }"
        hover-class="u-hover"
        :hover-stay-time="80"
        @tap="goSettings(item.label)"
      >
        <AppIconTile :icon="item.icon" :tone="item.tone" :size="40" />
        <text class="row__title">{{ item.label }}</text>
        <text v-if="item.extra" class="row__extra">{{ item.extra }}</text>
        <AppIcon name="chevron-right" :size="20" class="row__arrow" />
      </view>
    </AppCard>

    <!-- 偏好组 -->
    <text class="group-title">偏好</text>
    <AppCard padding="none" class="mb-20">
      <view
        v-for="(item, index) in PROFILE_PREFERENCES"
        :key="item.label"
        class="row"
        :class="{ 'row--divided': index !== 0 }"
        hover-class="u-hover"
        :hover-stay-time="80"
        @tap="goSettings(item.label)"
      >
        <AppIconTile :icon="item.icon" :tone="item.tone" :size="40" />
        <text class="row__title">{{ item.label }}</text>
        <AppIcon name="chevron-right" :size="20" class="row__arrow" />
      </view>
    </AppCard>

    <!-- 危险操作：12% 红底 + 红字（R14） -->
    <AppCard danger padding="none" class="logout" clickable @tap="onLogout">
      <text class="logout__text">退出登录</text>
    </AppCard>
  </AppLayout>

  <AppDialog
    v-model:visible="logoutOpen"
    tone="danger"
    icon="logout"
    :title="LOGOUT_MODAL.title"
    :message="LOGOUT_MODAL.content"
    :confirm-text="LOGOUT_MODAL.confirmText"
    cancel-text="再想想"
    @confirm="confirmLogout"
  />
</template>

<script setup lang="ts">
/**
 * 我的 Profile（P1，示例页）
 * 结构对齐规范 §5.14：资料块 → 身体三指标 → 设置组 → 偏好组 → 退出登录
 * 数据全是静态展示（无接口、无跨组件共享状态），故不建 store / api；登出复用 store/auth。
 */
import { ref } from 'vue';
import AppCard from '@/components/base/AppCard.vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppIconButton from '@/components/base/AppIconButton.vue';
import AppIconTile from '@/components/base/AppIconTile.vue';
import AppDialog from '@/components/overlays/AppDialog.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import useAuthStore from '@/store/auth';
import { toast } from '@/utils/ui';
import {
  LOGOUT_MODAL,
  PROFILE_METRICS,
  PROFILE_PREFERENCES,
  PROFILE_SETTINGS,
  PROFILE_USER,
  SETTINGS_PENDING_SUFFIX,
} from './config';

function goSettings(label: string) {
  toast(`${label}${SETTINGS_PENDING_SUFFIX}`);
}

/**
 * 退出登录：二次确认 → 清 token 与本地用户态 → 回首屏（不用返回键能退回）
 */
const logoutOpen = ref(false);

function onLogout() {
  logoutOpen.value = true;
}

function confirmLogout() {
  logoutOpen.value = false;
  useAuthStore().logout();
  uni.reLaunch({ url: '/pages/welcome/index' });
}
</script>

<style lang="scss" scoped>
@import './styles/profile.scss';
</style>
