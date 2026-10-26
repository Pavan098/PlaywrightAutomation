// ─── ACCESSIBILITY TESTS ──────────────────────────────────────────────────────
// Uses @axe-core/playwright (Deque's official package) to scan pages for
// WCAG 2.1 violations: missing labels, low contrast, bad ARIA, keyboard traps.
//
// HOW TO RUN:
//   npx playwright test tests/accessibility.spec.js
//   npx playwright test tests/accessibility.spec.js --reporter=list
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// ── Helper: scan and fail only on critical/serious violations ────────────────
// Minor/moderate issues on third-party sites are logged but don't fail the test.
// Critical/serious issues represent real barriers for users with disabilities.
async function scanPage(page, pageName) {
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#onetrust-banner-sdk')   // ignore cookie banners
        .analyze();

    if (results.violations.length > 0) {
        const summary = results.violations.map(v =>
            `[${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n` +
            v.nodes.slice(0, 2).map(n => `  → ${n.html}`).join('\n')
        ).join('\n\n');
        console.log(`\n♿ Accessibility violations on ${pageName}:\n${summary}`);
    }

    // Only block CI on critical/serious — minor/moderate are warnings on sites we don't own
    const blockers = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));

    expect(
        blockers,
        `${pageName} has ${blockers.length} critical/serious accessibility violation(s)`
    ).toEqual([]);
}

// ── SauceLabs ─────────────────────────────────────────────────────────────────
test.describe('Accessibility — SauceLabs @regression', () => {

    test('Login page has no WCAG violations @smoke', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await scanPage(page, 'SauceLabs Login');
    });

    test('Inventory page has no WCAG violations @regression', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await page.waitForURL('**/inventory.html');
        await scanPage(page, 'SauceLabs Inventory');
    });

    test('Cart page has no WCAG violations @regression', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('#user-name').fill('standard_user');
        await page.locator('#password').fill('secret_sauce');
        await page.locator('#login-button').click();
        await page.waitForURL('**/inventory.html');
        await page.locator('.shopping_cart_link').click();
        await page.waitForURL('**/cart.html');
        await scanPage(page, 'SauceLabs Cart');
    });
});

// ── TodoMVC ───────────────────────────────────────────────────────────────────
test.describe('Accessibility — TodoMVC @regression', () => {

    test('TodoMVC app has no WCAG violations @smoke', async ({ page }) => {
        await page.goto('https://todomvc.com/examples/react/dist/');
        await scanPage(page, 'TodoMVC');
    });

    test('TodoMVC with items has no WCAG violations @regression', async ({ page }) => {
        await page.goto('https://todomvc.com/examples/react/dist/');
        await page.getByPlaceholder('What needs to be done?').fill('Buy groceries');
        await page.keyboard.press('Enter');
        await page.getByPlaceholder('What needs to be done?').fill('Walk the dog');
        await page.keyboard.press('Enter');
        await scanPage(page, 'TodoMVC with items');
    });
});

// ── Flight Booking ────────────────────────────────────────────────────────────
test.describe('Accessibility — Flight Booking @regression', () => {

    test('Flight booking form has no WCAG violations @smoke', async ({ page }) => {
        await page.goto('https://rahulshettyacademy.com/dropdownsPractise/#');
        await scanPage(page, 'Flight Booking Form');
    });
});
