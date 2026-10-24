const {test, expect} = require('@playwright/test'); //import always

//test.only will only run that test in the file
test('Verify the Swag labs is displayed with username and password',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://www.saucedemo.com/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    await expect(page).toHaveTitle("Swag Labs");

    //Verify user is able to see the username and password field
    const username = page.getByPlaceholder('Username');
    const password = page.getByPlaceholder('Password');
    const login = page.getByRole('button',{name:'Login'});
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    await expect(login).toBeEnabled();
});

test('Verify the validation occurs when directly clicking on Login button',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://www.saucedemo.com/");

    const login = page.getByRole('button',{name:'Login'});
    await expect(login).toBeEnabled();
    await login.click();

    //Verify the validation username is required
    await expect(page.getByText('Epic sadface: Username is required')).toContainText('Username is required');

});

test('Verify the validation occurs when entering only username validaiton of password occurs',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://www.saucedemo.com/");

    const username = page.getByPlaceholder('Username');
    const login = page.getByRole('button',{name:'Login'});
    await username.fill('standard_user');
    await expect(login).toBeEnabled();
    await login.click();

    //Verify the validation password is required
    await expect(page.getByText('Epic sadface: Password is required')).toContainText('Password is required');

});

test('Verify the validation occurs when entering incorrect username and password',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://www.saucedemo.com/");

    const username = page.getByPlaceholder('Username');
    const password = page.getByPlaceholder('Password');
    const login = page.getByRole('button',{name:'Login'});
    await username.fill('testuser');
    await password.fill('test');
    await expect(login).toBeEnabled();
    await login.click();

    //Verify the validation password is required
    await expect(page.getByText('Epic sadface: Username and password do not match any user in this service')).toContainText('Username and password do not match any user in this service');

});

test('Verify the validation when entering the direct password',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://www.saucedemo.com/");

    const password = page.getByPlaceholder('Password');
    const login = page.getByRole('button',{name:'Login'});
    await password.fill('secret_sauce');
    await expect(login).toBeEnabled();
    await login.click();

    //Verify the validation password is required
    await expect(page.getByText('Epic sadface: Username is required')).toContainText('Username is required');

});

test('Verify validations with by locked user',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://www.saucedemo.com/");
    const users = ['locked_out_user'];

   const username = page.getByPlaceholder('Username');
   const password = page.getByPlaceholder('Password');
   const login = page.getByRole('button',{name:'Login'});
   await username.fill(users[0]);
   await password.fill('secret_sauce');
   await expect(login).toBeEnabled();
   await login.click();
   
   //Verify the validation password is required
   await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toContainText('Sorry, this user has been locked out.');

});

test('Verify user is able to login with valid user and verify the products count and prices as well',async ({page})=> //basic structure
{
    //Got to url
   await page.goto("https://www.saucedemo.com/");

   const username = page.getByPlaceholder('Username');
   const password = page.getByPlaceholder('Password');
   const login = page.getByRole('button',{name:'Login'});
   await username.fill('standard_user');
   await password.fill('secret_sauce');
   await expect(login).toBeEnabled();
   await login.click();
   
   //Verify new page is loaded with Products
   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
   await expect(page.getByText('Products')).toBeVisible();

   //Verify click on 3 lins and all items logout, about and reset to Apps state is visible
   await page.getByRole('button',{name:'Open Menu'}).click();
   await expect(page.getByRole('link',{name:'Logout'})).toBeVisible();
   await expect(page.getByRole('link',{name:'About'})).toBeVisible();
   await expect(page.getByRole('link',{name:'Reset App State'})).toBeVisible();
   await expect(page.getByRole('link',{name:'All Items'})).toBeVisible();
   
   //click on close menu
   await page.getByRole('button',{name:'Close Menu'}).click();

   //Verify the count of the proucts along with price listed and print them in console as well
   const items = await page.locator('.inventory_item_description a').allTextContents();
   console.log(items);

   const countitems = items.length;
   console.log(countitems);

   //Prin the prices as well along with the items one by one
   for(let i = 0; i < countitems; i++) {
   const price = await page.locator('.inventory_item_price').nth(i).textContent();
   console.log(items[i]  + price);
   }

});

