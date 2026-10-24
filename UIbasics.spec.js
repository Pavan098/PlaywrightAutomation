const {test, expect} = require('@playwright/test'); //import always;
const {Login} = require('../Pages/Login');

//all tests here starts simultaneoisuly it does not follow the order so we need to use await always as the
//the keyword comes with async function 

//Page fixtures are available
//Fixtures are objects that are created for each test and provide a consistent test environment. 
// They're like "test helpers" that set up everything your test needs.
//page, context, browser, request they are global variables
//Playwrights runs in headless mode default

//test.only will only run that test in the file
test('Browser context First playwright test',async ({browser})=> //basic structure
{
    //playewright code
    //this is a context which is fresh it will take the browser given in config.js file
    //context.new page will give the new page
    //always use await so it will wait for first command

    //These two commands we can comment put with browser it will does that thing
    //we don't have the context and page to declare so we can comment and put with async wait
    const context = await browser.newContext();
    const page = await context.newPage();

    //Declaring the username and pass in const
    const userName = page.locator('#username');
    const passWord = page.locator('#password');
    const signIn = page.locator('#signInBtn');

    //Got to url
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Input the username, password in that and click on signin button
    //to locate the webelements we need to use 
    await page.locator('#username').fill('test');
    await page.locator('#password').fill('learning');
    await page.locator('#signInBtn').click();

    //for dynamic message wait playwright to wait for the message
    //it will wait automatically for the message
    console.log(await page.locator('div[style*="block"]').textContent());

    //Asser the text as well using toContainText
    await expect(page.locator('div[style*="block"]')).toContainText("Incorrect username/password.");

    //fill the correct usernamed and sign in button
    //Playwright clear uing fill("") this will clear the current text and enter the new one
    await userName.fill('');
    await userName.fill('rahulshettyacademy');
    await signIn.click();

    //Grab the title of first product page 
    //firsdt() or nth(0) - two ways
    const List = page.locator('div.card-body h4');
    console.log(await List.first().textContent());
    console.log(await List.nth(1).textContent());
    //Note : if we comment out above two lines then allTextContents will give zero elements as all TextContents is not suported by playwright

    console.log(await List.allTextContents());

    
});

test('Dropdows and Radio Button and checkboxes',async ({browser,page})=> //basic structure
{

    //Got to url
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Verify the dropdowns and select the values
    //locator.select option is the option to select the value
    const studentdrop = page.locator('div select.form-control');
    await studentdrop.selectOption('Teacher');

    //Assert the value should be teacher
    await expect(studentdrop).toContainText('Teacher');

    //All print all the value as well
    console.log(await studentdrop.textContent());
    
    //Radio Buttons
    const admin = page.locator('input[value="admin"]')
    const user = page.locator('input[value="user"]')

    //Veriify admin radio btn is checked or not
    await admin.isChecked() == true;
    await expect(admin).toBeChecked();
    console.log(await admin.isChecked());

    //Click on user radio button and verify the popup appears
    await user.setChecked(true);
    
    const okbtn = page.locator('#okayBtn')

    okbtn.click();
    await expect(user).toBeChecked();
    await expect(admin).not.toBeChecked();

    //click on admin btn again and verify user is unchecked
    await admin.setChecked(true);
    await expect(user).not.toBeChecked();

    //click on checkbox and verify it should be checked using check() and uncheck
    const terms = page.locator('#terms');
    expect(terms).not.toBeChecked();
    await terms.check();
    //await terms.uncheck();
    expect(terms).toBeChecked();
    
    // //Truthy and falsy
    // await expect(terms).toBeFalsy();
    // await expect(terms).toBeTruthy();

    //Note : await is required only when we are performing the actions on the elements
    //if we are storing the locator in const then we don't need to use await
    //expect(page.locator('#username')).toBeVisible(); -  here only assertion not the click required

    //there is blinking text in the page assert that using attribute value
    const blinking = page.locator("a[href*='documents-request']");
    //console.log(await blinking.getAttribute('class'));
    await expect(blinking).toHaveAttribute('class',"blinkingText");
    
});

