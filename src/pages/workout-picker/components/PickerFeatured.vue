<template>
  <scroll-view v-if="items.length" class="feat" scroll-x :show-scrollbar="false">
    <view class="feat__row">
      <view v-for="item in items" :key="item.id" class="feat__c">
        <image class="feat__img" :src="item.thumb" mode="aspectFill" />
        <view class="feat__meta">
          <text class="feat__n">{{ item.zh_name }}</text>
          <text class="feat__e">{{ item.equipment }}</text>
        </view>
        <view class="feat__add" hover-class="u-hover" @tap.stop="emit('add', item)">
          <AppIcon name="plus" :size="12" />
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 横滑精选卡
 * 取当前结果的前几张（列表已按 tab 的排序口径排好，不再另发请求）。
 */
import type { IExerciseBrief } from '@/api/exercise/types';
import AppIcon from '@/components/base/AppIcon.vue';

defineProps<{ items: IExerciseBrief[] }>();

const emit = defineEmits<{ (e: 'add', item: IExerciseBrief): void }>();
</script>

<style lang="scss" scoped>
.feat {
  width: 100%;
  white-space: nowrap;
}

.feat__row {
  display: inline-flex;
  gap: var(--sp-2);
  padding-bottom: var(--sp-1);
}

.feat__c {
  display: flex;
  flex: none;
  gap: var(--sp-2);
  align-items: center;
  width: 170px;
  padding: var(--sp-2);
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.feat__img {
  flex: none;
  width: 44px;
  height: 44px;
  background-color: var(--fill);
  border-radius: var(--radius-xs);
}

.feat__meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--sp-1);
  min-width: 0;
}

.feat__n {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: var(--lh-snug);
  color: var(--text-1);
  white-space: nowrap;
}

.feat__e {
  font-size: var(--fs-2xs);
  line-height: 1;
  color: var(--text-3);
}

.feat__add {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: auto;
  color: var(--brand-500);
  background-color: var(--brand-50);
  border-radius: var(--radius-full);
}
</style>
