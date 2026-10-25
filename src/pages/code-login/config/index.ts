import type { AuthCodeScene } from '@/api/auth/types';
import type { IAuthTitleLine } from '@/components/auth/constants';

/** 验证码登录页（§16.1 P3）：单行标题 */
export const CODE_LOGIN_TITLE: IAuthTitleLine[] = [
  { text: '不用记密码' },
];

export const CODE_LOGIN_DESC = '一条验证码登录，换设备也不用慌。';

/** 取码场景：登录（后端据此选短信 / 邮件模板） */
export const CODE_LOGIN_SCENE: AuthCodeScene = 'login';
