const {test, expect, request} = require('@playwright/test'); //import always
const {ApiUtils} = require('../utils/ApiUtils');
const loginPayLoad = {userEmail:"luxorplus1@gmail.com", userPassword:"Oneplus@0908"};
const orderPayLoad = {orders:[{country:"India", productOrderedId:"6960eac0c941646b7a8b3e68"}]};

//Request include here to use API tool for playwright
let response;
test.beforeAll(async ()=>{

    //Request context here to use API tool for playwright
    const apicontext = await request.newContext();
    const apiUtils = new ApiUtils(apicontext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
    console.log('Response from beforeAll:', response);
});

test('End to End Automation Part',async ({browser,page}) => {

    //To store token in local storage we use js script in playwright
    await page.addInitScript(value => {
        localStorage.setItem('token',value);
    }, response.token);

    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/client/');

    //Go to order section and verify the order id button and click on View
    //await page.pause(); // Remove pause for automated testing
    const orders = page.locator('button[routerlink="/dashboard/myorders"]');
    await orders.click();

    //Wait for navigation
    await page.waitForLoadState('networkidle');

    //Verify the url contains myorders
    expect(page.url()).toContain('myorders');

    //Verify in the table the order id is present
    const tableid = page.locator('tbody tr');
    await tableid.first().waitFor(); // Wait for table to load
    console.log(await tableid.count());

    for(let i = 0; i < await tableid.count(); ++i) {
        const orderIdText = await tableid.locator('th').nth(i).textContent();
        console.log(`Row ${i} order ID: ${orderIdText}`);
        
        if(orderIdText === response.orderid) { // Use orderid from beforeAll, not undefined exactorderid

            console.log(`Found matching order at row ${i}`);
            console.log(await tableid.locator('th').nth(i).textContent());

            //Click on View button
            await tableid.locator('text="View"').nth(i).click();

            //Wait for order details page to load
            await page.waitForLoadState('networkidle');

            //Verify the url contains order details
            console.log(await page.locator('p.tagline').textContent());
            await expect(page.locator('p.tagline')).toContainText('Thank you for Shopping With Us');
            expect(page.url()).toContain('order-details');
            console.log(await page.locator('div.col-text').textContent());
            
            //Verify the order id as well along with the country and email as well
            await expect(page.locator('div.col-text')).toContainText(response.orderid);

            break;
        }
    }

});