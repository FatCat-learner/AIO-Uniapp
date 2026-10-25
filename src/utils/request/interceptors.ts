import type {
  HttpError,
  HttpRequestAbstract,
  HttpRequestConfig,
  HttpResponse,
} from 'uview-plus/libs/luch-request/index';
import { FIRST_SCREEN_URL, getToken, removeRefreshToken, removeToken, removeTokenType } from '@/utils/auth';
import storage from '@/utils/storage';
import { showMessage } from './status';

/**
 * 登录态失效：清掉本地凭证 + 回首屏重新登录。
 * 这里不 import auth store —— store 依赖 api 依赖 request，反向 import 会成环。
 */
const resetAuth = () => {
  removeToken();
  removeTokenType();
  removeRefreshToken();
  // pinia 持久化把整份 auth state 也存了一份，只清 token 的话刷新后又“复活”
  storage.remove('auth');
  uni.reLaunch({ url: FIRST_SCREEN_URL });
};

// 重试队列，每一项将是一个待执行的函数形式
// let requestQueue: (() => void)[] = [];

// 防止重复提交
const repeatSubmit = (config: HttpRequestConfig) => {
  const requestObj = {
    url: config.url,
    data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
    time: Date.now(),
  };
  const sessionObj = storage.getJSON('sessionObj');
  if (!sessionObj) {
    storage.setJSON('sessionObj', requestObj);
  }
  else {
    const s_url = sessionObj.url; // 请求地址
    const s_data = sessionObj.data; // 请求数据
    const s_time = sessionObj.time; // 请求时间
    const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
    if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
      const message = '数据正在处理，请勿重复提交';
      console.warn(`[${s_url}]: ${message}`);
      return Promise.reject(new Error(message));
    }
    else {
      storage.setJSON('sessionObj', requestObj);
    }
  }
};

// 是否正在刷新token的标记
// let isRefreshing: boolean = false;

// // 刷新token
// const refreshToken = async (http: HttpRequestAbstract, config: HttpRequestConfig) => {
//   // 是否在获取token中,防止重复获取
//   if (!isRefreshing) {
//     // 修改登录状态为true
//     isRefreshing = true;
//     // 等待登录完成
//     await useAuthStore().accountLogin();
//     // 登录完成之后，开始执行队列请求
//     requestQueue.forEach(cb => cb());
//     // 重试完了清空这个队列
//     requestQueue = [];
//     isRefreshing = false;
//     // 重新执行本次请求
//     return http.request(config);
//   }

//   return new Promise<HttpResponse<any>>((resolve) => {
//     // 将resolve放进队列，用一个函数形式来保存，等登录后直接执行
//     requestQueue.push(() => {
//       resolve(http.request(config));
//     });
//   });
// };

function requestInterceptors(http: HttpRequestAbstract) {
  /**
   * 请求拦截
   * @param {object} http
   */
  http.interceptors.request.use(
    (config: HttpRequestConfig) => {
      // 可使用async await 做异步操作
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
      config.data = config.data || {};
      // 自定义参数
      const custom = config?.custom;

      // 是否需要设置 token
      const isToken = custom?.auth === false;
      if (getToken() && !isToken) {
        // 后端 OAuth2PasswordBearer 只认 Authorization: Bearer <token>
        config.header = { ...(config.header || {}), Authorization: `Bearer ${getToken()}` };
      }

      // 是否显示 loading
      if (custom?.loading) {
        uni.showLoading({
          title: '加载中',
          mask: true,
        });
      }

      // 是否需要防止数据重复提交
      const isRepeatSubmit = custom?.repeatSubmit === false;
      if (!isRepeatSubmit && (config.method === 'POST' || config.method === 'UPLOAD')) {
        repeatSubmit(config);
      }
      return config;
    },
    (config: any) => // 可使用async await 做异步操作
      Promise.reject(config),
  );
}
function responseInterceptors(http: HttpRequestAbstract) {
  /**
   * 响应拦截
   * @param {object} http
   */
  http.interceptors.response.use((response: HttpResponse) => {
    /* 对响应成功做点什么 可使用async await 做异步操作 */
    const data = response.data;
    // 配置参数
    const config = response.config;
    // 自定义参数
    const custom = config?.custom;

    // 登录状态失效，清凭证回首屏；还没登录（拿不到 token 的登录请求）交给页面自己提示
    if (data.code === 401) {
      if (getToken()) {
        if (custom?.loading) {
          uni.hideLoading();
        }
        resetAuth();
      }
      return Promise.reject(data);
    }

    // 隐藏loading
    if (custom?.loading) {
      uni.hideLoading();
    }

    // 请求成功则返回结果
    // 后端信封里的 code 与 HTTP 状态码一致（注册成功是 201），所以按 2xx 判成功；
    // 只认 200 会让「注册成功」被当成失败：既弹了成功文案，又不会跳登录页。
    const bizCode = typeof data?.code === 'number' ? data.code : response.statusCode;
    if (bizCode >= 200 && bizCode < 300) {
      return response || {};
    }

    // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
    if (custom?.toast !== false) {
      uni.$u.toast(data.message);
    }

    // 请求失败则抛出错误
    return Promise.reject(data);
  }, (response: HttpError) => {
    // 自定义参数
    const custom = response.config?.custom;

    // 隐藏loading
    if (custom?.loading !== false) {
      uni.hideLoading();
    }

    // 登录态失效：已登录的 token 过期/被踢 → 清凭证 + 回首屏；
    // 本来就还没登录（如登录接口返回 401 密码错）→ 不跳转，让页面提示
    if (response.statusCode === 401) {
      if (getToken()) {
        resetAuth();
        return Promise.reject(response);
      }
      if (custom?.toast !== false) {
        uni.$u.toast(response.data?.message || '账号或密码错误');
      }
      return Promise.reject(response);
    }

    // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
    if (custom?.toast !== false) {
      const message = response.statusCode ? showMessage(response.statusCode) : '网络连接异常,请稍后再试!';
      uni.$u.toast(message);
    }

    return Promise.reject(response);
  });
}

export { requestInterceptors, responseInterceptors };
