// ─── SAUCELABS PAGE OBJECT MODEL ─────────────────────────────────────────────
// Covers: https://www.saucedemo.com/
// Locators and actions are defined once here. Tests only call methods — never
// write locators directly. If the UI changes, you fix ONE file, not every test.
// ─────────────────────────────────────────────────────────────────────────────

const BasePage = require('./BasePage');

class SauceLabsPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = 'https://www.saucedemo.com/';

        // ── Login page ──────────────────────────────────────────────────────
        this.usernameInput  = page.locator('#user-name');
        this.passwordInput  = page.locator('#password');
        this.loginBtn       = page.locator('#login-button');
        this.errorMsg       = page.locator('[data-test="error"]');

        // ── Inventory (products) page ───────────────────────────────────────
        this.productItems   = page.locator('.inventory_item');
        this.sortDropdown   = page.locator('select.product_sort_container');
        this.cartBadge      = page.locator('.shopping_cart_badge');
        this.cartLink       = page.locator('.shopping_cart_link');

        // ── Cart page ───────────────────────────────────────────────────────
        this.cartItems      = page.locator('.cart_item');
        this.checkoutBtn    = page.locator('[data-test="checkout"]');

        // ── Checkout step 1 ─────────────────────────────────────────────────
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput  = page.locator('[data-test="lastName"]');
        this.zipInput       = page.locator('[data-test="postalCode"]');
        this.continueBtn    = page.locator('[data-test="continue"]');

        // ── Checkout step 2 (overview) ──────────────────────────────────────
        this.orderTotal     = page.locator('.summary_total_label');
        this.finishBtn      = page.locator('[data-test="finish"]');

        // ── Checkout complete ───────────────────────────────────────────────
        this.confirmHeader  = page.locator('.complete-header');

        // ── Menu ────────────────────────────────────────────────────────────
        this.menuBtn        = page.locator('#react-burger-menu-btn');
        this.logoutLink     = page.locator('#logout_sidebar_link');
    }

    // ── Navigation ────────────────────────────────────────────────────────────
    async goto() {
        await super.goto(this.url);
    }

    // ── Login / Logout ────────────────────────────────────────────────────────
    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
    }

    async logout() {
        await this.menuBtn.click();
        await this.logoutLink.waitFor({ state: 'visible' });
        await this.logoutLink.click();
    }

    async getErrorMessage() {
        return await this.getText(this.errorMsg);
    }

    // ── Products ──────────────────────────────────────────────────────────────
    async getProductCount() {
        return await this.productItems.count();
    }

    async getProductNames() {
        await this.productItems.locator('.inventory_item_name').first().waitFor({ state: 'visible' });
        return await this.page.locator('.inventory_item_name').allTextContents();
    }

    async getProductPrices() {
        // Wait for at least one price element to be visible before collecting all
        await this.productItems.locator('.inventory_item_price').first().waitFor({ state: 'visible' });
        const texts = await this.page.locator('.inventory_item_price').allTextContents();
        return texts.map(p => parseFloat(p.trim().replace('$', '')));
    }

    // Sort option values: 'az' | 'za' | 'lohi' | 'hilo'
    async sortProducts(option) {
        await this.sortDropdown.selectOption(option);
        // Wait for DOM to re-render with new sort order
        await this.page.waitForTimeout(600);
    }

    // ── Cart ──────────────────────────────────────────────────────────────────
    async addToCartByName(productName) {
        const product = this.productItems.filter({ hasText: productName });
        // Button text changes from "Add to cart" to "Remove" after adding
        await product.locator('button').filter({ hasText: 'Add to cart' }).click();
    }

    async removeFromCartByName(productName) {
        const product = this.productItems.filter({ hasText: productName });
        await product.locator('button').filter({ hasText: 'Remove' }).click();
    }

    async getCartCount() {
        const visible = await this.cartBadge.isVisible();
        if (!visible) return 0;
        return parseInt(await this.cartBadge.textContent(), 10);
    }

    async goToCart() {
        await this.cartLink.click();
        await this.page.waitForURL('**/cart.html');
    }

    async getCartItemCount() {
        await this.cartItems.first().waitFor({ state: 'visible' });
        return await this.cartItems.count();
    }

    // ── Checkout ──────────────────────────────────────────────────────────────
    async fillShippingInfo(firstName, lastName, zip) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.zipInput.fill(zip);
        await this.continueBtn.click();
        await this.page.waitForURL('**/checkout-step-two.html');
    }

    async getOrderTotal() {
        await this.orderTotal.waitFor({ state: 'visible' });
        const text = await this.orderTotal.innerText();
        return parseFloat(text.replace('Total: $', ''));
    }

    async finishOrder() {
        await this.finishBtn.click();
        await this.page.waitForURL('**/checkout-complete.html');
    }

    async getConfirmationMessage() {
        await this.confirmHeader.waitFor({ state: 'visible' });
        return (await this.confirmHeader.innerText()).trim();
    }

    // ── Full checkout flow shortcut ───────────────────────────────────────────
    async checkout(firstName = 'John', lastName = 'Doe', zip = '12345') {
        await this.goToCart();
        await this.checkoutBtn.click();
        await this.fillShippingInfo(firstName, lastName, zip);
    }
}

module.exports = SauceLabsPage;
