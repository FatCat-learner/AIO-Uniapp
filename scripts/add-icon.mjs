#!/usr/bin/env node
/**
 * add-icon.mjs · 图标入库一条命令（我或你都能用）
 *
 * 两种来源：
 *   1. iconify 线性集合（默认 lucide，与 iconfont 线性集同族：24 网格 / 线宽 2 / 圆角端点）
 *        node scripts/add-icon.mjs lucide:grip-vertical
 *        node scripts/add-icon.mjs tabler:run timer
 *   2. 你从 iconfont 下载的本地 SVG
 *        node scripts/add-icon.mjs --from=~/Downloads/bench-press.svg --name=bench-press
 *
 * 动作：下载/读取 → 归一化成项目规范 SVG → 落 src/static/icons/<name>.svg
 *      → 登记进 src/components/base/icons.ts → 跑 check-icons 校验 → 刷新图标墙。
 * 校验不过自动回滚（删文件 + 撤销登记），不会留下半成品。
 *
 * 规范来源 _design/SPEC.md：24×24 / fill:none / stroke:currentColor / 线宽 2 / round 端点。
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ROOT = resolve(APP, '..');
const ICON_DIR = join(APP, 'src/static/icons');
const REGISTRY = join(APP, 'src/components/base/icons.ts');
const DEFAULT_SET = 'lucide';
/** 只允许描边风格集合：面性集合（mdi/material-symbols 等）强行转描边会变成"空心怪"，直接拒绝 */
const STROKE_SETS = ['lucide', 'tabler', 'iconoir'];

const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const die = (msg) => {
  console.error(`✖ ${msg}`);
  process.exit(1);
};

const argOf = (k) => {
  const hit = process.argv.find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.slice(k.length + 3) : '';
};

