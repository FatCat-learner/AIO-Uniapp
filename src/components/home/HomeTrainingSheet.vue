<template>
  <view v-if="open" class="mask" @tap="emit('close')" />
  <view v-if="open" class="sheet" @tap.stop>
    <view class="sheet__grip" />

    <view class="sheet__hd">
      <text class="sheet__t">
        开始训练
      </text>
      <view class="sheet__x" hover-class="u-hover" :hover-stay-time="80" @tap="emit('close')">
        <AppIcon name="close" :size="18" />
      </view>
    </view>

    <view class="sheet__grid">
      <view
        v-for="a in actions"
        :key="a.label"
        class="qk"
        hover-class="u-hover"
        :hover-stay-time="80"
        @tap="emit('action', a.label)"
      >
        <view class="qk__ic">
          <AppIcon :name="a.icon" :size="20" />
        </view>
        <text class="qk__t">
          {{ a.label }}
        </text>
      </view>
    </view>

    <view class="sheet__btn" hover-class="u-hover" :hover-stay-time="80" @tap="emit('action', '开始自由训练')">
      <text>开始自由训练</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * HomeTrainingSheet · 训练启动面板（FAB 展开，UI 规范 V1.1 §4.18 BottomSheet）
 * 4 个快捷入口 + 「开始自由训练」主按钮；面板本身只是训练流程的入口，
 * 具体训练面板（练胸 / 练腿 / 有氧 / 拉伸）后续接入。
 */
import AppIcon from '@/components/base/AppIcon.vue';

defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'action', label: string): void;
}>();

const actions = [
  { label: '练胸', icon: 'dumbbell' },
  { label: '练腿', icon: 'dumbbell' },
  { label: '有氧', icon: 'run' },
  { label: '拉伸', icon: 'yoga' },
];
</script>

<style lang="scss" scoped>
.mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 110;
  background-color: var(--mask);
}

.sheet {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 111;
  padding: 10px var(--sp-4) 22px;
  background-color: var(--surface-2);
  border-top: 1px solid var(--line-strong);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.sheet__grip {
  width: 46px;
  height: 4px;
  margin: 0 auto 10px;
  background-color: var(--line-strong);
  border-radius: var(--radius-full);
}

.sheet__hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--sp-3);
}

.sheet__t {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-1);
}

.sheet__x {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: var(--text-2);
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.sheet__grid {
  display: flex;
  gap: 10px;
  padding-bottom: 14px;
}

.qk {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.qk__ic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: var(--brand-500);
  background-color: var(--brand-50);
  border-radius: 10px;
}

.qk__t {
  font-size: 11px;
  color: var(--text-1);
}

.sheet__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  font-size: 14px;
  font-weight: 700;
  color: var(--on-brand);
  background-color: var(--brand-500);
  border-radius: var(--radius-full);
}
</style>
