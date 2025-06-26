import { defineConfig } from '@playwright/test';
import { BASE_URL, DEFAULT_TIMEOUT } from './config/constants';

export default defineConfig({
  timeout: DEFAULT_TIMEOUT,
  use: {
    baseURL: BASE_URL,
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
  ],
  reporter: [['html', { outputFolder: 'reports', open: 'never' }]],
});