const innerOf = (svg) => svg.replace(/^[\s\S]*?<svg\b[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '');

/** 归一化成项目规范 SVG；不满足前提就抛错（不做"强行改造"，改坏了不如不用） */
function normalize(raw, label) {
  let inner = innerOf(raw);
  if (!inner.trim()) die(`${label}: 解析不出 <svg> 内容`);

  if (/<g\b[^>]*\btransform\s*=/.test(inner)) {
    die(`${label}: 带 transform 的 <g> 分组（iconfont 导出的 1024 网格常见），无法安全转 24 网格。\n  换一个 24 网格 / 描边风格的图标，或用设计工具导出 24×24 的 SVG。`);
  }
  // 只剥掉「不承载变换、只承载样式」的 <g> 包裹
  inner = inner.replace(/<g\b(?![^>]*\btransform=)[^>]*>/g, '').replace(/<\/g>/g, '');
  inner = inner.replace(/<!--[\s\S]*?-->/g, '').replace(/<title\b[\s\S]*?<\/title>/g, '');
  inner = inner.replace(/<defs\b[\s\S]*?<\/defs>/g, '');

  if (/<text\b|<image\b/.test(inner)) die(`${label}: 含 <text>/<image>，不可 mask，换图标`);

  // 图形节点上的写死颜色/线宽，一律去掉，交给根节点统一控制
  inner = inner.replace(/\s(?:fill|stroke|stroke-width|stroke-linecap|stroke-linejoin|class|style|opacity|fill-rule|clip-rule)="[^"]*"/g, '');
  inner = inner.replace(/\s+/g, ' ').trim();

  const shapes = (inner.match(/<(path|line|circle|rect|polyline|polygon|ellipse)\b/g) ?? []).length;
  if (!shapes) die(`${label}: 没有图形节点`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n  ${inner}\n</svg>\n`;
}

async function fetchIconify(id) {
  const [prefix, name] = id.includes(':') ? id.split(':') : [DEFAULT_SET, id];
  const url = `https://api.iconify.design/${prefix}.json?icons=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) die(`拉取 ${id} 失败：HTTP ${res.status}`);
  const data = await res.json();
  const icon = data.icons?.[name] ?? (data.aliases?.[name] ? data.icons?.[data.aliases[name].parent] : null);
  if (!icon?.body) die(`iconify 里没有 ${id}（集合 ${prefix} / 名字 ${name}）`);
  if (!STROKE_SETS.includes(prefix)) {
    die(`${prefix} 不是描边风格集合，拒绝（面性图标转描边会烂）。\n  可选：${STROKE_SETS.join(' / ')}`);
  }
  if (/\bfill\s*=\s*"(?!none)/.test(icon.body)) {
    die(`${id} 内含实心填充（fill），不是纯描边图标，换一个`);
  }
  if (data.width && data.width !== 24) {
    die(`${id} 是 ${data.width}×${data.width} 网格，不是 24 网格；换一个 set（推荐 lucide / tabler / ph）`);
  }
  return { body: `<g>${icon.body}</g>`, label: id };
}

function readRegistry() {
  const src = readFileSync(REGISTRY, 'utf8');
  const block = src.match(/APP_ICONS\s*=\s*\[([\s\S]*?)\]/);
  if (!block) die(`找不到 APP_ICONS：${REGISTRY}`);
  const names = [...block[1].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
  return { src, names };
}

function writeRegistry(src, names) {
  const next = `export const APP_ICONS = [\n${names.map((n) => `  '${n}',`).join('\n')}\n] as const;`;
  writeFileSync(REGISTRY, src.replace(/export const APP_ICONS\s*=\s*\[[\s\S]*?\] as const;/, next));
}

function run(cmd, args) {
  try {
    execFileSync(cmd, args, { cwd: APP, stdio: 'pipe' });
    return { ok: true };
  } catch (e) {
    return { ok: false, out: `${e.stdout ?? ''}${e.stderr ?? ''}`.trim() };
  }
}

async function main() {
  const from = argOf('from');
  const explicitName = argOf('name');
  const positional = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const ids = positional.length ? positional : from ? [] : [];

  if (!from && !ids.length) {
    die(`用法：
  node scripts/add-icon.mjs lucide:grip-vertical [tabler:run ...]
  node scripts/add-icon.mjs --from=<本地 svg 路径> --name=<kebab-name>`);
  }

  const jobs = [];
  if (from) {
    const p = resolve(from.replace(/^~/, process.env.USERPROFILE ?? '~'));
    if (!existsSync(p)) die(`找不到文件：${p}`);
    const name = explicitName || p.split(/[\\/]/).pop().replace(/\.svg$/i, '');
    jobs.push({ name, raw: readFileSync(p, 'utf8'), label: p });
  } else {
    for (const id of ids) {
      const got = await fetchIconify(id);
      jobs.push({ name: id.includes(':') ? id.split(':').pop() : id, raw: got.body, label: got.label, wrap: true });
    }
  }

  const { src, names } = readRegistry();
  const added = [];

  for (const job of jobs) {
    if (!KEBAB.test(job.name)) die(`图标名必须是 kebab-case：${job.name}`);
    if (names.includes(job.name)) die(`${job.name} 已登记，换名字或先删旧的`);

    const svg = normalize(job.wrap ? `<svg>${job.raw}</svg>` : job.raw, job.label);
    const file = join(ICON_DIR, `${job.name}.svg`);
    writeFileSync(file, svg);

    writeRegistry(src, [...names, job.name].sort());
    const chk = run(process.execPath, ['scripts/check-icons.mjs']);
    if (!chk.ok) {
      writeFileSync(file, '');
      execFileSync(process.execPath, ['-e', `require('fs').unlinkSync(${JSON.stringify(file)})`]);
      writeRegistry(src, names);
      die(`${job.name} 校验不过，已回滚：\n${chk.out}`);
    }
    names.push(job.name);
    added.push(job.name);
    console.log(`✓ ${job.name}  ← ${job.label}`);
  }

  try {
    execFileSync(process.execPath, [join(ROOT, '_design/gen-icon-wall.mjs')], { stdio: 'pipe' });
    console.log('✓ 图标墙已刷新 _design/previews/icon-set/index.html');
  } catch {
    console.log('· 图标墙刷新失败（不影响入库），手动跑 node _design/gen-icon-wall.mjs');
  }
  console.log(`\n新增 ${added.length} 个：${added.join(', ')}`);
  console.log(`用法：<AppIcon set="app" name="${added[0]}" />`);
}

await main();
