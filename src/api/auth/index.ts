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

export const accountLogin = (data: IAccountLoginRequest) => post<ILoginResponse>('/auth/login', { data });

export const getUserInfo = () => get<IUserInfo>('/users/me');

export const register = (data: IRegisterRequest) => post('/auth/register', { data });

/** 发送验证码（sms / email 同一入口，scene 区分用途） */
export const sendAuthCode = (data: IAuthCodeSendRequest) =>
  post<ICodeSendResponse>('/auth/code/send', { data });

/** 验证码登录 */
export const codeLogin = (data: ICodeLoginRequest) => post<ILoginResponse>('/auth/login/code', { data });

/** 注册（账号 + 验证码 + 昵称 + 密码） */
export const registerByAccount = (data: IRegisterByAccountRequest) => post('/auth/register', { data });

/** 忘记密码：校验通过后重设 */
export const resetPassword = (data: IResetPasswordRequest) => post('/auth/password/reset', { data });

/** 第三方快捷登录（未绑定时后端返回 bind_ticket，前端带去注册页） */
export const oauthLogin = (data: IOAuthLoginRequest) => post<ILoginResponse>('/auth/oauth/login', { data });
