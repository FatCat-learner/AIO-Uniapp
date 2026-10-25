<template>
  <view class="card">
    <text class="card__badge">讲解</text>

    <view class="card__shot">
      <image
        v-if="!imgFailed"
        class="card__img"
        :src="item.thumb"
        mode="aspectFit"
        @error="imgFailed = true"
      />
      <view v-else class="card__ph">
        <AppIcon set="app" name="dumbbell" :size="22" color="var(--text-4)" />
      </view>
    </view>

    <text class="card__name">{{ item.zh_name }}</text>

    <view class="card__btn card__btn--add" hover-class="u-hover" @tap="emit('add', item)">
      <text class="card__btn-text card__btn-text--add">加入训练</text>
    </view>
    <view class="card__btn" hover-class="u-hover" @tap="emit('detail', item)">
      <text class="card__btn-text">查看动作要点</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 双列动作卡
 * 左上「讲解」角标 + 缩略图 + 名称 + 主/次两个按钮。
 * 「N 次」角标已省略：列表接口（ExerciseBrief）不返回 use_count，不编造数字。
 */
import type { IExerciseBrief } from '@/api/exercise/types';
import { ref } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';

defineProps<{ item: IExerciseBrief }>();

const emit = defineEmits<{
  (e: 'add', item: IExerciseBrief): void;
  (e: 'detail', item: IExerciseBrief): void;
}>();

/** 缩略图 404 时退化成本地图标 */
const imgFailed = ref(false);
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-2);
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.card__badge {
  position: absolute;
  top: var(--sp-2);
  left: var(--sp-2);
  z-index: 1;
  display: flex;
  align-items: center;
  height: 18px;
  padding: 0 var(--sp-1);
  font-size: var(--fs-3xs);
  font-weight: 600;
  line-height: 1;
  color: var(--on-brand);
  background-color: var(--brand-500);
  border-radius: var(--radius-xs);
}

.card__shot {
  position: relative;
  width: 100%;
  /* 图片框定高比：uni-image 的内联宽高不吃 aspect-ratio，必须给容器定 */
  aspect-ratio: 4 / 3;
  margin-top: var(--sp-2);
  overflow: hidden;
  background-color: var(--fill);
  border-radius: var(--radius-xs);
}

.card__img,
.card__ph {
  width: 100%;
  height: 100%;
}

.card__ph {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__name {
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: var(--lh-snug);
  color: var(--text-1);
  text-align: center;
}

.card__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  background-color: var(--fill);
  border-radius: var(--radius-full);
}

.card__btn--add {
  background-color: var(--brand-500);
}

.card__btn-text {
  font-size: var(--fs-xs);
  line-height: 1;
  color: var(--text-2);
}

.card__btn-text--add {
  font-weight: 600;
  color: var(--on-brand);
}
</style>
