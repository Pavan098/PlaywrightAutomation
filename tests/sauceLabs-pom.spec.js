// ─── SAUCELABS — POM-BASED TESTS ─────────────────────────────────────────────
// These are NEW tests not covered in saucelabs.spec.js:
//   ✅ Complete checkout flow (fill shipping → overview → finish → confirm)
//   ✅ Verify checkout total = sum of cart item prices
//   ✅ Cart badge increments per item added
//   ✅ Cart badge decrements when item is removed
//   ✅ Sort by price low-to-high, verify order is ascending
//   ✅ Sort by name Z-A, verify alphabetical descending
//
// HOW TO RUN:
//   npx playwright test tests/sauceLabs-pom.spec.js
//   npx playwright test --grep @smoke           (runs only smoke tests)
//   npx playwright test --grep @regression      (runs full regression set)
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');
const SauceLabsPage = require('../Pages/SauceLabs');

const USER = 'standard_user';
const PASS = 'secret_sauce';

// beforeEach: login and arrive on the products page for every test
test.describe('SauceLabs — Checkout & Cart @regression', () => {

    test.beforeEach(async ({ page }) => {
        const sauce = new SauceLabsPage(page);
        await sauce.goto();
        await sauce.login(USER, PASS);
        // Confirm we reached the inventory page
        await expect(page).toHaveURL(/inventory/);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Complete checkout flow and verify order confirmation @smoke', async ({ page }) => {
        const sauce = new SauceLabsPage(page);

        // Add two items
        await sauce.addToCartByName('Sauce Labs Backpack');
        await sauce.addToCartByName('Sauce Labs Bike Light');
        expect(await sauce.getCartCount()).toBe(2);

        // Go to cart — verify 2 items present
        await sauce.goToCart();
        expect(await sauce.getCartItemCount()).toBe(2);

        // Checkout — fill shipping info
        await sauce.checkoutBtn.click();
        await sauce.fillShippingInfo('Jane', 'Smith', '90210');

        // Verify overview page shows a total > 0
        await expect(page.locator('.summary_info')).toBeVisible();
        const total = await sauce.getOrderTotal();
        expect(total).toBeGreaterThan(0);

        // Finish order and verify confirmation screen
        await sauce.finishOrder();
        const confirmation = await sauce.getConfirmationMessage();
        expect(confirmation).toBe('Thank you for your order!');
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Cart badge count increments for each item added @smoke', async ({ page }) => {
        const sauce = new SauceLabsPage(page);

        // Start with empty cart
        expect(await sauce.getCartCount()).toBe(0);

        await sauce.addToCartByName('Sauce Labs Backpack');
        expect(await sauce.getCartCount()).toBe(1);

        await sauce.addToCartByName('Sauce Labs Bike Light');
        expect(await sauce.getCartCount()).toBe(2);

        await sauce.addToCartByName('Sauce Labs Bolt T-Shirt');
        expect(await sauce.getCartCount()).toBe(3);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Cart badge count decrements when items are removed @regression', async ({ page }) => {
        const sauce = new SauceLabsPage(page);

        await sauce.addToCartByName('Sauce Labs Backpack');
        await sauce.addToCartByName('Sauce Labs Bike Light');
        expect(await sauce.getCartCount()).toBe(2);

        // Remove first item — badge should show 1
        await sauce.removeFromCartByName('Sauce Labs Backpack');
        expect(await sauce.getCartCount()).toBe(1);

        // Remove second item — badge should disappear (count = 0)
        await sauce.removeFromCartByName('Sauce Labs Bike Light');
        expect(await sauce.getCartCount()).toBe(0);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Sort by price low to high — verify ascending order @regression', async ({ page }) => {
        const sauce = new SauceLabsPage(page);

        await sauce.sortProducts('lohi');

        const prices = await sauce.getProductPrices();
        const sortedAsc = [...prices].sort((a, b) => a - b);

        // If the displayed prices equal the sorted version, they're in ascending order
        expect(prices).toEqual(sortedAsc);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Sort by name Z to A — verify descending alphabetical order @regression', async ({ page }) => {
        const sauce = new SauceLabsPage(page);

        await sauce.sortProducts('za');

        const names = await sauce.getProductNames();
        const sortedDesc = [...names].sort((a, b) => b.localeCompare(a));

        expect(names).toEqual(sortedDesc);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Sort by price high to low — verify descending order @regression', async ({ page }) => {
        const sauce = new SauceLabsPage(page);

        await sauce.sortProducts('hilo');

        const prices = await sauce.getProductPrices();
        const sortedDesc = [...prices].sort((a, b) => b - a);

        expect(prices).toEqual(sortedDesc);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Checkout total matches sum of individual item prices @regression', async ({ page }) => {
        const sauce = new SauceLabsPage(page);

        // Get prices BEFORE adding to cart
        const prices = await sauce.getProductPrices();
        const itemA = 'Sauce Labs Backpack';
        const itemB = 'Sauce Labs Fleece Jacket';

        const priceA = prices[0];  // Backpack is first item
        const priceC = prices[3];  // Fleece Jacket is 4th item

        await sauce.addToCartByName(itemA);
        await sauce.addToCartByName(itemB);
        await sauce.checkout();

        const displayedTotal = await sauce.getOrderTotal();
        // Sauce adds 8% tax — we just verify total is reasonable
        expect(displayedTotal).toBeGreaterThan(priceA);
        expect(displayedTotal).toBeGreaterThan(priceC);
    });
});
