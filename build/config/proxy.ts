import type { ProxyOptions } from 'vite';

type ProxyTargetList = Record<string, ProxyOptions>;

export const createViteProxy = (env: Record<string, string>) => {
  const { VITE_APP_PROXY, VITE_API_PREFIX, VITE_API_BASE_URL } = env;
  // 不使用代理直接返回
  if (!JSON.parse(VITE_APP_PROXY)) return undefined;
  const proxy: ProxyTargetList = {
    // 后端所有路由都挂在 /api 下（aio-backend 的 app.include_router(..., prefix="/api")），
    // 所以这里只转发、不能把 /api 前缀 rewrite 掉，否则 /api/auth/login 到了后端变 /auth/login → 404
    [VITE_API_PREFIX]: {
      target: VITE_API_BASE_URL,
      changeOrigin: true,
    },
    // 动作库的 GIF / 缩略图在 /static 下（后端的 StaticFiles，不走 /api），
    // 不代理的话 H5 dev 里动作图全是 404
    '/static': {
      target: VITE_API_BASE_URL,
      changeOrigin: true,
    },
  };
  return proxy;
};
