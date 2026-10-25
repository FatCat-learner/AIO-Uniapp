<template>
  <view v-if="visible" class="country" :style="{ zIndex: overlayZ('sheet') }">
    <view class="country__mask" @tap="emit('close')" />
    <view class="country__panel">
      <view class="country__head">
        <text class="country__title">选择国家 / 地区</text>
        <text class="country__close" @tap="emit('close')">关闭</text>
      </view>
      <scroll-view scroll-y class="country__list">
        <view
          v-for="item in countries"
          :key="item.dial"
          class="country__row"
          :class="{ 'is-active': item.dial === activeDial }"
          hover-class="country__row--hover"
          :hover-stay-time="60"
          @tap="onPick(item)"
        >
          <text class="country__name">{{ item.name }}</text>
          <text class="country__dial">{{ item.dial }}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ICountry } from './constants';
import { overlayZ } from '@/components/overlays/overlayStack';
/**
 * 国际区号面板：底部升起，一行一个地区（左侧名称、右侧区号）
 */
import { COUNTRIES } from './constants';

withDefaults(defineProps<{ visible: boolean; activeDial?: string }>(), { activeDial: '+86' });

const emit = defineEmits<{ close: []; select: [country: ICountry] }>();

const countries = COUNTRIES;

function onPick(item: ICountry) {
  emit('select', item);
}
</script>

<style lang="scss" scoped>
.country {
  position: fixed;
  inset: 0;
}

.country__mask {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 55%);
}

.country__panel {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  max-height: 74vh;
  padding-bottom: 12px;
  background: var(--surface-2);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.country__head {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 10px;
}

.country__title {
  font-size: var(--fs-base);
  font-weight: 600;
  color: var(--text-1);
}

.country__close {
  font-size: var(--fs-sm);
  color: var(--text-3);
}

.country__list {
  flex: 1;
  min-height: 0;
}

.country__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 46px;
  padding: 0 22px;
}

.country__row--hover {
  background: var(--fill);
}

.country__name {
  font-size: var(--fs-base);
  color: var(--text-1);
}

.country__dial {
  font-size: var(--fs-base);
  color: var(--text-2);
}

.is-active .country__name,
.is-active .country__dial {
  font-weight: 600;
  color: var(--brand-500);
}
</style>
