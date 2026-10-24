/**
 * @name createVitePlugins
 * @description 封装plugins数组统一调用
 */
import type { PluginOption } from 'vite';
import UniPlugin from '@dcloudio/vite-plugin-uni';
import ViteRestart from 'vite-plugin-restart';
import { AutoImportPlugin } from './autoImport';
// import { ConfigImageminPlugin } from './imagemin';
// import { ReplaceUrlPlugin } from './replaceUrl';
import { AutoComponentsPlugin } from './component';
import { MCPPlugin } from './mcp';
import { MockPlugin } from './mock';
import { UnoCSSPlugin } from './unocss';

/** env 里与 mock 相关的开关 */
type EnvLike = Record<string, string | undefined>;

export default function createVitePlugins(isBuild: boolean, env: EnvLike = {}) {
  // 开发环境默认开启 mock；env/.env.development 里写 VITE_APP_MOCK=false 关闭
  const mockEnabled = !isBuild && env.VITE_APP_MOCK !== 'false';
  // 需要看请求命中情况时打开 VITE_APP_MOCK_LOG=true
  const mockLogger = env.VITE_APP_MOCK_LOG === 'true';

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // UnoCSS配置
    UnoCSSPlugin(),
    // 自动按需引入依赖
    AutoImportPlugin(),
    // 自动按需引入组件(注意：需注册至 uni 之前，否则不会生效)
    AutoComponentsPlugin(),
    // 接口 mock（mocks/ 目录，vite-plugin-mock + faker）
    MockPlugin(mockEnabled, mockLogger),
    // uni支持(兼容性写法，当type为module时，必须要这样写)
    (UniPlugin as any).default(),
    ViteRestart({
      // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
      restart: ['vite.config.ts'],
    }),
    // 为项目开启 MCP Server
    MCPPlugin(),
  ];

  if (isBuild) {
    const buildPlugins: (PluginOption | PluginOption[])[] = [
      // 图片资源自动转换为网络资源
      // ReplaceUrlPlugin(),
      // 自动清除本地图片
      // CleanImagePlugin(),
      // 打包视图分析
      // VisualizerPlugin(),
    ];
    vitePlugins.push(...buildPlugins);
  }

  return vitePlugins;
}
