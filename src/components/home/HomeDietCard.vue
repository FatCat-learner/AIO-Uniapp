<template>
  <AppCard padding="none">
    <view class="diet__hd">
      <AppCardHeader :title="title">
        <template #right>
          <AppPill tone="diet" size="lg" icon="pencil" @tap="emit('custom')">
            {{ custom }}
          </AppPill>
        </template>
      </AppCardHeader>
    </view>

    <swiper class="diet__swiper" :current="page" :circular="false" @change="onChange">
      <swiper-item v-for="p in props.pages" :key="p.key">
        <!-- 页 1：还可吃 -->
        <view v-if="p.key === 'kcal'" class="pg1">
          <view class="pg1__top">
            <view class="pg1__l">
              <text class="pg1__l1">
                还可吃
              </text>
              <view class="pg1__vrow">
                <text class="pg1__v a-num">
                  {{ p.remain }}
                </text>
                <text class="pg1__u">
                  千卡
                </text>
              </view>
            </view>
            <view class="pg1__r">
              <view class="tile tile--diet">
                <text class="tile__v a-num">
                  {{ p.eaten }}
                </text>
                <text class="tile__l">
                  饮食
                </text>
              </view>
              <view class="tile tile--move">
                <text class="tile__v a-num">
                  {{ p.burned }}
                </text>
                <text class="tile__l">
                  运动×0.9
                </text>
              </view>
            </view>
          </view>
          <view class="bar">
            <view class="bar__in" :style="{ width: `${p.percent || 0}%` }" />
          </view>
        </view>

        <!-- 页 2：三大营养素 -->
        <view v-else-if="p.key === 'macro'" class="pg2">
          <view v-for="m in p.macro" :key="m.label" class="macro" :class="`macro--${m.tone}`">
            <text class="macro__l">
              {{ m.label }}
            </text>
            <view class="macro__vrow">
              <text class="macro__v a-num">
                {{ m.value }}
              </text>
              <text class="macro__d a-num">
                /{{ m.total }}
              </text>
            </view>
          </view>
        </view>

        <!-- 页 3：解锁（渐变描边） -->
        <view v-else class="lock">
          <view class="lock__in">
            <view class="lock__ic">
              <AppIcon name="shield-lock-outline" :size="18" />
            </view>
            <view class="lock__txt">
              <text class="lock__t">
                解锁 8 项营养素明细
              </text>
              <text class="lock__s">
                钠 / 钾 / 纤维 / 钙 等
              </text>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <view class="diet__dots">
      <view
        v-for="(p, i) in props.pages"
        :key="`dot-${p.key}`"
        class="dot"
        :class="{ 'dot--on': i === page }"
        @tap="page = i"
      />
    </view>

    <view class="diet__quick">
      <template v-for="s in props.shortcuts" :key="s.key">
        <view v-if="s.key === 'water'" class="quick__sep" />
        <view class="quick" hover-class="u-hover" :hover-stay-time="80" @tap="emit('shortcut', s)">
          <view class="quick__ic" :class="`quick__ic--${s.tone}`">
            <AppIcon :name="s.icon" :size="22" />
          </view>
          <text class="quick__l">
            {{ s.label }}
          </text>
        </view>
      </template>
    </view>

    <view class="diet__cta" hover-class="u-hover" :hover-stay-time="80" @tap="emit('photo')">
      <AppIcon name="camera-outline" :size="16" />
      <text>拍照识别</text>
    </view>
  </AppCard>
</template>

<script setup lang="ts">
import type { DietPage, DietShortcut } from '@mocks/types';
/**
 * HomeDietCard · 今日饮食卡（UI 规范 V1.1 §5.1 ④）
 * 卡头「今日饮食」+ 32 高橙色 tint 胶囊「自定义」；
 * 中部三页横滑（页1 还可吃 + 进度条 / 页2 三大营养素 / 页3 解锁渐变描边）+ 圆点；
 * 快捷行 6 个 48 圆图标（4 餐次 + 竖分隔线 + 饮水 + 体重）；
 * 底部 48 高 brand-50「拍照识别」。
 */
import { ref } from 'vue';
import AppCard from '@/components/base/AppCard.vue';
import AppCardHeader from '@/components/base/AppCardHeader.vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppPill from '@/components/base/AppPill.vue';

const props = defineProps<{
  title: string;
  /** 卡头胶囊文案，如「自定义」 */
  custom: string;
  pages: DietPage[];
  shortcuts: DietShortcut[];
}>();

const emit = defineEmits<{
  (e: 'custom'): void;
  (e: 'shortcut', item: DietShortcut): void;
  (e: 'photo'): void;
}>();

