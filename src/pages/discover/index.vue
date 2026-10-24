<template>
  <view class="page" :style="accVars">
    <!-- ============ 顶部 tab：既是分区，也是搜索范围 ============ -->
    <view class="tabs">
      <view
        v-for="c in CATS"
        :key="c.key"
        class="tab"
        :class="{ 'is-on': cat === c.key }"
        hover-class="tab--hover"
        :hover-stay-time="60"
        @tap="switchCat(c.key)"
      >
        <text class="tab__t">
          {{ c.label }}
        </text>
        <view class="tab__bar" />
      </view>
    </view>

    <!-- ============ 搜索条（无品类选择器，范围由 tab 决定） ============ -->
    <view class="bar-wrap">
      <view class="bar">
        <AppIcon name="magnify" :size="18" color="#8f98a8" />
        <input
          v-model="query"
          class="bar__in"
          :placeholder="curCat.ph"
          placeholder-style="color:#8f98a8;font-size:14px;"
          confirm-type="search"
        >
        <view v-if="searching" class="bar__x" hover-class="u-hover" @tap="clearQuery">
          <AppIcon name="close-circle" :size="16" color="#8f98a8" />
        </view>
        <view v-if="curCat.cam" class="bar__cam" hover-class="u-hover" @tap="openScan">
          <AppIcon name="camera-outline" :size="18" color="var(--acc)" />
        </view>
      </view>
    </view>

    <!-- ============ AI ============ -->
    <scroll-view v-if="cat === 'ai'" scroll-y class="scroll">
      <view v-if="searching" class="carry">
        <text class="carry__t">
          正在用 AI 搜索「{{ query.trim() }}」
        </text>
        <text class="carry__x" @tap="clearQuery">
          清除
        </text>
      </view>

      <view class="hero">
        <view class="hero__hd">
          <view class="hero__ic">
            <AppIcon name="creation" :size="16" color="#0b0d12" />
          </view>
          <text class="hero__t">
            AI 教练
          </text>
          <view class="hero__live">
            <view class="dot" />
            <text>已接入今日数据</text>
          </view>
        </view>
        <text class="hero__d">
          说说目标，我直接产出可执行的计划；拍一张餐盘，我拆成热量和三大营养素。
        </text>
        <view class="hero__acts">
          <view class="pill" hover-class="u-hover" @tap="toast('让 AI 按你的目标排计划')">
            <AppIcon name="calendar-blank-outline" :size="14" color="#c9d2e0" />
            <text class="pill__t">
              生成 4 周计划
            </text>
          </view>
          <view class="pill" hover-class="u-hover" @tap="openScan">
            <AppIcon name="camera-outline" :size="14" color="#c9d2e0" />
            <text class="pill__t">
              识别这张照片
            </text>
          </view>
          <view class="pill" hover-class="u-hover" @tap="toast('让 AI 分析今日饮食')">
            <AppIcon name="chart-box-outline" :size="14" color="#c9d2e0" />
            <text class="pill__t">
              分析今日饮食
            </text>
          </view>
        </view>
      </view>

      <view class="sec__hd">
        <text class="sec__t">
          你可以这样问
        </text>
        <text class="sec__more">
          看全部
        </text>
      </view>
      <view
        v-for="a in ASKS"
        :key="a.title"
        class="ask"
        hover-class="u-hover"
        :hover-stay-time="60"
        @tap="askOne(a.title)"
      >
        <view class="ask__ic">
          <AppIcon name="creation" :size="15" color="var(--acc)" />
        </view>
        <view class="ask__txt">
          <text class="ask__t">
            {{ a.title }}
          </text>
          <text class="ask__d">
            {{ a.desc }}
          </text>
        </view>
        <AppIcon name="chevron-right" :size="16" color="#6b7280" />
      </view>

      <view class="sec__hd">
        <text class="sec__t">
          健康小知识
        </text>
        <text class="sec__more">
          全部
        </text>
      </view>
      <view class="tips">
        <view v-for="t in TIPS" :key="t.title" class="tip">
          <view class="tip__ic">
            <AppIcon :name="t.icon" :size="16" color="var(--acc)" />
          </view>
          <text class="tip__t">
            {{ t.title }}
          </text>
          <text class="tip__d">
            {{ t.desc }}
          </text>
        </view>
      </view>
    </scroll-view>

    <!-- ============ 搜索结果（只在本 tab 内） ============ -->
    <scroll-view v-else-if="searching" scroll-y class="scroll">
      <view class="hint">
        在<text class="hint__b">
          {{ curCat.label }}
        </text>内搜索「{{ query.trim() }}」，切顶部 tab 换范围
      </view>

      <view v-for="g in searchGroups" :key="g.key" class="grp">
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
          @tap="openDetail(r.n)"
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
          <view class="fav" :class="{ 'is-on': isFav(r.n) }" @tap.stop="toggleFav(r.n)">
            <text class="fav__i">
              {{ isFav(r.n) ? '★' : '☆' }}
            </text>
          </view>
        </view>
      </view>

      <!-- 空结果：给两条出路 -->
      <view v-if="!searchGroups.length" class="empty">
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
          <view class="act act--ai" hover-class="u-hover" @tap="askAI">
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
            @tap="jumpCat(h.key)"
          >
            <text class="act__t">
              去「{{ h.label }}」找 {{ h.n }} 条
            </text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- ============ 列表：左栏分堆 + 右侧索引 ============ -->
    <view v-else class="body">
      <scroll-view scroll-y class="rail">
        <template v-for="it in railItems" :key="it.key">
          <view
            class="rail__i"
            :class="{ 'is-on': railSel === it.key }"
            hover-class="u-hover"
            :hover-stay-time="60"
            @tap="selectRail(it)"
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
              @tap="selectKid(k)"
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
        @scroll="onScroll"
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
              @tap="openDetail(r.n)"
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
                <view class="fav fav--abs" :class="{ 'is-on': isFav(r.n) }" @tap.stop="toggleFav(r.n)">
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
              @tap="openDetail(r.n)"
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
              <view class="fav" :class="{ 'is-on': isFav(r.n) }" @tap.stop="toggleFav(r.n)">
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
              @tap="openDetail(r.n)"
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
              <view class="fav" :class="{ 'is-on': isFav(r.n) }" @tap.stop="toggleFav(r.n)">
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
          @tap="jumpTo(i)"
          @longpress="showTip(s.title)"
        >
          <text>{{ s.short }}</text>
        </view>
      </view>
      <view v-if="idxTip" class="idx__tip">
        {{ idxTip }}
      </view>
    </view>

    <AppTabBar active="discover" @change="onTabChange" />

    <!-- ============ 拍照识别 ============ -->
    <view v-if="scanOpen" class="mask" @tap="closeScan" />
    <view v-if="scanOpen" class="sheet">
      <view class="sheet__grip" />
      <text class="sheet__t">
        {{ scanDone ? '识别结果' : '拍照识别食物' }}
      </text>
      <text class="sheet__s">
        {{ scanDone ? '已按 1 人份估算，可逐项确认' : '对准餐盘或营养表，AI 自动拆热量与营养素' }}
      </text>

      <view v-if="!scanDone" class="frame" @tap="runScan">
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
        <view class="btn btn--ghost" hover-class="u-hover" @tap="scanDone ? (scanDone = false) : closeScan()">
          <text>{{ scanDone ? '重拍' : '相册' }}</text>
        </view>
        <view class="btn btn--main" hover-class="u-hover" @tap="scanDone ? addScanned() : runScan()">
          <text>{{ scanDone ? '全部加入饮食' : '拍摄' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { TabKey } from '@/layouts/tabs';
import { ACTIONS, FOODS, PLANS, ROUTES } from '@mocks/data/catalog';
import { computed, getCurrentInstance, nextTick, onMounted, reactive, ref, watch } from 'vue';
import AppIcon from '@/components/base/AppIcon.vue';
import AppTabBar from '@/components/layout/AppTabBar.vue';
import { navigateToTab } from '@/layouts/tabs';

/* ============================ 品类 ============================ */

type CatKey = 'action' | 'food' | 'plan' | 'route' | 'ai';

interface CatDef {
  key: CatKey;
  label: string;
  icon: string;
  ph: string;
  acc: string;
  soft: string;
  cam: boolean;
}

const CATS: CatDef[] = [
  { key: 'action', label: '动作', icon: 'dumbbell', ph: '搜索动作、器械或肌群', acc: 'var(--brand-500)', soft: 'var(--brand-50)', cam: false },
  { key: 'food', label: '食物', icon: 'food-apple-outline', ph: '搜索食物、品牌或扫码', acc: 'var(--mod-diet)', soft: 'rgba(249,115,22,.12)', cam: true },
  { key: 'route', label: '路书', icon: 'map-marker-path', ph: '搜索路书、城市或距离', acc: 'var(--mod-social)', soft: 'rgba(6,182,212,.12)', cam: false },
  { key: 'plan', label: '计划', icon: 'calendar-blank-outline', ph: '搜索计划、目标或周期', acc: 'var(--brand-500)', soft: 'var(--brand-50)', cam: false },
  { key: 'ai', label: 'AI', icon: 'creation', ph: '问 AI：帮我排个减脂周计划', acc: 'var(--brand-500)', soft: 'var(--brand-50)', cam: true },
];

/** 种子数据统一在 mocks/data/catalog.ts（页面与 mock 接口共用同一份） */

const TIPS = [
  { icon: 'water-outline', title: '补水决定恢复', desc: '练后 500 ml，分两次喝完。' },
  { icon: 'food-apple-outline', title: '蛋白质时机', desc: '训练后 2 小时内吃够 30 g。' },
];

const ASKS = [
  { title: '我这周练得怎么样？', desc: '结合 4 次训练容量与强度给结论' },
  { title: '深蹲卡在 100 kg 怎么办？', desc: '按你的历史组次给加练方案' },
  { title: '晚饭还差多少蛋白？', desc: '按今天已吃和 185 g 目标算' },
];

/* ============================ 分堆维度 ============================ */

/** 每个品类：左栏分堆用的字段 + 组内分组的字段 + 固定顺序 */
/** 动作部位固定顺序（含胸的二级） */
const PARTS = ['胸', '背', '腿', '肩', '前锯肌', '斜方肌', '二头', '三头', '小腿', '前臂', '颈部', '臀部', '核心'];

interface Dim {
  rail: string;
  group: string;
  /** 组内分组的固定顺序 */
  order: string[];
  /** 左栏分堆的固定顺序（空 = 按数据出现顺序） */
  railOrder: string[];
}

const DIM: Record<CatKey, Dim> = {
  action: { rail: 'part', group: 'equip', order: ['置顶', '杠铃', '哑铃', '壶铃', '绳索', '器械', '自重'], railOrder: PARTS },
  food: { rail: 'src', group: 'cat', order: ['主食', '肉蛋奶', '蔬果', '豆类坚果'], railOrder: ['常见', '自定义', '已购', '我的'] },
  plan: { rail: 'g', group: 'goal', order: ['增肌', '减脂', '力量', '有氧'], railOrder: ['我的', '推荐', '收藏', '社区'] },
  route: { rail: 'region', group: 'sport', order: ['骑行', '跑步', '徒步'], railOrder: ['全球', '全国', '福建', '广东', '四川'] },
  ai: { rail: '', group: '', order: [], railOrder: [] },
};

/** 动作部位固定顺序（含胸的二级） */
const CHEST_SUBS = ['上胸', '中下胸'];

/* ============================ 状态 ============================ */

const inst = getCurrentInstance();
const cat = ref<CatKey>('action');
const query = ref('');
const railSel = ref('全部');
const chestSub = ref('');
const activeGroup = ref('');
const anchor = ref('');
const idxTip = ref('');
const scanOpen = ref(false);
const scanDone = ref(false);

let anchorTimer: any = null;
let tipTimer: any = null;

/** 收藏：key = `${cat}:${name}`，替换为接口后走 /api/favorites */
const favs = reactive<Record<string, boolean>>({
  'action:杠铃卧推': true,
  'action:深蹲': true,
  'action:引体向上': true,
  'food:米饭': true,
  'food:鸡胸肉': true,
  'plan:推拉腿 · 上肢增肌': true,
  'plan:减脂启动 · 4 周': true,
  'route:阿姆斯特丹运河环线': true,
  'route:五缘湾晨跑': true,
});
const favKey = (n: string) => `${cat.value}:${n}`;
const isFav = (n: string) => !!favs[favKey(n)];

/* ============================ 派生 ============================ */

const curCat = computed(() => CATS.find(c => c.key === cat.value)!);
const searching = computed(() => query.value.trim().length > 0);
const accVars = computed(() => ({ '--acc': curCat.value.acc, '--acc-soft': curCat.value.soft }));

/** 当前品类的全量行 */
const rows = computed<any[]>(() => {
  if (cat.value === 'action') return ACTIONS;
  if (cat.value === 'food') return FOODS;
  if (cat.value === 'plan') return PLANS;
  if (cat.value === 'route') return ROUTES;
  return [];
});

/** 左栏：收藏（有才显示）→ 全部 → 各分堆 */
const railItems = computed(() => {
  const list: { key: string; label: string; star?: boolean; kids?: boolean }[] = [];
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

interface Sec { key: string; title: string; short: string; rows: any[] }

/** 选中分堆 → 过滤 → 按 DIM.group 分组成分区 */
const sections = computed<Sec[]>(() => {
  const sel = railSel.value;
  const field = DIM[cat.value].rail as string;
  let list = rows.value as any[];
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

/** 搜索：只在本 tab 内 */
const searchGroups = computed<Sec[]>(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  const hit = (v?: string) => String(v || '').toLowerCase().includes(q);
  const list = rows.value.filter((r: any) => {
    if (cat.value === 'action') return hit(r.n) || hit(r.target) || hit(r.equip) || hit(r.part);
    if (cat.value === 'food') return hit(r.n) || hit(r.cat) || hit(r.src);
    if (cat.value === 'plan') return hit(r.n) || hit(r.goal) || hit(r.g);
    return hit(r.n) || hit(r.region) || hit(r.sport);
  });
  return list.length ? [{ key: cat.value, title: curCat.value.label, short: '', rows: list }] : [];
});

/** 其它 tab 里能搜到的条数（空态里给「去 X 找」） */
const crossHits = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return [];
  const hit = (v?: string) => String(v || '').toLowerCase().includes(q);
  const out: { key: CatKey; label: string; n: number }[] = [];
  const test: Record<string, (r: any) => boolean> = {
    action: r => hit(r.n) || hit(r.target) || hit(r.equip),
    food: r => hit(r.n) || hit(r.cat),
    route: r => hit(r.n) || hit(r.region) || hit(r.sport),
    plan: r => hit(r.n) || hit(r.goal) || hit(r.g),
  };
  const pools: Record<string, any[]> = { action: ACTIONS, food: FOODS, plan: PLANS, route: ROUTES };
  (['action', 'food', 'route', 'plan'] as CatKey[]).forEach((k) => {
    if (k === cat.value) return;
    const n = (pools[k] || []).filter(test[k]).length;
    if (n) out.push({ key: k, label: CATS.find(c => c.key === k)!.label, n });
  });
  return out;
});

/* ============================ 行为 ============================ */

/* 滚动：反查当前分区 → 高亮索引 */
const secTops = ref<number[]>([]);

const measure = () => {
  const q = uni.createSelectorQuery().in(inst?.proxy as any);
  q.selectAll('.sec').boundingClientRect();
  q.select('.main').boundingClientRect();
  q.exec((res: any[]) => {
    const [secs, main] = res || [];
    if (!secs || !main) return;
    secTops.value = secs.map((r: any) => r.top - main.top);
  });
};

const onScroll = (e: any) => {
  const top = (e?.detail?.scrollTop || 0) + 46;
  let cur = '';
  secTops.value.forEach((t, i) => {
    if (t <= top) cur = sections.value[i]?.key || cur;
  });
  if (cur && cur !== activeGroup.value) activeGroup.value = cur;
};

const toast = (t: string) => uni.showToast({ title: t, icon: 'none' });

const rowMeta = (r: any) => {
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
  if (favs[k]) delete favs[k];
  else favs[k] = true;
  toast(favs[k] ? '已收藏' : '已取消收藏');
  // 收藏项变化会影响左栏，重新测量一次
  nextTick(measure);
};

const openDetail = (n: string) => {
  uni.navigateTo({ url: `/pages/discover/detail?cat=${cat.value}&name=${encodeURIComponent(n)}` }).catch(() => {
    toast(`「${n}」详情页开发中`);
  });
};

const jumpTo = (i: number) => {
  const s = sections.value[i];
  if (!s) return;
  activeGroup.value = s.key;
  anchor.value = '';
  nextTick(() => {
    anchor.value = `sec-${i}`;
    if (anchorTimer) clearTimeout(anchorTimer);
    anchorTimer = setTimeout(() => (anchor.value = ''), 350);
  });
};

const showTip = (t: string) => {
  idxTip.value = t;
  if (tipTimer) clearTimeout(tipTimer);
  tipTimer = setTimeout(() => (idxTip.value = ''), 900);
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

<style lang="scss" scoped>
/* ---------- 顶部 tab ---------- */
.tabs {
  display: flex;
  align-items: flex-end;
  gap: 22px;
  padding: 24px 16px 0;
  flex: none;
}
.tab {
  position: relative;
  padding-bottom: 9px;
}
.tab--hover {
  opacity: 0.6;
}
.tab__t {
  font-size: 15px;
  color: var(--text-2);
}
.tab.is-on .tab__t {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-1);
}
.tab__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  border-radius: 3px;
  background-color: transparent;
}
.tab.is-on .tab__bar {
  background-color: var(--brand-500);
}

/* ---------- 搜索条 ---------- */
.bar-wrap {
  padding: 14px 16px;
  flex: none;
}
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 12px;
  border-radius: var(--radius-full);
  background-color: var(--surface-2);
  border: 1px solid var(--line);
}
.bar__in {
  flex: 1;
  height: 44px;
  font-size: 14px;
  color: var(--text-1);
}
.bar__x {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bar__cam {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--acc-soft);
}
.u-hover {
  opacity: 0.65;
}

/* ---------- 滚动区 ---------- */
.scroll {
  flex: 1;
  min-height: 0;
  padding: 0 16px 96px;
  box-sizing: border-box;
}
.hint {
  padding: 12px 0 6px;
  font-size: 11px;
  color: var(--text-2);
}
.hint__b {
  color: var(--text-1);
  font-weight: 600;
}

/* ---------- 主体：左栏 + 列表 + 索引 ---------- */
.body {
  flex: 1;
  min-height: 0;
  display: flex;
}
.rail {
  width: 72px;
  flex: none;
  background-color: #12151c;
  // border-right: 1px solid var(--line);
  border-top-right-radius: var(--radius-lg);
}
.rail__i {
  position: relative;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.rail__i.is-on {
  background-color: var(--surface-2);
}
.rail__i.is-on::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0px;
  width: 3px;
  height: 48px;
  border-radius: 0 3px 3px 0;
  background-color: var(--acc);
}
.rail__t {
  font-size: 13px;
  color: var(--text-2);
}
.rail__i.is-on .rail__t {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-1);
}
.rail__s {
  font-size: 10px;
  color: var(--acc);
}
.kids {
  background-color: var(--surface-2);
}
.kid {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding-left: 16px;
}
.kid text {
  font-size: 12px;
  color: var(--text-2);
}
.kid.is-on text {
  color: var(--text-1);
  font-weight: 600;
}
.kid__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: transparent;
}
.kid.is-on .kid__dot {
  background-color: var(--acc);
}

