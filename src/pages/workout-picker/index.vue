<template>
  <view class="page pk">
    <view class="pk__status" />

    <PickerHeader
      :keyword="keyword"
      @close="onClose"
      @camera="onStub('拍照识别')"
      @hiit="onStub('HIIT 组合')"
      @plus="onStub('新建组合')"
      @search="onSearch"
    />

    <PickerChips
      :equipment="equipmentOptions"
      :active="store.equipment"
      @select="onEquipment"
    />

    <view class="pk__body">
      <PickerRail
        :active-part="store.bodyPart"
        :active-muscle="store.muscle"
        @select="onPart"
      />

      <view class="pk__main">
        <PickerTabs :active="store.sort" @change="onTab" @clear="onClear" />

        <z-paging
          ref="pagingRef"
          v-model="list"
          class="pk__paging"
          :auto="false"
          :fixed="false"
          @query="onQuery"
        >
          <template #loading>
            <PickerState type="loading" />
          </template>
          <template #empty>
            <PickerState :type="failed ? 'error' : 'empty'" @retry="reload" />
          </template>

          <view class="pk__content">
            <text class="pk__sec">{{ sectionLabel }}</text>
            <PickerFeatured :items="featured" :selected-ids="selectedIds" @toggle="onToggle" />

            <template v-for="group in groups" :key="group.equipment">
              <text class="pk__grp">{{ group.equipment }}</text>
              <view class="pk__grid">
                <ExerciseCard
                  v-for="item in group.items"
                  :key="item.id"
                  :item="item"
                  :selected="selectedIds.includes(item.id)"
                  @toggle="onToggle"
                  @detail="onDetail"
                />
              </view>
            </template>
          </view>
        </z-paging>
      </view>
    </view>

    <PickerFooter :count="selected.length" @super-set="onSuperSet" @done="onDone" />

    <SuperSetDialog v-model:visible="namingVisible" :default-value="namingDefault" @save="onSaveGroup" />
  </view>
</template>

<script setup lang="ts">
/**
 * 训练内动作选择页（workout-picker）· 设计稿 _design/previews/workout-flow 第 ③ 屏
 * 布局 + 交互编排只留在这里，状态请求走 @/store/exercise（共享动作库域），
 * 分页交给 z-paging（:query → store.fetchPage），本页不自己翻页。
 */
import type { IExerciseBrief } from '@/api/exercise/types';
import { computed, nextTick, onMounted, ref } from 'vue';
import { MUSCLE_TREE } from '@/pages/discover/config/muscle-tree';
import useExerciseStore from '@/store/exercise';
import useWorkoutStore from '@/store/workout';
import ExerciseCard from './components/ExerciseCard.vue';
import PickerChips from './components/PickerChips.vue';
import PickerFeatured from './components/PickerFeatured.vue';
import PickerFooter from './components/PickerFooter.vue';
import PickerHeader from './components/PickerHeader.vue';
import PickerRail from './components/PickerRail.vue';
import PickerState from './components/PickerState.vue';
import PickerTabs from './components/PickerTabs.vue';
import SuperSetDialog from './components/SuperSetDialog.vue';

interface EquipmentGroup {
  equipment: string;
  items: IExerciseBrief[];
}

const store = useExerciseStore();
/** 训练草稿：选完动作写进来，训练页读它 */
const workout = useWorkoutStore();

/** z-paging 的列表；分页数据由 onQuery 写回 */
const list = ref<IExerciseBrief[]>([]);
const keyword = ref('');
const failed = ref(false);
/** 当前筛选下的总条数（z-paging 只要 list，total 我们自己留着显示） */
const totalCount = ref(0);
const pagingRef = ref<any>(null);

const equipmentOptions = computed<string[]>(() =>
  store.filters.equipment.map((entry: { value: string }) => entry.value),
);

/** 「背 · 183 个动作」：二级肌群优先，其次一级部位，都没有就是全部 */
const sectionLabel = computed(() => {
  const node = store.muscle
    ? MUSCLE_TREE.flatMap(part => part.children ?? []).find(kid => kid.id === store.muscle)
    : undefined;
  const name = node?.label ?? store.bodyPart ?? '';
  return `${name || '全部'} · ${totalCount.value} 个动作`;
});