const page = ref(0);

function onChange(e: any) {
  page.value = e?.detail?.current ?? 0;
}
</script>

<style lang="scss" scoped>
.diet__hd {
  padding: var(--sp-5) var(--sp-5) var(--sp-3);
}

.diet__swiper {
  height: 112px;
}

/* ---------- 页 1 ---------- */
.pg1 {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: 0 var(--sp-5);
}

.pg1__top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--sp-3);
}

.pg1__l {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.pg1__l1 {
  font-size: 11px;
  line-height: 14px;
  color: var(--text-2);
}

.pg1__vrow {
  display: flex;
  align-items: baseline;
  gap: var(--sp-1);
}

.pg1__v {
  font-size: 28px;
  font-weight: 600;
  line-height: 32px;
  color: var(--text-1);
  letter-spacing: -0.01em;
}

.pg1__u {
  font-size: 11px;
  color: var(--text-3);
}

.pg1__r {
  display: flex;
  flex: none;
  gap: var(--sp-2);
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 64px;
  height: 56px;
  border-radius: var(--radius-md);
}

.tile--diet {
  background-color: var(--tint-diet);
}

.tile--diet .tile__v {
  color: var(--mod-diet);
}

.tile--move {
  background-color: var(--tint-neutral);
}

.tile--move .tile__v {
  color: var(--text-2);
}

.tile__v {
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
}

.tile__l {
  font-size: 10px;
  line-height: 13px;
  color: var(--text-2);
}

.bar {
  height: var(--progress-h);
  overflow: hidden;
  background-color: var(--line-strong);
  border-radius: var(--radius-full);
}

.bar__in {
  height: 100%;
  background-color: var(--brand-500);
  border-radius: var(--radius-full);
}

/* ---------- 页 2 ---------- */
.pg2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-2);
  padding: 0 var(--sp-5);
}

.macro {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--sp-1);
  padding: var(--sp-3);
  background-color: var(--surface-2);
  border-radius: var(--radius-md);
}

.macro--p {
  color: var(--nut-p);
}

.macro--c {
  color: var(--nut-c);
}

.macro--f {
  color: var(--nut-f);
}

.macro__l {
  font-size: 11px;
  line-height: 14px;
  color: var(--text-2);
}

.macro__vrow {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.macro__v {
  font-size: 18px;
  font-weight: 600;
  line-height: 22px;
}

.macro__d {
  font-size: 10px;
  color: var(--text-3);
}

/* ---------- 页 3 ---------- */
.lock {
  margin: 0 var(--sp-5);
  padding: 1px;
  background-image: var(--gradient-ai);
  border-radius: var(--radius-md);
}

.lock__in {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  height: 88px;
  padding: 0 var(--sp-4);
  background-color: var(--surface);
  border-radius: 15px;
}

.lock__ic {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--mod-social);
  background-color: var(--tint-social);
  border-radius: var(--radius-sm);
}

.lock__txt {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.lock__t {
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  color: var(--text-1);
}

.lock__s {
  font-size: 11px;
  line-height: 14px;
  color: var(--text-3);
}

/* ---------- 圆点 ---------- */
.diet__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: var(--sp-2) 0 var(--sp-3);
}

.dot {
  width: 5px;
  height: 5px;
  background-color: var(--line-strong);
  border-radius: var(--radius-full);
  transition: width 0.2s;
}

.dot--on {
  width: 14px;
  background-color: var(--brand-500);
}

/* ---------- 快捷行 ---------- */
.diet__quick {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 var(--sp-4);
}

.quick {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-1);
  width: 44px;
}

.quick__ic {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
}

.quick__ic--diet {
  color: var(--mod-diet);
  background-color: var(--tint-diet);
}

.quick__ic--social {
  color: var(--mod-social);
  background-color: var(--tint-social);
}

.quick__ic--body {
  color: var(--mod-body);
  background-color: var(--tint-body);
}

.quick__l {
  font-size: 10px;
  line-height: 13px;
  color: var(--text-2);
}

/* 4 餐次与「饮水 / 体重」之间的 1×24 竖分隔线 */
.quick__sep {
  flex: none;
  width: 1px;
  height: 24px;
  margin-top: 10px;
  background-color: var(--line);
}

/* ---------- 拍照识别 ---------- */
.diet__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-1);
  height: 48px;
  margin: var(--sp-4) var(--sp-4) var(--sp-4);
  font-size: 14px;
  font-weight: 600;
  color: var(--brand-500);
  background-color: var(--brand-50);
  border-radius: var(--radius-full);
}
</style>
