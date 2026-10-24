const { test, expect, request } = require('@playwright/test');

const creds = { email: "luxortest1@gmail.com", password: "Oneplus@0908" };
const url = "https://eventhub.rahulshettyacademy.com";
const SIX_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
        { id: 5, title: 'Lollapalooza India', category: 'Festival', eventDate: '2025-06-20T12:00:00.000Z', venue: 'Mahalaxmi Racecourse', city: 'Mumbai', price: '3000', totalSeats: 5000, availableSeats: 2000, imageUrl: null, isStatic: false },
        { id: 6, title: 'AI & ML Expo', category: 'Conference', eventDate: '2025-06-25T10:00:00.000Z', venue: 'Bangalore International Exhibition Centre', city: 'Bangalore', price: '750', totalSeats: 300, availableSeats: 180, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 6, limit: 12 },
};
const FOUR_EVENTS_RESPONSE = {
    data: [
        { id: 1, title: 'Tech Summit 2025', category: 'Conference', eventDate: '2025-06-01T10:00:00.000Z', venue: 'HICC', city: 'Hyderabad', price: '999', totalSeats: 200, availableSeats: 150, imageUrl: null, isStatic: false },
        { id: 2, title: 'Rock Night Live', category: 'Concert', eventDate: '2025-06-05T18:00:00.000Z', venue: 'Palace Grounds', city: 'Bangalore', price: '1500', totalSeats: 500, availableSeats: 300, imageUrl: null, isStatic: false },
        { id: 3, title: 'IPL Finals', category: 'Sports', eventDate: '2025-06-10T19:30:00.000Z', venue: 'Chinnaswamy', city: 'Bangalore', price: '2000', totalSeats: 800, availableSeats: 50, imageUrl: null, isStatic: false },
        { id: 4, title: 'UX Design Workshop', category: 'Workshop', eventDate: '2025-06-15T09:00:00.000Z', venue: 'WeWork', city: 'Mumbai', price: '500', totalSeats: 50, availableSeats: 20, imageUrl: null, isStatic: false },
    ],
    pagination: { page: 1, totalPages: 1, total: 4, limit: 12 },
};

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

    //Verify card loaded from mock
    const eventcard = await page.locator('#event-card h3').allTextContents();
    console.log('✅ Banner is visible when 6 events are returned', eventcard);

    //Verify first card is visible and count is 6
    await page.locator('#event-card').first().isVisible();
    let eventcardcount = await page.locator('#event-card').count();
    expect(eventcardcount).toBe(6);
    console.log('✅ First card is visible and count is 6', eventcardcount);

    //Verify the banner is visible
    await page.getByText('Your sandbox holds up to 9').isVisible();
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

    //Verify card loaded from mock
    const eventcard = await page.locator('#event-card h3').allTextContents();
    console.log('✅ Banner is not visible when 4 events are returned', eventcard);

    //Verify first card is visible and count is 4
    await page.locator('#event-card').first().isVisible();
    let eventcardcount = await page.locator('#event-card').count();
    expect(eventcardcount).toBe(4);
    console.log('✅ First card is visible and count is 4', eventcardcount);

    //Verify the banner is not visible
    await page.getByText('Your sandbox holds up to 9').isHidden();
    await expect(page.getByText('Your sandbox holds up to 9')).not.toBeVisible('9 bookings');
});