test('Child windows handling',async ({browser})=> //basic structure
{

    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator('#username');

    //Got to url
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //there is blinking text in the page assert that using attribute value
    const blinking = page.locator("a[href*='documents-request']");
    await expect(blinking).toHaveAttribute('class',"blinkingText");

    /// this is simple method of waitforEvent of the page other one is promise
    //Where all the steps are parallely performed in the page

  /// -------------------------------------------------------
    // //Click on that link and it should open in new tab
    // await blinking.click();
    // //await page.pause();

    // //Now for child page we need to define the context which we defined earlier in the page
    // context.waitForEvent('page');
    // const page2 = await context.waitForEvent('page');

    // //print the new title
    // console.log(await page2.title());
    // await expect(page2).toHaveTitle("RS Academy");

    // //Assert this description pending
    // const email = page2.locator('div p.im-para.red');
    // await expect(email).toHaveText("Please email us at mentor@rahulshettyacademy.com with below template to receive response");
    // console.log(await email.textContent());

    //Promise way of waiting for the event

    const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        blinking.click(),
    ]);

    //print the new title
    console.log(await newPage.title());
    await expect(newPage).toHaveTitle("RS Academy");

    //Assert this description pending
    const email = newPage.locator('div p.im-para.red');
    await expect(email).toHaveText("Please email us at mentor@rahulshettyacademy.com with below template to receive response");
    console.log(await email.textContent());
    const txt = await email.textContent();
    const Email = txt.split('@');
    const domain = Email[1].split(' ');
    console.log(domain[0]);

    //Now put this in the parent window and check it is being putted or now
    await userName.fill(domain[0]);
    console.log(await userName.inputValue());
    

});

test('Client Login Other Website PageObject Test',async ({browser,page}) => {

    const login = new Login(page);
    await login.goToClientWeb();

    //Assert the title of the page and verify the title as well
    console.log(await page.title());
    await expect(page).toHaveTitle("Let's Shop");

    //PageObject Stuff
    await login.validLogin('luxorplus1@gmail.com','Oneplus@0908');

    // //enter the username and password and click on login button
    // const usernName = page.locator('#userEmail');
    // const password = page.locator('#userPassword');
    // const signIn = page.locator('#login');

    // await usernName.fill('luxorplus1@gmail.com');
    // await password.fill('Oneplus@0908');
    // await signIn.click();

    //Asser the text of the page and all log the all the text on the page as well
    //console.log(await page.locator('div.card-body b').first().textContent());
    // we have wait for page load state to load so all titles will be displayed
    //await page.waitForLoadState('load');
    await login.Cartbody().first().waitFor();
    console.log(await login.Cartbody().allTextContents());

});

test('First playwright test',async ({page})=> //basic structure
{
    //playewright code
    //this is a context which is fresh it will take the browser given in config.js file
    //context.new page will give the new page
    //always use await so it will wait for first command

    //Got to url
    await page.goto("https://www.google.com");
    console.log(await page.title());
    await expect(page).toHaveTitle('Google');
});


test('Generated from Code Gen', async ({ page }) => {
  
    //npx playwright codegen https://rahulshettyacademy.com/loginpagePractise/
    //in the terminal
  
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  await page.getByRole('textbox', { name: 'Username:' }).click();
  await page.getByRole('textbox', { name: 'Username:' }).fill('rahulshettyacademy');
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('learning');
  await page.getByRole('checkbox', { name: 'I Agree to the terms and' }).check();
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: 'Category 3' }).click();
  await page.goto('https://rahulshettyacademy.com/angularpractice/shop');
  await page.locator('app-card').filter({ hasText: 'iphone X $24.99 Lorem ipsum' }).getByRole('button').click();
  await page.getByText('Checkout ( 1 ) (current)').click();
  await page.locator('#exampleInputEmail1').click();
  await page.locator('#exampleInputEmail1').click();
  await page.locator('#exampleInputEmail1').fill('2');
  await page.getByRole('button', { name: 'Checkout' }).click();
  //await page.getByText('I agree with the term &').click();
  await page.getByRole('textbox', { name: 'Please choose your delivery' }).click();
  await page.getByRole('textbox', { name: 'Please choose your delivery' }).fill('Paris');
  await page.getByRole('button', { name: 'Purchase' }).click();
  await page.getByText('× Success! Thank you! Your').click();
});

