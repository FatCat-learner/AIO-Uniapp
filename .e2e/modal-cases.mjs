const CDP = 'http://127.0.0.1:9222';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const list = await (await fetch(`${CDP}/json/list`)).json();
const page = list.find(t => t.type === 'page' && t.url.includes('9527'));
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const p = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m.result ?? m.error); p.delete(m.id); } });
await new Promise(r => ws.addEventListener('open', r));
const send = (m, params = {}) => new Promise(ok => { p.set(++id, ok); ws.send(JSON.stringify({ id, method: m, params })); });
const ev = async x => {
  const r = await send('Runtime.evaluate', { expression: x, returnByValue: true });
  if (r.exceptionDetails) return 'EXC: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 200);
  return r.result?.value;
};
const log = (...a) => console.log(a.join(' '));
const shot = async (name) => {
  const s = await send('Page.captureScreenshot', { format: 'png' });
  const { writeFile } = await import('node:fs/promises');
  await writeFile(`.e2e/${name}.png`, Buffer.from(s.data, 'base64'));
};
const boot = async (hash) => {
  await send('Page.navigate', { url: page.url.split('#')[0] + '#/pages/welcome/index' });
  await send('Page.reload', { ignoreCache: true });
  await sleep(3500);
  await ev(`location.hash = '${hash}'`);
  await sleep(1300);
};
const fill = `(sel, v) => { const el = document.querySelector(sel) || document.querySelectorAll('input')[0]; const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); }`;

log('connected'); await send('Page.enable'); log('page enabled');

// === 1. 密码登录 + 未注册账号 ===
log('boot login'); await boot('#/pages/login/index'); log('login booted');
await ev(`(() => { const f = ${fill}; f('.acc__input input', '13900000000'); f('.pwd__input input', 'Aa12345678'); return [...document.querySelectorAll('input')].map(i => i.value); })()`);
await sleep(300);
await ev(`(() => { [...document.querySelectorAll('uni-button')].filter(n => n.textContent.trim() === '登录').pop().click(); return true; })()`);
await sleep(1200);
const pwdResult = await ev(`(() => ({
  dialog: !!document.querySelector('.unu'),
  toasts: [...document.querySelectorAll('[class*=toast]')].map(n => n.innerText.trim()).filter(Boolean),
  body: document.body.innerText.slice(0, 100),
}))()`);
console.log('1) 密码登录未注册 =>', JSON.stringify(pwdResult));
await shot('login-wrong-credentials');

// === 2. 验证码登录 + 未注册账号 ===
log('boot code-login'); await boot('#/pages/code-login/index'); log('code-login booted');
await ev(`(() => { const f = ${fill}; f('.acc__input input', '13900000000'); f('.code__input input', '123456'); return true; })()`);
await sleep(300);
await ev(`(() => { [...document.querySelectorAll('uni-button')].filter(n => n.textContent.trim() === '登录').pop().click(); return true; })()`);
await sleep(1500);
console.log('2) 弹窗 =>', await ev(`(() => { const p = document.querySelector('.unu__panel'); return p ? p.innerText.split(String.fromCharCode(10)).join(' | ') : 'NO DIALOG'; })()`));
await shot('code-login-unregistered-dialog');

// X 关闭：什么都不做，只收起
await ev(`document.querySelector('.unu__close').click()`);
await sleep(600);
console.log('3) X 关闭后 =>', await ev(`({ dialog: !!document.querySelector('.unu'), hash: location.hash, account: (document.querySelector('.acc__input input') || {}).value })`));

// 再触发一次，点「换个账号」
await ev(`(() => { [...document.querySelectorAll('uni-button')].filter(n => n.textContent.trim() === '登录').pop().click(); return true; })()`);
await sleep(1500);
await ev(`(() => { const b = [...document.querySelectorAll('.unu__btn')].find(n => n.textContent.trim() === '换个账号'); b.click(); return true; })()`);
await sleep(700);
console.log('4) 换个账号后 =>', await ev(`({ dialog: !!document.querySelector('.unu'), account: (document.querySelector('.acc__input input') || {}).value })`));

// 再触发一次，点「去注册」
await ev(`(() => { const f = ${fill}; f('.acc__input input', '13900000000'); f('.code__input input', '123456'); return true; })()`);
await sleep(300);
await ev(`(() => { [...document.querySelectorAll('uni-button')].filter(n => n.textContent.trim() === '登录').pop().click(); return true; })()`);
await sleep(1500);
await ev(`(() => { const b = [...document.querySelectorAll('.unu__btn')].find(n => n.textContent.trim() === '去注册'); b.click(); return true; })()`);
await sleep(1600);
console.log('5) 去注册后 =>', await ev(`({ hash: location.hash, inputs: [...document.querySelectorAll('input')].slice(0,2).map(i => i.value) })`));
await shot('code-login-to-register');
ws.close();
