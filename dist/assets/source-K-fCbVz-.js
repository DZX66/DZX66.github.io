import"./modulepreload-polyfill-BxR_cmXS.js";import{t as e}from"./euw-crypto-DC3NBL3J.js";function t(e){let t=e.replace(/\\/g,`/`);return t=t.replace(/^\/?public\//,``),t}function n(e,t,n=7){let r=new Date(Date.now()+n*864e5).toUTCString();document.cookie=`${encodeURIComponent(e)}=${encodeURIComponent(t)}; expires=${r}; path=/; SameSite=Lax`}function r(e){let t=encodeURIComponent(e)+`=`,n=document.cookie.split(`;`);for(let e of n)if(e=e.trim(),e.indexOf(t)===0)return decodeURIComponent(e.substring(t.length));return null}function i(e){document.cookie=`${encodeURIComponent(e)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`}function a(e){let t=new TextEncoder().encode(e);return btoa(String.fromCharCode(...t))}var o=`/pages.json`,s=new URLSearchParams(window.location.search).get(`id`),c=document.getElementById(`sourceMain`),l=document.getElementById(`currentYear`);l&&(l.textContent=new Date().getFullYear());function u(e,t){document.title=`${e} · 源代码`,c.innerHTML=`
    <h1 style="color:var(--accent-deep);">📁 ${e}</h1>
    <div class="error-message">
      <strong>⚠️ 无法加载源代码</strong><br>
      ${t}
    </div>
    <a href="/" class="back-link">← 返回主页</a>
  `}function d(e,t,n=!1){let r=t.title||s||`未知页面`;document.title=`${r} · 源代码`;let i=t.created?new Date(t.created).toLocaleString(`zh-CN`):`—`,a=t.modified?new Date(t.modified).toLocaleString(`zh-CN`):i,o=t.file||`—`,l=`
    <div class="source-header" style="margin-bottom:1.5rem; border-bottom:1px dashed var(--border-light); padding-bottom:1rem;">
      <h1 style="font-size:2rem; margin-bottom:0.2rem; color:var(--accent-deep); display:flex; align-items:center; gap:10px;">
        <span>📜源代码查看： ${r}</span>
        <span style="font-size:0.9rem; background:var(--accent-soft); color:white; padding:2px 12px; border-radius:30px;">${t.encrypted?n?`🔓 已解密`:`🔒 已加密`:`🔓 公开`}</span>
      </h1>
      <div class="source-meta" style="color:var(--text-secondary); font-size:0.9rem; display:flex; flex-wrap:wrap; gap:1.5rem; margin-top:0.5rem;">
        <span>📅 创建: ${i}</span>
        <span>🔄 更新: ${a}</span>
        <span>📁 路径: ${o}</span>
      </div>
    </div>
  `,u=document.createElement(`pre`);u.className=`line-numbers`;let d=document.createElement(`code`);d.className=`language-markdown line-numbers`,d.textContent=e,u.appendChild(d),c.innerHTML=``,c.insertAdjacentHTML(`beforeend`,l);let f=document.createElement(`div`);f.className=`source-code-wrapper`,f.style.marginTop=`1.5rem`,f.style.borderRadius=`16px`,f.style.overflow=`hidden`,f.style.boxShadow=`var(--shadow-sm)`,f.style.border=`1px solid var(--border-light)`,f.appendChild(u),c.appendChild(f);let p=document.createElement(`p`);p.innerHTML=`<a href="/" class="back-link">← 返回主页</a>`,c.appendChild(p),window.Prism&&Prism.highlightElement(d)}async function f(t,r,i,a){let o=await e(r,t);n(a,t,7),d(o,i,!0)}function p(e,t){let n=e.passwordHint||`无提示`,o=a(n),s=r(o);if(s){f(s,t,e,o).catch(()=>{i(o),l()});return}l();function l(){document.title=`🔒 加密源文件 · ${e.title}`,c.innerHTML=`
      <h1>🔒 此源文件已加密</h1>
      <div class="password-panel" style="background:#fef7e0; border-left:6px solid #e6a700; padding:1.5rem; border-radius:12px; margin:2rem 0;">
        <p><strong>需要密码才能查看源代码</strong></p>
        <p style="font-size:0.9rem; margin-bottom:1rem;">密码提示：${n}</p>
        <input type="password" id="passwordInput" placeholder="输入密码" autocomplete="off"
               style="padding:0.5rem; width:220px; border-radius:6px; border:1px solid var(--border-light);">
        <button id="submitPassword" style="margin-left:0.5rem; padding:0.5rem 1.2rem; background:var(--accent-soft); color:white; border:none; border-radius:6px; cursor:pointer;">验证</button>
        <p id="passwordError" style="color:#c00; margin-top:0.5rem;"></p>
      </div>
      <p><a href="/" class="back-link">← 返回主页</a></p>
    `;let r=document.getElementById(`passwordInput`),i=document.getElementById(`submitPassword`),a=document.getElementById(`passwordError`),s=async()=>{let n=r.value.trim();if(!n){a.textContent=`请输入密码`;return}i.disabled=!0,i.textContent=`解密中...`,a.textContent=``;try{await f(n,t,e,o)}catch(e){a.textContent=e.message||`密码错误或数据损坏`,i.disabled=!1,i.textContent=`验证`}};i.addEventListener(`click`,s),r.addEventListener(`keypress`,e=>{e.key===`Enter`&&s()}),r.focus()}}async function m(){let e=await fetch(o);if(!e.ok)throw Error(`无法加载页面索引 (${e.status})`);return await e.json()}async function h(e){let n=await fetch(`/`+t(e));if(!n.ok)throw Error(`元数据加载失败 (${n.status})`);return await n.json()}async function g(e){let n=t(e),r=await fetch(`/`+n);if(!r.ok)throw Error(`EUW 文件加载失败 (${r.status})`);return await r.text()}async function _(){if(!s){u(`未指定页面`,`请通过 ?id=页面标识 访问源文件。`);return}try{let e=(await m())[s];if(!e)throw Error(`未找到页面 "${s}" 的索引记录`);let n=await h(e),r=t(n.file);if(n.encrypted){let e=await fetch(`/`+r);if(!e.ok)throw Error(`无法获取加密文件 (${e.status})`);p(n,await e.text(),r)}else c.innerHTML=`<div class="loading-placeholder">🍃 正在读取源文件...</div>`,d(await g(r),n,!1)}catch(e){console.error(`初始化失败:`,e),u(`加载失败`,e.message)}}_();