test('End to End Automation Part PageObject method',async ({browser,page}) => {

    const login = new Login(page);
    
    //Navigate to Page
    await login.goToClientWeb();
    
    //Assert the title of the page and verify the title as well
    console.log(await page.title());
    await expect(page).toHaveTitle("Let's Shop");

    //enter the username and password and click on login button
    await login.validLogin('luxorplus1@gmail.com','Oneplus@0908');

    //Asser the text of the page and all log the all the text on the page as well
    //console.log(await page.locator('div.card-body b').first().textContent());
    // we have wait for page load state to load so all titles will be displayed
    //await page.waitForLoadState('load');
    await login.Cartbody().first().waitFor();
    //await page.waitForEvent('load');
    console.log(await login.Cartbody().allTextContents());

    //Now Add the Zaracoat 3 to the checkout 
    //Click on Add to cart btn
    const items = await login.Cartbody();
    const addtocart = page.locator('button.btn.w-10.rounded');
    const zara = 'ZARA COAT 3';

    //Get all product names
    const allItems = await items.allTextContents();
    console.log(allItems);

    // Find ZARA COAT 3 and click its add-to-cart button
    const count = await items.count();
    console.log(count);
    for(let i = 0; i < count; i++) {
    const itemText = await items.nth(i).textContent();
    if(itemText === zara) {
        // Click the add-to-cart button at the same index
        await addtocart.nth(i).click();
        break;
    }
}

    //Click on add to cart buttoon 
    //It will redirect you to cart Page
    await login.addtocart().click();

    //Verify the url
    const url = page.url();
    console.log(url);

    expect(url).toContain('cart');

    ///Verify the Zara is there already
    const zaraorder = page.locator('div.cartSection h3');
    await expect(zaraorder).toContainText(zara);

    //Click on Checkout btn
    const checkout = page.locator('li button.btn.btn-primary');
    await checkout.getByText('Checkout').click();

    //Verify on the checkout as well
    await expect(page.locator('div.item__title')).toContainText(zara);

    //Enter the Shipping details and verify the email addresss
    //Also select the country
    const name = page.locator('input.input.txt');
    await name.nth(3).fill('Tester');
    const email = page.locator('.input.txt.text-validated');
    console.log(await email.nth(2).inputValue());
    
    //Select the country
    //await page.locator('input[placeholder="Select Country"]').pressSequentially('Switz');
    await login.selectCountryoption().pressSequentially('Switz');
    await login.selectCountry().click();

    //Verify Switzerland is selected
    await expect(login.selectCountryoption()).toHaveValue('Switzerland');

    //Click on Place Order
    await login.placeOrder().click();

    //Verify the thankyou msg
    const thankyou = await page.locator('h1').textContent();
    console.log(thankyou);
    await expect(thankyou).toBe(' Thankyou for the order. ');

    //Verify zaracoat should be ordered
    const ordered = page.locator('text="ZARA COAT 3"')
    console.log(await ordered.textContent());
    await expect(ordered).toContainText(zara);

    //Print the order id as well
    const orderid = await page.locator('label.ng-star-inserted').textContent();
    console.log(orderid);

    //Get the exact orderid
    const exactorderid = orderid.split(' ');
    console.log(exactorderid[2]);

    //Go to order section and verify the order id button and click on View 
    await login.myOrders().click();

    //Verify the url contains myorders
    expect(page.url()).toContain('myorders');

    //Verify in the table the order id is present
    const tableid = page.locator('tbody tr');
    console.log(await tableid.count());

    for(let i = 0; i < await tableid.count(); ++i) {
        if(await tableid.locator('th').nth(i).textContent() == exactorderid[2]) {

            console.log(i);
            console.log(await tableid.locator('th').nth(i).textContent());

            //Click on View button
            await tableid.locator('text="View"').nth(i).click();

            //Verify the url contains order details
            console.log(await page.locator('p.tagline').textContent());
            await expect(page.locator('p.tagline')).toContainText('Thank you for Shopping With Us');
            expect(await page.url()).toContain('order-details');
            console.log(await page.locator('div.col-text').textContent());
            
            //Verify the order id as well along with the country and email as well
            await expect(page.locator('div.col-text')).toContainText(exactorderid[2]);

            break;
        }
    }

});

