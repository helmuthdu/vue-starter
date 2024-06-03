import { config } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { vi } from 'vitest';
import i18n from './src/locales';

config.global.renderStubDefaultSlot = true;
config.global.plugins = [i18n, createPinia()];
window.URL.createObjectURL = vi.fn();
