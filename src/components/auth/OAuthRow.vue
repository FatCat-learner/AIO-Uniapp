<template>
  <view class="oauth">
    <view class="oauth__divider">
      <view class="oauth__line" />
      <text class="oauth__divider-text">或使用快捷登录</text>
      <view class="oauth__line" />
    </view>

    <view class="oauth__row">
      <view
        v-for="item in providers"
        :key="item.key"
        class="oauth__item"
        hover-class="oauth__item--hover"
        :hover-stay-time="60"
        @tap="emit('select', item.key)"
      >
        <OAuthIcon :provider="item.key" :size="22" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { OAuthProvider } from './constants';
/**
 * 快捷登录：微信 / QQ / 抖音 / 支付宝 四枚常驻，按设备追加 Apple 或 Google
 * 小程序里只有微信（§16.9）
 */
import { computed } from 'vue';
import { OAUTH_ITEMS } from './constants';
import OAuthIcon from './OAuthIcon.vue';

const props = withDefaults(defineProps<{ platform?: 'ios' | 'android' | 'mp' }>(), { platform: 'ios' });

const emit = defineEmits<{ select: [provider: OAuthProvider] }>();

const providers = computed(() => {
  if (props.platform === 'mp') return OAUTH_ITEMS.filter(item => item.key === 'wechat');
  const extra = props.platform === 'android' ? 'google' : 'apple';
  return OAUTH_ITEMS.filter(item => ['wechat', 'qq', 'douyin', 'alipay', extra].includes(item.key));
});
</script>

<style lang="scss" scoped>
.oauth {
  width: 100%;
}

.oauth__divider {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 4px 0 10px;
}

.oauth__line {
  flex: 1;
  height: 1px;
  background: var(--line);
}

.oauth__divider-text {
  font-size: 11.5px;
  color: var(--text-3);
}

.oauth__row {
  display: flex;
  gap: 8px;
}

.oauth__item {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 48px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
}

.oauth__item--hover {
  background: var(--fill);
}
</style>
