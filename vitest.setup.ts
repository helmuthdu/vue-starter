import { config } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { vi } from 'vitest';
import i18n from './src/locales';
import { router } from './src/routes';

config.global.renderStubDefaultSlot = true;
config.global.plugins = [router, i18n, createPinia()];
config.global.stubs = ['router-link', 'router-view'];
window.URL.createObjectURL = vi.fn();
