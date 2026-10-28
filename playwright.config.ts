import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 4,
  reporter: 'html',

  use: {
    baseURL: process.env.URL || 'https://www.uwm.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 60_000,
    actionTimeout: 15_000,
  },

  projects: [
    {
      name: 'Google Chrome',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        viewport: { width: 1800, height: 1000 },
      },
    },
    /*
    { name: 'Microsoft Edge',  use: { ...devices['Desktop Edge'],    channel: 'msedge', viewport: { width: 1800, height: 1000 } } },
    { name: 'chromium',        use: { ...devices['Desktop Chrome'],  viewport: { width: 1900, height: 1080 } } },
    { name: 'firefox',         use: { ...devices['Desktop Firefox'], viewport: { width: 1850, height: 1000 } } },
    { name: 'webkit',          use: { ...devices['Desktop Safari'],  viewport: { width: 1850, height: 1000 } } },
    { name: 'Mobile Chrome',   use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari',   use: { ...devices['iPhone 15'] } },
    */
  ],
});
