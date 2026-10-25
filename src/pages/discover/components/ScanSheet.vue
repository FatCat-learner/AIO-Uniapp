<template>
  <view>
    <view v-if="open" class="mask" @tap="emit('close')" />
    <view v-if="open" class="sheet">
      <view class="sheet__grip" />
      <text class="sheet__t">
        {{ done ? '识别结果' : '拍照识别食物' }}
      </text>
      <text class="sheet__s">
        {{ done ? '已按 1 人份估算，可逐项确认' : '对准餐盘或营养表，AI 自动拆热量与营养素' }}
      </text>

      <view v-if="!done" class="frame" @tap="emit('run')">
        <AppIcon name="camera-outline" :size="30" color="#8f98a8" />
        <text class="frame__t">
          点击拍摄
        </text>
        <text class="frame__d">
          也可以从相册选一张
        </text>
      </view>

      <view v-else class="result">
        <view class="result__hd">
          <AppIcon name="check" :size="13" color="var(--ok)" />
          <text class="result__hd-t">
            识别到 3 项 · 已按 1 人份估算
          </text>
        </view>
        <view v-for="f in scanned" :key="f.n" class="result__row">
          <view class="row__ic row__ic--sm">
            <AppIcon name="food-apple-outline" :size="15" color="var(--acc)" />
          </view>
          <text class="result__n">
            {{ f.n }}
          </text>
          <text class="result__k">
            {{ f.kcal }}<text class="row__u">
              kcal
            </text>
          </text>
        </view>
      </view>

      <view class="sheet__btns">
        <view class="btn btn--ghost" hover-class="u-hover" @tap="done ? emit('retake') : emit('close')">
          <text>{{ done ? '重拍' : '相册' }}</text>
        </view>
        <view class="btn btn--main" hover-class="u-hover" @tap="done ? emit('add') : emit('run')">
          <text>{{ done ? '全部加入饮食' : '拍摄' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface IScannedItem {
  n: string;
  kcal: number;
}

defineProps<{
  open: boolean;
  done: boolean;
  scanned: IScannedItem[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'retake'): void;
  (e: 'run'): void;
  (e: 'add'): void;
}>();
</script>

<style lang="scss" scoped>
@import '../styles/sheet.scss';
@import '../styles/list.scss';
</style>
