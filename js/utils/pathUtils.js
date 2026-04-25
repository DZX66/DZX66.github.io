// js/utils/pathUtils.js - 路径处理工具

/**
 * 规范化路径：去除 public/ 前缀，反斜杠转正斜杠，确保以 / 开头
 * @param {string} rawPath - 原始路径
 * @returns {string} 规范化后的路径
 */
export const normalizeMetaPath = (rawPath) => {
  if (!rawPath) return '';
  let path = rawPath.replace(/\\/g, '/');
  path = path.replace(/^public\//i, '');
  if (!path.startsWith('/')) path = '/' + path;
  return path;
};

/**
 * 通用路径规范化：去除 public/ 前缀（不强制添加前导斜杠，保留相对性）
 * 用于加载 index 中存储的元数据路径、文件路径等
 * @param {string} path - 原始路径
 * @returns {string} 规范化后的路径（无前导 /，无 public/ 前缀）
 */
export const normalizePath = (path) => {
  if (!path) return '';
  // 1. 反斜杠转正斜杠
  let normalized = path.replace(/\\/g, '/');
  // 2. 去除开头的 public/（可选前导斜杠）
  normalized = normalized.replace(/^\/?public\//, '');
  return normalized;
};
