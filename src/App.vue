<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
import { startNowClock } from '@/composables/useNow';
import useTimerStore from '@/store/timer';
import { FIRST_SCREEN_URL, getToken } from '@/utils/auth';

onLaunch(() => {
  // 没有登录态：启动默认落到首屏（Welcome），登录入口只有首屏的「开始使用」
  if (!getToken()) {
    uni.reLaunch({ url: FIRST_SCREEN_URL });
  }
  // 全局 300ms 心跳：训练时长 / 休息计时都靠它，面板收起也不停
  const timer = useTimerStore();
  startNowClock(() => timer.tick());
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