test('Angular Practice Website Get by Role Examples',async ({browser,page}) => {

    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    //Assert the title of the page and verify the title as well
    console.log(await page.title());
    await expect(page).toHaveTitle("ProtoCommerce");

    //fill the form and step by Step
    await page.getByLabel('Check me out if you Love IceCreams!').check();

    //fill the password
    //await page.getByLabel('Password').fill('Tester@0908');
    await page.getByPlaceholder('Password').fill('Tester@0908');

    //Select the Gender
    await page.getByLabel('Gender').selectOption('Female');

    //Select the Employment status employed
    await page.getByLabel('Employed').check();

    //Enter the name and Email
    // await page.getByLabel('Name').fill('Rahul');
    // await page.getByLabel('Email').fill('rahul@rahulshettyacademy.com');

    //click on submit button
    await page.getByRole('button', {name: 'Submit'}).click();
    
    //Verify the validation message
    await page.getByText(' The Form has been submitted successfully!.').isVisible();
    const success = await page.getByText(' The Form has been submitted successfully!.').textContent();
    console.log(success);
    expect(success).toContain(' The Form has been submitted successfully!.');

    //Click on Shop bnt as well
    await page.getByRole('link', {name: 'Shop'}).click();

    //Click on nokia Edge from the records
    //app-card has a lot of elements sp
    //This method narrows existing locator according to the options, for example filters by text. It can be chained to filter multiple times.
    //Filter has the lot of method this resolves the for loop concepts and also the ability to filter the elements
    await page.getByRole('button', {name: ' Checkout ( 0 ) '}).isVisible();
    //await page.locator('app-card').filter({hasText: 'Nokia Edge'}).getByRole('button', {name: 'Add'}).click();
    await page.locator('app-card').filter({hasText: 'Nokia Edge'}).getByRole('button').click();
    //await page.locator('app-card').getByText('Nokia Edge').click();

    //Verify the checkout btn should be one
    await page.getByRole('button', {name: ' Checkout ( 1 ) '}).isVisible();





});

