const {test, expect, request} = require('@playwright/test'); //import always
//Request include here to use API tool for playwright
let webContext;
test.beforeAll(async ({browser})=>{

    const context = await browser.newContext();
    const page = await context.newPage();
    
    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/client/');

    //Assert the title of the page and verify the title as well
    console.log(await page.title());
    await expect(page).toHaveTitle("Let's Shop");

    //enter the username and password and click on login button
    const usernName = page.locator('#userEmail');
    const password = page.locator('#userPassword');
    const signIn = page.locator('#login');

    await usernName.fill('luxorplus1@gmail.com');
    await password.fill('Oneplus@0908');
    await signIn.click({});
    await page.waitForLoadState('networkidle');
    
    //Storage state needs to be called on context level not on page level
    //Give the path and it will create a state.json file
    //Invoke the browser with the state as well
    await context.storageState({path:'state.json'});
    webContext = await browser.newContext({storageState:'state.json'});

});

test('End to End Automation Part',async ({browser}) => {

    const zara = 'ZARA COAT 3';
    const page = await webContext.newPage();
    
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
        
        if(orderIdText === zara) { // Use orderid from beforeAll, not undefined exactorderid

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
            await expect(page.locator('div.col-text')).toContainText(zara);

            break;
        }
    }

});