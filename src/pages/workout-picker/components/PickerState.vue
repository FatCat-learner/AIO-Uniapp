<template>
  <view class="pstate">
    <AppIcon :name="meta.icon" :size="30" :color="meta.color" />
    <text class="pstate__text">{{ meta.text }}</text>
    <view v-if="type === 'error'" class="pstate__btn" hover-class="u-hover" @tap="emit('retry')">
      <text class="pstate__btn-text">重试</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 空态 / 加载态 / 失败态
 * 挂在 z-paging 的 #loading 与 #empty 插槽里，失败态带「重试」。
 */
import { computed } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';

type StateType = 'loading' | 'empty' | 'error';

const props = withDefaults(defineProps<{ type?: StateType }>(), { type: 'empty' });

const emit = defineEmits<{ (e: 'retry'): void }>();

const META: Record<StateType, { icon: string; text: string; color: string }> = {
  loading: { icon: 'loading', text: '正在加载动作…', color: 'var(--text-3)' },
  empty: { icon: 'dumbbell', text: '没有匹配的动作，换个部位或器械试试', color: 'var(--text-4)' },
  error: { icon: 'alert-circle-outline', text: '动作库加载失败', color: 'var(--danger-text)' },
};

const meta = computed(() => META[props.type]);
</script>

<style lang="scss" scoped>
.pstate {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  align-items: center;
  justify-content: center;
  padding: var(--sp-8) var(--sp-4);
}

.pstate__text {
  font-size: var(--fs-sm);
  line-height: var(--lh-normal);
  color: var(--text-3);
  text-align: center;
}

.pstate__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--pill-h-lg);
  padding: 0 var(--sp-5);
  background-color: var(--brand-50);
  border: 1px solid var(--brand-a35);
  border-radius: var(--radius-full);
}

.pstate__btn-text {
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--brand-500);
}
</style>