test('End to End Automation Part of Client App using GetBy Different locators',async ({browser,page}) => {

    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/client/');

    //Assert the title of the page and verify the title as well
    console.log(await page.title());
    await expect(page).toHaveTitle("Let's Shop");

    //enter the username and password and click on login button
    const usernName = page.getByPlaceholder('email@example.com');
    const password = page.getByPlaceholder('enter your passsword');
    const signIn = page.getByRole('button',{name: 'Login'});

    await usernName.fill('luxorplus1@gmail.com');
    await password.fill('Oneplus@0908');
    await signIn.click();

    //Asser the text of the page and all log the all the text on the page as well
    //console.log(await page.locator('div.card-body b').first().textContent());
    // we have wait for page load state to load so all titles will be displayed
    //await page.waitForLoadState('load');
    await page.locator('div.card-body b').first().waitFor();
    //await page.waitForEvent('load');
    console.log(await page.locator('div.card-body b').allTextContents());

    //Now Add the Zaracoat 3 to the checkout 
    //Click on Add to cart btn
    const items = page.locator('div.card-body b');
    const addtocart = page.locator('button.btn.w-10.rounded');
    const zara = 'ZARA COAT 3';

    //Get all product names
    const allItems = await items.allTextContents();
    console.log(allItems);

    //using Filter technique to find the Zara Coat 3 and add to cart btn
    await page.locator('div.card-body').filter({hasText: zara}).getByRole('button',{name: 'Add To Cart'}).click();

    //Click on add to cart buttoon 
    //It will redirect you to cart Page
    const cart = page.locator('li button').filter({hasText:'Cart'});
    await cart.click();

    //Verify the url
    const url = page.url();
    console.log(url);

    expect(url).toContain('cart');

    ///Verify the Zara is there already
    const zaraorder = await page.locator('div.cartSection').filter({hasText: zara})
    await expect(zaraorder).toContainText(zara);

    //Click on Checkout btn
    const checkout = page.getByText('Checkout');
    await checkout.getByText('Checkout').click();

    //Verify on the checkout as well
    await expect(page.getByText('ZARA COAT 3')).toContainText(zara);

    //Enter the Shipping details and verify the email addresss
    //Also select the country
    const name = page.locator('input.input.txt');
    const credicard = page.getByRole('textbox');
    await credicard.first().fill('9931 9292 2293 3452');

    const cvvcode = page.getByRole('textbox');
    await cvvcode.nth(1).fill('123');

    const nameoncard = page.getByRole('textbox');
    await nameoncard.nth(2).fill('Tester');

    const coupon = page.getByRole('textbox');
    //await coupon.nth(3).fill('TESTCOUPON');

    //click on Apply Coupon btn
    const couponbtn = page.getByRole('button',{name: 'Apply Coupon'});
    //await couponbtn.click();

    //Verify the Error msg
    //await page.getByText('* Invalid Coupon').isVisible();

    //Select the month and date
    const expiry = page.locator('select.input.ddl');
    await expiry.nth(1).selectOption('22');
    await expiry.first().selectOption('05');

    // await name.nth(3).fill('Tester');
    // const email = page.locator('.input.txt.text-validated');
    // console.log(await email.nth(2).inputValue());
    
    //Change the Email address
    await page.pause();
    const emailtxt = page.getByRole('textbox');
    emailtxt.nth(4).fill('test@gmail.com');

    //Select the country
    //const country = page.locator('input[placeholder="Select Country"]');
    const country = page.getByPlaceholder('Select Country');
    await country.pressSequentially('Switz');

    await page.getByRole('button',{name:'Switzerland'}).click();

    //Verify Switzerland is selected
    await expect(country).toHaveValue('Switzerland');

    //Click on Place Order
    const placeorder = page.getByText('Place Order ');
    await placeorder.click();

    //Verify the thankyou msg
    const thankyou = await page.getByText(' Thankyou for the order. ').textContent();
    console.log(thankyou);
    expect(thankyou).toBe(' Thankyou for the order. ');

    //Verify zaracoat should be ordered
    const ordered = page.getByText('ZARA COAT 3');
    console.log(await ordered.textContent());
    await expect(ordered).toContainText(zara);

    //Print the order id as well
    const orderid = await page.locator('label.ng-star-inserted').textContent();
    console.log(orderid);

    //Get the exact orderid
    const exactorderid = orderid.split(' ');
    console.log(exactorderid[2]);

    //Go to order section and verify the order id button and click on View 
    const orders = page.getByRole('button',{name:'ORDERS'});
    await orders.click();

    //Verify the url contains myorders
    expect(page.url()).toContain('myorders');

    //Verify in the table the order id is present
    const tableid = page.locator('tbody tr');
    console.log(await tableid.count());

    for(let i = 0; i < await tableid.count(); ++i) {
        if(await page.getByText(exactorderid[2]).nth(i).textContent() == exactorderid[2]) {

            console.log(i);
            await page.pause();
            console.log(await page.getByText(exactorderid[2]).nth(i).textContent());

            //Click on View button
            await page.getByRole('button',{name:'View'}).nth(i).click();
            //await tableid.locator('text="View"').nth(i).click();

            //Verify the url contains order details
            console.log(await page.getByText('Thank you for Shopping With Us').textContent());
            await expect(await page.getByText('Thank you for Shopping With Us')).toContainText('Thank you for Shopping With Us');
            expect(await page.url()).toContain('order-details');
            console.log(await page.getByText(exactorderid[2]).textContent());
            
            //Verify the order id as well along with the country and email as well
            await expect(page.getByText(exactorderid[2])).toContainText(exactorderid[2]);

            break;
        }
    }
});

