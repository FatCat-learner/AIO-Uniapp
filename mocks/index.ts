/**
 * mocks 入口（vite-plugin-mock 唯一加载点）
 *
 * 为什么只有一个入口：vite-plugin-mock 默认会 glob + 逐个 esbuild 打包 mockPath 下所有 .ts，
 * 每个文件都会把 faker 再打一遍（约 2 MB/文件）。用 `configPath: 'mocks/index.ts'` 只打这一个包，
 * 启动快、faker 只初始化一次。
 *
 * URL 前缀：各模块里只写业务路径（`/auth/login`），这里统一拼上 `VITE_API_PREFIX`（默认 `/api`），
 * 这样改代理前缀时不用动任何 mock 文件。
 */
import type { MockMethod } from 'vite-plugin-mock';
import { authMock } from './modules/auth';
import { catalogMocks } from './modules/catalog';
import { homeMockApi } from './modules/home';
import { workoutMocks } from './modules/workout';

/** 所有 mock 接口（未加前缀） */
export const mockHandlers: MockMethod[] = [
  ...authMock,
  ...homeMockApi,
  ...catalogMocks,
  ...workoutMocks,
];

interface MockEnv {
  env?: Record<string, string | undefined>;
}

export default function setupMock({ env }: MockEnv = {}): MockMethod[] {
  const raw = env?.VITE_API_PREFIX || '/api';
  const prefix = raw.endsWith('/') ? raw.slice(0, -1) : raw;

  return mockHandlers.map(item => ({
    ...item,
    url: item.url.startsWith('/') ? `${prefix}${item.url}` : item.url,
  }));
}
