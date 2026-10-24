/**
 * faker 实例与生成工具。
 *
 * 中文数据统一走 `fakerZH_CN`（默认 locale 的 en 会生成 "Marlene Thompson" 这种名字）。
 *
 * 可复现性：列表类接口在入口调 `reseed('workouts:2')`，同一个 URL 每次刷新返回同一批数据，
 * 翻页/截图/联调都不会「数据自己变」；需要随机感就 reseed(Date.now())。
 */
import { fakerZH_CN } from '@faker-js/faker';

export const faker = fakerZH_CN;

/** 固定基准种子：不调用 reseed 时的默认数据形态 */
export const BASE_SEED = 20_261_024;
faker.seed(BASE_SEED);

/** FNV-1a：字符串 → 稳定种子 */
function hash(input: string): number {
  let h = 2_166_136_261;
  for (let i = 0; i < input.length; i++)
    h = Math.imul(h ^ input.charCodeAt(i), 16_777_619);
  return (h >>> 0) || 1;
}

/** 字符串 → 稳定数值（同一 id 永远得到同一个数，用于让详情/列表口径一致） */
export function hashSeed(input: string): number {
  return hash(input);
}

/** 按业务 key 重置种子，保证同 key 同结果 */
export function reseed(key: string | number): void {
  faker.seed(typeof key === 'number' ? key || 1 : hash(key));
}

/** 千分位整数：2847 → '2,847' */
export function fmtInt(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

/** 固定小数位：28 → '28.0' */
export function fmtFloat(value: number, digits = 1): string {
  return value.toFixed(digits);
}

/** 相对今天偏移 offset 天的日期（YYYY-MM-DD，本地时区） */
export function dateOffset(offset: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 分钟 → '62:00' */
export function fmtClock(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** 安全取数组元素（空数组返回 fallback） */
export function pickOne<T>(list: readonly T[], fallback: T): T {
  return list.length > 0 ? faker.helpers.arrayElement(list) : fallback;
}

/** 区间随机数（整数） */
export function intBetween(min: number, max: number): number {
  return faker.number.int({ min, max });
}

/** 区间随机数（固定小数位） */
export function floatBetween(min: number, max: number, digits = 1): number {
  return faker.number.float({ min, max, fractionDigits: digits });
}

/** 中文姓名 */
export function fullName(): string {
  return faker.person.fullName();
}

/** 手机号（11 位，1 开头） */
export function phone(): string {
  return `1${faker.number.int({ min: 3, max: 9 })}${faker.number.int({ min: 10_000_000, max: 99_999_999 })}`;
}

/** 昵称：名 + 训练相关后缀，比纯姓名更像社区用户 */
export function nickname(): string {
  const suffix = pickOne(['健身中', '今天也在举铁', '减脂第 N 天', '撸铁人', '准备上分'], '健身中');
  return `${faker.person.firstName()}${suffix}`;
}