test('Calender Tests', async({browser,page}) =>{
   
    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');

    //Assert the title of the page and verify the title as well
    console.log(await page.title());
    await expect(page).toHaveTitle("GreenKart - veg and fruits kart");

    //Click on top deals btn and verify it opens in the new page as well
    //Create a new context page
    const topdeals = page.getByText('Top Deals');
    const context = page.context();

const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    topdeals.click()
]);

    await expect(newPage.getByText('Wheat')).toBeVisible();

    //Now select the date and verify the date is selected
    const icon = newPage.locator('.react-date-picker__calendar-button');
    await icon.click(); 

    const monthyear = newPage.getByText('January 2026');
    await monthyear.click();
    await newPage.getByText('August').click();
    await newPage.getByRole('button', {name: 'August 9'}).click();

    const monthvalue = newPage.locator('input[name="month"]');
    console.log(await monthvalue.inputValue());
    await expect(monthvalue).toHaveValue('8');
    const datevalue = newPage.locator('input[name="day"]');
    await expect(datevalue).toHaveValue('9');
    const year = newPage.locator('input[name="year"]');
    await expect(year).toHaveValue('2026');

    //Now select these dates months and years
    await icon.click();
    await newPage.getByText('August 2026').click();
    await newPage.getByText('2026').click();

    const selectyear = '2027';
    const selectmonth = 'November';
    const monthval = '11';
    const selectday = '22';

    await newPage.getByText(selectyear).click();
    await newPage.getByText(selectmonth).click();
    await newPage.getByRole('button', { name: selectday }).click();

    //Verify the assertion
    const expectedlist = [monthval,selectday,selectyear];
    const inputs = newPage.locator('.react-date-picker__inputGroup__input');
    await newPage.pause();
    for(let i = 0; i < expectedlist.length; i++){

        const value = await inputs.nth(i).inputValue();
        expect(value).toEqual(expectedlist[i]);
    }

    //Verify the assertion
    await expect(monthvalue).toHaveValue('11');
    console.log(await monthvalue.inputValue());
    await expect(datevalue).toHaveValue('22');
    await expect(year).toHaveValue('2027');

});

test('More Validations', async({browser,page}) =>{
   
    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    //Assert the title of the page and verify the title as well
    console.log(await page.title());
    await expect(page).toHaveTitle("Practice Page");

    //Hide show Example using expect
    const hideshow = page.getByPlaceholder('Hide/Show Example');
    const hide = page.getByRole('button',{name:'Hide'});
    const show = page.getByRole('button',{name:'Show'});

    //Verify hideshow is displayed
    await expect(hideshow).toBeVisible();

    //Click on hide button
    await hide.click();
    
    //Verify hideshow is hidden
    await expect(hideshow).toBeHidden();

    //Click on show button
    await show.click();

    //Verify hideshow is displayed
    await expect(hideshow).toBeVisible();
});

test.only('JS Popups', async({browser,page}) =>{
   
    //Navigate to Page
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    //Assert the title of the page and verify the title as well
    console.log(await page.title());
    await expect(page).toHaveTitle("Practice Page");

    //Popups
    const enteryourname = page.getByPlaceholder('Enter Your Name');
    const alert = page.getByRole('button',{name:'Alert'});
    const confirm = page.getByRole('button',{name:'Confirm'});

    //Enter the name
    
    await enteryourname.fill('Test');

    //Click on alert button
    //Popups appears
    await confirm.click();
    page.on('dialog',dialog => dialog.accept());

    //hover 
    await page.getByRole('button', { name: 'Mouse Hover' }).hover();
    await page.getByText('Top').click();

    //Frames iframe whatever we have in ifram we need to switch it
    const iframes = page.frameLocator('#courses-iframe');

    //Now click on All Access plan
    await iframes.locator('li a[href=lifetime-access]:visible').click();

    //Now exteact the number from that  of happy subscriber to do
    //await page.pause();
    const jointxt = await iframes.locator('.text h2').textContent();
    console.log(jointxt);

    //Split the Join 13,522 Happy Subscibers! get the number from that
    const splittxt = jointxt.split(' ');
    const number = splittxt[1];
    console.log(number);
    
});
