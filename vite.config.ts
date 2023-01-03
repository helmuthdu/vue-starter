import vue from '@vitejs/plugin-vue';
import { join } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      plugins: [require('postcss-preset-env')({ stage: 0 })]
    }
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src')
    }
  }
});
