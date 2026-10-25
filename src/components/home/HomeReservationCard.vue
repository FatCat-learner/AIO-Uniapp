<template>
  <AppCard dashed>
    <AppCardHeader :title="title" :link="action" chevron @action="emit('manage')" />
    <text class="rsv__hint">
      {{ hint }}
    </text>

    <view
      v-for="item in props.items"
      :key="item.id"
      class="rsv__row"
      hover-class="u-hover"
      :hover-stay-time="80"
      @tap="emit('select', item)"
      @longpress="onLongPress(item)"
    >
      <AppIconTile icon="calendar-blank-outline" tone="cardio" :size="40" />
      <view class="rsv__txt">
        <text class="rsv__t a-num">
          {{ item.time }}
        </text>
        <text class="rsv__m">
          {{ item.title }}
        </text>
      </view>
      <AppIcon class="rsv__chev" name="chevron-right" :size="14" />
    </view>
  </AppCard>

  <AppDialog
    :visible="pendingCancel !== null"
    tone="danger"
    icon="calendar-remove-outline"
    title="取消这次预约？"
    :message="pendingCancel ? `${pendingCancel.time} · ${pendingCancel.title}` : ''"
    confirm-text="取消预约"
    cancel-text="再想想"
    @update:visible="(v: boolean) => { if (!v) pendingCancel = null; }"
    @confirm="confirmCancel"
  />
</template>

<script setup lang="ts">
import type { Reservation } from '@mocks/types';
import { ref } from 'vue';
/**
 * HomeReservationCard · 预约卡（UI 规范 V1.1 §5.1 ⑤）
 * 「计划」语义的卡一律用 1px 虚线（#3F4653）与实体卡区分：
 * 卡头「预约」+ 右侧品牌色「预约安排 ›」，副行 11 灰「长按可取消预约」，64 高行。
 */
import AppCard from '@/components/base/AppCard.vue';
import AppCardHeader from '@/components/base/AppCardHeader.vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppIconTile from '@/components/base/AppIconTile.vue';
import AppDialog from '@/components/overlays/AppDialog.vue';

const props = defineProps<{
  title: string;
  /** 右侧链接文案，如「预约安排」 */
  action: string;
  /** 副行提示，如「长按可取消预约」 */
  hint: string;
  items: Reservation[];
}>();

const emit = defineEmits<{
  (e: 'manage'): void;
  (e: 'select', item: Reservation): void;
  (e: 'cancel', item: Reservation): void;
}>();

const pendingCancel = ref<Reservation | null>(null);

function onLongPress(item: Reservation) {
  pendingCancel.value = item;
}

function confirmCancel() {
  if (pendingCancel.value) emit('cancel', pendingCancel.value);
  pendingCancel.value = null;
}
</script>

<style lang="scss" scoped>
.rsv__hint {
  display: block;
  padding-top: 2px;
  font-size: 11px;
  line-height: 14px;
  color: var(--text-3);
}

.rsv__row {
  display: flex;
  gap: var(--sp-3);
  align-items: center;
  height: var(--row-h);
  margin-top: var(--sp-3);
  border-top: 1px solid var(--line);
}

.rsv__txt {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.rsv__t {
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  color: var(--text-1);
}

.rsv__m {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  line-height: 14px;
  color: var(--text-2);
  white-space: nowrap;
}

.rsv__chev {
  flex: none;
  color: var(--text-disabled);
}
</style>
