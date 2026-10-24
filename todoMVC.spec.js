const {test, expect} = require('@playwright/test'); //import always

//test.only will only run that test in the file
test('Asserting Todos and adding multiple todos',async ({page})=> //basic structure
{

    // const context = await browser.newContext();
    // const page = await context.newPage();

    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Verify 4 items are left and All active completed is also there
    await expect(page.getByText('4 items left')).toBeVisible();
    await expect(page.locator('.filters').getByRole('link', { name: 'All' })).toBeVisible();
    await expect(page.locator('.filters').getByRole('link', { name: 'Active' })).toBeVisible();
    await expect(page.locator('.filters').getByRole('link', { name: 'Completed' })).toBeVisible();

    //Expect all the items are visible
    await expect(page.getByText('Tester')).toBeVisible();
    await expect(page.getByText('Playwright')).toBeVisible();
    await expect(page.getByText('QA')).toBeVisible();
    await expect(page.getByText('Selenium')).toBeVisible();
    
});

test('should not add empty todo', async ({ page }) => {
    
    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");
    
    // 1. Click on the input field without typing anything
    await page.getByRole('textbox', { name: 'What needs to be done?' }).click();
    
    // Expect: The input field is focused
    await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeFocused();
    
    // 2. Press Enter
    await page.keyboard.press('Enter');
    
    // Expect: No todo is added to the list, The todo list remains empty
    await expect(page.getByRole('list')).not.toBeVisible();
  });

test('should trim whitespace from new todo', async ({ page }) => {
    
    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");
    
    // 1. Type '   Todo with spaces   ' (with leading and trailing spaces) and press Enter
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill('   Todo with spaces   ');
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Expect: The todo is added as 'Todo with spaces' without leading or trailing whitespace, Counter shows '1 item left'
    await expect(page.getByText('Todo with spaces')).toBeVisible();
    await expect(page.getByText('1 item left')).toBeVisible();
  });

test('Complete the Single To do', async ({ page }) => {
    
    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Now 4 items are left 
    await expect(page.getByText('4 items left')).toBeVisible();

    //Complete one single to do
    //To do
    await page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo').click();
    
    //Verify 3 items will be left now
    await expect(page.getByText('3 items left')).toBeVisible();

    //click on Completed you will see the Tester being completed
    await page.locator('.filters').getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByRole('listitem').filter({hasText:'Tester'})).toBeVisible();
});

test('Complete all the todos and verify the 0 items left', async ({ page }) => {
    
    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Now 4 items are left 
    await expect(page.getByText('4 items left')).toBeVisible();

    //Complete all todos
    await page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'QA'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Selenium'}).getByLabel('Toggle Todo').click();
    
    //Verify 0 items will be left now
    await expect(page.getByText('0 items left')).toBeVisible();

    //click on Completed you will see the Tester being completed
    await page.locator('.filters').getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByRole('listitem').filter({hasText:'Tester'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Playwright'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'QA'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium'})).toBeVisible();

   //Verify all items should be toBeChecked
    await expect(page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo')).toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Toggle Todo')).toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'QA'}).getByLabel('Toggle Todo')).toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium'}).getByLabel('Toggle Todo')).toBeChecked();
    
});

test('Complete all the todos and verify clear completed removes the lists', async ({ page }) => {
    
    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Now 4 items are left 
    await expect(page.getByText('4 items left')).toBeVisible();

    //Complete all todos
    await page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'QA'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Selenium'}).getByLabel('Toggle Todo').click();
    
    //Verify 0 items will be left now
    await expect(page.getByText('0 items left')).toBeVisible();

    //click on Completed you will see the Tester being completed
    await page.locator('.filters').getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByRole('listitem').filter({hasText:'Tester'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Playwright'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'QA'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium'})).toBeVisible();

   //Verify all items should be toBeChecked
    await expect(page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo')).toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Toggle Todo')).toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'QA'}).getByLabel('Toggle Todo')).toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium'}).getByLabel('Toggle Todo')).toBeChecked();

    //Verify Clear Completed btn is visible and all items gets disappeared
    await page.getByRole('button', { name: 'Clear completed' }).click();

    //Verify listitems not exists
    await expect(page.getByRole('listitem').filter({hasText:'Tester'})).not.toBeVisible();
    
});

test('Uncheck the Single To do and verify the Status changes to Active', async ({ page }) => {
    
    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Now 4 items are left 
    await expect(page.getByText('4 items left')).toBeVisible();

    //Complete all todos
    await page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'QA'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Selenium'}).getByLabel('Toggle Todo').click();

    //Click on completed
    await page.locator('.filters').getByRole('link', { name: 'Completed' }).click();
    
    //Verify 0 items will be left now
    await expect(page.getByText('0 items left')).toBeVisible();

    //Uncheck the Tester one and verify in completed 1 item left 
    await page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo').click();
    await expect(page.getByText('1 item left')).toBeVisible();

    //Click on Active and verify only Tester item should be visible
    await page.locator('.filters').getByRole('link', { name: 'Active' }).click();
    await expect(page.getByRole('listitem').filter({hasText:'Tester'})).toBeVisible();

   //Verify that item should be unchecked
    await expect(page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo')).not.toBeChecked();
    
});

test('Uncheck the All To dos and verify the Status changes to Active', async ({ page }) => {
    
    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Now 4 items are left 
    await expect(page.getByText('4 items left')).toBeVisible();

    //Complete all todos
    await page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'QA'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Selenium'}).getByLabel('Toggle Todo').click();

    //Click on completed
    await page.locator('.filters').getByRole('link', { name: 'Completed' }).click();
    
    //Verify 0 items will be left now
    await expect(page.getByText('0 items left')).toBeVisible();

    //Uncheck the Tester one and verify in completed 1 item left 
    await page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'QA'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Selenium'}).getByLabel('Toggle Todo').click();
    await expect(page.getByText('4 items left')).toBeVisible();

    //Click on Active and verify all items are visible
    await page.locator('.filters').getByRole('link', { name: 'Active' }).click();
    await expect(page.getByRole('listitem').filter({hasText:'Tester'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Playwright'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'QA'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium'})).toBeVisible();

   //Verify that item should be unchecked
    await expect(page.getByRole('listitem').filter({hasText:'Tester'}).getByLabel('Toggle Todo')).not.toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Toggle Todo')).not.toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'QA'}).getByLabel('Toggle Todo')).not.toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium'}).getByLabel('Toggle Todo')).not.toBeChecked();
    
});

