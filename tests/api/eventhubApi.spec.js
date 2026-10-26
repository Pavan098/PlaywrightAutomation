const { test, expect, request } = require('@playwright/test');
const path = require('path');

const { eventhub: { primary: creds } } = require(path.join(__dirname, '../data/users.json'));
const { sixEvents: SIX_EVENTS_RESPONSE, fourEvents: FOUR_EVENTS_RESPONSE } =
    require(path.join(__dirname, '../data/mockResponses/events.json'));

const url = "https://eventhub.rahulshettyacademy.com";

//Helper function of login and go to Events page
async function loginAndGoToEvents(page) {
    await page.goto(`${url}/login`);
    await page.getByLabel('Email').fill(creds.email);
    await page.getByLabel('Password').fill(creds.password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
    await page.goto(`${url}/events`);
}

test('Banner is visible when 6 events are returned', async ({ request, page }) => {

    //Routing the events one
    await page.route('**/api/events**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(SIX_EVENTS_RESPONSE),
        });
    });

    //Login and navigate
    await loginAndGoToEvents(page);

    // Wait for mock data to render before reading DOM
    await page.locator('#event-card').first().waitFor({ state: 'visible' });

    //Verify first card is visible and count is 6
    let eventcardcount = await page.locator('#event-card').count();
    expect(eventcardcount).toBe(6);
    console.log('✅ First card is visible and count is 6', eventcardcount);

    //Verify the banner is visible (expect auto-waits for element)
    await expect(page.getByText('Your sandbox holds up to 9')).toBeVisible();
    await expect(page.getByText('Your sandbox holds up to 9')).toContainText('9 bookings');

});

test('Banner is not visible when 4 events are not returned', async ({ request, page }) => {

    //Routing the events one
    await page.route('**/api/events**', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(FOUR_EVENTS_RESPONSE),
        });
    });

    //Login and navigate
    await loginAndGoToEvents(page);

    // Wait for mock data to render before reading DOM
    await page.locator('#event-card').first().waitFor({ state: 'visible' });

    //Verify first card is visible and count is 4
    let eventcardcount = await page.locator('#event-card').count();
    expect(eventcardcount).toBe(4);
    console.log('✅ First card is visible and count is 4', eventcardcount);

    //Verify the banner is not visible
    await expect(page.getByText('Your sandbox holds up to 9')).not.toBeVisible();
});
