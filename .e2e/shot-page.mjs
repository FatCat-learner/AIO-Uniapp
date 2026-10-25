/**
 * 页面截图工具（CDP 9222 的 headless Chrome）
 *
 * 用法：
 *   node .e2e/shot-page.mjs --route="/#/pages/workout-picker/index" [--out=.e2e/shot.png] [--wait=6000] [--auth]
 *
 * 说明：
 * - 走 9527 的 dev server（BASE 可改），先访问首页、可选写入登录 token，再跳到目标路由。
 * - --auth 用后端 dev 种子账号 admin/12345 换 token 写进 localStorage（键名见 src/utils/auth）。
 * - 产物默认 .e2e/shot.png（.gitignore 已忽略 .e2e/*.png）。
 * - Git Bash/MSYS 会把 `--route=/#/...` 当成 POSIX 路径改写，必须加 MSYS2_ARG_CONV_EXCL='*' 前缀。
 */
import fs from 'node:fs';

const CDP = 'http://127.0.0.1:9222';
const BASE = 'http://127.0.0.1:9527';
const API = 'http://127.0.0.1:8000';

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const flag = (name) => argv.includes(`--${name}`);

const ROUTE = arg('route', '/#/pages/index/index');
const OUT = arg('out', '.e2e/shot.png');
const WAIT = Number(arg('wait', '6000'));
const AUTH = flag('auth');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function login() {
  const form = new URLSearchParams({ username: 'admin', password: '12345', grant_type: 'password' });
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const body = await res.json();
  const data = body.data || body;
  if (!data.access_token) throw new Error(`登录失败：${JSON.stringify(body).slice(0, 200)}`);
  return data;
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const logs = [];
  ws.addEventListener('message', (ev) => {
    const msg = JSON.parse(ev.data);
    if (!msg.id && msg.method) {
      if (msg.method === 'Runtime.exceptionThrown')
        logs.push(`EXC ${msg.params?.exceptionDetails?.exception?.description ?? msg.params?.exceptionDetails?.text}`);
      else if (msg.method === 'Runtime.consoleAPICalled')
        logs.push(`${msg.params.type.toUpperCase()} ${(msg.params.args || []).map((a) => a.value ?? a.description).join(' ')}`);
      else if (msg.method === 'Log.entryAdded')
        logs.push(`${msg.params.entry.level.toUpperCase()} ${msg.params.entry.text}`);
      return;
    }
    if (msg.id && pending.has(msg.id)) {
      const { ok, bad } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? bad(new Error(JSON.stringify(msg.error))) : ok(msg.result);
    }
  });
  const ready = new Promise((r) => ws.addEventListener('open', r));
  const send = (method, params = {}) =>
    new Promise((ok, bad) => {
      const mid = ++id;
      pending.set(mid, { ok, bad });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  return { ready, send, close: () => ws.close(), logs };
}

(async () => {
  const list = await (await fetch(`${CDP}/json/list`)).json();
  const page = list.find((t) => t.type === 'page');
  if (!page) throw new Error('没有可用的 page target，先起一个 headless Chrome（--remote-debugging-port=9222）');

  const { ready, send, close, logs } = connect(page.webSocketDebuggerUrl);
  await ready;

  /* 收集页面控制台与未捕获异常，便于排查「页面空白/没数据」这类问题 */
  await send('Runtime.enable');
  await send('Log.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await send('Page.navigate', { url: `${BASE}/` });
  await sleep(1200);

  if (AUTH) {
    const data = await login();
    await send('Runtime.evaluate', {
      expression: `localStorage.setItem('token', ${JSON.stringify(data.access_token)});
        localStorage.setItem('tokenType', ${JSON.stringify(data.token_type || 'bearer')});
        'ok'`,
    });
  }

  await send('Page.navigate', { url: `${BASE}${ROUTE}` });
  await sleep(WAIT);

  const EVAL = arg('eval', '');
  if (EVAL) {
    const res = await send('Runtime.evaluate', { expression: EVAL, awaitPromise: true });
    if (res.exceptionDetails) throw new Error(`--eval 出错：${JSON.stringify(res.exceptionDetails).slice(0, 200)}`);
    if (res.result && res.result.value !== undefined) console.log('eval →', String(res.result.value).slice(0, 400));
    await sleep(Number(arg('after', '900')));
  }

  const { data: shot } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(OUT, Buffer.from(shot, 'base64'));
  if (flag('logs') && logs.length) console.log('--- 页面日志 ---\n' + logs.slice(-15).join('\n'));
  console.log('saved', OUT);
  close();
})().catch((err) => {
  console.error('FAIL', err.message);
  process.exit(1);
});
