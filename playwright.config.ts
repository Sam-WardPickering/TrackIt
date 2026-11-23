import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  retries: 0,
  reporter: 'html',
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'http://localhost:4000',
      },
    },
    {
      name: 'e2e',
      testDir: './tests/e2e',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
        testIdAttribute: 'data-test',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
      },
    },
  ],
});