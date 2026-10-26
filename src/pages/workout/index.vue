<template>
  <view class="page wk">
    <view class="wk__status" />

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
          @toggle-set="setId => store.toggleSet(item.id, setId)"
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
      @minimize="onMinimize"
      @add="onAddExercise"
      @note="onStub('写心得')"
      @settings="onStub('训练设置')"
    />
  </view>
</template>

<script setup lang="ts">
/**
 * 训练页（workout）· 设计稿 _design/previews/workout-flow 第 ①② 屏
 *
 * 页面只做编排：数据全在 @/store/workout（草稿，持久化），
 * 计时这里只负责「每秒把 now 推一下」，真正的 prepare/rest 状态机留给 store/timer。
 *
 * 本轮范围：空态、动作卡、组行、底栏四项。完成训练 / 改标题 / 写心得
 * 等要等后端 §6.11 的写接口，先统一 toast 占位。
 */
import { computed, onMounted, onUnmounted, ref } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';
import useWorkoutStore from '@/store/workout';
import WorkoutBar from './components/WorkoutBar.vue';
import WorkoutExercise from './components/WorkoutExercise.vue';
import WorkoutHeader from './components/WorkoutHeader.vue';

const store = useWorkoutStore();

/** 每秒推一下，elapsed 才有得算（真正的计时状态机在 store/timer，这里只是心跳） */
const now = ref(Date.now());
let ticker: ReturnType<typeof setInterval> | undefined;

/** 已训练时长：起点 startedAt，扣掉累计暂停 */
const elapsed = computed(() => {
  if (!store.startedAt) return 0;
  const end = store.paused ? store.pausedAt : now.value;
  return Math.max(0, end - store.startedAt - store.pausedMs);
});

/** 不足 1 小时用 mm:ss，超了才升到 h:mm:ss */
function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

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

function onAddExercise() {
  uni.navigateTo({ url: '/pages/workout-picker/index' });
}

/** 最小化：回首页，悬浮胶囊还在（胶囊读同一个 store） */
function onMinimize() {
  uni.navigateBack();
}

/** 本期只做点击态的按钮统一走这里 */
function onStub(name: string) {
  uni.showToast({ title: `${name} 稍后开放`, icon: 'none' });
}

onMounted(() => {
  ticker = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  if (ticker) clearInterval(ticker);
  ticker = undefined;
});
</script>

<style lang="scss" scoped>
@import './styles/workout.scss';
</style>
