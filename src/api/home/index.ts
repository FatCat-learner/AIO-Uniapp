import type { IHomeData } from './types';
import { homeMock } from '@mocks/data/home';

export type { DietShortcut, HomeData, IHomeData, Reservation, WorkoutRow } from './types';

/**
 * 首页数据源。今天直接返回 mock 种子常量（`mocks/data/home.ts`），
 * 接后端后把函数体改成 `return get<IHomeData>('/home')`，并改成
 * `export async function fetchHomeData(): Promise<IHomeData>`；
 * store/home 与 src/components/home/* 都不用动。
 */
export function fetchHomeData(): IHomeData {
  return homeMock;
}
