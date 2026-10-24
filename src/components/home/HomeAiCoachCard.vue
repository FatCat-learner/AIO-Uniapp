<template>
  <view class="ai">
    <view class="ai__in">
      <view class="ai__hd">
        <view class="ai__badge">
          <AppIcon name="creation" :size="14" color="var(--on-brand)" />
        </view>
        <text class="ai__t">
          {{ props.tip.title }}
        </text>
      </view>

      <text v-for="(line, i) in props.tip.lines" :key="i" class="ai__line">
        {{ line }}
      </text>

      <view class="ai__btns">
        <view class="ai__ok" hover-class="u-hover" :hover-stay-time="80" @tap="emit('accept')">
          <text>接受</text>
        </view>
        <view class="ai__skip" hover-class="u-hover" :hover-stay-time="80" @tap="emit('ignore')">
          <text>忽略</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { AiCoachTip } from '@mocks/types';
/**
 * HomeAiCoachCard · AI 教练卡（UI 规范 V1.1 §5.1 ⑧）
 * 唯一的「渐变描边」卡：1px brand→social 渐变，24 渐变徽标，底部 48 接受 / 忽略。
 * 接受是卡内主操作（brand 实底），忽略是弱操作 —— 一张卡最多两个按钮，这里正好用完。
 */
import AppIcon from '@/components/base/AppIcon.vue';

const props = defineProps<{
  tip: AiCoachTip;
}>();

const emit = defineEmits<{
  (e: 'accept'): void;
  (e: 'ignore'): void;
}>();
</script>

<style lang="scss" scoped>
/* 1px 渐变描边：外层铺渐变，内层铺卡面，比 border-image 在小程序端稳 */
.ai {
  padding: 1px;
  background-image: var(--gradient-ai);
  border-radius: calc(var(--radius-lg) + 1px);
}

.ai__in {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
  background-color: var(--surface);
  border-radius: var(--radius-lg);
}

.ai__hd {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.ai__badge {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-image: var(--gradient-ai);
  border-radius: var(--radius-full);
}

.ai__t {
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  color: var(--text-1);
}

.ai__line {
  margin-top: var(--sp-2);
  font-size: 13px;
  line-height: 20px;
  color: var(--text-2);
}

.ai__btns {
  display: flex;
  gap: var(--sp-3);
  margin-top: var(--sp-4);
}

.ai__ok {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 48px;
  font-size: 14px;
  font-weight: 600;
  color: var(--on-brand);
  background-color: var(--brand-500);
  border-radius: var(--radius-full);
}

.ai__skip {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 48px;
  font-size: 14px;
  color: var(--text-2);
  background-color: var(--surface-2);
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
}
</style>
