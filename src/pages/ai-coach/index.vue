<template>
  <AppLayout title="AI 教练" nav="back" :show-tab-bar="false">
    <AppEmptyState
      fill
      icon="robot-outline"
      title="AI 教练建设中"
      desc="会读你的训练与饮食数据给建议，现在先看首页那张教练卡。"
    />
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * AI 教练（ai-coach）· 占位页
 * 首页 7 项面板「AI教练」跳这里；首页 HomeAiCoachCard 是同一套语气。
 */
import AppEmptyState from '@/components/base/AppEmptyState.vue';
import AppLayout from '@/layouts/AppLayout.vue';
</script>
