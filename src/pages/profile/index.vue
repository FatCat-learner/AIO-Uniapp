<script setup lang="ts">
/**
 * 我的 Profile（P1，示例页）
 * 结构对齐规范 §5.14：资料块 → 身体三指标 → 设置组 → 偏好组 → 退出登录
 */
import AppLayout from '@/layouts/AppLayout.vue';
import AppCard from '@/components/base/AppCard.vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppIconButton from '@/components/base/AppIconButton.vue';
import AppIconTile from '@/components/base/AppIconTile.vue';
import useAuthStore from '@/store/auth';

const metrics = [
  { label: '体重', value: '93.0', unit: 'kg' },
  { label: '身高', value: '165', unit: 'cm' },
  { label: '目标', value: '减脂', unit: '' },
];

const settings = [
  { icon: 'target', tone: 'diet' as const, label: '目标与计划', extra: '每周 4 练' },
  { icon: 'bluetooth', tone: 'cardio' as const, label: '设备管理', extra: '' },
  { icon: 'book-open-page-variant-outline', tone: 'social' as const, label: '我的路书', extra: '' },
];

const preferences = [
  { icon: 'view-dashboard-outline', tone: 'social' as const, label: '首页卡片布局', extra: '' },
  { icon: 'bell-outline', tone: 'diet' as const, label: '通知提醒', extra: '' },
  { icon: 'shield-lock-outline', tone: 'body' as const, label: '隐私与安全', extra: '' },
];

function goSettings(label: string) {
  uni.showToast({ title: `${label}（待接入）`, icon: 'none' });
}

/**
 * 退出登录：二次确认 → 清 token 与本地用户态 → 回首屏（不用返回键能退回）
 */
function onLogout() {
  uni.showModal({
    title: '退出登录',
    content: '退出后需要重新登录才能同步训练数据。',
    confirmText: '退出',
    confirmColor: '#ef4444',
    success: (res) => {
      if (!res.confirm) {
        return;
      }
      useAuthStore().logout();
      uni.reLaunch({ url: '/pages/welcome/index' });
    },
  });
}
</script>

<template>
  <AppLayout title="我的" subtitle="资料、目标与偏好设置" active-tab="profile">
    <template #nav-right>
      <AppIconButton icon="bell-outline" />
    </template>

    <!-- 资料块 -->
    <view class="profile">
      <view class="profile__avatar">
        <text class="profile__initial">汉</text>
        <view class="profile__edit">
          <AppIcon name="pencil" :size="14" />
        </view>
      </view>
      <text class="profile__name">黄聪汉</text>
      <text class="profile__meta">坚持就是胜利 · 2026 年 10 月加入</text>
    </view>

    <!-- 身体三指标：三列全宽小卡 -->
    <view class="metrics">
      <AppCard v-for="item in metrics" :key="item.label" class="metrics__card">
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
        v-for="(item, index) in settings"
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
        v-for="(item, index) in preferences"
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
</template>

<style lang="scss" scoped>
.mb-20 {
  margin-bottom: 20px;
}

.profile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  padding: 8px 0 20px;
}

.profile__avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  margin-bottom: 8px;
  background-color: var(--surface-2);
  border: 2px solid var(--brand-500);
  border-radius: var(--radius-full);
}

.profile__initial {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-1);
}

.profile__edit {
  position: absolute;
  right: -2px;
  bottom: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--on-brand);
  background-color: var(--brand-500);
  border: 2px solid var(--bg);
  border-radius: var(--radius-full);
}

.profile__name {
  font-size: 17px;
  font-weight: 600;
  line-height: 24px;
  color: var(--text-1);
}

.profile__meta {
  font-size: 11px;
  line-height: 16px;
  color: var(--text-2);
}

.metrics {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.metrics__card {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  padding: 12px 8px;
}

.metrics__label {
  font-size: 11px;
  line-height: 16px;
  color: var(--text-2);
}

.metrics__value-row {
  display: flex;
  gap: 2px;
  align-items: baseline;
}

.metrics__value {
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  color: var(--text-1);
  font-variant-numeric: tabular-nums;
}

.metrics__value.is-brand {
  color: var(--brand-500);
}

.metrics__unit {
  font-size: 11px;
  color: var(--text-3);
}

.group-title {
  display: block;
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 600;
  line-height: 16px;
  color: var(--text-2);
  letter-spacing: 0.08em;
}

.row {
  display: flex;
  gap: 12px;
  align-items: center;
  height: 56px;
  padding: 0 16px;
}

.row--divided {
  border-top: 1px solid var(--line);
}

.row__title {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  line-height: 22px;
  color: var(--text-1);
}

.row__extra {
  font-size: 11px;
  color: var(--text-3);
}

.row__arrow {
  color: var(--text-3);
}

.logout {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout__text {
  display: block;
  padding: 14px 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--danger);
  text-align: center;
}
</style>
