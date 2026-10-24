<script setup lang="ts">
/**
 * 社区 Community（P2，示例页）
 * 规范 §5.20：社区与路书，MVP 之后再做，这里给「建设中」空态，
 * 顺便验证空态在 Layout 里的垂直居中表现。
 */
import AppLayout from '@/layouts/AppLayout.vue';
import AppIcon from '@/components/base/AppIcon.vue';
</script>

<template>
  <AppLayout title="社区" subtitle="练友动态与路书分享" active-tab="community">
    <view class="empty">
      <view class="empty__icon-wrap">
        <AppIcon name="account-group-outline" :size="48" />
      </view>
      <text class="empty__title">社区正在建设中</text>
      <text class="empty__desc">未来可以在这里看到练友的今日训练、路书和计划广场。</text>
      <view class="empty__btn" hover-class="u-hover" :hover-stay-time="80">
        <text class="empty__btn-text">先去记录训练</text>
      </view>
    </view>
  </AppLayout>
</template>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 96px 24px 0;
  text-align: center;
}

.empty__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
  color: var(--brand-500);
  background-color: var(--brand-50);
  border-radius: var(--radius-full);
}

.empty__title {
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  color: var(--text-1);
}

.empty__desc {
  font-size: 13px;
  line-height: 20px;
  color: var(--text-2);
}

.empty__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 20px;
  margin-top: 12px;
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.empty__btn-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-1);
}
</style>
