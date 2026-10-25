<template>
  <view class="body">
    <scroll-view scroll-y class="rail">
      <template v-for="it in rail" :key="it.key">
        <view
          class="rail__i"
          :class="{ 'is-on': railSel === it.key }"
          hover-class="u-hover"
          :hover-stay-time="60"
          @tap="emit('selectRail', it)"
        >
          <text v-if="it.star" class="rail__s">
            ★
          </text>
          <text class="rail__t">
            {{ it.label }}
          </text>
        </view>

        <!-- 二级分堆：紧跟所属项（目前只有「胸」有上胸 / 中下胸） -->
        <view v-if="it.kids" class="kids">
          <view
            v-for="k in kids"
            :key="k"
            class="kid"
            :class="{ 'is-on': chestSub === k }"
            hover-class="u-hover"
            @tap="emit('selectKid', k)"
          >
            <view class="kid__dot" />
            <text>{{ k }}</text>
          </view>
        </view>
      </template>
    </scroll-view>

    <scroll-view
      scroll-y
      scroll-with-animation
      :scroll-into-view="anchor"
      class="main"
      @scroll="emit('scroll', $event)"
    >
      <view v-for="(s, i) in sections" :id="`sec-${i}`" :key="s.key" class="sec">
        <view class="sec__hd">
          <text class="sec__t">
            {{ s.title }}
          </text>
          <text class="sec__n">
            {{ s.rows.length }} 项
          </text>
        </view>

        <template v-for="r in s.rows" :key="r.n">
          <!-- 路书卡 -->
          <view
            v-if="cat === 'route'"
            class="card card--route"
            hover-class="u-hover"
            :hover-stay-time="60"
            @tap="emit('open', r.n)"
          >
            <view class="map">
              <svg class="map__svg" viewBox="0 0 300 110" preserveAspectRatio="none">
                <path
                  d="M-4 82 C 40 40, 78 96, 120 62 S 200 34, 240 58 S 292 40, 306 22"
                  fill="none"
                  stroke="var(--acc)"
                  stroke-width="2.4"
                  stroke-linecap="round"
                />
              </svg>
              <view class="map__badge">
                {{ r.dist }}
              </view>
              <view class="fav fav--abs" :class="{ 'is-on': isFav(r.n) }" @tap.stop="emit('toggleFav', r.n)">
                <text class="fav__i">
                  {{ isFav(r.n) ? '★' : '☆' }}
                </text>
              </view>
            </view>
            <view class="card__b">
              <text class="card__t">
                {{ r.n }}
              </text>
              <text class="card__m">
                {{ r.d }}
              </text>
            </view>
          </view>

          <!-- 计划卡 -->
          <view
            v-else-if="cat === 'plan'"
            class="card card--plan"
            hover-class="u-hover"
            :hover-stay-time="60"
            @tap="emit('open', r.n)"
          >
            <view class="card__b">
              <text class="card__t">
                {{ r.n }}
              </text>
              <text class="card__m">
                {{ r.d }}
              </text>
              <view class="tags">
                <text v-for="t in r.tags" :key="t" class="tag">
                  {{ t }}
                </text>
              </view>
            </view>
            <text class="card__own">
              {{ r.g }}
            </text>
            <view class="fav" :class="{ 'is-on': isFav(r.n) }" @tap.stop="emit('toggleFav', r.n)">
              <text class="fav__i">
                {{ isFav(r.n) ? '★' : '☆' }}
              </text>
            </view>
          </view>

          <!-- 动作 / 食物行 -->
          <view
            v-else
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
        </template>
      </view>
      <view class="tail">
        — 已经到底了 —
      </view>
    </scroll-view>

    <view v-if="sections.length > 1" class="idx">
      <view
        v-for="(s, i) in sections"
        :key="s.key"
        class="idx__i"
        :class="{ 'is-on': activeGroup === s.key }"
        @tap="emit('jump', i)"
        @longpress="emit('tip', s.title)"
      >
        <text>{{ s.short }}</text>
      </view>
    </view>
    <view v-if="idxTip" class="idx__tip">
      {{ idxTip }}
    </view>
  </view>
</template>

<script setup lang="ts">
import type { CatKey, RailItem, Row, Sec } from '@/pages/discover/config';
import { CATS } from '@/pages/discover/config';

const props = defineProps<{
  cat: CatKey;
  rail: RailItem[];
  railSel: string;
  kids: string[];
  chestSub: string;
  sections: Sec[];
  anchor: string;
  activeGroup: string;
  idxTip: string;
  isFav: (n: string) => boolean;
  rowMeta: (r: Row) => string;
}>();

const emit = defineEmits<{
  (e: 'selectRail', it: RailItem): void;
  (e: 'selectKid', k: string): void;
  (e: 'open', n: string): void;
  (e: 'toggleFav', n: string): void;
  (e: 'scroll', ev: any): void;
  (e: 'jump', i: number): void;
  (e: 'tip', t: string): void;
}>();

const curCat = computed(() => CATS.find(c => c.key === props.cat)!);
</script>

<style lang="scss" scoped>
@import '../styles/rail.scss';
@import '../styles/list.scss';
@import '../styles/card.scss';
@import '../styles/state.scss';
</style>
