/**
 * 账号与安全 · 常量
 * 依据：AIO运动助手 产品设计文档 V2.0 §16（账号与安全）
 */

export type AccountType = 'phone' | 'email';
export type OAuthProvider = 'wechat' | 'qq' | 'douyin' | 'alipay' | 'apple' | 'google';

export interface ICountry {
  dial: string;
  name: string;
}

export interface IAccountValue {
  type: AccountType;
  dial: string;
  value: string;
}

/** AuthScaffold 的一行大标题：brand = 该行走品牌色 */
export interface IAuthTitleLine {
  text: string;
  brand?: boolean;
}

/** 顶部提示条（开发期模拟验证码在这里展示） */
export interface IAuthNotice {
  visible: boolean;
  title: string;
  message: string;
}

/** 区号面板：先放 12 个高频地区，后续按使用量排序 */
export const COUNTRIES: ICountry[] = [
  { dial: '+86', name: '中国大陆' },
  { dial: '+852', name: '中国香港' },
  { dial: '+886', name: '中国台湾' },
  { dial: '+853', name: '中国澳门' },
  { dial: '+65', name: '新加坡' },
  { dial: '+60', name: '马来西亚' },
  { dial: '+81', name: '日本' },
  { dial: '+82', name: '韩国' },
  { dial: '+1', name: '美国 / 加拿大' },
  { dial: '+44', name: '英国' },
  { dial: '+61', name: '澳大利亚' },
  { dial: '+49', name: '德国' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export function createAccountValue(type: AccountType = 'phone'): IAccountValue {
  return { type, dial: DEFAULT_COUNTRY.dial, value: '' };
}

/** 验证码输入框下方提示：四个入口共用同一句，别再各写各的 */
export const CODE_TIP = '验证码 5 分钟内有效，最多试 5 次；60 秒后可重发。';

/** 模拟验证码提示：三个取码入口共用标题，正文按场景选一句 */
export const CODE_NOTICE_TITLE = '模拟验证码已生成';
export const CODE_NOTICE_HINT_LOGIN = '开发期不发短信，直接用它登录';
export const CODE_NOTICE_HINT_REUSE = '开发期不发送短信，直接填它继续';

/** 注册 / 忘记密码成功后回登录页（改密会让所有已登录设备退出） */
export const LOGIN_PAGE_URL = '/pages/login/index';
/** 成功 toast 停留一下再跳转，避免提示还没看清就换页 */
export const AUTH_REDIRECT_DELAY = 600;

/** 密码规则：注册② 与 忘记密码② 完全一致（§16.12） */
export const PASSWORD_RULES = [
  { key: 'cap', label: '首位为大写字母', test: (v: string) => /^[A-Z]/.test(v) },
  { key: 'low', label: '含小写字母', test: (v: string) => /[a-z]/.test(v) },
  { key: 'num', label: '含数字', test: (v: string) => /\d/.test(v) },
  { key: 'len', label: '8–32 位，无空格', test: (v: string) => /^\S{8,32}$/.test(v) },
] as const;

export const PASSWORD_HINT = '含大小写与数字，8–32 位';

export const OAUTH_ITEMS: { key: OAuthProvider; label: string; color: string }[] = [
  { key: 'wechat', label: '微信', color: '#4ade80' },
  { key: 'qq', label: 'QQ', color: '#38bdf8' },
  { key: 'douyin', label: '抖音', color: '#f472b6' },
  { key: 'alipay', label: '支付宝', color: '#60a5fa' },
  { key: 'apple', label: 'Apple', color: '#ffffff' },
  { key: 'google', label: 'Google', color: '#ffffff' },
];

export const BRAND_MARK_SVG = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBkPSJNMjQgOS41IEwzOSA0MCBIMzAuNSBMMjQgMjUuNSBMMTcuNSA0MCBIOSBaIiBmaWxsPSIjYzlmMDNhIi8+PC9zdmc+';
