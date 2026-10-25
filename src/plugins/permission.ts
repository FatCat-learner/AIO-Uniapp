import { FIRST_SCREEN_URL, getToken } from '@/utils/auth';

/**
 * 登录守卫：白名单 + token 判定。
 *
 * 未登录时一律回首屏（Welcome），由首屏唯一的「开始使用」进入登录页；
 * 启动直接进首屏不经过下面这些 uni API，所以 App.vue 的 onLaunch 里还要单独判一次。
 */
const whiteList = [
  '/pages/welcome/index',
  '/pages/login/index',
  '/pages/register/index',
  '/pages/code-login/index',
  '/pages/reset-password/index',
];

function isWhiteListed(path: string): boolean {
  const clean = path.split('?')[0];
  return whiteList.some(item => clean.startsWith(item));
}

export function hasPerm(path = ''): boolean {
  const allowed = isWhiteListed(path) || !!getToken();
  if (!allowed) {
    uni.reLaunch({ url: FIRST_SCREEN_URL });
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
