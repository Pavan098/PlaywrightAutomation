/**
 * NavBar — SauceLabs top navigation bar component.
 * Shared across Inventory, Cart, and Checkout pages.
 * SauceLabs.js composes this for cart/logout actions.
 */
class NavBar {
    constructor(page) {
        this.page       = page;
        this.cartLink   = page.locator('.shopping_cart_link');
        this.cartBadge  = page.locator('.shopping_cart_badge');
        this.menuBtn    = page.locator('#react-burger-menu-btn');
        this.closeBtn   = page.locator('#react-burger-cross-btn');
        this.logoutLink = page.locator('#logout_sidebar_link');
        this.allItems   = page.locator('#inventory_sidebar_link');
        this.aboutLink  = page.locator('#about_sidebar_link');
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

    async openMenu() {
        await this.menuBtn.click();
        await this.logoutLink.waitFor({ state: 'visible' });
    }

    async logout() {
        await this.openMenu();
        await this.logoutLink.click();
        await this.page.waitForURL('**/');
    }

    async goToAllItems() {
        await this.openMenu();
        await this.allItems.click();
        await this.page.waitForURL('**/inventory.html');
    }
}

module.exports = NavBar;
