<template>
  <view class="pk-top">
    <view class="pk-top__x" hover-class="u-hover" @tap="emit('close')">
      <AppIcon name="close" :size="18" />
    </view>

    <view class="pk-top__search">
      <AppIcon name="magnify" :size="15" color="var(--text-3)" />
      <input
        class="pk-top__input"
        type="text"
        confirm-type="search"
        placeholder="输入动作名字搜索"
        placeholder-class="pk-top__ph"
        :value="keyword"
        @input="onInput"
      >
      <view class="pk-top__cam" hover-class="u-hover" @tap="emit('camera')">
        <AppIcon name="camera-outline" :size="14" />
      </view>
    </view>

    <!-- 设计稿没有这一颗，按需求补「HIIT组合」文本按钮：本期只有点击态 -->
    <view class="pk-top__hiit" hover-class="u-hover" @tap="emit('hiit')">
      <text class="pk-top__hiit-text">HIIT组合</text>
    </view>

    <view class="pk-top__plus" hover-class="u-hover" @tap="emit('plus')">
      <AppIcon name="plus" :size="18" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 顶部条
 * 关闭 X / 圆角搜索框（放大镜 + 拍照识别）/ HIIT组合 / 新建「+」。
 * 只有搜索是真的，其余三颗本期只做点击态（父组件弹 toast）。
 */
import AppIcon from '@/components/base/AppIcon.vue';

withDefaults(defineProps<{ keyword?: string }>(), { keyword: '' });

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'camera'): void;
  (e: 'hiit'): void;
  (e: 'plus'): void;
  (e: 'search', value: string): void;
}>();

/** uni-app 的 InputEvent 跨端类型不一致，这里只取 detail.value */
function onInput(event: any) {
  emit('search', event?.detail?.value ?? '');
}
</script>

<style lang="scss" scoped>
.pk-top {
  display: flex;
  flex: none;
  gap: var(--sp-2);
  align-items: center;
  padding: var(--sp-3) var(--sp-4);
}

.pk-top__x {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text-1);
}

.pk-top__search {
  display: flex;
  flex: 1;
  gap: var(--sp-2);
  align-items: center;
  min-width: 0;
  height: 40px;
  padding: 0 var(--sp-2) 0 var(--sp-3);
  background-color: var(--surface);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-full);
}

.pk-top__input {
  flex: 1;
  min-width: 0;
  height: 100%;
  font-size: var(--fs-base);
  color: var(--text-1);
}

.pk-top__ph {
  color: var(--text-3);
}

.pk-top__cam,
.pk-top__plus {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  color: var(--brand-500);
  background-color: var(--brand-50);
  border-radius: var(--radius-full);
}

.pk-top__cam {
  width: 28px;
  height: 28px;
}

.pk-top__plus {
  width: 32px;
  height: 32px;
}

.pk-top__hiit {
  display: flex;
  flex: none;
  align-items: center;
  padding: 0 var(--sp-1);
}

.pk-top__hiit-text {
  font-size: var(--fs-xs);
  font-weight: 600;
  color: var(--text-2);
  white-space: nowrap;
}
</style>
