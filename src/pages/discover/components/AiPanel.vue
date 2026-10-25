<template>
  <scroll-view scroll-y class="scroll">
    <view v-if="searching" class="carry">
      <text class="carry__t">
        正在用 AI 搜索「{{ query.trim() }}」
      </text>
      <text class="carry__x" @tap="emit('clear')">
        清除
      </text>
    </view>

    <view class="hero">
      <view class="hero__hd">
        <view class="hero__ic">
          <AppIcon name="creation" :size="16" color="#0b0d12" />
        </view>
        <text class="hero__t">
          AI 教练
        </text>
        <view class="hero__live">
          <view class="dot" />
          <text>已接入今日数据</text>
        </view>
      </view>
      <text class="hero__d">
        说说目标，我直接产出可执行的计划；拍一张餐盘，我拆成热量和三大营养素。
      </text>
      <view class="hero__acts">
        <view class="pill" hover-class="u-hover" @tap="emit('toast', '让 AI 按你的目标排计划')">
          <AppIcon name="calendar-blank-outline" :size="14" color="#c9d2e0" />
          <text class="pill__t">
            生成 4 周计划
          </text>
        </view>
        <view class="pill" hover-class="u-hover" @tap="emit('scan')">
          <AppIcon name="camera-outline" :size="14" color="#c9d2e0" />
          <text class="pill__t">
            识别这张照片
          </text>
        </view>
        <view class="pill" hover-class="u-hover" @tap="emit('toast', '让 AI 分析今日饮食')">
          <AppIcon name="chart-box-outline" :size="14" color="#c9d2e0" />
          <text class="pill__t">
            分析今日饮食
          </text>
        </view>
      </view>
    </view>

    <view class="sec__hd">
      <text class="sec__t">
        你可以这样问
      </text>
      <text class="sec__more">
        看全部
      </text>
    </view>
    <view
      v-for="a in ASKS"
      :key="a.title"
      class="ask"
      hover-class="u-hover"
      :hover-stay-time="60"
      @tap="emit('ask', a.title)"
    >
      <view class="ask__ic">
        <AppIcon name="creation" :size="15" color="var(--acc)" />
      </view>
      <view class="ask__txt">
        <text class="ask__t">
          {{ a.title }}
        </text>
        <text class="ask__d">
          {{ a.desc }}
        </text>
      </view>
      <AppIcon name="chevron-right" :size="16" color="#6b7280" />
    </view>

    <view class="sec__hd">
      <text class="sec__t">
        健康小知识
      </text>
      <text class="sec__more">
        全部
      </text>
    </view>
    <view class="tips">
      <view v-for="t in TIPS" :key="t.title" class="tip">
        <view class="tip__ic">
          <AppIcon :name="t.icon" :size="16" color="var(--acc)" />
        </view>
        <text class="tip__t">
          {{ t.title }}
        </text>
        <text class="tip__d">
          {{ t.desc }}
        </text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ASKS, TIPS } from '@/pages/discover/config';

defineProps<{ query: string; searching: boolean }>();

const emit = defineEmits<{
  (e: 'ask', title: string): void;
  (e: 'toast', msg: string): void;
  (e: 'scan'): void;
  (e: 'clear'): void;
}>();
</script>

<style lang="scss" scoped>
@import '../styles/hero.scss';
@import '../styles/state.scss';
@import '../styles/list.scss';
@import '../styles/rail.scss';
</style>