test('Verify user is able to add some products in the cart and to the checkout',async ({page})=> //basic structure
{
    //Got to url
   await page.goto("https://www.saucedemo.com/");

   const username = page.getByPlaceholder('Username');
   const password = page.getByPlaceholder('Password');
   const login = page.getByRole('button',{name:'Login'});
   await username.fill('standard_user');
   await password.fill('secret_sauce');
   await expect(login).toBeEnabled();
   await login.click();
   
   //Verify new page is loaded with Products
   await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
   await expect(page.getByText('Products')).toBeVisible();

   //Verify the count of the proucts along with price listed and print them in console as well
   const items = await page.locator('.inventory_item_description a').allTextContents();
   console.log(items);

   const countitems = items.length;
   console.log(countitems);

   //Prin the prices as well along with the items one by one
   for(let i = 0; i < countitems; i++) {
   const price = await page.locator('.inventory_item_price').nth(i).textContent();
   console.log(items[i]  + price);
   }

  //Add some products and verify Remove btn is being displayed as well
  const addtocart = page.locator('.inventory_item_description');
  await addtocart.filter({hasText:'Sauce Labs Backpack'}).getByRole('button',{name:'Add to Cart'}).click();
  await expect(addtocart.filter({hasText:'Sauce Labs Backpack'}).getByRole('button',{name:'Remove'})).toBeVisible();

  //Add Another product as well
  await addtocart.filter({hasText:'Sauce Labs Bike Light'}).getByRole('button',{name:'Add to Cart'}).click();

  //Click on Cart link and verify the Cart displays the products as well
  //Verify the Title as well
  await page.locator('.shopping_cart_link').click();

  const cartitems = await page.locator('.inventory_item_name').allTextContents();
  console.log(cartitems);
  await page.getByTitle('Your Cart').isVisible();

  //Verify the cartitems
  expect(cartitems).toContain('Sauce Labs Backpack');
  expect(cartitems).toContain('Sauce Labs Bike Light');

  //Verify the checkout btn is being displayed
  await expect(page.getByRole('button',{name:'Checkout'})).toBeVisible();

  //Click on Checkout btn
  await page.getByRole('button',{name:'Checkout'}).click();

  //Verify the checkout title is being displayed
  await page.getByTitle('Checkout: Your Information').isVisible();

  //Verify the form is being displayed
  await page.getByPlaceholder('First Name').isVisible();
  await page.getByPlaceholder('Last Name').isVisible();
  await page.getByPlaceholder('Zip/Postal Code').isVisible();

  //Click on Continue verify the Error msg is being displayed
  await page.getByRole('button',{name:'Continue'}).click();
  await expect(page.getByText('Error: First Name is required')).toContainText('Error: First Name is required');

  //Enter the Firstname verify lastname is required
  await page.getByPlaceholder('First Name').fill('John');
  await page.getByRole('button',{name:'Continue'}).click();
  await expect(page.getByText('Error: Last Name is required')).toContainText('Last Name is required');

  //Enter the Lastname verify Zipcode is required
  await page.getByPlaceholder('Last Name').fill('Doe');
  await page.getByRole('button',{name:'Continue'}).click();
  await expect(page.getByText('Error: Postal Code is required')).toContainText('Postal Code is required');

  //Enter the Zipcode click on Continue
  await page.getByPlaceholder('Zip/Postal Code').fill('12345');
  await page.getByRole('button',{name:'Continue'}).click();

  //Veiryf the Checkout page is being displayed
  await expect(page.getByText('Checkout: Overview')).toBeVisible();

  //Click on Finish btn 
  await page.getByRole('button',{name:'Finish'}).click();

  //Verify Thank you msg for the same
  await expect(page.getByText('Checkout: Complete!')).toBeVisible();
  await expect(page.getByText('Thank you for your order!')).toContainText('Thank you for your order!');
  await expect(page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!')).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');

});