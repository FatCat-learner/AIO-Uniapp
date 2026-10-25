import type { Ref } from 'vue';
import type { Sec } from '@/pages/discover/config';

/**
 * 右列表的「滚动 → 当前分区」相关逻辑（索引高亮 / 跳转 / 长按提示）。
 *
 * 注意：measure() 刻意不加 `.in(inst.proxy)`。
 * 小程序端 `.in()` 只能查当前组件实例内的节点，而 `.main` / `.sec` 已经在
 * DiscoverList 子组件里，用 `.in()` 会查不到；不加则查当前页面内所有节点。
 */
export function useSectionScroll(sections: Ref<Sec[]>, activeGroup: Ref<string>) {
  const anchor = ref('');
  const idxTip = ref('');
  const secTops = ref<number[]>([]);

  let anchorTimer: any = null;
  let tipTimer: any = null;

  const measure = () => {
    const q = uni.createSelectorQuery();
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

  return { anchor, idxTip, measure, onScroll, jumpTo, showTip };
}
