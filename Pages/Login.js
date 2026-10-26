class Login {
    constructor(page) {
        this.page = page;
    }

    async goToClientWeb() {
        await this.page.goto('https://rahulshettyacademy.com/client/');
    }

    async validLogin(email, password) {
        await this.page.locator('#userEmail').fill(email);
        await this.page.locator('#userPassword').fill(password);
        await this.page.locator('#login').click();
    }

    Cartbody() {
        return this.page.locator('div.card-body b');
    }

    addtocart() {
        return this.page.locator('li button').filter({ hasText: 'Cart' });
    }

    selectCountryoption() {
        return this.page.locator('input[placeholder="Select Country"]');
    }

    selectCountry() {
        return this.page.getByRole('button', { name: 'Switzerland' });
    }

    placeOrder() {
        return this.page.getByText('Place Order ');
    }

    myOrders() {
        return this.page.getByRole('button', { name: 'ORDERS' });
    }
}

module.exports = { Login };
