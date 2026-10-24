<template>
  <view class="oauth-icon" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- 微信：两个气泡 -->
    <svg v-if="provider === 'wechat'" :width="size" :height="size" viewBox="0 0 24 24">
      <path
        d="M9.2 3C5.3 3 2.2 5.6 2.2 8.8c0 1.8 1 3.4 2.6 4.5l-.6 2.1 2.4-1.2c.8.2 1.7.4 2.6.4h.5c-.2-.5-.3-1.1-.3-1.7 0-3 2.9-5.4 6.5-5.4h.6C16 5.2 12.9 3 9.2 3Z"
        fill="#4ade80"
      />
      <circle cx="6.8" cy="7.6" r="0.9" fill="#0b0d12" />
      <circle cx="11.4" cy="7.6" r="0.9" fill="#0b0d12" />
      <path
        d="M16.4 8.9c-3 0-5.5 2-5.5 4.5s2.5 4.5 5.5 4.5c.7 0 1.3-.1 1.9-.3l2 1-.5-1.8c1.3-.9 2.1-2.2 2.1-3.4 0-2.5-2.4-4.5-5.5-4.5Z"
        fill="#4ade80"
      />
    </svg>

    <!-- QQ：企鹅头 -->
    <svg v-else-if="provider === 'qq'" :width="size" :height="size" viewBox="0 0 24 24">
      <path
        d="M12 2.6c-3.1 0-5.3 2.3-5.3 5.4 0 .9.1 1.6.1 2.2-1 1.6-1.8 3.4-1.8 4.7 0 .7.3 1.1.8 1.1.6 0 1.2-.9 1.6-1.8.5 1.4 1.6 2.4 3 2.7-.5.3-.9.7-.9 1.1 0 .6.9 1 2.5 1s2.5-.4 2.5-1c0-.4-.4-.8-.9-1.1 1.4-.3 2.5-1.3 3-2.7.4.9 1 1.8 1.6 1.8.5 0 .8-.4.8-1.1 0-1.3-.8-3.1-1.8-4.7 0-.6.1-1.3.1-2.2 0-3.1-2.2-5.4-5.3-5.4Z"
        fill="#38bdf8"
      />
      <circle cx="9.8" cy="7.4" r="0.9" fill="#0b0d12" />
      <circle cx="14.2" cy="7.4" r="0.9" fill="#0b0d12" />
    </svg>

    <!-- 抖音：音符 -->
    <svg v-else-if="provider === 'douyin'" :width="size" :height="size" viewBox="0 0 24 24">
      <path
        d="M14.2 2.6h2.1c.2 1.6 1.2 3 2.9 3.3v2.2c-1.1 0-2.1-.4-2.9-1v5.6c0 3-2.3 5.2-5.2 5.2S5.9 15.7 5.9 12.7c0-2.9 2.2-5.2 5.1-5.2.3 0 .5 0 .8.1v2.3c-.3-.1-.5-.2-.8-.2-1.6 0-2.9 1.3-2.9 3s1.3 3 2.9 3 3-1.3 3-3V2.6Z"
        fill="#f472b6"
      />
    </svg>

    <!-- 支付宝：圆角方块 + 支（SVG 里的 <text> 在端上不渲染，改用原生文字） -->
    <view
      v-else-if="provider === 'alipay'"
      class="alipay"
      :style="{ width: `${size}px`, height: `${size}px` }"
    >
      <text class="alipay__glyph" :style="{ fontSize: `${Math.round(size * 0.5)}px` }">支</text>
    </view>

    <!-- Apple -->
    <svg v-else-if="provider === 'apple'" :width="size" :height="size" viewBox="0 0 24 24">
      <path
        d="M16.4 12.6c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.6 2 1-.1 1.4-.7 2.7-.7s1.6.7 2.7.7c1.1 0 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.2Z"
        fill="#ffffff"
      />
      <path
        d="M14.6 6.4c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.7-1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2Z"
        fill="#ffffff"
      />
    </svg>

    <!-- Google：四色 G -->
    <svg v-else :width="size" :height="size" viewBox="0 0 24 24">
      <path
        d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4c-.2 1.2-1 2.3-2 3v2.5h3.2c1.9-1.8 3-4.4 3-7.2Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6C4.8 19.8 8.1 22 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3.1C2.4 8.9 2 10.4 2 12s.4 3.1 1.1 4.5l3.3-2.6Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.9 14.7 2 12 2 8.1 2 4.8 4.2 3.1 7.5l3.3 2.6C7.2 7.7 9.4 5.9 12 5.9Z"
        fill="#EA4335"
      />
    </svg>
  </view>
</template>

<script setup lang="ts">
/**
 * 快捷登录品牌图标（内联 SVG，不引图标库）
 * 每个图标都是矢量，颜色写死品牌色，不跟随 currentColor——品牌 logo 不该被主题改色。
 */
import type { OAuthProvider } from './constants'

withDefaults(defineProps<{ provider: OAuthProvider; size?: number }>(), { size: 22 })
</script>

<style lang="scss" scoped>
.oauth-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.alipay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #60a5fa;
  border-radius: 6px;
}

.alipay__glyph {
  font-weight: 700;
  line-height: 1;
  color: #0b0d12;
}
</style>
