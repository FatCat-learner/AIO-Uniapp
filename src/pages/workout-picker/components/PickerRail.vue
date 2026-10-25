<template>
  <scroll-view class="rail" scroll-y :show-scrollbar="false">
    <view
      class="rail__i"
      :class="{ 'rail__i--on': !activePart }"
      hover-class="u-hover"
      @tap="emit('select', { bodyPart: '', muscle: '' })"
    >
      <text class="rail__text">全部</text>
    </view>

    <template v-for="node in parts" :key="node.id">
      <view
        class="rail__i"
        :class="{ 'rail__i--on': activePart === node.label && !activeMuscle }"
        hover-class="u-hover"
        @tap="emit('select', { bodyPart: node.label, muscle: '' })"
      >
        <text class="rail__text">{{ node.label }}</text>
      </view>

      <template v-if="activePart === node.label">
        <view
          class="rail__sub"
          :class="{ 'rail__sub--on': !activeMuscle }"
          hover-class="u-hover"
          @tap="emit('select', { bodyPart: node.label, muscle: '' })"
        >
          <text class="rail__text rail__text--sub">全部</text>
        </view>
        <view
          v-for="kid in node.children"
          :key="kid.id"
          class="rail__sub"
          :class="{ 'rail__sub--on': activeMuscle === kid.id }"
          hover-class="u-hover"
          @tap="emit('select', { bodyPart: node.label, muscle: kid.id })"
        >
          <text class="rail__text rail__text--sub">{{ kid.label }}</text>
        </view>
      </template>
    </template>
  </scroll-view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 左栏部位
 * 「全部」+ MUSCLE_TREE 的 anatomy 一级部位；选中的一级展开二级肌群。
 * 二级走 muscle 参数（点号 id，如 back.lat），后端 primary_tags 就是这个口径。
 */
import { computed } from 'vue';
import { MUSCLE_TREE } from '@/pages/discover/config/muscle-tree';

const props = defineProps<{ activePart: string; activeMuscle: string }>();

const emit = defineEmits<{
  (e: 'select', payload: { bodyPart: string; muscle: string }): void;
}>();

/** 只取解剖部位：usage 类（功能性 / 热身 / 拉伸…）不进训练内选动作的左栏 */
const parts = computed(() => MUSCLE_TREE.filter(node => node.kind === 'anatomy'));

// 模板里用到的 props 提到局部变量，避免 props 解构告警
const activePart = computed(() => props.activePart);
const activeMuscle = computed(() => props.activeMuscle);
</script>

<style lang="scss" scoped>
.rail {
  flex: none;
  width: 88px;
  border-right: 1px solid var(--line);
}

.rail__i,
.rail__sub {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: var(--sp-4);
  text-align: left;
}

.rail__i {
  height: 48px;
}

.rail__i--on {
  background-color: var(--surface);
}

.rail__i--on::before {
  position: absolute;
  top: 12px;
  bottom: 12px;
  left: 0;
  width: 3px;
  content: '';
  background-color: var(--brand-500);
  border-radius: 0 3px 3px 0;
}

.rail__sub {
  height: 38px;
}

.rail__text {
  font-size: var(--fs-sm);
  line-height: 1;
  color: var(--text-2);
}

.rail__i--on .rail__text {
  font-weight: 600;
  color: var(--brand-500);
}

.rail__text--sub {
  font-size: var(--fs-xs);
  color: var(--text-3);
}

.rail__sub--on .rail__text {
  color: var(--text-1);
}
</style>
