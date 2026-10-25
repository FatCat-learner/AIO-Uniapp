/** 首屏定值形状：出口路由 + 条款入口文案 */
export interface IWelcomeCopy {
  /** 唯一出口：登录页 */
  loginPath: string;
  serviceTerms: string;
  privacyTerms: string;
  /** 条款页未接入时的提示后缀 */
  termsPendingSuffix: string;
}