.main {
  flex: 1;
  min-width: 0;
  padding: 0 22px 96px 12px;
  box-sizing: border-box;
}
.sec__hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0 8px;
}
.sec__t {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-1);
}
.sec__n {
  font-size: 11px;
  color: var(--text-2);
}
.sec__more {
  font-size: 11px;
  color: var(--acc);
}
.tail {
  padding: 18px 0 10px;
  text-align: center;
  font-size: 11px;
  color: var(--text-3);
}

/* ---------- 行 ---------- */
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 6px 9px;
  margin-bottom: 8px;
  border-radius: var(--radius-md);
  background-color: var(--surface);
  border: 1px solid var(--line);
}
.row__ic {
  width: 34px;
  height: 34px;
  flex: none;
  border-radius: var(--radius-sm);
  background-color: var(--acc-soft);
  display: flex;
  align-items: center;
  justify-content: center;
}
.row__ic--sm {
  width: 28px;
  height: 28px;
}
.row__txt {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.row__t {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-1);
}
.row__m {
  font-size: 11px;
  color: var(--text-2);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.row__x {
  flex: none;
  font-size: 11px;
  color: var(--text-2);
}
.row__kcal {
  flex: none;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-1);
}
.row__u {
  font-size: 9px;
  font-weight: 400;
  color: var(--text-2);
  margin-left: 2px;
}

