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

test('Intercept the Api request', async ({ browser, page }) => {

    //To store token in local storage we use js script in playwright
    await page.addInitScript(value => {
        localStorage.setItem('token', value);
    }, response.token);

    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/client/');

    // //enter the username and password and click on login button
    // const usernName = page.locator('#userEmail');
    // const password = page.locator('#userPassword');
    // const signIn = page.locator('#login');

    // await usernName.fill('luxorplus1@gmail.com');
    // await password.fill('Oneplus@0908');
    // await signIn.click();

    // await page.locator('div.card-body b').first().waitFor();
    // console.log(await page.locator('div.card-body b').allTextContents());

    // //Now Add the Zaracoat 3 to the checkout 
    // //Click on Add to cart btn
    // const items = page.locator('div.card-body b');
    // const addtocart = page.locator('button.btn.w-10.rounded');
    // const zara = 'ZARA COAT 3';

    // //Get all product names
    // const allItems = await items.allTextContents();
    // console.log(allItems);

    // // Find ZARA COAT 3 and click its add-to-cart button
    // const count = await items.count();
    // console.log(count);
    // for (let i = 0; i < count; i++) {
    //     const itemText = await items.nth(i).textContent();
    //     if (itemText === zara) {
    //         // Click the add-to-cart button at the same index
    //         await addtocart.nth(i).click();
    //         break;
    //     }
    // }

    //Go to order section and verify the order id button and click on View
    //await page.pause(); // Remove pause for automated testing
    const orders = page.locator('button[routerlink="/dashboard/myorders"]');
    await orders.click();

    //Routing
    await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
        async route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=69a29eca415d779f9b4b4abf' })
    )
    const tableid = page.locator('tbody tr');

    //Click on View button
    await tableid.locator('text="View"').nth(1).click();

    //Verify the Assertion
    await page.getByText('You are not authorize to view').isVisible();

});