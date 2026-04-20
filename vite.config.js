import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    rolldownOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        pages: resolve(__dirname, 'pages.html'),
        page: resolve(__dirname, 'page.html'),
        404: resolve(__dirname, "404.html"),
        source: resolve(__dirname, "source.html"),
      }
    }
  },
  server: {
    watch: {
      // 监视 public 目录下的 .euw 和 .json 文件变化
      include: ['public/**/*.euw', 'public/**/*.json']
    }
  }
});