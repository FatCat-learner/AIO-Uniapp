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
        <text class="welcome__link" @tap="openTerms('服务条款')">
          服务条款
        </text>
        <text class="welcome__legal-text">
          与
        </text>
        <text class="welcome__link" @tap="openTerms('隐私政策')">
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
 */
import AuthButton from '@/components/auth/AuthButton.vue';
import AuthGlow from '@/components/auth/AuthGlow.vue';
import AuthLogo from '@/components/auth/AuthLogo.vue';

function start() {
  uni.navigateTo({ url: '/pages/login/index' });
}

/** 条款页还没做，先用 toast 兜住点击（不让用户点了没反应） */
function openTerms(name: string) {
  uni.showToast({ title: `${name}（待接入）`, icon: 'none' });
}
</script>

<style lang="scss" scoped>
.welcome {
  position: relative;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 10px var(--sp-4) 28px;
  overflow: hidden;
  background: var(--bg);
}

.welcome__page{
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.welcome__logo {
  display: flex;
  justify-content: center;
  margin-bottom: 36px;
}

.welcome__copy {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome__title {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-1);
}

.welcome__desc {
  margin-top: 14px;
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  text-align: center;
  color: var(--text-2);
  width: 180px;
}

.welcome__foot {
  flex: none;
  /* 设计稿：.welcome__foot{padding:0 24px 30px}，页面本身不再重复留边 */
  padding: 0 8px 2px;
}

.welcome__legal {
  display: flex;
  align-items: baseline;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0 4px;
  margin-top: 16px;
  font-size: var(--fs-xs);
  line-height: 1.65;
  color: #8b94a3;
}

.welcome__legal-text {
  font-size: var(--fs-xs);
  color: #8b94a3;
}

/* 设计稿 .legal a：浅灰字 + 1px 下划线，压住「可点」但不抢主按钮 */
.welcome__link {
  font-size: var(--fs-xs);
  color: #b9c2d0;
  border-bottom: 1px solid var(--line-strong);
  padding-bottom: 1px;
}
</style>
