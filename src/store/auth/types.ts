import type { IUserInfo } from '@/api/auth/types';

export type RoleType = '' | '*' | 'user';

export type providerType
  = | 'weixin'
    | 'qq'
    | 'sinaweibo'
    | 'xiaomi'
    | 'apple'
    | 'univerify'
    | undefined;

export interface IUserState {
  user_id?: string;
  username?: string;
  nickname?: string;
  access_token?: string;
  token_type?: string;
  userInfo?: IUserInfo;
}
