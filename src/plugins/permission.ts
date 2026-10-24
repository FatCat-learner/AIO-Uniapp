import { getToken } from '@/utils/auth';

/**
 * 权限校验（模板遗留，当前无人 import）
 * 原来依赖一个不存在的 @/router 模块，改成自包含实现：
 * 白名单 + token 判定，未登录统一跳登录页并带上 redirect。
 */
const whiteList = ['/pages/welcome/index', '/pages/login/index', '/pages/register/index'];

export function hasPerm(path = ''): boolean {
  const clean = path.split('?')[0].replace(/^\//, '/');
  const allowed = whiteList.some(item => clean.startsWith(item)) || !!getToken();
  if (!allowed) {
    uni.redirectTo({ url: `/pages/login/index?redirect=${encodeURIComponent(path)}` });
  }
  return allowed;
}

function setupPermission() {
  // 注意：拦截 uni.switchTab 本身没有问题，但小程序端点 tabBar 不触发 uni.switchTab，
  // 这类场景要在 tab 页的 onShow 里自己判断。
  (['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'] as const).forEach((item) => {
    uni.addInterceptor(item, {
      invoke(args: { url: string }) {
        return hasPerm(args.url);
      },
    });
  });
}

export default setupPermission;
