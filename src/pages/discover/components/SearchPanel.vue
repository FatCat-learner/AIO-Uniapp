<template>
  <scroll-view scroll-y class="scroll">
    <view class="hint">
      在<text class="hint__b">
        {{ curCat.label }}
      </text>内搜索「{{ query.trim() }}」，切顶部 tab 换范围
    </view>

    <view v-for="g in groups" :key="g.key" class="grp">
      <view class="sec__hd">
        <text class="sec__t">
          {{ g.title }}
        </text>
        <text class="sec__n">
          {{ g.rows.length }} 条
        </text>
      </view>
      <view
        v-for="r in g.rows"
        :key="r.n"
        class="row"
        hover-class="u-hover"
        :hover-stay-time="60"
        @tap="emit('open', r.n)"
      >
        <view class="row__ic">
          <AppIcon :name="curCat.icon" :size="18" color="var(--acc)" />
        </view>
        <view class="row__txt">
          <text class="row__t">
            {{ r.n }}
          </text>
          <text class="row__m">
            {{ rowMeta(r) }}
          </text>
        </view>
        <text v-if="cat === 'action' && r.times" class="row__x">
          {{ r.times }} 次
        </text>
        <text v-else-if="cat === 'food'" class="row__kcal">
          {{ r.kcal }}<text class="row__u">
            kcal
          </text>
        </text>
        <view class="fav" :class="{ 'is-on': isFav(r.n) }" @tap.stop="emit('toggleFav', r.n)">
          <text class="fav__i">
            {{ isFav(r.n) ? '★' : '☆' }}
          </text>
        </view>
      </view>
    </view>

    <!-- 空结果：给两条出路 -->
    <view v-if="!groups.length" class="empty">
      <view class="empty__ic">
        <AppIcon name="magnify" :size="32" color="#4b5361" />
      </view>
      <text class="empty__t">
        在「{{ curCat.label }}」里没找到「{{ query.trim() }}」
      </text>
      <text class="empty__d">
        换个说法，或者让 AI 帮你找
      </text>
      <view class="empty__acts">
        <view class="act act--ai" hover-class="u-hover" @tap="emit('ask')">
          <AppIcon name="creation" :size="15" color="#0b0d12" />
          <text class="act__t">
            问 AI 试试
          </text>
        </view>
        <view
          v-for="h in crossHits"
          :key="h.key"
          class="act act--ghost"
          hover-class="u-hover"
          @tap="emit('jumpCat', h.key)"
        >
          <text class="act__t">
            去「{{ h.label }}」找 {{ h.n }} 条
          </text>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import type { CatKey, CrossHit, Row, Sec } from '@/pages/discover/config';
import { CATS } from '@/pages/discover/config';

const props = defineProps<{
  cat: CatKey;
  query: string;
  groups: Sec[];
  crossHits: CrossHit[];
  isFav: (n: string) => boolean;
  rowMeta: (r: Row) => string;
}>();

const emit = defineEmits<{
  (e: 'open', n: string): void;
  (e: 'ask'): void;
  (e: 'jumpCat', k: CatKey): void;
  (e: 'toggleFav', n: string): void;
}>();

const curCat = computed(() => CATS.find(c => c.key === props.cat)!);
</script>

<style lang="scss" scoped>
@import '../styles/rail.scss';
@import '../styles/list.scss';
@import '../styles/state.scss';
</style>
