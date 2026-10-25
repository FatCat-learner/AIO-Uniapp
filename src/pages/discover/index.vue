<template>
  <view class="page" :style="accVars">
    <!-- ============ 顶部 tab：既是分区，也是搜索范围 ============ -->
    <DiscoverTabs :cat="cat" @select="switchCat" />

    <!-- ============ 搜索条（无品类选择器，范围由 tab 决定） ============ -->
    <DiscoverSearchBar
      :cat="cat"
      :query="query"
      :searching="searching"
      @update:query="query = $event"
      @clear="clearQuery"
      @scan="openScan"
    />

    <!-- ============ AI ============ -->
    <AiPanel
      v-if="cat === 'ai'"
      :query="query"
      :searching="searching"
      @clear="clearQuery"
      @ask="askOne"
      @scan="openScan"
      @toast="toast"
    />

    <!-- ============ 搜索结果（只在本 tab 内） ============ -->
    <SearchPanel
      v-else-if="searching"
      :cat="cat"
      :query="query"
      :groups="searchGroups"
      :cross-hits="crossHits"
      :is-fav="isFav"
      :row-meta="rowMeta"
      @open="openDetail"
      @ask="askAI"
      @jump-cat="jumpCat"
      @toggle-fav="toggleFav"
    />

    <!-- ============ 列表：左栏分堆 + 右侧索引 ============ -->
    <DiscoverList
      v-else
      :cat="cat"
      :rail="railItems"
      :rail-sel="railSel"
      :kids="kids"
      :chest-sub="chestSub"
      :sections="sections"
      :anchor="anchor"
      :active-group="activeGroup"
      :idx-tip="idxTip"
      :is-fav="isFav"
      :row-meta="rowMeta"
      @select-rail="selectRail"
      @select-kid="selectKid"
      @open="openDetail"
      @toggle-fav="toggleFav"
      @scroll="onScroll"
      @jump="jumpTo"
      @tip="showTip"
    />

    <AppTabBar active="discover" @change="onTabChange" />

    <!-- ============ 拍照识别 ============ -->
    <ScanSheet
      :open="scanOpen"
      :done="scanDone"
      :scanned="scanned"
      @close="closeScan"
      @retake="scanDone = false"
      @run="runScan"
      @add="addScanned"
    />
  </view>
</template>

<script setup lang="ts">
import type { CatKey, CrossHit, RailItem, Row, Sec } from './config';
import type { TabKey } from '@/layouts/tabs';
import AppTabBar from '@/components/layout/AppTabBar.vue';
import { navigateToTab } from '@/layouts/tabs';
import { useDiscoverStore } from '@/store/discover';
import { toast } from '@/utils/ui';
import AiPanel from './components/AiPanel.vue';
import DiscoverList from './components/DiscoverList.vue';
import DiscoverSearchBar from './components/DiscoverSearchBar.vue';
import DiscoverTabs from './components/DiscoverTabs.vue';
import ScanSheet from './components/ScanSheet.vue';
import SearchPanel from './components/SearchPanel.vue';
import { useSectionScroll } from './composables/useSectionScroll';
import { CATS, CHEST_SUBS, DIM } from './config';

const store = useDiscoverStore();

const cat = ref<CatKey>('action');
const query = ref('');
const railSel = ref('全部');
const chestSub = ref('');
const activeGroup = ref('');
const scanOpen = ref(false);
const scanDone = ref(false);

/** 收藏：key = `${cat}:${name}`，状态在 store/discover 里 */
const favKey = (n: string) => `${cat.value}:${n}`;
const isFav = (n: string) => store.isFav(favKey(n));

/* ============================ 派生 ============================ */

const curCat = computed(() => CATS.find(c => c.key === cat.value)!);
const searching = computed(() => query.value.trim().length > 0);
const accVars = computed(() => ({ '--acc': curCat.value.acc, '--acc-soft': curCat.value.soft }));

/** 当前品类的全量行 */
const rows = computed<Row[]>(() => {
  const c = store.catalog;
  if (cat.value === 'action') return c.actions as Row[];
  if (cat.value === 'food') return c.foods as Row[];
  if (cat.value === 'plan') return c.plans as Row[];
  if (cat.value === 'route') return c.routes as Row[];
  return [];
});

/** 左栏：收藏（有才显示）→ 全部 → 各分堆 */
const railItems = computed<RailItem[]>(() => {
  const list: RailItem[] = [];
  const hasFav = rows.value.some(r => isFav(r.n));
  if (hasFav) list.push({ key: '收藏', label: '收藏', star: true });
  list.push({ key: '全部', label: '全部' });
  const field = DIM[cat.value].rail as string;
  if (!field) return list;
  const vals = DIM[cat.value].railOrder.length
    ? DIM[cat.value].railOrder
    : (Array.from(new Set(rows.value.map(r => r[field]))) as string[]);
  vals.forEach((v) => {
    if (rows.value.some(r => r[field] === v)) list.push({ key: v, label: v, kids: cat.value === 'action' && v === '胸' });
  });
  return list;
});

/** 胸的二级（只在选中「胸」时出现） */
const kids = computed(() => (cat.value === 'action' && railSel.value === '胸' ? CHEST_SUBS : []));

