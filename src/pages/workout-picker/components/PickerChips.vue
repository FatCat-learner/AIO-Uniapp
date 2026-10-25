<template>
  <scroll-view class="chips" scroll-x :show-scrollbar="false">
    <view class="chips__row">
      <view
        class="chip"
        :class="{ 'chip--on': pinned }"
        hover-class="u-hover"
        @tap="pinned = !pinned"
      >
        <text class="chip__text">置顶</text>
      </view>
      <view
        v-for="item in equipment"
        :key="item"
        class="chip"
        :class="{ 'chip--on': item === active }"
        hover-class="u-hover"
        @tap="emit('select', item)"
      >
        <text class="chip__text">{{ item }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 器械 chip 行
 * 第一个「置顶」是纯点击态（没有后端口径）；其余来自 filters.equipment，选中荧光绿。
 * 再次点击同一颗 = 取消（store.setEquipment 自带取反）。
 */
import { ref } from 'vue';

defineProps<{ equipment: string[]; active: string }>();

const emit = defineEmits<{ (e: 'select', value: string): void }>();

/** 置顶本期只切换视觉态 */
const pinned = ref(false);
</script>

<style lang="scss" scoped>
.chips {
  flex: none;
  padding: 0 var(--sp-4) var(--sp-3);
  white-space: nowrap;
}

/* inline-flex：宽度跟内容走，父级 scroll-view 才能横滑 */
.chips__row {
  display: inline-flex;
  gap: var(--sp-2);
  align-items: center;
}

.chip {
  display: flex;
  flex: none;
  align-items: center;
  height: var(--pill-h);
  padding: 0 var(--sp-4);
  background-color: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
}

.chip--on {
  background-color: var(--brand-500);
  border-color: var(--brand-500);
}

.chip__text {
  font-size: var(--fs-sm);
  line-height: 1;
  color: var(--text-2);
}

.chip--on .chip__text {
  font-weight: 600;
  color: var(--on-brand);
}
</style>
