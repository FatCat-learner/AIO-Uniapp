<template>
  <view class="card" :class="{ 'is-on': selected }" hover-class="u-hover" @tap="emit('toggle', item)">
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

      <view v-if="selected" class="card__check">
        <AppIcon set="app" name="check" :size="12" color="var(--on-brand)" />
      </view>
    </view>

    <text class="card__name">{{ item.zh_name }}</text>

    <view class="card__btn" hover-class="u-hover" @tap.stop="emit('detail', item)">
      <text class="card__btn-text">查看动作要点</text>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * 选择动作 · 双列动作卡（可多选）
 * 点整卡 = 选中/取消；「查看动作要点」单独走详情。
 * 已按需求去掉「加入训练」按钮与「讲解」角标（角标只在详情页、且该动作有视频时才显示）。
 * 「N 次」角标：列表接口（ExerciseBrief）不返回 use_count，不编造数字。
 */
import type { IExerciseBrief } from '@/api/exercise/types';
import { ref } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';

defineProps<{ item: IExerciseBrief; selected: boolean }>();

const emit = defineEmits<{
  (e: 'toggle', item: IExerciseBrief): void;
  (e: 'detail', item: IExerciseBrief): void;
}>();

/** 缩略图 404 时退化成本地图标 */
const imgFailed = ref(false);
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-2);
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
}

.card.is-on {
  background-color: var(--brand-a10);
  border-color: var(--brand-500);
}

.card__shot {
  position: relative;
  width: 100%;
  /* 正方形：uni-image 的内联宽高不吃 aspect-ratio，必须给容器定 */
  aspect-ratio: 1 / 1;
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

.card__check {
  position: absolute;
  top: var(--sp-1);
  right: var(--sp-1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: var(--brand-500);
  border-radius: var(--radius-full);
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

.card__btn-text {
  font-size: var(--fs-xs);
  line-height: 1;
  color: var(--text-2);
}
</style>
