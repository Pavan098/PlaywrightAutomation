// @ts-check
require('dotenv').config();   // Loads .env file automatically
const { defineConfig, devices } = require('@playwright/test');

// ─── REPORTER SETUP ───────────────────────────────────────────────────────────
// We always use the built-in HTML reporter.
// Allure is used only if the package is installed (npm install allure-playwright).
// This keeps the config working even before allure is installed.
const reporters = [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],   // Terminal output — shows each test pass/fail in real time
];

try {
    require.resolve('allure-playwright');
    reporters.push(['allure-playwright', { outputFolder: 'allure-results', detail: true }]);
    console.log('📊 Allure reporter enabled');
} catch {
    // allure-playwright not installed — that's fine
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────
module.exports = defineConfig({
    testDir: './tests',
    outputDir: 'test-results',

    // Run tests in parallel within a file? false = safer for tests sharing state
    fullyParallel: false,

    // Fail immediately if someone accidentally commits test.only to the repo
    forbidOnly: !!process.env.CI,

    // Retry failed tests: 2 retries in CI, 0 locally
    // Concept: Retries help with flaky network/UI tests in CI but slow down local dev
    retries: process.env.CI ? 2 : 0,

    // Sequential (1 worker) — tests share browser state and are not isolation-safe for parallelism
    workers: 1,

    // Global timeout per test
    timeout: process.env.CI ? 90000 : 60000,

    // Expect (assertion) timeout
    expect: {
        timeout: 10000,
    },

    reporter: reporters,

    use: {
        headless: true,

        // Capture screenshot only when a test fails
        screenshot: 'only-on-failure',

        // Keep video of failing tests (useful to diagnose CI failures)
        video: 'retain-on-failure',

        // Trace gives you a full interactive timeline of the test
        // 'on-first-retry' = record trace only when test is being retried
        trace: 'on-first-retry',

        // Base URL — override per environment via .env or CI env vars
        baseURL: process.env.BASE_URL,

        // Viewport size
        viewport: { width: 1280, height: 720 },

        // 0 = no separate action timeout; each action is bounded by the test-level timeout above
        actionTimeout: 0,
    },

    // ── BROWSER PROJECTS ──────────────────────────────────────────────────────
    // Run 'npm run test:all-browsers' to test across all three browsers.
    // In CI we default to chromium only (faster and free).
    // ── DEFAULT: Chromium only ────────────────────────────────────────────────
    // Run multi-browser with: npm run test:all-browsers
    // In CI: set BROWSERS env var to add firefox/webkit
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Uncomment after running: npx playwright install firefox
        // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },

        // Uncomment after running: npx playwright install webkit
        // { name: 'webkit', use: { ...devices['Desktop Safari'] } },

        // Mobile (after installing respective browsers)
        // { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
        // { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
    ],

    // ── GLOBAL SETUP / TEARDOWN ───────────────────────────────────────────────
    // globalSetup runs ONCE before all tests (good for seeding auth tokens)
    // globalTeardown runs ONCE after all tests (good for cleanup)
    // Uncomment when you create these files:
    // globalSetup: require.resolve('./tests/global-setup.js'),
    // globalTeardown: require.resolve('./tests/global-teardown.js'),
});
