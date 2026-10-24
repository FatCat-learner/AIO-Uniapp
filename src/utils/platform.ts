/**
 * 端判定：快捷登录要按平台给 Apple 还是 Google，小程序里只留微信。
 * 用条件编译而不是运行时 UA——UA 在 WebView 里经常被改。
 * 三个 #ifdef 分支写成赋值而不是 return，避免 vue-tsc 报 unreachable。
 */
let cached: 'ios' | 'android' | 'mp' | '' = ''

export function isMiniProgram(): boolean {
  let mp = false
  // #ifdef MP
  mp = true
  // #endif
  return mp
}

export function detectPlatform(): 'ios' | 'android' | 'mp' {
  if (cached) return cached

  let result: 'ios' | 'android' | 'mp' = 'ios'

  // #ifdef MP
  result = 'mp'
  // #endif

  // #ifdef H5
  const ua = ((globalThis as any).navigator?.userAgent || '').toLowerCase()
  result = /android/.test(ua) ? 'android' : 'ios'
  // #endif

  // #ifdef APP-PLUS
  result = (uni.getSystemInfoSync().platform || '').toLowerCase() === 'android' ? 'android' : 'ios'
  // #endif

  cached = result
  return result
}