test('Verify you are able to Edit the all Todos and assert the new value', async ({ page }) => {
    
    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Now 4 items are left 
    await expect(page.getByText('4 items left')).toBeVisible();

    //Now Edit the todos with the new names
    await page.getByText('Tester').dblclick();
    await page.getByRole('listitem').filter({hasText:'Tester'}).locator('input.edit').fill('Tester Done');
    await page.keyboard.press('Enter'); 

    //Now Edit the todos with the new names
    await page.getByText('Playwright').dblclick();
    await page.getByRole('listitem').filter({hasText:'Playwright'}).locator('input.edit').fill('Learning Playwright');
    await page.keyboard.press('Enter');

    //Now Edit the todos with the new names
    await page.getByText('QA').dblclick();
    await page.getByRole('listitem').filter({hasText:'QA'}).locator('input.edit').fill('QA Done');
    await page.keyboard.press('Enter');

    //Now Edit the todos with the new names
    await page.getByText('Selenium').dblclick();
    await page.getByRole('listitem').filter({hasText:'Selenium'}).locator('input.edit').fill('Selenium Done');
    await page.keyboard.press('Enter');

    //Verify the updated field should be there
    await expect(page.getByRole('listitem').filter({hasText:'Tester Done'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Learning Playwright'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Qa Done'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium Done'})).toBeVisible();

    //Complete all todos
    await page.getByRole('listitem').filter({hasText:'Tester Done'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Learning Playwright'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'QA Done'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Selenium Done'}).getByLabel('Toggle Todo').click();

    //Click on completed
    await page.locator('.filters').getByRole('link', { name: 'Completed' }).click();
    
    //Verify 0 items will be left now
    await expect(page.getByText('0 items left')).toBeVisible();

    //Uncheck the Tester one and verify in completed 1 item left 
    await page.getByRole('listitem').filter({hasText:'Tester Done'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Learning Playwright'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'QA Done'}).getByLabel('Toggle Todo').click();
    await page.getByRole('listitem').filter({hasText:'Selenium Done'}).getByLabel('Toggle Todo').click();
    await expect(page.getByText('4 items left')).toBeVisible();

    //Click on Active and verify all items are visible
    await page.locator('.filters').getByRole('link', { name: 'Active' }).click();
    await expect(page.getByRole('listitem').filter({hasText:'Tester Done'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Learning Playwright'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'QA Done'})).toBeVisible();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium Done'})).toBeVisible();

   //Verify that item should be unchecked
    await expect(page.getByRole('listitem').filter({hasText:'Tester Done'}).getByLabel('Toggle Todo')).not.toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'Learning Playwright'}).getByLabel('Toggle Todo')).not.toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'QA Done'}).getByLabel('Toggle Todo')).not.toBeChecked();
    await expect(page.getByRole('listitem').filter({hasText:'Selenium Done'}).getByLabel('Toggle Todo')).not.toBeChecked();
    
});

test('Verify user can escape if we dont want to edit', async ({ page }) => {
    
    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Now 4 items are left 
    await expect(page.getByText('4 items left')).toBeVisible();

    //Now Edit the todos with the new names
    await page.getByText('Tester').dblclick();
    await page.getByRole('listitem').filter({hasText:'Tester'}).locator('input.edit').fill('Tester Done');
    await page.keyboard.press('Escape');

    //Verify the updated should not be there
    await expect(page.getByRole('listitem').filter({hasText:'Tester'})).toBeVisible();
    
});

test('Verify user can delete the specified todos', async ({ page }) => {
    
    const todos = page.getByPlaceholder('What needs to be done?');

    //Got to url
    await page.goto("https://demo.playwright.dev/todomvc/#/");

    //assert the title and print the title
    console.log(await page.title());
    await page.title();
    //await expect(page).toHaveTitle("LoginPage Practise | Rahul Shetty Academy");

    //Fill the Todos one by one
    await todos.fill('Tester');
    await todos.press('Enter');

    await todos.fill('Playwright');
    await todos.press('Enter');

    await todos.fill('QA');
    await todos.press('Enter');

    await todos.fill('Selenium');
    await todos.press('Enter');

    //Now 4 items are left 
    await expect(page.getByText('4 items left')).toBeVisible();

    //Now Delet the specified to do
    await page.getByRole('listitem').filter({hasText:'Playwright'}).hover();
    await page.getByRole('listitem').filter({hasText:'Playwright'}).getByLabel('Delete').click();
    
    //Verify the Deleted item should not be there
    await expect(page.getByRole('listitem').filter({hasText:'Playwright'})).not.toBeVisible();
    
});