/** 精选卡：取当前结果前 4 条（已按 tab 的排序口径排好，不再另发请求） */
const featured = computed(() => list.value.slice(0, 4));

/** 按器械分组，Map 保序 = 后端排序的首现顺序 */
const groups = computed<EquipmentGroup[]>(() => {
  const map = new Map<string, IExerciseBrief[]>();
  for (const item of list.value) {
    const key = item.equipment || '其他';
    const bucket = map.get(key);
    if (bucket) bucket.push(item);
    else map.set(key, [item]);
  }
  return [...map].map(([equipment, items]) => ({ equipment, items }));
});

/** z-paging 分页入口：pageNo/pageSize 由组件给，失败要显式 complete(false) */
async function onQuery(pageNo: number, pageSize: number) {
  failed.value = false;
  try {
    const page = await store.fetchPage(pageNo, pageSize);
    totalCount.value = page.total;
    pagingRef.value?.completeByTotal(page.list, page.total);
  }
  catch {
    failed.value = true;
    pagingRef.value?.complete(false);
  }
}

function reload() {
  pagingRef.value?.reload();
}

function onPart(payload: { bodyPart: string; muscle: string }) {
  if (store.bodyPart !== payload.bodyPart)
    store.setBodyPart(payload.bodyPart);
  else if (store.muscle !== payload.muscle)
    store.setMuscle(payload.muscle);
  else
    return;
  reload();
}

function onEquipment(value: string) {
  store.setEquipment(value);
  reload();
}

function onTab(value: 'default' | 'popular') {
  if (store.sort === value) return;
  store.setSort(value);
  reload();
}

function onClear() {
  store.clearFilters();
  keyword.value = '';
  reload();
}

let searchTimer: ReturnType<typeof setTimeout> | undefined;
function onSearch(value: string) {
  keyword.value = value;
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    store.setKeyword(value);
    reload();
  }, 300);
}

/** 已选动作（点卡切换，可多选） */
const selected = ref<IExerciseBrief[]>([]);
const selectedIds = computed(() => selected.value.map(item => item.id));
const namingVisible = ref(false);
const namingDefault = computed(() =>
  selected.value.map(item => item.zh_name).join('+'),
);

function onToggle(item: IExerciseBrief) {
  const index = selected.value.findIndex(row => row.id === item.id);
  if (index >= 0) selected.value.splice(index, 1);
  else selected.value.push(item);
}

/** 完成：把已选动作写进训练草稿，再退回训练页 */
function onDone() {
  if (!selected.value.length) {
    uni.showToast({ title: '先选动作', icon: 'none' });
    return;
  }
  workout.addExercises(selected.value);
  uni.showToast({ title: `已加入 ${selected.value.length} 个动作`, icon: 'none' });
  setTimeout(() => uni.navigateBack(), 400);
}

/** 临时超级组：选满 2 个及以上才弹命名 */
function onSuperSet() {
  if (selected.value.length < 2) {
    uni.showToast({ title: '至少选 2 个动作', icon: 'none' });
    return;
  }
  namingVisible.value = true;
}

function onSaveGroup(name: string) {
  uni.showToast({ title: `已建超级组：${name}`, icon: 'none' });
  selected.value = [];
}

function onDetail(item: IExerciseBrief) {
  uni.showToast({ title: `${item.zh_name} · 要点详情待接入`, icon: 'none' });
}

/** 本期只做点击态的按钮统一走这里 */
function onStub(name: string) {
  uni.showToast({ title: `${name} 稍后开放`, icon: 'none' });
}

function onClose() {
  uni.navigateBack();
}

onMounted(async () => {
  // 动作库 store 与其他页共享，进页先清掉上一页的筛选，避免带着筛选进训练
  store.clearFilters();
  store.setSort('default');
  void store.fetchFilters();
  await nextTick();
  reload();
});
</script>

<style lang="scss" scoped>
@import './styles/picker.scss';
</style>
