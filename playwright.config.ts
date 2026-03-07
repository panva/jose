import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tap',
  testMatch: '.browser.ts',
  timeout: 120_000,
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'safari', use: devices['Desktop Safari'] },
  ],
})
