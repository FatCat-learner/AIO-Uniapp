import type { RegisterStep } from './types';
import type { AuthCodeScene } from '@/api/auth/types';
import type { AccountType, IAuthTitleLine } from '@/components/auth/constants';

export * from './types';

/** 注册②：昵称输入框的占位与预填值（设计稿预填 James） */
export const NICKNAME_PLACEHOLDER = '怎么称呼你';
export const NICKNAME_SEED = 'James';
/** 昵称留空时提交给后端的兜底值 */
export const NICKNAME_FALLBACK = '训练者';

export const TERMS_TEXT = '我已阅读并同意 服务条款 与 隐私政策，训练数据只用于给我自己看。';

/** 取码场景：注册 */
export const REGISTER_SCENE: AuthCodeScene = 'register';

/** 两步大标题：第 1 步第二行跟着手机号 / 邮箱切换 */
export function registerTitle(step: RegisterStep, type: AccountType): IAuthTitleLine[] {
  if (step === 1) {
    return [{ text: '先验证' }, { text: type === 'phone' ? '手机号' : '邮箱', brand: true }];
  }
  return [{ text: '设置' }, { text: '昵称与密码', brand: true }];
}

/** 两步说明文案 */
export const REGISTER_DESC: Record<RegisterStep, string> = {
  1: '验证通过才建号，一个号只建一次。',
  2: '建完直接登录，训练计划马上排进本周。',
};
