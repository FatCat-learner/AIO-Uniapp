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

        <!-- ③ 开始训练入口卡（7 项面板） -->
        <HomeWorkoutEntry @start="openFab" />

        <!-- ④ 今日训练结果（有记录才出，历史入口留在入口卡下面） -->
        <HomeWorkoutResult
          v-if="data.workouts.length"
          :rows="data.workouts"
          :summary="data.workoutSummary"
          @more="toast(HOME_TOASTS.workoutMore)"
          @select="onWorkoutSelect"
        />

        <!-- ⑤ 今日饮食：三页横滑 + 快捷行 + 拍照识别 -->
        <HomeDietCard
          :title="data.diet.title"
          :custom="data.diet.custom"
          :pages="data.diet.pages"
          :shortcuts="data.diet.shortcuts"
          @custom="toast(HOME_TOASTS.dietCustom)"
          @shortcut="onDietShortcut"
          @photo="toast(HOME_TOASTS.dietPhoto)"
        />

        <!-- ⑥ 预约（虚线卡） -->
        <HomeReservationCard
          :title="data.reservation.title"
          :action="data.reservation.action"
          :hint="data.reservation.hint"
          :items="data.reservation.items"
          @manage="toast(HOME_TOASTS.reservationManage)"
          @select="toast(HOME_TOASTS.reservationSelect)"
          @cancel="onReservationCancel"
        />

        <!-- ⑦ 体重 / ⑧ 饮水（§4.26 指标卡） -->
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

        <!-- ⑨ AI 教练（唯一渐变描边卡） -->
        <HomeAiCoachCard :tip="data.ai" @accept="toast(HOME_TOASTS.aiAccept)" @ignore="toast(HOME_TOASTS.aiIgnore)" />

        <!-- ⑩ + 添加卡片 -->
        <HomeAddCard @add="toast(HOME_TOASTS.addCard)" />

        <view class="tail">
          — 今天到这里 —
        </view>
      </view>
    </scroll-view>

    <AppTabBar
      active="home"
      :fab-open="fabOpen"
      :workout-active="workout.active && !workoutOpen"
      :workout-time="pillTime"
      @change="onTabChange"
      @fab="toggleFab"
      @resume="openWorkout"
    />
    <HomeTrainingSheet :open="fabOpen" @close="closeFab" @pick="onTrainingPick" />
    <WorkoutSheet :visible="workoutOpen" @close="closeWorkout" />
  </view>
</template>

<script setup lang="ts">
/**
 * 首页 Home · 卡片流（UI 规范 V1.1 §5.1）
 *
 * 结构：问候 → 置顶指标 → 开始训练入口 → 今日训练结果 → 今日饮食 → 预约 →
 * 体重 → 饮水 → AI 教练 → 添加卡片。
 * 每张卡都是 src/components/home 下的独立组件，本页只负责「顺序 + 数据 + 跳转」。
 *
 * 训练面板（WorkoutSheet）在本页以 sheet 形式打开，不 push 页面栈；
 * 收起后训练状态留在 store，底栏上方浮出「训练进行中」胶囊。
 */
import type { DietShortcut, Reservation, WorkoutRow } from '@/api/home';
import type { TrainingPick } from '@/components/home/types';
import type { TabKey } from '@/layouts/tabs';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import HomeAddCard from '@/components/home/HomeAddCard.vue';
import HomeAiCoachCard from '@/components/home/HomeAiCoachCard.vue';
import HomeDietCard from '@/components/home/HomeDietCard.vue';
import HomeGreeting from '@/components/home/HomeGreeting.vue';
import HomeMetricCard from '@/components/home/HomeMetricCard.vue';
import HomePinnedMetrics from '@/components/home/HomePinnedMetrics.vue';
import HomeReservationCard from '@/components/home/HomeReservationCard.vue';
import HomeTrainingSheet from '@/components/home/HomeTrainingSheet.vue';
import HomeWorkoutEntry from '@/components/home/HomeWorkoutEntry.vue';
import HomeWorkoutResult from '@/components/home/HomeWorkoutResult.vue';
import AppTabBar from '@/components/layout/AppTabBar.vue';
import { now } from '@/composables/useNow';
import { navigateToTab } from '@/layouts/tabs';
import WorkoutSheet from '@/pages/workout/components/WorkoutSheet.vue';
import { useHomeStore } from '@/store/home';
import useWorkoutStore from '@/store/workout';
import { formatDuration } from '@/utils/time';
import { toast } from '@/utils/ui';
import { greetingWord, HOME_TOASTS, HOME_USER_NAME } from './config';

/** 7 项面板里跳页面的那三项 */
const ROUTES: Record<'body' | 'period' | 'ai', string> = {
  body: '/pages/body/index',
  period: '/pages/period/index',
  ai: '/pages/ai-coach/index',
};

const store = useHomeStore();
const { data, fabOpen } = storeToRefs(store);
const { openFab, closeFab, toggleFab } = store;

const workout = useWorkoutStore();
const workoutOpen = ref(false);

/** 时段问候（mock 阶段仍用真实时间，读起来更自然） */
const greeting = computed(() => `${greetingWord(new Date().getHours())}，${HOME_USER_NAME}`);

/** 「10 月 20 日 周二 · 减脂第 18 天」 */
const subLine = computed(() => `${data.value.dateText} · ${data.value.planText}`);

/** 胶囊上的训练时长：跟着全局心跳走，面板收起也不停 */
const pillTime = computed(() => formatDuration(workout.elapsedMs(now.value)));

const onTabChange = (key: TabKey) => navigateToTab(key);

function openWorkout() {
  workoutOpen.value = true;
}

function closeWorkout() {
  workoutOpen.value = false;
}

function onWorkoutSelect(row: WorkoutRow) {
  if (row.state === 'idle') {
    openFab();
    return;
  }
  toast(`${row.title}：训练详情待接入`);
}

/** 7 项面板：前四项开训练 sheet，球类占位，后三项跳页面 */
function onTrainingPick(key: TrainingPick) {
  closeFab();
  if (key === 'ball') {
    toast('球类训练即将开放');
    return;
  }
  if (key === 'strength' || key === 'cardio' || key === 'hiit') {
    workout.startNew(key);
    openWorkout();
    return;
  }
  uni.navigateTo({ url: ROUTES[key] });
}

function onDietShortcut(item: DietShortcut) {
  toast(`${item.label}：记录面板待接入`);
}

function onReservationCancel(item: Reservation) {
  toast(`已取消 ${item.time} 的预约`);
}
</script>

<style lang="scss" scoped>
@import './styles/home.scss';
</style>
