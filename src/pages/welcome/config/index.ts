import type { IWelcomeCopy } from './types';

export * from './types';

/** 首屏只有「开始使用」一个出口，条款页还没做，先留名字给 toast 兜底 */
export const WELCOME_COPY: IWelcomeCopy = {
  loginPath: '/pages/login/index',
  serviceTerms: '服务条款',
  privacyTerms: '隐私政策',
  termsPendingSuffix: '（待接入）',
};
