import type { IAccountValue } from '@/components/auth/constants';
import storage from '@/utils/storage';

export const TokenKey: string = 'token';
export const TokenType = 'tokenType';
export const RefreshTokenKey: string = 'refresh_token';

/** 未登录时统一落到首屏（Welcome），由首屏「开始使用」进登录页 */
export const FIRST_SCREEN_URL = '/pages/welcome/index';

export const getTokenType = (): string => {
  return storage.get(TokenType);
};

export const getToken = (): string => {
  return storage.get(TokenKey);
};

export const getRefreshToken = (): string => {
  return storage.get(RefreshTokenKey);
};

export const setTokenType = (value: string): void => {
  storage.set(TokenType, value);
};

export const setToken = (value: string): void => {
  storage.set(TokenKey, value);
};

export const setRefreshToken = (value: string): void => {
  storage.set(RefreshTokenKey, value);
};

export const removeTokenType = (): void => {
  storage.remove(TokenType);
};

export const removeToken = (): void => {
  storage.remove(TokenKey);
};

export const removeRefreshToken = (): void => {
  storage.remove(RefreshTokenKey);
};

/** 注册成功后带回登录页的账号密码 */
export interface IAuthPrefill {
  account: IAccountValue;
  password: string;
}

/**
 * 交接只走内存：密码进 URL 会落进浏览器历史 / 访问日志，进 storage 会被持久化，
 * 而这里只需要撑过 reLaunch 那一次跳转。
 */
let authPrefill: IAuthPrefill | null = null;

export const setAuthPrefill = (value: IAuthPrefill): void => {
  authPrefill = value;
};

/** 取一次就清空：下次自己走到登录页时不该再被旧值覆盖 */
export const takeAuthPrefill = (): IAuthPrefill | null => {
  const value = authPrefill;
  authPrefill = null;
  return value;
};

/** 后端错误体里 data.reason 的取值：账号没注册 */
export const ACCOUNT_NOT_REGISTERED = 'account_not_registered';

interface IErrorEnvelope {
  code?: number | string;
  message?: string;
  data?: { reason?: string } | null;
}

/**
 * 请求失败时的拒因有两种形状：HTTP 层错误（信封在 error.data 里）和
 * 业务错误（error 本身就是信封）。按「有没有 code」认出来，免得页面各写一套。
 */
const pickErrorEnvelope = (error: any): IErrorEnvelope | undefined => {
  const maybe = error?.data;
  if (maybe && typeof maybe === 'object' && 'code' in maybe) return maybe as IErrorEnvelope;
  return error as IErrorEnvelope | undefined;
};

export const getErrorReason = (error: any): string | undefined => pickErrorEnvelope(error)?.data?.reason;

export const getErrorMessage = (error: any, fallback: string): string =>
  pickErrorEnvelope(error)?.message || error?.message || fallback;
