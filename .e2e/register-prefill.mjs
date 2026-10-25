/** 注册 → 回登录页（账号密码已预填）E2E，走 CDP 9222 的 headless Chrome */
const BASE = 'http://127.0.0.1:9527';
const CDP = 'http://127.0.0.1:9222';
const PASSWORD = 'Aa12345678';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function openTarget() {
  // headless 里新建 tab 的 /json/new 不认 url，直接复用已有 9527 页面再导航
  const list = await (await fetch(`${CDP}/json/list`)).json();
  const page = list.find(t => t.type === 'page' && t.url.includes('9527')) || list.find(t => t.type === 'page');
  if (!page) throw new Error('没有可用的 page target');
  return page;
}

function connect(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve: ok, reject: bad } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? bad(new Error(JSON.stringify(msg.error))) : ok(msg.result);
      }
    });
    ws.addEventListener('error', reject);
    ws.addEventListener('open', () => {
      const send = (method, params = {}) => new Promise((ok, bad) => {
        const mid = ++id;
        pending.set(mid, { resolve: ok, reject: bad });
        ws.send(JSON.stringify({ id: mid, method, params }));
      });
      resolve({ send, close: () => ws.close() });
    });
  });
}

async function main() {
  const target = await openTarget();
  const cdp = await connect(target.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  // 直接 reload 带 hash 的深链会被启动逻辑弹回 welcome：
  // 先在 welcome 冷启动，再用 hash 走客户端路由进注册页（每次都是干净的 step1）
  await cdp.send('Page.navigate', { url: `${BASE}/#/pages/welcome/index` });
  await sleep(600);
  await cdp.send('Page.reload', { ignoreCache: true });

  const evaluate = async (expression) => {
    const res = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (res.exceptionDetails) throw new Error(JSON.stringify(res.exceptionDetails));
    return res.result.value;
  };
  /** expr 返回 uni-input 外壳或原生 input；外壳会自动下钻到真正的 <input> */
  const inputExpr = (expr) => `(() => { const host = (${expr}); if (!host) return null; return host.tagName === 'INPUT' ? host : host.querySelector('input'); })()`;
  const typeInto = async (expr, text) => {
    const ok = await evaluate(`(() => { const el = ${inputExpr(expr)}; if (!el) return false; el.focus(); el.select(); return true; })()`);
    if (!ok) throw new Error(`没找到输入框: ${expr}`);
    await cdp.send('Input.insertText', { text });
    await sleep(150);
    return evaluate(`${inputExpr(expr)}.value`);
  };
  const clickText = async (needle, exact = false) => {
    const hit = await evaluate(`(() => {
      const all = [...document.querySelectorAll('uni-view, uni-text, uni-button, view, text, button')];
      const match = n => ${exact} ? n.textContent.trim() === ${JSON.stringify(needle)} : n.textContent.includes(${JSON.stringify(needle)});
      const el = all.filter(match).pop();
      if (!el) return null;
      el.click();
      return el.textContent.trim().slice(0, 30);
    })()`);
    if (!hit) throw new Error(`没找到可点的「${needle}」`);
    await sleep(450);
    return hit;
  };

  await sleep(2500);
  await evaluate(`location.hash = '#/pages/register/index'`);
  await sleep(1200);
  console.log('step1 inputs:', await evaluate(`[...document.querySelectorAll('input')].map(i => i.placeholder)`));

  const phone = `138${String(Math.floor(Math.random() * 1e8)).padStart(8, '0')}`;
  console.log('phone:', await typeInto(`document.querySelector('.acc__input')`, phone));

  // ① 图形码弹窗
  await clickText('获取验证码', true);
  await sleep(500);
  const captcha = await evaluate(`[...document.querySelectorAll('.cap__char')].map(e => e.textContent.trim()).join('')`);
  console.log('captcha:', captcha);
  await typeInto(`document.querySelector('.cap__input')`, captcha);
  await clickText('确认并发送', true);
  await sleep(900);

  const bodyText = await evaluate(`document.body.innerText`);
  const code = (bodyText.match(/\b(\d{6})\b/) || [])[1];
  console.log('code:', code, '| snippet:', bodyText.slice(0, 160).replace(/\n/g, ' / '));
  if (!code) throw new Error('没在页面里读到验证码');

  await typeInto(`document.querySelector('.code__input')`, code);
  await clickText('验证并继续', true);
  await sleep(700);

  console.log('step2 inputs:', JSON.stringify(await evaluate(`[...document.querySelectorAll('input')].map(i => ({ ph: i.placeholder, v: i.value }))`)));

  await typeInto(`document.querySelectorAll('.pwd__input')[0]`, PASSWORD);
  await typeInto(`document.querySelectorAll('.pwd__input')[1]`, PASSWORD);
  await clickText('我已阅读并同意');
  console.log('terms on:', await evaluate(`!!document.querySelector('.is-on') && document.body.innerText.includes('我已阅读并同意')`));
  await clickText('创建账号', true);
  await sleep(1200);
  console.log('after submit text:', await evaluate(`document.body.innerText.split(String.fromCharCode(10)).join(' / ')`));
  await sleep(2000);

  const after = await evaluate(`({
    hash: location.hash,
    inputs: [...document.querySelectorAll('input')].map(i => ({ ph: i.placeholder, v: i.value })),
    text: document.body.innerText.slice(0, 160).split(String.fromCharCode(10)).join(' / '),
  })`);
  console.log('after register:', JSON.stringify(after, null, 2));

  const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  const { writeFileSync } = await import('node:fs');
  writeFileSync('F:/Code/AIOSport/aio-uni-app-x/.e2e/login-prefilled.png', Buffer.from(shot.data, 'base64'));
  console.log('screenshot saved');

  cdp.close();
}

main().catch((err) => {
  console.error('E2E FAILED:', err.message);
  process.exit(1);
});
