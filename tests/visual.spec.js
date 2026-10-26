// ─── VISUAL REGRESSION TESTS ──────────────────────────────────────────────────
// Uses Playwright's built-in toHaveScreenshot() — no extra packages needed.
// On first run, screenshots are GENERATED as golden baselines.
// On subsequent runs, screenshots are COMPARED pixel-by-pixel to the baseline.
//
// FIRST TIME SETUP (generate baselines):
//   npx playwright test tests/visual.spec.js --update-snapshots
//   git add tests/visual.spec.js-snapshots/
//   git commit -m "chore: add visual regression baselines"
//
// NORMAL RUNS (compare to baseline):
//   npx playwright test tests/visual.spec.js
//
// UPDATE BASELINES (after intentional UI change):
//   npx playwright test tests/visual.spec.js --update-snapshots
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');

// Allow up to 0.2% pixel difference to avoid false failures from
// anti-aliasing, font rendering, and subpixel differences across OS/GPU
const THRESHOLD = { maxDiffPixelRatio: 0.002 };

// ── SauceLabs ─────────────────────────────────────────────────────────────────
test.describe('Visual Regression — SauceLabs @regression', () => {

    test('Login page matches baseline @smoke', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await expect(page).toHaveScreenshot('saucelabs-login.png', THRESHOLD);
    });

    test('Inventory page matches baseline @regression', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await page.waitForURL('**/inventory.html');
        await page.locator('.inventory_list').waitFor({ state: 'visible' });
        await expect(page).toHaveScreenshot('saucelabs-inventory.png', THRESHOLD);
    });

    test('Cart page matches baseline @regression', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await page.waitForURL('**/inventory.html');
        // Add one item before screenshotting the cart
        await page.locator('.inventory_item').first().locator('button').click();
        await page.locator('.shopping_cart_link').click();
        await page.waitForURL('**/cart.html');
        await expect(page).toHaveScreenshot('saucelabs-cart.png', THRESHOLD);
    });
});

// ── TodoMVC ───────────────────────────────────────────────────────────────────
test.describe('Visual Regression — TodoMVC @regression', () => {

    test('Empty TodoMVC app matches baseline @smoke', async ({ page }) => {
        await page.goto('https://todomvc.com/examples/react/dist/');
        await expect(page).toHaveScreenshot('todomvc-empty.png', THRESHOLD);
    });

    test('TodoMVC with active and completed items matches baseline @regression', async ({ page }) => {
        await page.goto('https://todomvc.com/examples/react/dist/');
        const input = page.getByPlaceholder('What needs to be done?');

        await input.fill('Buy groceries');
        await page.keyboard.press('Enter');
        await input.fill('Walk the dog');
        await page.keyboard.press('Enter');
        await input.fill('Read a book');
        await page.keyboard.press('Enter');

        // Complete the first item
        await page.locator('.todo-list li').first().locator('.toggle').click();

        await expect(page).toHaveScreenshot('todomvc-mixed.png', THRESHOLD);
    });
});

// ── Flight Booking ────────────────────────────────────────────────────────────
test.describe('Visual Regression — Flight Booking @regression', () => {

    test('Flight booking form matches baseline @smoke', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/dropdownsPractise/#');
        // Wait for form to fully render
        await page.locator('#ctl00_mainContent_view_date1').waitFor({ state: 'visible' });
        await expect(page).toHaveScreenshot('flight-booking-form.png', THRESHOLD);
    });
});
