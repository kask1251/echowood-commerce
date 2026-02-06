// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Retry failed tests once
  retries: 1,
  // Reporter to see results in terminal
  reporter: 'list',
  
  use: {
    // 1. Point to Staging Environment
    baseURL: 'http://127.0.0.1:3001',

    // 2. Run invisible (Headless) - Required for VPS
    headless: true,

    // 3. Collect traces if a test fails (helps debugging)
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // We can add Firefox/Safari later, let's stick to Chrome for speed
  ],
});