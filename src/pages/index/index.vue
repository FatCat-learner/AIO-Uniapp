<template>
  <view class="page">
    <scroll-view scroll-y class="scroll">
      <view class="home">
        <!-- ① 导航：问候 + 连续天数 + 通知 / 消息 -->
        <HomeGreeting
          :greeting="greeting"
          :sub="subLine"
          :streak-days="data.streakDays"
          @bell="toast('暂无新通知')"
          @message="toast('消息中心待接入')"
        />

        <!-- ② 置顶指标：步数 / 热量 / 训练分钟 -->
        <HomePinnedMetrics :metrics="data.pinned" @edit="toast('指标编辑待接入')" />

        <!-- ③ 今日训练结果（§4.25 状态机，卡内无按钮） -->
        <HomeWorkoutResult
          :rows="data.workouts"
          :summary="data.workoutSummary"
          @more="toast('训练历史待接入')"
          @select="onWorkoutSelect"
        />

        <!-- ④ 今日饮食：三页横滑 + 快捷行 + 拍照识别 -->
        <HomeDietCard
          :title="data.diet.title"
          :custom="data.diet.custom"
          :pages="data.diet.pages"
          :shortcuts="data.diet.shortcuts"
          @custom="toast('饮食目标自定义待接入')"
          @shortcut="onDietShortcut"
          @photo="toast('拍照识别待接入')"
        />

        <!-- ⑤ 预约（虚线卡） -->
        <HomeReservationCard
          :title="data.reservation.title"
          :action="data.reservation.action"
          :hint="data.reservation.hint"
          :items="data.reservation.items"
          @manage="toast('预约安排待接入')"
          @select="toast('预约详情待接入')"
          @cancel="onReservationCancel"
        />

        <!-- ⑥ 体重 / ⑦ 饮水（§4.26 指标卡） -->
        <HomeMetricCard
          kind="weight"
          :value="data.weight.value"
          :sub="data.weight.sub"
          :unit="data.weight.unit"
          :updated="data.weight.updated"
          :tag="data.weight.tag"
          :points="data.weight.points"
          @add="toast('记录体重待接入')"
          @detail="toast('体重详情待接入')"
        />
        <HomeMetricCard
          kind="water"
          :value="data.water.value"
          :sub="data.water.sub"
          :unit="data.water.unit"
          :updated="data.water.updated"
          :tag="data.water.tag"
          :points="data.water.points"
          @add="toast('记一杯水待接入')"
          @detail="toast('饮水详情待接入')"
        />

        <!-- ⑧ AI 教练（唯一渐变描边卡） -->
        <HomeAiCoachCard :tip="data.ai" @accept="toast('已接受 AI 建议')" @ignore="toast('已忽略本次建议')" />

        <!-- ⑨ + 添加卡片 -->
        <HomeAddCard @add="toast('卡片管理待接入')" />

        <view class="tail">
          — 今天到这里 —
        </view>
      </view>
    </scroll-view>

    <AppTabBar active="home" :fab-open="fabOpen" @change="onTabChange" @fab="fabOpen = !fabOpen" />
    <HomeTrainingSheet :open="fabOpen" @close="fabOpen = false" @action="onTrainingAction" />
  </view>
</template>

<script setup lang="ts">
import type { DietShortcut, Reservation, WorkoutRow } from '@mocks/types';
import type { TabKey } from '@/layouts/tabs';
import { homeMock } from '@mocks/data/home';
/**
 * 首页 Home · 卡片流（UI 规范 V1.1 §5.1 v2）
 *
 * 结构：问候 → 置顶指标 → 今日训练结果 → 今日饮食 → 预约 → 体重 → 饮水 → AI 教练 → 添加卡片。
 * 每张卡都是 src/components/home 下的独立组件，本页只负责「顺序 + 数据 + 跳转」，
 * 不写卡片内部样式 —— 一个首页只允许一种顺序（§4 卡片规范）。
 * 数据来自 src/mock/home.ts，接后端时换成 /api/home 即可，卡片组件不用动。
 */
import { computed, ref } from 'vue';
import HomeAddCard from '@/components/home/HomeAddCard.vue';
import HomeAiCoachCard from '@/components/home/HomeAiCoachCard.vue';
import HomeDietCard from '@/components/home/HomeDietCard.vue';
import HomeGreeting from '@/components/home/HomeGreeting.vue';
import HomeMetricCard from '@/components/home/HomeMetricCard.vue';
import HomePinnedMetrics from '@/components/home/HomePinnedMetrics.vue';
import HomeReservationCard from '@/components/home/HomeReservationCard.vue';
import HomeTrainingSheet from '@/components/home/HomeTrainingSheet.vue';
import HomeWorkoutResult from '@/components/home/HomeWorkoutResult.vue';
import AppTabBar from '@/components/layout/AppTabBar.vue';
import { navigateToTab } from '@/layouts/tabs';

const data = homeMock;
const fabOpen = ref(false);

/** 时段问候（mock 阶段仍用真实时间，读起来更自然） */
const greeting = computed(() => {
  const hour = new Date().getHours();
  const word = hour < 6 ? '夜深了' : hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好';
  return `${word}，聪汉`;
});

/** 「10 月 20 日 周二 · 减脂第 18 天」 */
const subLine = computed(() => `${data.dateText} · ${data.planText}`);

const toast = (title: string) => uni.showToast({ title, icon: 'none' });

const onTabChange = (key: TabKey) => navigateToTab(key);

function onWorkoutSelect(row: WorkoutRow) {
  if (row.state === 'idle') {
    fabOpen.value = true;
    return;
  }
  toast(`${row.title}：训练详情待接入`);
}

function onDietShortcut(item: DietShortcut) {
  toast(`${item.label}：记录面板待接入`);
}

function onReservationCancel(item: Reservation) {
  toast(`已取消 ${item.time} 的预约`);
}

function onTrainingAction(label: string) {
  fabOpen.value = false;
  toast(`${label}：训练面板待接入`);
}
</script>

<style lang="scss" scoped>
.scroll {
  flex: 1;
  min-height: 0;
}

/* 卡片流：统一 12 间距，底部预留 Dock（108） */
.home {
  display: flex;
  flex-direction: column;
  gap: var(--card-gap);
  padding: 24px var(--page-x) var(--content-inset-bottom);
  box-sizing: border-box;
}

.tail {
  padding: var(--sp-3) 0 var(--sp-2);
  font-size: 11px;
  color: var(--text-3);
  text-align: center;
}
</style>
