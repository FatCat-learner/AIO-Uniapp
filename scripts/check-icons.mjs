#!/usr/bin/env node
/**
 * check-icons.mjs · 本地图标准入校验（零依赖）
 *
 * 规范来源 `_design/SPEC.md`：线性风格 / 24 网格 / 线宽 2 / 圆角端点 / 单色（随 currentColor）。
 * 从 iconfont 下载的 SVG 直接丢进 `src/static/icons/`，跑 `pnpm icons:check`：
 *   - 退出码 0：全部合格，可以进 `src/components/base/icons.ts` 登记；
 *   - 退出码 1：列出不合格项和原因，不要用改坏了的图标。
 *
 * 用法：
 *   node scripts/check-icons.mjs          校验
 *   node scripts/check-icons.mjs --list   只列出现有图标 + 尺寸
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ICON_DIR = join(ROOT, 'src/static/icons');
const REGISTRY = join(ROOT, 'src/components/base/icons.ts');

const SHAPE_TAGS = ['path', 'line', 'circle', 'rect', 'polyline', 'polygon', 'ellipse'];
const FORBIDDEN_TAGS = ['text', 'image', 'style', 'defs', 'clipPath', 'mask', 'filter', 'foreignObject'];
const MAX_SHAPES = 6;
const KEBAB = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

function readRegistry() {
  const src = readFileSync(REGISTRY, 'utf8');
  const block = src.match(/APP_ICONS\s*=\s*\[([\s\S]*?)\]/);
  if (!block) throw new Error(`${REGISTRY} 里找不到 APP_ICONS = [ ... ] 数组`);
  return [...block[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
}

/** 返回该 svg 的问题列表（空数组 = 合格） */
function inspect(name, svg) {
  const issues = [];
  const rootTag = svg.match(/<svg\b[^>]*>/)?.[0] ?? '';
  if (!rootTag) return ['不是合法 svg（缺 <svg> 根节点）'];

  const viewBox = rootTag.match(/viewBox\s*=\s*"([^"]+)"/)?.[1];
  if (viewBox !== '0 0 24 24') issues.push(`viewBox 必须是 "0 0 24 24"，当前 ${viewBox ? `"${viewBox}"` : '缺失'}`);

  const fill = rootTag.match(/\bfill\s*=\s*"([^"]+)"/)?.[1];
  if (fill && fill !== 'none') issues.push(`根节点 fill 必须是 none（禁止面性/实心图标），当前 "${fill}"`);

  const stroke = rootTag.match(/\bstroke\s*=\s*"([^"]+)"/)?.[1];
  if (stroke !== 'currentColor') issues.push(`根节点 stroke 必须是 currentColor（颜色随父级），当前 ${stroke ? `"${stroke}"` : '缺失'}`);

  const sw = rootTag.match(/stroke-width\s*=\s*"([^"]+)"/)?.[1];
  if (sw !== '2') issues.push(`stroke-width 必须是 2，当前 ${sw ?? '缺失'}`);

  for (const key of ['stroke-linecap', 'stroke-linejoin']) {
    const v = rootTag.match(new RegExp(`${key}\\s*=\\s*"([^"]+)"`))?.[1];
    if (v !== 'round') issues.push(`${key} 必须是 round，当前 ${v ?? '缺失'}`);
  }

  for (const tag of FORBIDDEN_TAGS) {
    if (new RegExp(`<${tag}\\b`).test(svg)) issues.push(`不允许 <${tag}>（不可 mask、不可复用或不可跨端）`);
  }

  const shapes = SHAPE_TAGS.reduce((n, tag) => n + (svg.match(new RegExp(`<${tag}\\b`, 'g'))?.length ?? 0), 0);
  if (shapes === 0) issues.push('没有图形节点');
  if (shapes > MAX_SHAPES) issues.push(`图形节点 ${shapes} 个，超过 ${MAX_SHAPES} 个（小尺寸会糊，换更简的图标）`);

  const painted = svg.match(/\b(fill|stroke)\s*=\s*"(#[0-9a-fA-F]{3,8}|rgb[^"]*|var\([^"]*\))"/);
  if (painted) issues.push(`写死了颜色 ${painted[1]}="${painted[2]}"，图标必须单色跟随 currentColor`);

  const pathTags = svg.match(/<path\b[^>]*>/g) ?? [];
  if (pathTags.some(tag => tag.length > 900)) issues.push('存在超长路径（>900 字符），小尺寸会糊');

  if (svg.includes('<!--') || svg.includes('<metadata') || svg.includes('<title')) {
    issues.push('含注释/元数据，删掉（会进 CSS 产物）');
  }

  if (!KEBAB.test(name)) issues.push('文件名必须是 kebab-case（如 bench-press、timer-outline）');

  return issues;
}

function main() {
  const listOnly = process.argv.includes('--list');
  if (!existsSync(ICON_DIR)) {
    console.error(`✖ 目录不存在：${ICON_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(ICON_DIR).filter(f => f.toLowerCase().endsWith('.svg')).sort();
  const names = files.map(f => f.replace(/\.svg$/i, ''));
  const registry = readRegistry();

  if (listOnly) {
    console.log(`本地图标 ${names.length} 个（已登记 ${registry.length} 个）：`);
    for (const n of names) console.log(`  ${registry.includes(n) ? '✓' : '·'} ${n}`);
    return;
  }

  let failed = 0;
  for (const name of names) {
    const issues = inspect(name, readFileSync(join(ICON_DIR, `${name}.svg`), 'utf8'));
    if (issues.length) {
      failed += 1;
      console.log(`✖ ${name}.svg`);
      for (const i of issues) console.log(`    - ${i}`);
    }
  }

  const unregistered = names.filter(n => !registry.includes(n));
  const missingFile = registry.filter(n => !names.includes(n));

  if (unregistered.length) {
    failed += unregistered.length;
    console.log(`✖ 有文件没登记进 src/components/base/icons.ts（会被 unocss 摇掉）：${unregistered.join(', ')}`);
  }
  if (missingFile.length) {
    failed += missingFile.length;
    console.log(`✖ 登记了但没有对应 svg 文件：${missingFile.join(', ')}`);
  }

  if (failed) {
    console.log(`\n✖ ${failed} 处不合格`);
    process.exit(1);
  }
  console.log(`✓ ${names.length} 个本地图标全部合格，且与 icons.ts 登记表一致`);
}

main();
