class ApiUtils {
    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    async getToken() {
        const loginResponse = await this.apiContext.post(
            'https://rahulshettyacademy.com/api/ecom/auth/login',
            {
                data: this.loginPayLoad,
                headers: { 'Content-Type': 'application/json' },
            }
        );
        const loginJson = await loginResponse.json();
        return loginJson.token;
    }

    async createOrder(orderPayLoad) {
        const token = await this.getToken();
        const orderResponse = await this.apiContext.post(
            'https://rahulshettyacademy.com/api/ecom/order/create-order',
            {
                data: orderPayLoad,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }
        );
        const orderJson = await orderResponse.json();
        return {
            token,
            orderid: orderJson.orders[0],
        };
    }
}

module.exports = { ApiUtils };
