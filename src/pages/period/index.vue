<template>
  <AppLayout title="经期记录" nav="back" :show-tab-bar="false">
    <AppEmptyState
      fill
      icon="calendar-blank-outline"
      title="经期记录建设中"
      desc="周期、症状、经量会在这里记，之后训练强度也会跟着周期走。"
    />
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * 经期记录（period）· 占位页
 * 首页 7 项面板「经期记录」跳这里；周期色用 theme.scss 的 --period 系列。
 */
import AppEmptyState from '@/components/base/AppEmptyState.vue';
import AppLayout from '@/layouts/AppLayout.vue';
</script>
