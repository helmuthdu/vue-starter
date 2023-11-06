/// <reference types="vitest" />
import Vue from '@vitejs/plugin-vue';
import { join } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [Vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
});
