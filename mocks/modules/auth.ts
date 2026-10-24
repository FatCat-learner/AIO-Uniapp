/**
 * 认证接口 mock —— 对齐 `src/api/auth/index.ts`
 *   POST /auth/login      → LoginResult
 *   POST /auth/register   → UserInfo
 *   GET  /auth/user/me    → UserInfo
 *
 * 规则：
 * - 同一个 username 永远得到同一个用户（按 username reseed），反复登录看到的是同一份数据；
 * - 密码只校验「非空」，任意密码都能进，本地联调不会被登录卡住；
 * - 用户表在进程内，重启 dev server 即重置。
 */
import type { MockMethod } from 'vite-plugin-mock';
import type { LoginResult, UserInfo } from '../types';
import { faker, reseed } from '../utils/faker';
import { fail, ok } from '../utils/response';

interface StoredUser {
  password: string;
  user: UserInfo;
}

/** vite-plugin-mock 回调入参 */
interface MockParams {
  body?: Record<string, unknown> | string;
  query?: Record<string, unknown>;
}

const users = new Map<string, StoredUser>();

function str(value: unknown): string {
  return String(value ?? '').trim();
}

function bodyOf(body: MockParams['body']): Record<string, unknown> {
  if (!body)
    return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    }
    catch {
      return {};
    }
  }
  return body;
}

function createUser(username: string, nickname?: string): UserInfo {
  reseed(`user:${username}`);
  return {
    id: faker.string.uuid(),
    username,
    nickname: nickname || username,
    created_at: new Date(Date.now() - 86_400_000 * 200).toISOString(),
  };
}

function loginResult(user: UserInfo): LoginResult {
  reseed(`token:${user.username}`);
  return {
    access_token: `mock.${faker.string.alphanumeric(32)}`,
    token_type: 'bearer',
    refresh_token: `mock.${faker.string.alphanumeric(32)}`,
    user,
  };
}

export const authMock: MockMethod[] = [
  {
    url: '/auth/login',
    method: 'post',
    timeout: 120,
    response: ({ body }: MockParams) => {
      const data = bodyOf(body);
      const username = str(data.username);
      const password = str(data.password);
      if (!username || !password)
        return fail('账号和密码不能为空');

      const stored = users.get(username);
      if (stored && stored.password !== password)
        return fail('账号或密码错误', 401);

      if (!stored)
        users.set(username, { password, user: createUser(username) });

      return ok(loginResult(users.get(username)!.user), '登录成功');
    },
  },
  {
    url: '/auth/register',
    method: 'post',
    response: ({ body }: MockParams) => {
      const data = bodyOf(body);
      const username = str(data.username);
      const password = str(data.password);
      if (!username || !password)
        return fail('账号和密码不能为空');
      if (users.has(username))
        return fail('该账号已注册', 409);

      const user = createUser(username, str(data.nickname));
      users.set(username, { password, user });
      return ok(user, '注册成功');
    },
  },
  {
    url: '/auth/user/me',
    method: 'get',
    response: ({ query }: MockParams) => {
      const username = str(query?.username) || 'huangconghan';
      const stored = users.get(username);
      if (!stored)
        return ok(createUser(username, '聪汉'));
      return ok(stored.user);
    },
  },
];
