/**
 * Mock 插件（vite-plugin-mock）
 *
 * 只在开发服务器（command === 'serve'）里生效，构建产物不含任何 mock 代码。
 * 关闭方式：`env/.env.development` 里加 `VITE_APP_MOCK=false`（或启动时 `VITE_APP_MOCK=false pnpm dev`）。
 *
 * 注意：mock 走 Vite 中间件，只有在**同源**请求上才拦得住，也就是 H5 + `VITE_APP_PROXY=true`
 * （此时 baseURL 是 `VITE_API_PREFIX`）。如果 baseURL 指向绝对地址（如 http://127.0.0.1:8000），
 * 请求不会经过 dev server，mock 自然不生效。
 */
import { viteMockServe } from 'vite-plugin-mock';

export function MockPlugin(enable: boolean, logger = false) {
  return viteMockServe({
    // 种子数据、类型、工具函数都放在 mocks 下，入口只有一个
    mockPath: 'mocks',
    configPath: 'mocks/index.ts',
    enable,
    // 改 mock 文件自动 reload（chokidar）
    watchFiles: true,
    // 每条请求打一行 [vite:mock]，排查「为什么没命中」时很有用
    logger,
    cors: true,
  });
}
