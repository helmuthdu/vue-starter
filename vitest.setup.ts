import { config } from '@vue/test-utils';
import { vi } from 'vitest';
import { router } from './src/routes';

config.global.renderStubDefaultSlot = true;
config.global.plugins = [router];
config.global.stubs = ['router-link', 'router-view'];
window.URL.createObjectURL = vi.fn();
