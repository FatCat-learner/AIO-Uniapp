import type { IUserState } from './types';
import type { IAccountLoginRequest, ILoginResponse, IRegisterRequest } from '@/api/auth/types';
import { defineStore } from 'pinia';
import { accountLogin, getUserInfo, register } from '@/api/auth';

import { removeRefreshToken, removeToken, removeTokenType, setToken } from '@/utils/auth';

const useAuthStore = defineStore('auth', {
  state: (): IUserState => ({
    user_id: '',
    username: 'admin',
    nickname: '',
    access_token: '',
    token_type: '',
    userInfo: undefined,
  }),
  getters: {
    userInfo(state: IUserState): IUserState | undefined {
      return { ...state };
    },
  },
  actions: {
    // 设置用户的信息
    setInfo(partial: Partial<IUserState>): void {
      this.$patch((state: IUserState) => {
        state.user_id = partial.userInfo?.id;
        state.username = partial.userInfo?.username;
        state.nickname = partial.userInfo?.nickname;
        state.access_token = partial.access_token;
        state.token_type = partial.token_type;
        state.userInfo = partial.userInfo;
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
    // 异步登录并存储token
    async login(loginForm: IAccountLoginRequest): Promise<ILoginResponse> {
      const res: ILoginResponse = await accountLogin(loginForm);
      const token = res.access_token;
      if (token) {
        setToken(token);
        this.setInfo(res);
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
