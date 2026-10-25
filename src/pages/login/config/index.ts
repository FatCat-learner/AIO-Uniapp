import type { IAuthTitleLine } from '@/components/auth/constants';

/** 登录页（§16.1 P2）：两行大标题，第二行走品牌色 */
export const LOGIN_TITLE: IAuthTitleLine[] = [
  { text: '今天练的每一组' },
  { text: '明天都算数', brand: true },
];

export const LOGIN_DESC = '回来继续，上次的计划还排在原来的位置。';

/** 登录 / 快捷登录成功后的落地页 */
export const HOME_URL = '/pages/index/index';
export const CODE_LOGIN_URL = '/pages/code-login/index';
export const RESET_PASSWORD_URL = '/pages/reset-password/index';
export const REGISTER_URL = '/pages/register/index';
