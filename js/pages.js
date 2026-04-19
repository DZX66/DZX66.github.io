// js/pages.js - 页面列表页面的功能模块
import { fetchPagesData } from './services/pageService.js';

class PagesManager {
  constructor() {
    this.pages = [];
    this.filteredPages = [];
    this.currentSort = 'date';
    this.searchTerm = '';
    this.init();
  }

  async init() {
    // 初始化年份
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 加载页面数据
    await this.loadPagesData();
    
    // 初始化事件监听
    this.initEventListeners();
    
    // 渲染页面列表
    this.renderPagesList();
  }

  async loadPagesData() {
    try {
      this.pages = await fetchPagesData();
      this.filteredPages = [...this.pages];
      this.updateStats();
    } catch (error) {
      console.error('加载页面数据失败:', error);
      this.showError('加载页面数据失败，请刷新页面重试');
    }
  }

  updateStats() {
    const totalPages = this.pages.length;
    const recentPages = this.pages.filter(page => {
      const daysAgo = (Date.now() - new Date(page.modified).getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7; // 最近7天更新的页面
    }).length;

    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('recentPages').textContent = recentPages;
  }

  initEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('pageSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.trim().toLowerCase();
        this.filterAndSortPages();
      });
    }

    // 加密筛选功能
    const encryptedCheckbox = document.getElementById('showEncryptedOnly');
    if (encryptedCheckbox) {
      encryptedCheckbox.addEventListener('change', () => {
        this.filterAndSortPages();
      });
    }

    // 排序功能
    const sortButtons = document.querySelectorAll('.sort-btn');
    sortButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sortType = e.target.dataset.sort;
        this.setSort(sortType);
      });
    });
  }

  setSort(sortType) {
    this.currentSort = sortType;
    
    // 更新按钮状态
    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sort === sortType);
    });

    this.filterAndSortPages();
  }

  filterAndSortPages() {
    // 过滤页面
    let filtered = [...this.pages];
    
    // 搜索过滤
    if (this.searchTerm) {
      filtered = filtered.filter(page => 
        page.title.toLowerCase().includes(this.searchTerm) ||
        (page.description && page.description.toLowerCase().includes(this.searchTerm))
      );
    }
    
    // 加密状态过滤
    const encryptedCheckbox = document.getElementById('showEncryptedOnly');
    if (encryptedCheckbox && encryptedCheckbox.checked) {
      filtered = filtered.filter(page => page.encrypted === true);
    }
    
    this.filteredPages = filtered;

    // 排序页面
    this.filteredPages.sort((a, b) => {
      if (this.currentSort === 'date') {
        return new Date(b.modified) - new Date(a.modified);
      } else if (this.currentSort === 'encrypted') {
        // 加密页面优先，然后按标题排序
        if (a.encrypted && !b.encrypted) return -1;
        if (!a.encrypted && b.encrypted) return 1;
        return a.title.localeCompare(b.title, 'zh-CN');
      } else {
        return a.title.localeCompare(b.title, 'zh-CN');
      }
    });

    this.renderPagesList();
  }

  renderPagesList() {
    const container = document.getElementById('pagesListContainer');
    if (!container) return;

    if (this.filteredPages.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📄</div>
          <p>${this.searchTerm ? '没有找到匹配的页面' : '暂无页面内容'}</p>
          ${this.searchTerm ? '<button class="clear-search" onclick="pagesManager.clearSearch()">清除搜索</button>' : ''}
        </div>
      `;
      return;
    }

    const pagesHTML = this.filteredPages.map(page => this.renderPageItem(page)).join('');
    container.innerHTML = pagesHTML;
  }

  renderPageItem(page) {
    const date = new Date(page.modified).toLocaleDateString('zh-CN');
    const encryptedBadge = page.encrypted ? '<span class="encrypted-badge" title="此页面已加密">🔒 已加密</span>' : '';
    
    return `
      <div class="page-item" data-page-id="${page.id}">
        <div class="page-info">
          <h3 class="page-title">
            <a href="page?id=${page.id}" class="page-link">${page.title}</a>
          </h3>
          <div class="page-meta">
            <span class="page-date">${date}</span>
            ${encryptedBadge}
            ${page.tags && page.tags.length > 0 ? `<span class="page-tags">${page.tags.map(tag => `#${tag}`).join(' ')}</span>` : ''}
          </div>
        </div>
        <div class="page-actions">
          <a href="page?id=${page.id}" class="read-btn" title="阅读页面">阅读 →</a>
        </div>
      </div>
    `;
  }

  clearSearch() {
    const searchInput = document.getElementById('pageSearch');
    if (searchInput) {
      searchInput.value = '';
      this.searchTerm = '';
      this.filterAndSortPages();
    }
  }

  showError(message) {
    const container = document.getElementById('pagesListContainer');
    if (container) {
      container.innerHTML = `
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <p>${message}</p>
          <button class="retry-btn" onclick="pagesManager.loadPagesData()">重试</button>
        </div>
      `;
    }
  }
}

// 初始化页面管理器
window.pagesManager = new PagesManager();

export { PagesManager };