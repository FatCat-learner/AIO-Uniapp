#!/usr/bin/env node
/**
 * gen-page —— 生成符合《前端开发规范》的页面骨架（四件套）
 *
 * 用法：
 *   pnpm gen:page <name> "<页面标题>" [--force]
 *   node scripts/gen-page.mjs total "总计"
 *
 * 产物（页面名 = store 名 = api 目录名，见 docs/前端开发规范.md §3）：
 *   src/pages/<name>/index.vue
 *   src/pages/<name>/config/{index,types,seed}.ts
 *   src/store/<name>/{index,types}.ts        + store/index.ts 追加导出
 *   src/api/<name>/{index,types}.ts
 *   src/pages.json 追加页面注册
 *
 * 只生成骨架，不写业务。已存在的文件默认跳过（--force 覆盖）。
 */
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');

const argv = process.argv.slice(2);
const force = argv.includes('--force');
const [rawName, rawTitle] = argv.filter(item => !item.startsWith('--'));

if (!rawName) {
  console.error('用法: pnpm gen:page <name> "<页面标题>" [--force]');
  console.error('示例: pnpm gen:page total "总计"');
  process.exit(1);
}

const name = rawName.trim();
if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name)) {
  console.error(`页面名不合法: "${name}"。要求 kebab-case，如 my-page。`);
  process.exit(1);
}

const title = (rawTitle || name).trim();
const pascal = name.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
const storeName = `use${pascal}Store`;

/** 相对 src 的路径 → 绝对路径 */
const abs = rel => join(SRC, rel);

/**
 * .vue 的块顺序必须是 template → script → style
 * （eslint.config.mjs 的 vue/block-order 是 error 级，顺序错了 lint 直接不过）
 */
const pageVue = `<template>
  <AppLayout title="${title}" subtitle="页面副标题">
    <view class="page">
      <view v-if="store.loading" class="page__state">
        <text class="page__state-text">加载中…</text>
      </view>

      <view v-else-if="isEmpty" class="page__state">
        <text class="page__state-text">暂无数据</text>
      </view>

      <view v-else class="page__list">
        <view v-for="item in store.items" :key="item.id" class="page__row">
          <text class="page__row-title">{{ item.title }}</text>
        </view>
      </view>
    </view>
  </AppLayout>
</template>

<script setup lang="ts">
/**
 * ${title}（${name}）
 * 骨架由 \`pnpm gen:page\` 生成；分层与体积红线见 docs/前端开发规范.md
 * 本文件 ≤ 300 行：超了先把 常量/类型 → config/、纯函数 → utils/、状态 → store/${name}、UI 块 → components/
 */
import { computed, onMounted } from 'vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { use${pascal}Store } from '@/store/${name}';

const store = use${pascal}Store();

/** 页面级派生放这里；纯展示用的派生不要塞进 store */
const isEmpty = computed(() => !store.loading && store.items.length === 0);

onMounted(() => {
  void store.load();
});
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--card-gap);
  padding: var(--page-top) 0 var(--content-inset-bottom);
}

.page__state {
  display: flex;
  justify-content: center;
  padding: var(--sp-8) 0;
}

.page__state-text {
  font-size: var(--fs-sm);
  color: var(--text-3);
}

.page__list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}
</style>
`;

