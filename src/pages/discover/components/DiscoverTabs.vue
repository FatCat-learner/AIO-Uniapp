<template>
  <view class="tabs">
    <view
      v-for="c in CATS"
      :key="c.key"
      class="tab"
      :class="{ 'is-on': cat === c.key }"
      hover-class="tab--hover"
      :hover-stay-time="60"
      @tap="emit('select', c.key)"
    >
      <text class="tab__t">
        {{ c.label }}
      </text>
      <view class="tab__bar" />
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CatKey } from '@/pages/discover/config';
import { CATS } from '@/pages/discover/config';

defineProps<{ cat: CatKey }>();

const emit = defineEmits<{ (e: 'select', k: CatKey): void }>();
</script>

<style lang="scss" scoped>
@import '../styles/tabs.scss';
</style>
