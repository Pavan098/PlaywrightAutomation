// ─── FLIPKART — POM-BASED TESTS ───────────────────────────────────────────────
// These are NEW tests built on FlipkartPage POM.
// The existing flipkart.spec.js tests the full nav + hover inline.
// These POM tests are cleaner versions of the same flows + a search test.
//   ✅ Core nav elements visible (via POM, no inline locators in test)
//   ✅ Hover on Login shows dropdown menu items
//   ✅ Hover on More shows additional links
//   ✅ Search navigates to results URL with query param
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');
const FlipkartPage = require('../Pages/Flipkart');

test.describe('Flipkart — POM Tests @regression', () => {

    test.beforeEach(async ({ page }) => {
        const flipkart = new FlipkartPage(page);
        await flipkart.goto();
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Page title and core header elements are visible @smoke', async ({ page }) => {
        const flipkart = new FlipkartPage(page);

        await expect(page).toHaveTitle(/Online Shopping/i);
        await expect(flipkart.flipkartLogo).toBeVisible();
        await expect(flipkart.loginBtn).toBeVisible();
        await expect(flipkart.searchBox).toBeVisible();
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Hovering on Login reveals the user dropdown menu @smoke', async ({ page }) => {
        const flipkart = new FlipkartPage(page);

        await flipkart.hoverLogin();

        await expect(page.getByText('My Profile')).toBeVisible();
        await expect(page.getByText('Orders')).toBeVisible();
        await expect(page.getByText('Wishlist', { exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Become a Seller', exact: true })).toBeVisible();
        await expect(page.getByText('Notification Preferences')).toBeVisible();
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Hovering on More reveals additional nav links @regression', async ({ page }) => {
        const flipkart = new FlipkartPage(page);

        await flipkart.hoverMore();

        await expect(flipkart.moreLink).toBeVisible();
        await expect(page.getByRole('link', { name: 'Become a Seller', exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Notification Settings' })).toBeVisible();
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Searching for a product navigates to search results URL @regression', async ({ page }) => {
        const flipkart = new FlipkartPage(page);

        await flipkart.search('laptop');

        // Verify the URL contains the search query
        expect(page.url()).toContain('q=laptop');
        expect(await flipkart.isOnSearchResultsPage()).toBe(true);
    });
});
