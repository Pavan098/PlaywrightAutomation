const {test, expect} = require('@playwright/test'); //import always

test('Verify user is able to navigate to website and verify the different headers on Flight Website',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://rahulshettyacademy.com/dropdownsPractise/#");

    //Verify the title
    console.log(await page.title());
    expect(page).toHaveTitle("QAClickJet - Flight Booking for Domestic and International, Cheap Air Tickets");

    //Verify the country is there along with the Flights, hotels, packages Flgiht status, checkin and Manage booking as well
    const flights = page.locator('#buttons').getByRole('link', { name: 'Flights' });
    const Hotels = page.locator('#buttons').getByRole('link', { name: 'Hotels' });
    const packages = page.locator('#buttons').getByRole('link', { name: 'Packages' });
    const flightstatus = page.locator('#buttons').getByRole('link', { name: 'Flight Status' });
    const checkin = page.locator('#buttons').getByRole('link', { name: 'Check-In' });
    const managebooking = page.locator('#buttons').getByRole('link', { name: 'Manage Booking' });

    //Assert the fields
    await expect(flights).toBeVisible();
    await expect(Hotels).toBeVisible();
    await expect(packages).toBeVisible();
    await expect(flightstatus).toBeVisible();
    await expect(checkin).toBeVisible();
    await expect(managebooking).toBeVisible();

    //Verify the country dropdown is there
    await page.getByPlaceholder('Type to Select').isVisible();

    //Verify the Destination, Departure, Return and date dropdowns are visible
    //Search Icon as well
    await page.getByLabel('DESTINATION').isVisible();
    await page.getByLabel('DEPARTURE').isVisible();
    await page.getByLabel('RETURN').isVisible();
    await page.getByLabel('DEPART DATE').isVisible();
    await page.getByLabel('PASSENGERS').isVisible();
    await page.getByRole('button', { name: 'Search' }).isVisible();

    //Verify One Way, Round Trip and Multi City are visible
    await page.getByRole('radio', { name: 'One Way' }).isVisible();
    await page.getByRole('radio', { name: 'Round Trip' }).isVisible();
    await page.getByRole('radio', { name: 'Multicity' }).isVisible();

    //Veriy currently OneWay is selected and Return date dropdown is disabled
    await page.getByRole('radio', { name: 'One Way' }).isChecked();
    await page.getByLabel('RETURN DATE').isVisible();
    await page.locator('#ctl00_mainContent_view_date2').isDisabled();

    //Verify differnet checkboxes types are there
    await page.getByRole('checkbox', { name: 'Family and Friends' }).isVisible();
    await page.getByRole('checkbox', { name: 'Senior Citizen' }).isVisible();
    await page.getByRole('checkbox', { name: 'Indian Armed Forces' }).isVisible();
    await page.getByRole('checkbox', { name: 'Student' }).isVisible();
    await page.getByRole('checkbox', { name: 'Unaccompanied Minor' }).isVisible();

    //Verify on hover all these checkboxes text should be displayed
    await page.getByRole('checkbox', { name: 'Family and Friends' }).hover();
    await page.getByRole('checkbox', { name: 'Senior Citizen' }).hover();
    await page.getByRole('checkbox', { name: 'Indian Armed Forces' }).hover();
    await page.getByRole('checkbox', { name: 'Student' }).hover();
    await page.getByRole('checkbox', { name: 'Unaccompanied Minor' }).hover();
});

test('Verify user is able to select the country on fligts booking page',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://rahulshettyacademy.com/dropdownsPractise/#");

    //Verify the title
    console.log(await page.title());
    expect(page).toHaveTitle("QAClickJet - Flight Booking for Domestic and International, Cheap Air Tickets");

    //Verify the country dropdown is there
    await page.getByPlaceholder('Type to Select').isVisible();

    //Select the one country from the dropdown
    await page.getByPlaceholder('Type to Select').click();
    await page.getByPlaceholder('Type to Select').pressSequentially('Ind');
    await page.locator('.ui-menu-item').filter({ hasText: /^India$/ }).click();
    
    //Verify the country is selected
    await expect(page.getByPlaceholder('Type to Select')).toHaveValue('India');
});

test('Verify user is able to select the country on flights booking page - Test 2',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://rahulshettyacademy.com/dropdownsPractise/#");

    //Verify the title
    console.log(await page.title());
    expect(page).toHaveTitle("QAClickJet - Flight Booking for Domestic and International, Cheap Air Tickets");

    //Verify the country dropdown is there
    await page.getByPlaceholder('Type to Select').isVisible();

    //Select the one country from the dropdown
    await page.getByPlaceholder('Type to Select').click();
    await page.getByPlaceholder('Type to Select').pressSequentially('Ind');
    await page.locator('.ui-menu-item').filter({ hasText: /^India$/ }).click();
    
    //Verify the country is selected
    await expect(page.getByPlaceholder('Type to Select')).toHaveValue('India');
});

test('Select the Flight of one way from one city to another city and verify same city is not there in viceversa',async ({page})=> //basic structure
{

    //Got to url
    await page.goto("https://rahulshettyacademy.com/dropdownsPractise/#");

    //Verify the title
    console.log(await page.title());
    expect(page).toHaveTitle("QAClickJet - Flight Booking for Domestic and International, Cheap Air Tickets");

    //Click on One Way radio button
    await page.getByRole('radio', { name: 'One Way' }).isChecked();

    //Directly click on Search btn and verifu the validation
     await page.getByRole('button', { name: 'Search' }).click();
     await page.getByText('Select Departure City').isVisible();
     await page.getByText('Select Arrival City').isVisible();


    //Get all the list of cities from departure and arrival city
    //Verify first option departure city is selected
    const departurecity = page.locator('#ctl00_mainContent_ddl_originStation1_CTXT');
    const arrival = page.locator('#ctl00_mainContent_ddl_destinationStation1');
    const allCities = await departurecity.allInnerTexts();
    console.log(allCities);

    //Select the one city from the Departure city
    await departurecity.click();
    await page.getByRole('link', { name: 'Mumbai (BOM)' }).click();

    //Select the To City
    await page.getByRole('link', { name: 'Jammu (IXJ)' }).click();

    //Select the date
    await page.getByRole('link', { name: '14' }).first().click();

    //Select the numbers of Adults as well
    await page.getByText('1 Adult').click();
    await page.locator('#hrefIncAdt').first().click();
    await page.locator('#hrefIncChd').click();
    await page.locator('#hrefIncInf').click();

    //Click on Done Btn
    await page.getByRole('button', { name: 'Done' }).click();

    //Verify the Text should be 1 Adult, 1 Child, 1 Infant
    expect(await page.getByText('2 Adult, 1 Child, 1 Infant').isVisible());

    //Select the currency as well
    const currency = page.locator('#ctl00_mainContent_DropDownListCurrency');
    await currency.selectOption('USD');
});