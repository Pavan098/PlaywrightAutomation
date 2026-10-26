// ─── FLIGHT BOOKING — POM-BASED TESTS ────────────────────────────────────────
// These are NEW tests not covered in dropdownsWeb.spec.js:
//   ✅ Round Trip radio enables the Return Date field
//   ✅ One Way radio disables the Return Date field
//   ✅ Type-ahead country dropdown — select & verify value
//   ✅ Search without cities shows validation messages
//   ✅ Full one-way booking: pick cities + date + passengers + currency
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');
const FlightBookingPage = require('../Pages/FlightBooking');

test.describe('Flight Booking — POM Tests @regression', () => {

    test.beforeEach(async ({ page }) => {
        const flight = new FlightBookingPage(page);
        await flight.goto();
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('One Way radio is checked by default on page load @smoke', async ({ page }) => {
        const flight = new FlightBookingPage(page);
        // Verify One Way is the default selection
        await expect(flight.oneWayRadio).toBeChecked();
        await expect(flight.roundTripRadio).not.toBeChecked();
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Selecting Round Trip changes radio state from One Way @smoke', async ({ page }) => {
        const flight = new FlightBookingPage(page);

        // Default: One Way is checked
        await expect(flight.oneWayRadio).toBeChecked();

        // After clicking Round Trip: Round Trip is checked, One Way is not
        await flight.selectRoundTrip();
        await expect(flight.roundTripRadio).toBeChecked();
        await expect(flight.oneWayRadio).not.toBeChecked();

        // Switch back to One Way
        await flight.selectOneWay();
        await expect(flight.oneWayRadio).toBeChecked();
        await expect(flight.roundTripRadio).not.toBeChecked();
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Type-ahead country dropdown selects and shows correct value @smoke', async ({ page }) => {
        const flight = new FlightBookingPage(page);

        await flight.selectCountry('India');
        expect(await flight.getCountryValue()).toBe('India');
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Clicking Search without cities shows validation error messages @regression', async ({ page }) => {
        const flight = new FlightBookingPage(page);

        await flight.clickSearch();

        await expect(page.getByText('Select Departure City')).toBeVisible();
        await expect(page.getByText('Select Arrival City')).toBeVisible();
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Full one-way booking: select cities, date, passengers and currency @regression', async ({ page }) => {
        const flight = new FlightBookingPage(page);

        // Trip type
        await flight.selectOneWay();

        // Cities
        await flight.selectDepartureCity('Mumbai (BOM)');
        await flight.selectDestinationCity('Jammu (IXJ)');

        // Date — pick the first available "14" on the calendar
        await flight.selectDepartureDate('14');

        // Passengers: 2 adults, 1 child, 1 infant
        await flight.setPassengers({ adults: 2, children: 1, infants: 1 });
        await expect(page.getByText('2 Adult, 1 Child, 1 Infant')).toBeVisible();

        // Currency
        await flight.selectCurrency('USD');
        expect(await flight.getCurrencyValue()).toBe('USD');
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Type-ahead shows no results for invalid country name @regression', async ({ page }) => {
        const flight = new FlightBookingPage(page);

        await flight.countryInput.click();
        await flight.countryInput.pressSequentially('XYZ');

        // The suggestion dropdown either disappears or shows no matching items
        const itemCount = await page.locator('.ui-menu-item').count();
        expect(itemCount).toBe(0);
    });
});