/* ---------- 收藏按钮 ---------- */
.fav {
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: var(--radius-full);
  background-color: var(--fill);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fav.is-on {
  background-color: var(--acc);
}
.fav__i {
  font-size: 14px;
  line-height: 14px;
  color: var(--text-2);
}
.fav.is-on .fav__i {
  color: #0b0d12;
}
.fav--abs {
  position: absolute;
  right: 10px;
  top: 100px;
}

/* ---------- 卡片：计划 / 路书 ---------- */
.card {
  margin-bottom: 10px;
  border-radius: var(--radius-lg);
  background-color: var(--surface);
  border: 1px solid var(--line);
  overflow: hidden;
}
.card--plan {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
}
.card__b {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 14px 12px;
}
.card--plan .card__b {
  padding: 0;
}
.card__t {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-1);
}
.card__m {
  font-size: 11px;
  color: var(--text-2);
}
.card__own {
  flex: none;
  font-size: 11px;
  color: var(--text-2);
  padding-top: 3px;
  margin-right: 2px;
}
.tags {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}
.tag {
  height: 20px;
  line-height: 20px;
  padding: 0 7px;
  border-radius: 6px;
  font-size: 10px;
  color: var(--text-2);
  background-color: var(--fill);
}
.map {
  position: relative;
  height: 108px;
  background-color: #101420;
  background-image: linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 34px 34px;
}
.map__svg {
  width: 100%;
  height: 108px;
}
.map__dot {
  position: absolute;
  left: 40%;
  top: 48%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: var(--surface);
  border: 2px solid var(--acc);
}
.map__badge {
  position: absolute;
  left: 12px;
  top: 10px;
  height: 22px;
  line-height: 22px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-1);
  background-color: rgba(9, 12, 18, 0.7);
}

