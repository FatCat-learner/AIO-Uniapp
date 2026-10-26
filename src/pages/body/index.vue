<template>
  <AppLayout title="身体数据" nav="back" :show-tab-bar="false">
    <AppEmptyState
      fill
      icon="scale-bathroom"
      title="身体数据建设中"
      desc="体重、体脂、围度会在这里归档，先回首页看其他卡片。"
    />
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * 身体数据（body）· 占位页
 * 首页 7 项面板「身体数据」跳这里，路由先站着，页面下一轮做。
 */
import AppEmptyState from '@/components/base/AppEmptyState.vue';
import AppLayout from '@/layouts/AppLayout.vue';
</script>
