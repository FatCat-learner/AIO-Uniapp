<template>
  <AppSheet
    :visible="visible"
    height="screen"
    :closable="false"
    :mask-closable="false"
    :keyboard-aware="false"
    :z-index="120"
    @close="emit('close')"
  >
    <view class="wk">
      <WorkoutHeader
        :time-text="timeText"
        :paused="store.paused"
        :title="store.title"
        :count-text="countText"
        :volume-text="volumeText"
        @toggle="onToggle"
        @done="onDone"
        @rename="onStub('改标题')"
      />

      <scroll-view class="wk__sheet" scroll-y>
        <view class="wk__list">
          <view v-if="store.isEmpty" class="empty">
            <view class="empty__ico">
              <AppIcon name="dumbbell" set="app" :size="22" />
            </view>
            <text class="empty__t">还没有动作，点下面「加动作」开始</text>
            <text class="empty__s">从动作库挑一个，或直接用上次的训练</text>
            <view class="empty__chips">
              <button class="chip-s" @click="onStub('复制上次训练')">
                <text class="chip-s__b">↺</text>
                <text>复制上次训练</text>
              </button>
              <button class="chip-s" @click="onStub('从模板开始')">
                <text>从模板开始</text>
              </button>
            </view>
          </view>

          <WorkoutExercise
            v-for="item in store.exercises"
            :key="item.id"
            :item="item"
            @toggle-set="setId => onToggleSet(item.id, setId)"
            @update-set="(setId, patch) => store.updateSet(item.id, setId, patch)"
            @difficulty="value => store.setDifficulty(item.id, value)"
            @add-set="store.addSet(item.id)"
            @toggle-timed="store.toggleTimed(item.id)"
            @set-more="onStub('组操作')"
            @note="onStub('动作备注')"
            @options="onStub('动作设置')"
            @history="onStub('动作历史')"
          />
        </view>
      </scroll-view>

      <WorkoutBar
        @minimize="emit('close')"
        @add="onAddExercise"
        @note="onStub('写心得')"
        @settings="onStub('训练设置')"
      />

      <WorkoutTimer />
    </view>
  </AppSheet>
</template>

<script setup lang="ts">
/**
 * WorkoutSheet · 训练面板（设计稿 _design/previews/workout-flow 第 ①② 屏）
 *
 * 全站唯一的训练面板底座：首页「开始训练」和 /pages/workout 路由页都开它，
 * 外壳是 AppSheet（94vh、顶部圆角、可下拉收起）。收起来不销毁训练状态 ——
 * 草稿在 @/store/workout（持久化），计时状态机在 @/store/timer，
 * 心跳在 App 层（@/composables/useNow），所以面板关掉时间照走。
 *
 * 完成训练 / 改标题 / 写心得等要等后端 §6.11 写接口，先 toast 占位。
 */
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppSheet from '@/components/overlays/AppSheet.vue';
import { now } from '@/composables/useNow';
import useTimerStore from '@/store/timer';
import useWorkoutStore from '@/store/workout';
import { formatDuration } from '@/utils/time';
import WorkoutBar from './WorkoutBar.vue';
import WorkoutExercise from './WorkoutExercise.vue';
import WorkoutHeader from './WorkoutHeader.vue';
import WorkoutTimer from './WorkoutTimer.vue';

const props = withDefaults(
  defineProps<{
    visible: boolean;
    /** 是否自己拦系统返回键（首页开 sheet 必须拦；/pages/workout 自带一层历史，传 false） */
    backGuard?: boolean;
  }>(),
  { backGuard: true },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

/** 打完一组默认歇多久（设计稿 ④ 训练设置「统一休息时间 90 秒」） */
const REST_SECONDS = 90;

const store = useWorkoutStore();
const timer = useTimerStore();

const elapsed = computed(() => store.elapsedMs(now.value));

const timeText = computed(() => formatDuration(elapsed.value));

/** 「2 组 · 1 动作」 */
const countText = computed(() => `${store.setCount} 组 · ${store.exerciseCount} 动作`);

/** 「容量 1.9t」：不到 1 吨直接读 kg，免得一直 0.4t */
const volumeText = computed(() => {
  if (!store.volume) return '容量 0.0';
  return store.volume >= 1000
    ? `容量 ${(store.volume / 1000).toFixed(1)}t`
    : `容量 ${store.volume}kg`;
});

/** 播放 / 暂停：第一次点才开始计时 */
function onToggle() {
  store.togglePause();
}

/** 完成训练：要等后端写接口，先别让用户以为存上了 */
function onDone() {
  if (store.isEmpty) {
    uni.showToast({ title: '先加个动作', icon: 'none' });
    return;
  }
  onStub('完成训练');
}

/** 组行打勾：变成已完成就自动起休息计时（⑦ 屏） */
function onToggleSet(exerciseId: string, setId: string) {
  const item = store.exercises.find(ex => ex.id === exerciseId);
  if (!item) return;
  const index = item.sets.findIndex(row => row.id === setId);
  store.toggleSet(exerciseId, setId);
  const row = item.sets.find(set => set.id === setId);
  if (!row?.done) return;
  timer.startRest(REST_SECONDS, {
    exerciseId,
    exerciseName: item.exercise.zh_name,
    setIndex: index + 1,
    setTotal: item.sets.length,
  });
}

function onAddExercise() {
  uni.navigateTo({ url: '/pages/workout-picker/index' });
}

/** 本期只做点击态的按钮统一走这里 */
function onStub(name: string) {
  uni.showToast({ title: `${name} 稍后开放`, icon: 'none' });
}

// #ifdef H5
/**
 * 返回键拦截（仅 H5）
 *
 * 打开时 pushState 埋一层，用户按返回先 popstate → 只关 sheet；UI 关闭时
 * 再把埋的那层 back() 掉，避免每开一次面板就多压一层历史。
 * 小程序没有 uni.onBackPress（那是 App 端 API），退化成底栏按钮关闭。
 */
let guardPushed = false;

function pushGuard() {
  if (guardPushed) return;
  history.pushState({ __workoutSheet: true }, '');
  guardPushed = true;
}

function dropGuard() {
  if (!guardPushed) return;
  guardPushed = false;
  history.back();
}

function onPopState() {
  // 自己 back() 清栈时 guardPushed 已置 false，这里只接用户真的按了返回
  if (!guardPushed) return;
  guardPushed = false;
  emit('close');
}

onMounted(() => {
  window.addEventListener('popstate', onPopState);
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', onPopState);
  if (guardPushed) {
    guardPushed = false;
    history.back();
  }
});

watch(
  () => props.visible,
  (open) => {
    if (open && props.backGuard) pushGuard();
    if (!open) dropGuard();
  },
  { immediate: true },
);
// #endif
</script>

<style lang="scss" scoped>
@import '../styles/workout.scss';
</style>
