<template>
  <view class="bar-wrap">
    <view class="bar">
      <AppIcon name="magnify" :size="18" color="#8f98a8" />
      <input
        v-model="q"
        class="bar__in"
        :placeholder="curCat.ph"
        placeholder-style="color:#8f98a8;font-size:14px;"
        confirm-type="search"
      >
      <view v-if="searching" class="bar__x" hover-class="u-hover" @tap="emit('clear')">
        <AppIcon name="close-circle" :size="16" color="#8f98a8" />
      </view>
      <view v-if="curCat.cam" class="bar__cam" hover-class="u-hover" @tap="emit('scan')">
        <AppIcon name="camera-outline" :size="18" color="var(--acc)" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CatKey } from '@/pages/discover/config';
import { CATS } from '@/pages/discover/config';

const props = defineProps<{ cat: CatKey; query: string; searching: boolean }>();

const emit = defineEmits<{
  (e: 'update:query', v: string): void;
  (e: 'clear'): void;
  (e: 'scan'): void;
}>();

const q = computed({
  get: () => props.query,
  set: (v: string) => emit('update:query', v),
});

const curCat = computed(() => CATS.find(c => c.key === props.cat)!);
</script>

<style lang="scss" scoped>
@import '../styles/searchbar.scss';
</style>
