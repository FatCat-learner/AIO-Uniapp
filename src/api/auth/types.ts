export interface IUserInfo {
  id: string;
  username: string;
  nickname: string;
  created_at: string;
}

export interface ILoginResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  user: IUserInfo;
}

export interface IAccountLoginRequest {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

export interface IRegisterRequest {
  username: string;
  password: string;
  nickname: string;
}

export type AuthAccountType = 'phone' | 'email';

/** 发送验证码的场景：注册 / 验证码登录 / 重置密码 */
export type AuthCodeScene = 'register' | 'login' | 'reset';

export interface IAuthCodeSendRequest {
  account_type: AuthAccountType;
  account: string;
  scene: AuthCodeScene;
  /** 图形码票据，后端校验通过才真的发短信 */
  challenge_ticket?: string;
}

export interface ICodeSendResponse {
  /** 开发期后端直接下发模拟验证码，前端用顶部弹窗展示 */
  code: string;
  expires_in: number;
  mock: boolean;
}

export interface ICodeLoginRequest {
  account_type: AuthAccountType;
  account: string;
  code: string;
}

export interface IRegisterByAccountRequest {
  account_type: AuthAccountType;
  account: string;
  code: string;
  nickname: string;
  password: string;
}

export interface IResetPasswordRequest {
  account_type: AuthAccountType;
  account: string;
  code: string;
  password: string;
}

export interface IOAuthLoginRequest {
  provider: 'wechat' | 'qq' | 'douyin' | 'alipay' | 'apple' | 'google';
  code: string;
  /** 未绑定时后端下发的绑定票据，注册完成后带上自动绑定 */
  bind_ticket?: string;
}
