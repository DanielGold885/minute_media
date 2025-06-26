import { defineConfig } from '@playwright/test';
import { BASE_URL } from './config/constants';
import { DEFAULT_TIMEOUT } from './config/timeouts';

export default defineConfig({
  timeout: DEFAULT_TIMEOUT,
  use: {
    baseURL: BASE_URL,
    headless: true,
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