const files = {
  [abs(`pages/${name}/index.vue`)]: pageVue,

  [abs(`pages/${name}/config/index.ts`)]: `export * from './seed';
export * from './types';
`,

  [abs(`pages/${name}/config/types.ts`)]: `/**
 * ${title}（${name}）页面内类型
 *
 * 只放「给页面与页面私有组件看」的类型；接口契约放 src/api/${name}/types.ts，
 * 不要在页面里另起一套和契约分叉的 interface。
 */
import type { I${pascal}Item } from '@/api/${name}/types';

/** 列表行：直接复用契约结构，避免两处分叉 */
export type I${pascal}Row = I${pascal}Item;
`,

  [abs(`pages/${name}/config/seed.ts`)]: `/**
 * ${title}（${name}）页面私有常量
 *
 * 只放不随请求变化的定值、枚举、字段映射；接口端点与种子数据放 src/api/${name}。
 * 颜色一律写设计令牌（var(--xxx)），不要写死十六进制。
 */

/** 页面副标题（示例） */
export const PAGE_SUBTITLE = '页面副标题';

/** 字段 → 展示文案的映射表（示例：能用查表表达的，别写 if/else 链） */
export const ROW_META: Record<string, string> = {};
`,

  [abs(`store/${name}/types.ts`)]: `/** ${title}（${name}）store 侧类型 */

/** 需要持久化 / 跨组件共享的筛选条件（示例） */
export interface I${pascal}Filter {
  keyword: string;
}
`,

  [abs(`store/${name}/index.ts`)]: `import type { I${pascal}Item } from '@/api/${name}/types';
import { defineStore } from 'pinia';
import { fetch${pascal}Items } from '@/api/${name}';

/**
 * ${title}（${name}）状态
 *
 * - pinia id 与页面目录同名（页面名 = store 名 = api 目录名）
 * - 只在确实需要本地持久化时加 persist: true（列表/筛选状态不要持久化）
 * - 组件里取值用 storeToRefs，不要直接解构
 */
export const ${storeName} = defineStore('${name}', () => {
  // ---- state ----
  const loading = ref(false);
  const error = ref('');
  const items = ref<I${pascal}Item[]>([]);

  // ---- getters（只读派生，不做副作用）----

  // ---- actions ----
  async function load() {
    loading.value = true;
    error.value = '';
    try {
      items.value = await fetch${pascal}Items();
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    }
    finally {
      loading.value = false;
    }
  }

  return { loading, error, items, load };
});

export default ${storeName};
`,

  [abs(`api/${name}/types.ts`)]: `/**
 * ${title}（${name}）接口契约
 *
 * 口径与后端一致；接后端时只改本文件与 index.ts，页面 / store 不动。
 */

export interface I${pascal}Item {
  id: string;
  title: string;
}

export interface I${pascal}Query {
  keyword?: string;
  page?: number;
  pageSize?: number;
}
`,

  [abs(`api/${name}/index.ts`)]: `import type { I${pascal}Item, I${pascal}Query } from './types';
import { get } from '@/utils/request';

/**
 * ${title}（${name}）接口
 *
 * URL 只允许出现在这一层；页面与 store 里不要出现字符串 URL。
 * dev 下由 vite-plugin-mock 拦截（见 mocks/README.md），接后端后换 baseURL 即可。
 */
export function fetch${pascal}Items(params: I${pascal}Query = {}) {
  return get<I${pascal}Item[]>('/${name}/items', { params });
}
`,
};

/** 写入单个文件 */
async function writeOne(filePath, content) {
  if (existsSync(filePath) && !force) return 'skipped';
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content, 'utf8');
  return 'written';
}

/** pages.json 注册页面 */
async function registerPage() {
  const file = abs('pages.json');
  const json = JSON.parse(await readFile(file, 'utf8'));
  const route = `pages/${name}/index`;
  if (json.pages.some(item => item.path === route)) return 'skipped';
  json.pages.push({
    path: route,
    style: {
      navigationStyle: 'custom',
      navigationBarTitleText: title,
      enablePullDownRefresh: false,
    },
  });
  await writeFile(file, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
  return 'written';
}

/** store/index.ts 追加统一导出 */
async function registerStore() {
  const file = abs('store/index.ts');
  const raw = await readFile(file, 'utf8');
  if (raw.includes(`'./${name}'`)) return 'skipped';
  await writeFile(file, `${raw.trimEnd()}\n\nexport { ${storeName} } from './${name}';\n`, 'utf8');
  return 'written';
}

const results = [];
for (const [filePath, content] of Object.entries(files)) {
  const status = await writeOne(filePath, content);
  results.push(`${status === 'written' ? '✚' : '·'} ${filePath.replace(`${ROOT}/`, '')}`);
}
results.push(`✚ src/pages.json（${await registerPage()}）`);
results.push(`✚ src/store/index.ts（${await registerStore()}）`);

for (const line of results) {
  console.log(line);
}

console.log(`\n页面 ${name} 已生成：pinia id = ${name}，store = src/store/${name}，api = src/api/${name}。`);
console.log('下一步：');
console.log(`  1. src/api/${name}/types.ts 写契约 → mocks/modules/${name}.ts 补 mock 并在 mocks/index.ts 注册；`);
console.log(`  2. src/store/${name}/index.ts 补 state / getters / actions；`);
console.log('  3. 页面只写布局与事件：常量类型进 config/，纯函数进 src/utils/，UI 块进 pages/<name>/components/。');
