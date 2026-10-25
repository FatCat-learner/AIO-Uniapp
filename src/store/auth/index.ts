import type { IUserState } from './types';
import type { IAccountLoginRequest, ILoginResponse, IRegisterRequest } from '@/api/auth/types';
import { defineStore } from 'pinia';
import { accountLogin, getUserInfo, register } from '@/api/auth';

import { removeRefreshToken, removeToken, removeTokenType, setToken } from '@/utils/auth';

const useAuthStore = defineStore('auth', {
  state: (): IUserState => ({
    user_id: '',
    username: '',
    nickname: '',
    access_token: '',
    token_type: '',
    userInfo: undefined,
  }),
  actions: {
    /**
     * 写入用户信息 / token
     * 只覆盖真正传进来的字段：info() 只带 userInfo，login() 带 token + user，
     * 老实现无条件写 access_token 会把登录后的 token 冲成 undefined。
     */
    setInfo(partial: Partial<IUserState>): void {
      this.$patch((state: IUserState) => {
        if (partial.userInfo) {
          state.userInfo = partial.userInfo;
          state.user_id = partial.userInfo.id;
          state.username = partial.userInfo.username;
          state.nickname = partial.userInfo.nickname;
        }
        if (partial.access_token) {
          state.access_token = partial.access_token;
          state.token_type = partial.token_type ?? 'bearer';
        }
      });
    },
    // 重置用户信息
    resetInfo(): void {
      this.$reset();
    },

    // 获取用户信息
    async info(): Promise<void> {
      const result = await getUserInfo();
      this.setInfo({ userInfo: result });
    },
    // 异步登录并存储token（后端表单登录，返回 { access_token, token_type, user }）
    async login(loginForm: IAccountLoginRequest): Promise<ILoginResponse> {
      const res: ILoginResponse = await accountLogin(loginForm);
      if (res?.access_token) {
        setToken(res.access_token);
        this.setInfo({
          access_token: res.access_token,
          token_type: res.token_type,
          userInfo: res.user,
        });
      }
      return res;
    },
    /**
     * 退出登录：清 store、清本地 token、回首屏
     * 只做状态清理，跳转交给调用方（页面知道自己该去哪）
     */
    logout(): void {
      this.resetInfo();
      removeToken();
      removeRefreshToken();
      removeTokenType();
    },
    //   // // 小程序授权登录
    //   // authLogin(provider: providerType = 'weixin') {
    //   //   return new Promise((resolve, reject) => {
    //   //     uni.login({
    //   //       provider,
    //   //       success: async (result: UniApp.LoginRes) => {
    //   //         if (result.code) {
    //   //           const res = await authLoginByCode({ code: result.code });
    //   //           resolve(res);
    //   //         }
    //   //         else {
    //   //           reject(new Error(result.errMsg));
    //   //         }
    //   //       },
    //   //       fail: (err: any) => {
    //   //         console.error(`login error: ${err}`);
    //   //         reject(err);
    //   //       },
    //   //     });
    //   //   });
    //   // },
    // },
    async register(registerForm: IRegisterRequest): Promise<ILoginResponse> {
      const res: ILoginResponse = await register(registerForm);
      return res;
      // if (res) {

      // }
    },
  },
  persist: true,
});

export default useAuthStore;
