# mocks —— 全局 mock 数据与接口

一个目录装下所有假数据：页面直接吃的静态种子、开发服务器用的接口处理器、以及和后端同口径的类型。

技术栈：**vite-plugin-mock 3**（Vite 中间件拦截）+ **faker 10（zh_CN）**（生成虚拟数据）。

## 目录

```
mocks/
├── index.ts            # 唯一入口：汇总各模块接口，统一拼 VITE_API_PREFIX 前缀
├── types.ts            # 数据契约（= 未来后端的返回结构），页面与 mock 共用
├── data/
│   ├── home.ts         # 首页静态 fixture（homeMock），卡片组件直接用
│   └── catalog.ts      # 动作/食物/计划/路书种子（发现页 + 检索接口共用）
├── modules/
│   ├── auth.ts         # /auth/login /auth/register /auth/user/me
│   ├── home.ts         # /home
│   ├── catalog.ts      # /actions /foods /plans /routes
│   └── workout.ts      # /workouts /workouts/:id /body/metrics
└── utils/
    ├── faker.ts        # faker 实例、可复现随机（reseed）、格式化工具
    └── response.ts     # ok / fail / paginate / 过滤工具
```

## 用法

- **页面要静态数据**：`import { homeMock } from '@mocks/data/home'`、`import { ACTIONS } from '@mocks/data/catalog'`。
- **页面要类型**：`import type { HomeData, ActionRow } from '@mocks/types'`。
- **联调真实请求**：直接调 `src/api` 里的函数，dev 下被中间件拦下并返回 mock：
  ```ts
  import { accountLogin } from '@/api/auth';

  await accountLogin({ username: 'huangconghan', password: '123456' });
  ```

## 开关

| 变量 | 位置 | 作用 |
| --- | --- | --- |
| `VITE_APP_MOCK` | `env/.env.development` | 设成 `false` 关闭 mock（走真实后端） |
| `VITE_APP_MOCK_LOG` | 同上 | 设成 `true` 时每条命中打一行 `[vite:mock] request invoke` |
| `VITE_APP_PROXY` | 同上 | 必须为 `true`，baseURL 才会是同源的 `VITE_API_PREFIX`，mock 才拦得住 |

> mock 是 Vite 中间件，只拦**同源**请求。H5 + 代理模式才生效；`baseURL` 是绝对地址（如 `http://127.0.0.1:8000`）时请求根本不经过 dev server。小程序端同样不走 Vite 中间件。

## 生成数据的约定

- **结构固定、数字随机**：卡片顺序、状态机、图标由设计稿决定，faker 只换数字，避免联调时出现「结构不对」的假问题。
- **可复现**：列表类接口入口 `reseed('workouts:2')`，同一个 URL 每次返回同一批数据，翻页/截图不跳。
- **中文**：统一 `fakerZH_CN`，不要用默认 `faker`（会生成英文名）。

## 新增一个 mock 接口

1. 在 `mocks/types.ts` 加返回类型（如果是新结构）。
2. 在 `mocks/modules/<域>.ts` 里往导出数组 push 一项：
   ```ts
   export const fooMock: MockMethod[] = [
     { url: '/foo/:id', method: 'get', response: ({ query }) => ok({ id: query.id }) },
   ];
   ```
   `url` 只写业务路径，**不要带 `/api` 前缀**，前缀在 `mocks/index.ts` 统一拼。
3. 若是新模块，在 `mocks/index.ts` 的 `mockHandlers` 里展开。
4. `response` 里先用 `reseed(key)` 再生成，保证可复现。

## 验收命令

<!-- eslint-skip -->
```bash
pnpm dev:h5                       # 起 H5 dev server
bash scripts/mock-smoke.sh        # 一键自检：自己拉起 dev server、打 5 个接口、退出
curl http://localhost:$PORT/api/home | head -c 400
curl -X POST http://localhost:$PORT/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"huangconghan","password":"123456"}'
```
