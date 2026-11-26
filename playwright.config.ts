import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: { baseURL: 'http://127.0.0.1:4200', trace: 'on-first-retry' },
  webServer: { command: 'pnpm vite --host 127.0.0.1 --port 4200', port: 4200, reuseExistingServer: !process.env.CI },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
