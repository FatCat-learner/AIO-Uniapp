<template>
  <view class="wk-page">
    <WorkoutSheet :visible="true" :back-guard="false" @close="leave" />
  </view>
</template>

<script setup lang="ts">
/**
 * 训练路由页 /pages/workout · 薄壳
 *
 * 内容全在 WorkoutSheet 里，这里保留路由只为兼容直接跳转（深链 / 旧入口）。
 * 关闭 = 离开本页：有页面栈就回退，直接进这个 URL 就回首页。
 * 返回键交给浏览器正常出栈（back-guard=false），不重复埋历史。
 */
import WorkoutSheet from './components/WorkoutSheet.vue';

function leave() {
  if (getCurrentPages().length > 1) {
    uni.navigateBack();
    return;
  }
  uni.reLaunch({ url: '/pages/index/index' });
}
</script>

<style lang="scss" scoped>
@import './styles/workout.scss';
</style>
