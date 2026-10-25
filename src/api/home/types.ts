import type { HomeData } from '@mocks/types';

export type { DietShortcut, HomeData, Reservation, WorkoutRow } from '@mocks/types';

/** 首页聚合数据的契约别名（= 后端 `GET /api/home` 的响应体） */
export type IHomeData = HomeData;
