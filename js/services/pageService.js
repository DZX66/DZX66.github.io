// js/services/pageService.js - 页面数据服务
import { normalizeMetaPath } from '../utils/pathUtils.js';

export async function fetchPagesData() {
  try {
    const indexRes = await fetch('/pages.json');
    if (!indexRes.ok) throw new Error(`索引加载失败 (${indexRes.status})`);
    const pageIndex = await indexRes.json();

    const pageIds = Object.keys(pageIndex);
    if (pageIds.length === 0) {
      throw new Error('暂无页面索引');
    }

    const metaPromises = pageIds.map(async (id) => {
      const rawPath = pageIndex[id];
      const metaUrl = normalizeMetaPath(rawPath);
      try {
        const res = await fetch(metaUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const meta = await res.json();
        meta.id = meta.id || id;
        return meta;
      } catch (err) {
        console.warn(`加载页面元数据失败 [${id}]:`, err);
        return { id, title: id, date: new Date().toISOString() };
      }
    });

    return await Promise.all(metaPromises);
  } catch (error) {
    console.error('获取页面数据失败:', error);
    return [];
  }
}