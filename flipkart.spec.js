const {test, expect} = require('@playwright/test'); //import always

//test.only will only run that test in the file
test('Verify user is able to Naviage to Flipkart page with all Labels and Other Fields are visible',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://www.flipkart.com/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    await expect(page).toHaveTitle("Online Shopping Site for Mobiles, Electronics, Furniture, Grocery, Lifestyle, Books & More. Best Offers!");

    //Verify user is able to see the flipkart page with flipkart btn, Travel, Login, Cart
    await expect(page.getByLabel("Flipkart")).toBeVisible();
    await expect(page.getByRole("link",{name:"Travel"})).toBeVisible();
    await expect(page.getByLabel("Login")).toBeVisible();
    await expect(page.getByRole("link",{name:"Cart"})).toBeVisible();
    await expect(page.getByRole('Textbox',{name : "Search for Products, Brands and More"})).toBeVisible();

    //Verify user is able to Hover on Login and login is visible
    await page.getByLabel("Login").hover();
    await expect(page.getByRole("link",{name:"Login"}).nth(1)).toBeVisible();

    //Verify other fields should be visible as well
    await page.getByLabel("Login").hover();
    await expect(page.getByText('My Profile')).toBeVisible();
    await expect(page.getByText('Orders')).toBeVisible();
    await expect(page.getByRole('link',{name:'Wishlist Wishlist'})).toBeVisible();
    await expect(page.getByRole('link',{name:'Become a Seller',exact:true})).toBeVisible();
    await expect(page.getByRole('link',{name:'Rewards'})).toBeVisible();
    await expect(page.getByRole('link',{name:'Gift Cards Gift Cards'})).toBeVisible();
    await expect(page.getByText('Sign Up')).toBeVisible();
    await expect(page.getByText('New customer?')).toBeVisible();
    await expect(page.getByText('Flipkart Plus Zone')).toBeVisible();
    await expect(page.getByText('Wishlist',{exact:true})).toBeVisible();
    await expect(page.getByRole('link',{name:'Rewards Rewards'})).toBeVisible();
    await expect(page.getByText('Notification Preferences')).toBeVisible();

    //Verify On hovering on More as well some options should be visible
    await page.getByRole("link",{name:"More", exact: true}).hover();
    await expect(page.getByRole("link",{name:"More", exact: true})).toBeVisible();
    await expect(page.getByRole('link',{name:'Become a Seller',exact:true})).toBeVisible();
    await expect(page.getByRole('link',{name:'Notification Settings'})).toBeVisible();    
});