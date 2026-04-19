import"./modulepreload-polyfill-BxR_cmXS.js";import{t as e}from"./pageService-DtnBMpoQ.js";var t=[{title:`🍃 翻新`,date:`2026-04-19`,content:`柳下回声 已完全重做。采用插件编写自定义语言EUW，vite构建等新技术。重要页面全部迁移，目前处于维护阶段，有部分地方内容混乱，请谅解。`}];function n(e){if(!e)return;let n=``;t.slice(0,3).forEach(e=>{n+=`
      <div class="notice-item">
        <div class="notice-title">
          <span>${e.title}</span>
          <span class="notice-date">${e.date}</span>
        </div>
        <div class="notice-content">${e.content}</div>
      </div>
    `}),e.innerHTML=n}var r=e=>{if(!e)return``;try{return new Date(e).toLocaleDateString(`zh-CN`,{year:`numeric`,month:`2-digit`,day:`2-digit`}).replace(/\//g,`-`)}catch{return e.slice(0,10)}},i=e=>{let t=new Date-new Date(e),n=Math.floor(t/(1e3*60*60*24));return n<1?`今天`:n<7?`${n}天前`:n<30?`${Math.floor(n/7)}周前`:r(e)};function a(e,t,n=5){if(!e)return;let r=t.filter(e=>e.modified).sort((e,t)=>new Date(t.modified)-new Date(e.modified)).slice(0,n);if(r.length===0){e.innerHTML=`<div class="empty-state">暂无更新</div>`;return}let a=`<ul class="recent-list">`;r.forEach(e=>{let t=e.encrypted?`<span class="encrypted-badge" title="此页面已加密">🔒</span>`:``;a+=`
      <li class="recent-item">
        <a href="/page?id=${e.id}" class="recent-link">
          ${e.icon||`📄`} ${e.title||e.id}
        </a>
        <div class="recent-meta">
          <span class="recent-date">${i(e.modified)}</span>
          ${t}
          ${e.tags?`<span class="tag-indicator">${e.tags}</span>`:``}
        </div>
      </li>
    `}),a+=`</ul>`,e.innerHTML=a}(async function(){let t=document.getElementById(`currentYear`);t&&(t.textContent=new Date().getFullYear()),n(document.getElementById(`noticeContainer`));let r=document.getElementById(`recentUpdatesContainer`),i=document.getElementById(`pageCountIndicator`),o=document.getElementById(`viewAllPagesBtn`);r&&(r.innerHTML=`<div class="loading-placeholder">🍃 柳枝轻曳，正在加载...</div>`),i&&(i.textContent=`···`);try{let t=await e();console.log(t),i&&(i.textContent=`${t.length} 个页面`),a(r,t),o&&o.addEventListener(`click`,e=>{e.preventDefault();let t=document.querySelector(`.entry-card`);t?t.scrollIntoView({behavior:`smooth`,block:`start`}):window.location.href=`/pages`});let n=document.querySelector(`.brand-icon`);n&&(n.style.cursor=`default`)}catch(e){console.error(`初始化失败:`,e),r&&(r.innerHTML=`<div class="empty-state">加载失败，请刷新重试</div>`)}})();