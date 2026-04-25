import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        pages: resolve(__dirname, 'pages.html'),
        page: resolve(__dirname, 'page.html'),
        404: resolve(__dirname, "404.html"),
        source: resolve(__dirname, "source.html"),
      },
      output: {
        manualChunks(id) {
          // 将公共工具模块单独打包
          if (id.includes('/js/utils/pathUtils.js')) return 'utils';
          // 组件模块单独打包
          if (id.includes('/js/components/')) return 'components';
          // 服务模块单独打包
          if (id.includes('/js/services/')) return 'services';
          // 其余模块使用默认打包行为
          return null;
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 500
  },
  server: {
    watch: {
      // 监视 public 目录下的 .euw 和 .json 文件变化
      include: ['public/**/*.euw', 'public/**/*.json']
    }
  }
});
