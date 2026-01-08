import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'source',
  base: './', // Relative paths for static deployment
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'source/index.html'),
      },
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/style.css'; 
          }
          return `assets/[name].[ext]`;
        }
      }
    },
  },
  server: {
    port: 3000
  }
});
