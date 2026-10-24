/**
 * 统一响应包装：mock 的返回值必须和 `src/utils/request/types.ts` 的 IResponse 对齐，
 * 否则响应拦截器不会放行（它只认 code === 200）。
 */
import type { ApiResponse, PageResult } from '../types';

/** 成功 */
export function ok<T>(data: T, message = 'success'): ApiResponse<T> {
  return { code: 200, message, status: 200, data };
}

/** 业务失败（前端会 toast message） */
export function fail(message: string, code = 400): ApiResponse<null> {
  return { code, message, status: code, data: null };
}

/** 分页切片 */
export function paginate<T>(list: T[], page = 1, pageSize = 20): ApiResponse<PageResult<T>> {
  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.min(100, Math.max(1, Number(pageSize) || 20));
  const start = (safePage - 1) * safeSize;
  return ok({
    list: list.slice(start, start + safeSize),
    total: list.length,
    page: safePage,
    pageSize: safeSize,
  });
}

/** 转正整数，非法值走兜底 */
export function toInt(value: unknown, fallback: number): number {
  const n = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** 关键字包含（忽略大小写；空关键字视为全部命中） */
export function matchKeyword(text: string, keyword?: string): boolean {
  const kw = (keyword ?? '').trim().toLowerCase();
  return kw === '' || text.toLowerCase().includes(kw);
}

/** 等值过滤：'全部' 或空值视为不过滤 */
export function matchEq(value: string, filter?: string): boolean {
  const f = (filter ?? '').trim();
  return f === '' || f === '全部' || f === value;
}
