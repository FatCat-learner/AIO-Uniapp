import { useToast } from '@/composables/useToast';

/**
 * 轻提示：未接入的功能统一用 toast 兜住点击（不让用户点了没反应）。
 *
 * 2026-10-25 起视觉统一走 overlays 体系的 AppToastHost（useToast()），
 * 这里只保留同名函数做兼容，页面调用点不用改；等 6 个页面迁移到 useToast() 后删除本文件。
 */
export function toast(title: string): void {
  useToast().show(title);
}