/** 选中分堆 → 过滤 → 按 DIM.group 分组成分区 */
const sections = computed<Sec[]>(() => {
  const sel = railSel.value;
  const field = DIM[cat.value].rail as string;
  let list = rows.value as Row[];
  if (sel === '收藏') list = list.filter(r => isFav(r.n));
  else if (sel !== '全部' && field) list = list.filter(r => r[field] === sel);
  if (cat.value === 'action' && chestSub.value) list = list.filter(r => r.sub === chestSub.value);

  const groupField = DIM[cat.value].group;
  const out: Sec[] = [];
  const order = DIM[cat.value].order;

  if (cat.value === 'action') {
    const pinned = list.filter(r => r.pinned);
    if (pinned.length && sel !== '收藏') out.push({ key: '置顶', title: '置顶', short: '置', rows: pinned });
  }

  const keys = order.filter(k => k !== '置顶' && list.some(r => r[groupField] === k));
  keys.forEach((k) => {
    const rs = list.filter(r => r[groupField] === k && !(cat.value === 'action' && r.pinned && sel !== '收藏'));
    if (rs.length) out.push({ key: k, title: k, short: k.slice(0, 1), rows: rs });
  });
  return out;
});

/** 滚动 / 索引相关（measure 见 composable 内注释：不能加 .in(inst.proxy)） */
const { anchor, idxTip, measure, onScroll, jumpTo, showTip } = useSectionScroll(sections, activeGroup);

/** 搜索：只在本 tab 内 */
const searchGroups = computed<Sec[]>(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  const hit = (v?: string) => String(v || '').toLowerCase().includes(q);
  const list = rows.value.filter((r: Row) => {
    if (cat.value === 'action') return hit(r.n) || hit(r.target) || hit(r.equip) || hit(r.part);
    if (cat.value === 'food') return hit(r.n) || hit(r.cat) || hit(r.src);
    if (cat.value === 'plan') return hit(r.n) || hit(r.goal) || hit(r.g);
    return hit(r.n) || hit(r.region) || hit(r.sport);
  });
  return list.length ? [{ key: cat.value, title: curCat.value.label, short: '', rows: list }] : [];
});

/** 其它 tab 里能搜到的条数（空态里给「去 X 找」） */
const crossHits = computed<CrossHit[]>(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  const hit = (v?: string) => String(v || '').toLowerCase().includes(q);
  const out: CrossHit[] = [];
  const test: Record<string, (r: Row) => boolean> = {
    action: r => hit(r.n) || hit(r.target) || hit(r.equip),
    food: r => hit(r.n) || hit(r.cat),
    route: r => hit(r.n) || hit(r.region) || hit(r.sport),
    plan: r => hit(r.n) || hit(r.goal) || hit(r.g),
  };
  const c = store.catalog;
  const pools: Record<string, Row[]> = { action: c.actions, food: c.foods, plan: c.plans, route: c.routes };
  (['action', 'food', 'route', 'plan'] as CatKey[]).forEach((k) => {
    if (k === cat.value) return;
    const n = (pools[k] || []).filter(test[k]).length;
    if (n) out.push({ key: k, label: CATS.find(x => x.key === k)!.label, n });
  });
  return out;
});

/* ============================ 行为 ============================ */

const rowMeta = (r: Row) => {
  if (cat.value === 'action') return r.target;
  if (cat.value === 'food') return `碳${r.c} 蛋${r.p} 脂${r.f}`;
  if (cat.value === 'plan') return r.d;
  return r.d;
};

const switchCat = (k: CatKey) => {
  if (cat.value === k) return;
  cat.value = k;
  railSel.value = '全部';
  chestSub.value = '';
  activeGroup.value = '';
};

const selectRail = (it: { key: string }) => {
  railSel.value = it.key;
  chestSub.value = '';
  if (searching.value) query.value = '';
  nextTick(() => {
    activeGroup.value = '';
    measure();
  });
};

const selectKid = (k: string) => {
  chestSub.value = chestSub.value === k ? '' : k;
  nextTick(measure);
};

const clearQuery = () => {
  query.value = '';
  nextTick(measure);
};

/** 空态：问 AI —— 切到 AI tab 并把关键词带过去当提问 */
const askAI = () => {
  cat.value = 'ai';
  railSel.value = '全部';
  chestSub.value = '';
};

/** 空态：去别的 tab 接着搜 */
const jumpCat = (k: CatKey) => {
  cat.value = k;
  railSel.value = '全部';
  chestSub.value = '';
};

const askOne = (t: string) => {
  query.value = t;
  toast('AI 正在结合你的数据作答');
};

const toggleFav = (n: string) => {
  const k = favKey(n);
  store.toggleFav(k);
  toast(store.isFav(k) ? '已收藏' : '已取消收藏');
  // 收藏项变化会影响左栏，重新测量一次
  nextTick(measure);
};

const openDetail = (n: string) => {
  uni.navigateTo({ url: `/pages/discover/detail?cat=${cat.value}&name=${encodeURIComponent(n)}` }).catch(() => {
    toast(`「${n}」详情页开发中`);
  });
};

/* 拍照识别 */
const scanned = ref([
  { n: '米饭', kcal: 232 },
  { n: '红烧鸡腿', kcal: 286 },
  { n: '炒青菜', kcal: 78 },
]);

const openScan = () => {
  scanOpen.value = true;
  scanDone.value = false;
};
const closeScan = () => {
  scanOpen.value = false;
  scanDone.value = false;
};
const runScan = () => {
  setTimeout(() => (scanDone.value = true), 700);
  toast('识别中…');
};
const addScanned = () => {
  closeScan();
  toast('已加入今日饮食');
};

/* ============================ 生命周期 ============================ */

onMounted(() => nextTick(measure));
watch([cat, () => sections.value.length], () => nextTick(measure));
watch(cat, () => {
  // 切 tab 后回到顶部
  anchor.value = '';
  activeGroup.value = '';
});

/** Dock 切换（AppTabBar 只 emit，导航由页面负责） */
const onTabChange = (k: TabKey) => navigateToTab(k);
void (null as unknown as TabKey);
</script>
