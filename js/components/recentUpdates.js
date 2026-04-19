// js/components/recentUpdates.js - 最近更新组件
import { relativeTime } from '../utils/dateUtils.js';

export function renderRecentUpdates(container, pages, limit = 5) {
  if (!container) return;
  
  const recentPages = pages
    .filter(p => p.modified)
    .sort((a, b) => new Date(b.modified) - new Date(a.modified))
    .slice(0, limit);

  if (recentPages.length === 0) {
    container.innerHTML = '<div class="empty-state">暂无更新</div>';
    return;
  }

  let html = '<ul class="recent-list">';
  recentPages.forEach(page => {
    const encryptedBadge = page.encrypted ? '<span class="encrypted-badge" title="此页面已加密">🔒</span>' : '';
    html += `
      <li class="recent-item">
        <a href="/page?id=${page.id}" class="recent-link">
          ${page.icon || '📄'} ${page.title || page.id}
        </a>
        <div class="recent-meta">
          <span class="recent-date">${relativeTime(page.modified)}</span>
          ${encryptedBadge}
          ${page.tags ? `<span class="tag-indicator">${page.tags}</span>` : ''}
        </div>
      </li>
    `;
  });
  html += '</ul>';
  container.innerHTML = html;
}