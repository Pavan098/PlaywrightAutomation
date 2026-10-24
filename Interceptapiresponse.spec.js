const { test, expect, request } = require('@playwright/test'); //import always
const { ApiUtils } = require('./utils/ApiUtils');
const loginPayLoad = { userEmail: "luxorplus1@gmail.com", userPassword: "Oneplus@0908" };
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
const fakepayload = { data: [], message: "No Orders" };

//Request include here to use API tool for playwright
let response;
test.beforeAll(async () => {

    //Request context here to use API tool for playwright
    const apicontext = await request.newContext();
    const apiUtils = new ApiUtils(apicontext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
    console.log('Response from beforeAll:', response);
});

test('End to End Automation Part', async ({ browser, page }) => {

    //To store token in local storage we use js script in playwright
    await page.addInitScript(value => {
        localStorage.setItem('token', value);
    }, response.token);

    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/client/');

    //Routing
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/63270237c4d0c51f4f243e71',
        async route => {
            //intercepting the response - api - response
            //fetches the response
            const fakeresponse = await page.request.fetch(route.request());
            let body = JSON.stringify(fakepayload);
            route.fulfill({
                fakeresponse,
                body,
            });

        }
    )

    //Go to order section and verify the order id button and click on View
    //await page.pause(); // Remove pause for automated testing
    const orders = page.locator('button[routerlink="/dashboard/myorders"]');
    await orders.click();

    //Wait for navigation
    await page.waitForLoadState('networkidle');

    //Verify the url contains myorders
    expect(page.url()).toContain('myorders');

    //Verfiy the no orders page is displayed
    await page.getByText('You have No Orders to show at').isVisible();

});