// js/components/announcements.js - 公告组件
const announcements = [
  { title: '🍃 翻新', date: '2026-04-19', content: '柳下回声 已完全重做。采用插件编写自定义语言EUW，vite构建等新技术。重要页面全部迁移，目前处于维护阶段，有部分地方内容混乱，请谅解。' },
];

export function renderAnnouncements(container) {
  if (!container) return;
  let html = '';
  announcements.slice(0, 3).forEach(item => {
    html += `
      <div class="notice-item">
        <div class="notice-title">
          <span>${item.title}</span>
          <span class="notice-date">${item.date}</span>
        </div>
        <div class="notice-content">${item.content}</div>
      </div>
    `;
  });
  container.innerHTML = html;
}