import { decrypt } from './components/euw-crypto.js';

import { normalizePath } from './utils/pathUtils.js';

// ---------- Cookie 工具 ----------
function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const key = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
    c = c.trim();
    if (c.indexOf(key) === 0) return decodeURIComponent(c.substring(key.length));
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getCookieKeyFromHint(hint) {
  const utf8Bytes = new TextEncoder().encode(hint);
  return btoa(String.fromCharCode(...utf8Bytes));
}

// ---------- 配置 ----------
const PAGES_INDEX_URL = '/pages.json';
const urlParams = new URLSearchParams(window.location.search);
const pageId = urlParams.get('id');
const mainEl = document.getElementById('sourceMain');
const yearSpan = document.getElementById('currentYear');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// ---------- UI 辅助函数 ----------
function showError(title, message) {
  document.title = `${title} · 源代码`;
  mainEl.innerHTML = `
    <h1 style="color:var(--accent-deep);"><i class="fas fa-folder"></i> ${title}</h1>
    <div class="error-message">
      <strong><i class="fas fa-exclamation-triangle"></i> 无法加载源代码</strong><br>
      ${message}
    </div>
    <a href="/" class="back-link">← 返回主页</a>
  `;
}

function renderSourceCode(sourceText, meta, isDecrypted = false) {
  const title = meta.title || pageId || '未知页面';
  document.title = `${title} · 源代码`;

  const created = meta.created ? new Date(meta.created).toLocaleString('zh-CN') : '—';
  const modified = meta.modified ? new Date(meta.modified).toLocaleString('zh-CN') : created;
  const filePath = meta.file || '—';
  const encryptedBadge = meta.encrypted
    ? (isDecrypted ? '<i class="fas fa-unlock-alt"></i> 已解密' : '<i class="fas fa-lock"></i> 已加密')
    : '<i class="fas fa-unlock-alt"></i> 公开';

  const metaHtml = `
    <div class="source-header" style="margin-bottom:1.5rem; border-bottom:1px dashed var(--border-light); padding-bottom:1rem;">
      <h1 style="font-size:2rem; margin-bottom:0.2rem; color:var(--accent-deep); display:flex; align-items:center; gap:10px;">
        <span><i class="fas fa-scroll"></i> 源代码查看： ${title}</span>
        <span style="font-size:0.9rem; background:var(--accent-soft); color:white; padding:2px 12px; border-radius:30px;">${encryptedBadge}</span>
      </h1>
      <div class="source-meta" style="color:var(--text-secondary); font-size:0.9rem; display:flex; flex-wrap:wrap; gap:1.5rem; margin-top:0.5rem;">
        <span><i class="fas fa-calendar-alt"></i> 创建: ${created}</span>
        <span><i class="fas fa-sync-alt"></i> 更新: ${modified}</span>
        <span><i class="fas fa-folder-open"></i> 路径: ${filePath}</span>
      </div>
    </div>
  `;

  // 创建代码块
  const pre = document.createElement('pre');
  pre.className = 'line-numbers';
  const code = document.createElement('code');
  code.className = 'language-markdown line-numbers';
  code.textContent = sourceText;
  pre.appendChild(code);

  mainEl.innerHTML = '';
  mainEl.insertAdjacentHTML('beforeend', metaHtml);

  const wrapper = document.createElement('div');
  wrapper.className = 'source-code-wrapper';
  wrapper.style.marginTop = '1.5rem';
  wrapper.style.borderRadius = '16px';
  wrapper.style.overflow = 'hidden';
  wrapper.style.boxShadow = 'var(--shadow-sm)';
  wrapper.style.border = '1px solid var(--border-light)';
  wrapper.appendChild(pre);
  mainEl.appendChild(wrapper);

  const backLink = document.createElement('p');
  backLink.innerHTML = '<a href="/" class="back-link">← 返回主页</a>';
  mainEl.appendChild(backLink);

  // 应用 Prism 高亮
  if (window.Prism) {
    Prism.highlightElement(code);
  }
}

// ---------- 加密处理 ----------
async function tryDecryptWithPassword(password, encryptedJson, meta, cookieKey) {
  const plaintext = await decrypt(encryptedJson, password);
  setCookie(cookieKey, password, 7);
  renderSourceCode(plaintext, meta, true);
}

