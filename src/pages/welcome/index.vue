<template>
  <view class="welcome">
    <view class="welcome__page">
      <AuthGlow />

      <view class="welcome__logo">
        <AuthLogo />
      </view>

      <view class="welcome__copy">
        <text class="welcome__title">训练、饮食、身体</text>
        <!-- 内联 <text> 必须写在同一行：模板里的换行/缩进会被编译器压成一个空格，视觉上就是左右各多半个字 -->
        <text class="welcome__title">放在<text class="a-highlight">同一个节奏</text>里</text>
        <text class="welcome__desc">
          练什么、吃什么、明天该多重，打开就知道。
        </text>
      </view>
    </view>

    <view class="welcome__foot">
      <AuthButton label="开始使用" @tap="start" />
      <view class="welcome__legal">
        <text class="welcome__legal-text">
          继续即表示同意
        </text>
        <text class="welcome__link" @tap="openTerms(WELCOME_COPY.serviceTerms)">
          服务条款
        </text>
        <text class="welcome__legal-text">
          与
        </text>
        <text class="welcome__link" @tap="openTerms(WELCOME_COPY.privacyTerms)">
          隐私政策
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 首屏 Welcome（§16.1 P1）
 * 只有「开始使用」一个出口：点进登录页，不再有「已有账号」这种重复入口。
 * 纯静态引导页：无共享状态、无接口，故不建 store / api（出口路由与条款文案在 config/）。
 */
import AuthButton from '@/components/auth/AuthButton.vue';
import AuthGlow from '@/components/auth/AuthGlow.vue';
import AuthLogo from '@/components/auth/AuthLogo.vue';
import { toast } from '@/utils/ui';
import { WELCOME_COPY } from './config';

function start() {
  uni.navigateTo({ url: WELCOME_COPY.loginPath });
}

/** 条款页还没做，先用 toast 兜住点击（不让用户点了没反应） */
function openTerms(name: string) {
  toast(`${name}${WELCOME_COPY.termsPendingSuffix}`);
}
</script>

<style lang="scss" scoped>
@import './styles/welcome.scss';
</style>
