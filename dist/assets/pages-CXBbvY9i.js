import"./modulepreload-polyfill-CSRv37U6.js";import{t as e}from"./pageService-CRh8VmWs.js";window.pagesManager=new class{constructor(){this.pages=[],this.filteredPages=[],this.currentSort=`date`,this.searchTerm=``,this.init()}async init(){let e=document.getElementById(`currentYear`);e&&(e.textContent=new Date().getFullYear()),await this.loadPagesData(),this.initEventListeners(),this.renderPagesList()}async loadPagesData(){try{this.pages=await e(),this.filteredPages=[...this.pages],this.updateStats()}catch(e){console.error(`加载页面数据失败:`,e),this.showError(`加载页面数据失败，请刷新页面重试`)}}updateStats(){let e=this.pages.length,t=this.pages.filter(e=>(Date.now()-new Date(e.modified).getTime())/(1e3*60*60*24)<=7).length;document.getElementById(`totalPages`).textContent=e,document.getElementById(`recentPages`).textContent=t}initEventListeners(){let e=document.getElementById(`pageSearch`);e&&e.addEventListener(`input`,e=>{this.searchTerm=e.target.value.trim().toLowerCase(),this.filterAndSortPages()});let t=document.getElementById(`showEncryptedOnly`);t&&t.addEventListener(`change`,()=>{this.filterAndSortPages()}),document.querySelectorAll(`.sort-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.target.dataset.sort;this.setSort(t)})})}setSort(e){this.currentSort=e,document.querySelectorAll(`.sort-btn`).forEach(t=>{t.classList.toggle(`active`,t.dataset.sort===e)}),this.filterAndSortPages()}filterAndSortPages(){let e=[...this.pages];this.searchTerm&&(e=e.filter(e=>e.title.toLowerCase().includes(this.searchTerm)||e.description&&e.description.toLowerCase().includes(this.searchTerm)));let t=document.getElementById(`showEncryptedOnly`);t&&t.checked&&(e=e.filter(e=>e.encrypted===!0)),this.filteredPages=e,this.filteredPages.sort((e,t)=>this.currentSort===`date`?new Date(t.modified)-new Date(e.modified):this.currentSort===`encrypted`?e.encrypted&&!t.encrypted?-1:!e.encrypted&&t.encrypted?1:e.title.localeCompare(t.title,`zh-CN`):e.title.localeCompare(t.title,`zh-CN`)),this.renderPagesList()}renderPagesList(){let e=document.getElementById(`pagesListContainer`);if(e){if(this.filteredPages.length===0){e.innerHTML=`
        <div class="empty-state">
          <div class="empty-icon">📄</div>
          <p>${this.searchTerm?`没有找到匹配的页面`:`暂无页面内容`}</p>
          ${this.searchTerm?`<button class="clear-search" onclick="pagesManager.clearSearch()">清除搜索</button>`:``}
        </div>
      `;return}e.innerHTML=this.filteredPages.map(e=>this.renderPageItem(e)).join(``)}}renderPageItem(e){let t=new Date(e.modified).toLocaleDateString(`zh-CN`),n=e.encrypted?`<span class="encrypted-badge" title="此页面已加密">🔒 已加密</span>`:``;return`
      <div class="page-item" data-page-id="${e.id}">
        <div class="page-info">
          <h3 class="page-title">
            <a href="page?id=${e.id}" class="page-link">${e.title}</a>
          </h3>
          <div class="page-meta">
            <span class="page-date">${t}</span>
            ${n}
            ${e.tags&&e.tags.length>0?`<span class="page-tags">${e.tags.map(e=>`#${e}`).join(` `)}</span>`:``}
          </div>
        </div>
        <div class="page-actions">
          <a href="page?id=${e.id}" class="read-btn" title="阅读页面">阅读 →</a>
        </div>
      </div>
    `}clearSearch(){let e=document.getElementById(`pageSearch`);e&&(e.value=``,this.searchTerm=``,this.filterAndSortPages())}showError(e){let t=document.getElementById(`pagesListContainer`);t&&(t.innerHTML=`
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <p>${e}</p>
          <button class="retry-btn" onclick="pagesManager.loadPagesData()">重试</button>
        </div>
      `)}};