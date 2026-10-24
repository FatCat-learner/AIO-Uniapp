<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
/* 每个页面公共css */
/* 设计令牌全局引入一次（不要放进 uni.scss，否则会被注入到每个 scss 文件） */
@import '@/styles/theme.scss';
@import 'uview-plus/index.scss';
@import '@/styles/common.scss';
</style>
