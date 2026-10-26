require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

// ─── REPORTER SETUP ───────────────────────────────────────────────────────────
// Allure is added only when allure-playwright is installed.
// Using @type {import('@playwright/test').ReporterDescription[]} keeps TS happy
// while still allowing the dynamic push below.

/** @type {import('@playwright/test').ReporterDescription[]} */
const reporters = [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
];

try {
    require.resolve('allure-playwright');
    reporters.push(['allure-playwright', { outputFolder: 'allure-results' }]);
    console.log('📊 Allure reporter enabled');
} catch {
    // allure-playwright not installed — skipping
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────
module.exports = defineConfig({
    testDir: './tests',
    outputDir: 'test-results',

    // Visual regression baselines are captured per-OS (win32 vs linux).
    // Skip visual tests in CI to avoid false failures from font rendering differences.
    // Run locally with: npm run test:visual
    testIgnore: process.env.CI ? ['**/visual.spec.js'] : [],

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
    projects: [

        // ── Auth setup (runs first, saves storageState JSON files) ────────────
        // tests/global.setup.js logs into SauceLabs + EventHub once per suite.
        // All browser projects declare this as a dependency so tests start
        // with a valid session — no repeated login calls per test.
        {
            name: 'setup',
            testMatch: /global\.setup\.js/,
        },

        // ── Default: Chromium desktop ─────────────────────────────────────────
        // @flaky tests are excluded from normal runs.
        // Run flaky tests explicitly: npm run test:quarantine
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup'],
            grepInvert: /@flaky/,
        },

        // ── Quarantine: isolated run for known-flaky tests ────────────────────
        // Only runs via:  npm run test:quarantine
        // Use @flaky tag to mark tests: test('name @flaky', ...)
        // Higher retries isolate the flakiness without hiding it in main run.
        {
            name: 'chromium-quarantine',
            grep: /@flaky/,
            retries: 5,
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup'],
        },

        // ── Mobile viewports ──────────────────────────────────────────────────
        // Run via:  npm run test:mobile
        // Requires: npx playwright install chromium webkit
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
            dependencies: ['setup'],
            grepInvert: /@flaky/,
        },
        {
            name: 'mobile-safari',
            use: { ...devices['iPhone 12'] },
            dependencies: ['setup'],
            grepInvert: /@flaky/,
        },

        // ── Additional desktop browsers ───────────────────────────────────────
        // Run via:  npm run test:all-browsers
        // Requires: npx playwright install firefox webkit
        // { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
        // { name: 'webkit',  use: { ...devices['Desktop Safari']  }, dependencies: ['setup'] },
    ],
});
