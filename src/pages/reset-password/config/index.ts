import type { ResetStep } from './types';
import type { AuthCodeScene } from '@/api/auth/types';
import type { IAuthTitleLine } from '@/components/auth/constants';

export * from './types';

/** 取码场景：重置密码 */
export const RESET_SCENE: AuthCodeScene = 'reset';

/** 两步大标题 */
export function resetTitle(step: ResetStep): IAuthTitleLine[] {
  if (step === 1) {
    return [{ text: '找回账号' }];
  }
  return [{ text: '设置新密码' }];
}

/** 两步说明文案 */
export const RESET_DESC: Record<ResetStep, string> = {
  1: '先验证这条账号是你在用。',
  2: '改完这个账号所有已登录设备会退出。',
};