function showPasswordPrompt(meta, encryptedJson) {
  const hint = meta.passwordHint || '无提示';
  const cookieKey = getCookieKeyFromHint(hint);

  // 尝试自动解密
  const savedPwd = getCookie(cookieKey);
  if (savedPwd) {
    tryDecryptWithPassword(savedPwd, encryptedJson, meta, cookieKey).catch(() => {
      deleteCookie(cookieKey);
      renderPasswordUI();
    });
    return;
  }

  renderPasswordUI();

  function renderPasswordUI() {
    document.title = `<i class="fas fa-lock"></i> 加密源文件 · ${meta.title}`;
    mainEl.innerHTML = `
      <h1><i class="fas fa-lock"></i> 此源文件已加密</h1>
      <div class="password-panel" style="background:#fef7e0; border-left:6px solid #e6a700; padding:1.5rem; border-radius:12px; margin:2rem 0;">
        <p><strong>需要密码才能查看源代码</strong></p>
        <p style="font-size:0.9rem; margin-bottom:1rem;">密码提示：${hint}</p>
        <input type="password" id="passwordInput" placeholder="输入密码" autocomplete="off"
               style="padding:0.5rem; width:220px; border-radius:6px; border:1px solid var(--border-light);">
        <button id="submitPassword" style="margin-left:0.5rem; padding:0.5rem 1.2rem; background:var(--accent-soft); color:white; border:none; border-radius:6px; cursor:pointer;">验证</button>
        <p id="passwordError" style="color:#c00; margin-top:0.5rem;"></p>
      </div>
      <p><a href="/" class="back-link">← 返回主页</a></p>
    `;

    const input = document.getElementById('passwordInput');
    const btn = document.getElementById('submitPassword');
    const errEl = document.getElementById('passwordError');

    const tryDecrypt = async () => {
      const pwd = input.value.trim();
      if (!pwd) {
        errEl.textContent = '请输入密码';
        return;
      }
      btn.disabled = true;
      btn.textContent = '解密中...';
      errEl.textContent = '';
      try {
        await tryDecryptWithPassword(pwd, encryptedJson, meta, cookieKey);
      } catch (e) {
        errEl.textContent = e.message || '密码错误或数据损坏';
        btn.disabled = false;
        btn.textContent = '验证';
      }
    };

    btn.addEventListener('click', tryDecrypt);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') tryDecrypt();
    });
    input.focus();
  }
}

// ---------- 数据加载 ----------
async function loadPageIndex() {
  const res = await fetch(PAGES_INDEX_URL);
  if (!res.ok) throw new Error(`无法加载页面索引 (${res.status})`);
  return await res.json();
}

async function loadMeta(metaPath) {
  const res = await fetch('/' + normalizePath(metaPath));
  if (!res.ok) throw new Error(`元数据加载失败 (${res.status})`);
  return await res.json();
}

async function fetchRawEuw(filePath) {
  const normalizedPath = normalizePath(filePath);
  const res = await fetch('/' + normalizedPath);
  if (!res.ok) throw new Error(`EUW 文件加载失败 (${res.status})`);
  return await res.text();
}

// ---------- 主流程 ----------
async function init() {
  if (!pageId) {
    showError('未指定页面', '请通过 ?id=页面标识 访问源文件。');
    return;
  }

  try {
    const index = await loadPageIndex();
    const metaPath = index[pageId];
    if (!metaPath) throw new Error(`未找到页面 "${pageId}" 的索引记录`);

    const meta = await loadMeta(metaPath);
    
    // 对 meta.file 进行路径规范化
    const filePath = normalizePath(meta.file);

    if (meta.encrypted) {
      const res = await fetch('/' + filePath);
      if (!res.ok) throw new Error(`无法获取加密文件 (${res.status})`);
      const encryptedJson = await res.text();
      showPasswordPrompt(meta, encryptedJson, filePath); // 传递规范化后的路径用于后续显示
    } else {
      mainEl.innerHTML = '<div class="loading-placeholder"><i class="fas fa-leaf"></i> 正在读取源文件...</div>';
      const sourceText = await fetchRawEuw(filePath);
      renderSourceCode(sourceText, meta, false);
    }
  } catch (error) {
    if (import.meta.env.DEV) console.error('初始化失败:', error);
    showError('加载失败', error.message);
  }
}

init();