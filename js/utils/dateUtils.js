// js/utils/dateUtils.js - 日期处理工具
export const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  } catch {
    return isoString.slice(0,10);
  }
};

export const relativeTime = (isoString) => {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffDays = Math.floor(diffMs / (1000*60*60*24));
  if (diffDays < 1) return '今天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays/7)}周前`;
  return formatDate(isoString);
};