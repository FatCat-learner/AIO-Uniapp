<template>
  <view class="page">
    <scroll-view scroll-y class="scroll">
      <view class="home">
        <!-- ① 导航：问候 + 连续天数 + 通知 / 消息 -->
        <HomeGreeting
          :greeting="greeting"
          :sub="subLine"
          :streak-days="data.streakDays"
          @bell="toast(HOME_TOASTS.bell)"
          @message="toast(HOME_TOASTS.message)"
        />

        <!-- ② 置顶指标：步数 / 热量 / 训练分钟 -->
        <HomePinnedMetrics :metrics="data.pinned" @edit="toast(HOME_TOASTS.metricsEdit)" />

        <!-- ③ 今日训练结果（§4.25 状态机，卡内无按钮） -->
        <HomeWorkoutResult
          :rows="data.workouts"
          :summary="data.workoutSummary"
          @more="toast(HOME_TOASTS.workoutMore)"
          @select="onWorkoutSelect"
        />

        <!-- ④ 今日饮食：三页横滑 + 快捷行 + 拍照识别 -->
        <HomeDietCard
          :title="data.diet.title"
          :custom="data.diet.custom"
          :pages="data.diet.pages"
          :shortcuts="data.diet.shortcuts"
          @custom="toast(HOME_TOASTS.dietCustom)"
          @shortcut="onDietShortcut"
          @photo="toast(HOME_TOASTS.dietPhoto)"
        />

        <!-- ⑤ 预约（虚线卡） -->
        <HomeReservationCard
          :title="data.reservation.title"
          :action="data.reservation.action"
          :hint="data.reservation.hint"
          :items="data.reservation.items"
          @manage="toast(HOME_TOASTS.reservationManage)"
          @select="toast(HOME_TOASTS.reservationSelect)"
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
          @add="toast(HOME_TOASTS.weightAdd)"
          @detail="toast(HOME_TOASTS.weightDetail)"
        />
        <HomeMetricCard
          kind="water"
          :value="data.water.value"
          :sub="data.water.sub"
          :unit="data.water.unit"
          :updated="data.water.updated"
          :tag="data.water.tag"
          :points="data.water.points"
          @add="toast(HOME_TOASTS.waterAdd)"
          @detail="toast(HOME_TOASTS.waterDetail)"
        />

        <!-- ⑧ AI 教练（唯一渐变描边卡） -->
        <HomeAiCoachCard :tip="data.ai" @accept="toast(HOME_TOASTS.aiAccept)" @ignore="toast(HOME_TOASTS.aiIgnore)" />

        <!-- ⑨ + 添加卡片 -->
        <HomeAddCard @add="toast(HOME_TOASTS.addCard)" />

        <view class="tail">
          — 今天到这里 —
        </view>
      </view>
    </scroll-view>

    <AppTabBar active="home" :fab-open="fabOpen" @change="onTabChange" @fab="toggleFab" />
    <HomeTrainingSheet :open="fabOpen" @close="closeFab" @action="onTrainingAction" />
  </view>
</template>

<script setup lang="ts">
/**
 * 首页 Home · 卡片流（UI 规范 V1.1 §5.1 v2）
 *
 * 结构：问候 → 置顶指标 → 今日训练结果 → 今日饮食 → 预约 → 体重 → 饮水 → AI 教练 → 添加卡片。
 * 每张卡都是 src/components/home 下的独立组件，本页只负责「顺序 + 数据 + 跳转」，
 * 不写卡片内部样式 —— 一个首页只允许一种顺序（§4 卡片规范）。
 * 数据走 store/home（种子收口在 api/home），接后端时只改 api/home，卡片组件不用动。
 */
import type { DietShortcut, Reservation, WorkoutRow } from '@/api/home';
import type { TabKey } from '@/layouts/tabs';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
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
import { useHomeStore } from '@/store/home';
import { toast } from '@/utils/ui';
import { greetingWord, HOME_TOASTS, HOME_USER_NAME } from './config';

const store = useHomeStore();
const { data, fabOpen } = storeToRefs(store);
const { openFab, closeFab, toggleFab } = store;

/** 时段问候（mock 阶段仍用真实时间，读起来更自然） */
const greeting = computed(() => `${greetingWord(new Date().getHours())}，${HOME_USER_NAME}`);

/** 「10 月 20 日 周二 · 减脂第 18 天」 */
const subLine = computed(() => `${data.value.dateText} · ${data.value.planText}`);

const onTabChange = (key: TabKey) => navigateToTab(key);

function onWorkoutSelect(row: WorkoutRow) {
  if (row.state === 'idle') {
    openFab();
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
  closeFab();
  toast(`${label}：训练面板待接入`);
}
</script>

<style lang="scss" scoped>
@import './styles/home.scss';
</style>
