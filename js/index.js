// js/main.js - 主入口文件（模块化版本）
import { renderAnnouncements } from './components/announcements.js';
import { fetchPagesData } from './services/pageService.js';
import { renderRecentUpdates } from './components/recentUpdates.js';

(async function() {
  // 初始化年份
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // 渲染公告
  renderAnnouncements(document.getElementById('noticeContainer'));

  // 获取元素
  const recentContainer = document.getElementById('recentUpdatesContainer');
  const pageCountIndicator = document.getElementById('pageCountIndicator');
  const viewAllBtn = document.getElementById('viewAllPagesBtn');

  // 显示加载状态
  if (recentContainer) recentContainer.innerHTML = '<div class="loading-placeholder">🍃 柳枝轻曳，正在加载...</div>';
  if (pageCountIndicator) pageCountIndicator.textContent = '···';

  // 获取并渲染页面数据
  try {
    const pages = await fetchPagesData();
    
    console.log(pages);
    // 更新页面总数显示
    if (pageCountIndicator) {
      pageCountIndicator.textContent = `${pages.length} 个页面`;
    }
    
    // 渲染最近更新
    renderRecentUpdates(recentContainer, pages);

    // 绑定"全部"按钮滚动到入口卡片
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const entryCard = document.querySelector('.entry-card');
        if (entryCard) {
          entryCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = '/pages';
        }
      });
    }

    // 添加品牌图标样式
    const brandIcon = document.querySelector('.brand-icon');
    if (brandIcon) {
      brandIcon.style.cursor = 'default';
    }
  } catch (error) {
    console.error('初始化失败:', error);
    if (recentContainer) {
      recentContainer.innerHTML = '<div class="empty-state">加载失败，请刷新重试</div>';
    }
  }
})();