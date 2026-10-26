/**
 * ProductCard — a single product tile on the SauceLabs inventory page.
 * Wraps the `.inventory_item` element and exposes typed actions.
 * Usage:
 *   const card = new ProductCard(page, 'Sauce Labs Backpack');
 *   await card.addToCart();
 *   const price = await card.getPrice();
 */
class ProductCard {
    constructor(page, productName) {
        this.page    = page;
        this.name    = productName;
        this.root    = page.locator('.inventory_item').filter({ hasText: productName });
        this.addBtn  = this.root.locator('button').filter({ hasText: 'Add to cart' });
        this.removeBtn = this.root.locator('button').filter({ hasText: 'Remove' });
        this.title   = this.root.locator('.inventory_item_name');
        this.desc    = this.root.locator('.inventory_item_desc');
        this.price   = this.root.locator('.inventory_item_price');
        this.image   = this.root.locator('img.inventory_item_img');
    }

    async addToCart() {
        await this.addBtn.click();
    }

    async removeFromCart() {
        await this.removeBtn.click();
    }

    async getPrice() {
        const text = await this.price.innerText();
        return parseFloat(text.replace('$', '').trim());
    }

    async getName() {
        return (await this.title.innerText()).trim();
    }

    async getDescription() {
        return (await this.desc.innerText()).trim();
    }

    async isInCart() {
        return await this.removeBtn.isVisible();
    }

    async clickTitle() {
        await this.title.click();
    }
}

module.exports = ProductCard;