/* ---------- 右侧索引 ---------- */
.idx {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  z-index: 6;
}
.idx__i {
  width: 20px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.idx__i text {
  font-size: 10px;
  color: var(--text-2);
}
.idx__i.is-on text {
  color: #0b0d12;
  background-color: var(--acc);
  padding: 2px 4px;
  border-radius: 5px;
  font-weight: 700;
}
.idx__tip {
  position: absolute;
  right: 30px;
  top: 46%;
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  border-radius: 8px;
  font-size: 11px;
  color: var(--text-1);
  background-color: var(--surface-2);
  border: 1px solid var(--line-strong);
  z-index: 8;
}

/* ---------- 空态 ---------- */
.empty {
  padding: 70px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.empty__ic {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty__t {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
  margin-top: 6px;
}
.empty__d {
  font-size: 12px;
  color: var(--text-2);
}
.empty__acts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
}
.act {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 18px;
  border-radius: var(--radius-full);
}
.act--ai {
  background-color: var(--brand-500);
}
.act--ai .act__t {
  color: #0b0d12;
  font-weight: 700;
}
.act--ghost {
  background-color: var(--surface-2);
  border: 1px solid var(--line);
}
.act__t {
  font-size: 13px;
  color: var(--text-1);
}

/* ---------- AI 面板 ---------- */
.carry {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding: 9px 12px;
  border-radius: var(--radius-md);
  background-color: var(--surface-2);
  border: 1px solid var(--line);
}
.carry__t {
  font-size: 12px;
  color: var(--text-1);
}
.carry__x {
  font-size: 12px;
  color: var(--acc);
}

.hero {
  position: relative;
  margin: 14px 0 6px;
  padding: 14px;
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  background: linear-gradient(var(--surface), var(--surface)) padding-box,
    linear-gradient(135deg, var(--brand-500), var(--mod-social)) border-box;
}
.hero__hd {
  display: flex;
  align-items: center;
  gap: 8px;
}
.hero__ic {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--brand-500), var(--mod-social));
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero__t {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-1);
}
.hero__live {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 5px;
}
.hero__live text {
  font-size: 10px;
  color: var(--text-2);
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: var(--brand-500);
}
.hero__d {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--text-2);
}
.hero__acts {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.pill {
  flex: 1;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: var(--radius-full);
  background-color: var(--surface-2);
  border: 1px solid var(--line);
}
.pill__t {
  font-size: 11px;
  color: var(--text-1);
}
.ask {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  margin-bottom: 8px;
  border-radius: var(--radius-md);
  background-color: var(--surface);
  border: 1px solid var(--line);
}
.ask__ic {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background-color: var(--brand-50);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ask__txt {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ask__t {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-1);
}
.ask__d {
  font-size: 11px;
  color: var(--text-2);
}
.tips {
  display: flex;
  gap: 10px;
}
.tip {
  flex: 1;
  padding: 10px;
  border-radius: var(--radius-md);
  background-color: var(--surface);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.tip__ic {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background-color: var(--brand-50);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tip__t {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-1);
}
.tip__d {
  font-size: 10px;
  color: var(--text-2);
}

/* ---------- 拍照面板 ---------- */
.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(6, 8, 12, 0.62);
  z-index: 110;
}
.sheet {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 16px 22px;
  border-radius: 24px 24px 0 0;
  background-color: var(--surface-2);
  border-top: 1px solid var(--line-strong);
  z-index: 111;
}
.sheet__grip {
  width: 46px;
  height: 4px;
  border-radius: 4px;
  background-color: var(--line-strong);
  margin: 0 auto 10px;
}
.sheet__t {
  display: block;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-1);
}
.sheet__s {
  display: block;
  text-align: center;
  font-size: 11px;
  color: var(--text-2);
  margin-top: 4px;
}
.frame {
  margin: 12px 0;
  height: 150px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--line-strong);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.frame__t {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-1);
}
.frame__d {
  font-size: 11px;
  color: var(--text-2);
}
.result {
  margin: 12px 0;
  padding: 10px;
  border-radius: var(--radius-md);
  background-color: var(--surface);
  border: 1px solid var(--line);
}
.result__hd {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 8px;
}
.result__hd-t {
  font-size: 11px;
  color: var(--text-2);
}
.result__row {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 48px;
}
.result__n {
  flex: 1;
  font-size: 13px;
  color: var(--text-1);
}
.result__k {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-1);
}
.sheet__btns {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.btn {
  flex: 1;
  height: 46px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn--ghost {
  background-color: var(--fill);
  color: var(--text-1);
}
.btn--main {
  background-color: var(--mod-diet);
  color: #0b0d12;
  font-weight: 700;
}
.btn text {
  font-size: 14px;
}
.btn--ghost text {
  color: var(--text-1);
}
.btn--main text {
  color: #0b0d12;
}
</style>
