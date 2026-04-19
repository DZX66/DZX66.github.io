// js/utils/pathUtils.js - 路径处理工具
export const normalizeMetaPath = (rawPath) => {
  if (!rawPath) return '';
  let path = rawPath.replace(/\\/g, '/');
  path = path.replace(/^public\//i, '');
  if (!path.startsWith('/')) path = '/' + path;
  return path;
};