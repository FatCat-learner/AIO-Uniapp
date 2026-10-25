import type {
  IAccountLoginRequest,
  IAuthCodeSendRequest,
  ICodeLoginRequest,
  ICodeSendResponse,
  ILoginResponse,
  IOAuthLoginRequest,
  IRegisterByAccountRequest,
  IRegisterRequest,
  IResetPasswordRequest,
  IUserInfo,
} from './types';
import { get, post } from '@/utils/request';

/** luch-request 的 data 声明成 object；urlencoded 要的是字符串，运行时按原样发出 */
type FormBody = Record<string | number | symbol, unknown>;

/** OAuth2 表单编码：后端 /auth/login 用 OAuth2PasswordRequestForm，只收 urlencoded */
const toFormUrlEncoded = (params: Record<string, unknown>) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

export const accountLogin = (data: IAccountLoginRequest) =>
  post<ILoginResponse>('/auth/login', {
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    data: toFormUrlEncoded(data as unknown as Record<string, unknown>) as unknown as FormBody,
    // 密码错=401，交给登录页提示，别让全局 401 逻辑把用户踢回首屏
    custom: { toast: false },
  });

export const getUserInfo = () => get<IUserInfo>('/users/me');

export const register = (data: IRegisterRequest) => post('/auth/register', { data });

/** 发送验证码（sms / email 同一入口，scene 区分用途） */
export const sendAuthCode = (data: IAuthCodeSendRequest) =>
  post<ICodeSendResponse>('/auth/code/send', { data });

/** 验证码登录 */
export const codeLogin = (data: ICodeLoginRequest) =>
  post<ILoginResponse>('/auth/login/code', { data, custom: { toast: false } });

/** 注册（账号 + 验证码 + 昵称 + 密码） */
export const registerByAccount = (data: IRegisterByAccountRequest) => post('/auth/register', { data });

/** 忘记密码：校验通过后重设 */
export const resetPassword = (data: IResetPasswordRequest) =>
  post('/auth/password/reset', { data, custom: { toast: false } });

/** 第三方快捷登录（未绑定时后端返回 bind_ticket，前端带去注册页） */
export const oauthLogin = (data: IOAuthLoginRequest) => post<ILoginResponse>('/auth/oauth/login', { data });
