// ─── CUSTOM PLAYWRIGHT FIXTURES ───────────────────────────────────────────────
// Fixtures are Playwright's dependency injection system.
// They work like beforeEach/afterEach but are composable and reusable.
//
// HOW TO USE in a spec file:
//   const { test, expect } = require('./fixtures');
//   test('my test', async ({ page, healingPage, logger }) => { ... });
//
// WHY FIXTURES OVER beforeEach:
//   - beforeEach is per-file. Fixtures are reusable across ALL test files.
//   - Fixtures compose — healingPage builds on top of the built-in page fixture.
//   - Teardown (afterEach logic) lives inside the fixture using yield.
// ─────────────────────────────────────────────────────────────────────────────

const { test: base, expect } = require('@playwright/test');
const SelfHealingLocator = require('../utils/SelfHealingLocator');
const Logger = require('../utils/Logger');

const test = base.extend({

    // ── Fixture 1: healingPage ────────────────────────────────────────────────
    // Extends the default `page` with a .heal() method.
    // When a selector breaks, the AI finds an alternative automatically.
    //
    // Usage:
    //   test('test', async ({ healingPage }) => {
    //     const btn = await healingPage.heal('.login-btn', 'Login button');
    //     await btn.click();
    //   });
    healingPage: async ({ page }, use, testInfo) => {
        const healer = new SelfHealingLocator(page);

        // Attach the .heal() method directly to page for convenience
        page.heal = (selector, description) => healer.locate(selector, description);

        // Run the test
        await use(page);

        // After test: save any heal events to the report file
        await healer.saveHealReport();

        if (healer.getHealLog().length > 0) {
            // Attach heal summary to Playwright's built-in test report
            await testInfo.attach('self-healing-log', {
                body: JSON.stringify(healer.getHealLog(), null, 2),
                contentType: 'application/json',
            });
        }
    },

    // ── Fixture 2: logger ─────────────────────────────────────────────────────
    // Provides a structured logger scoped to the current test.
    // Auto-saves log to disk after each test.
    //
    // Usage:
    //   test('test', async ({ page, logger }) => {
    //     logger.step('Navigate to login');
    //     logger.api('POST', '/auth/login', 200);
    //   });
    logger: async ({}, use, testInfo) => {
        const log = new Logger(testInfo.title);
        log.info(`Test started: ${testInfo.title}`);

        await use(log);

        log.info(`Test finished with status: ${testInfo.status}`);
        const logPath = log.save();

        // Attach log file to Playwright report — downloadable from HTML report
        await testInfo.attach('test-log', {
            path: logPath,
            contentType: 'application/json',
        });
    },

    // ── Fixture 3: apiContext ─────────────────────────────────────────────────
    // A pre-configured request context for the EventHub API.
    // Avoids repeating the baseURL in every API test.
    //
    // Usage:
    //   test('api test', async ({ apiContext }) => {
    //     const res = await apiContext.get('/events');
    //   });
    apiContext: async ({ playwright }, use) => {
        const ctx = await playwright.request.newContext({
            baseURL: process.env.API_URL || 'https://api.eventhub.rahulshettyacademy.com/api',
            extraHTTPHeaders: { 'Content-Type': 'application/json' },
        });

        await use(ctx);
        await ctx.dispose();
    },
});

module.exports = { test, expect };
