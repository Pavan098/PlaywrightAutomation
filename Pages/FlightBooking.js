// ─── FLIGHT BOOKING PAGE OBJECT MODEL ────────────────────────────────────────
// Covers: https://rahulshettyacademy.com/dropdownsPractise/#
// ─────────────────────────────────────────────────────────────────────────────

const BasePage = require('./BasePage');

class FlightBookingPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = 'https://rahulshettyacademy.com/dropdownsPractise/#';

        // ── Trip type radios ─────────────────────────────────────────────────
        this.oneWayRadio    = page.getByRole('radio', { name: 'One Way' });
        this.roundTripRadio = page.getByRole('radio', { name: 'Round Trip' });
        this.multiCityRadio = page.getByRole('radio', { name: 'Multicity' });

        // ── Form fields ──────────────────────────────────────────────────────
        this.countryInput       = page.getByPlaceholder('Type to Select');
        this.departureCityDdl   = page.locator('#ctl00_mainContent_ddl_originStation1_CTXT');
        this.returnDateField    = page.locator('#ctl00_mainContent_view_date2');
        this.currencyDdl        = page.locator('#ctl00_mainContent_DropDownListCurrency');
        this.searchBtn          = page.getByRole('button', { name: 'Search' });
        this.passengersBtn      = page.getByText('1 Adult');
        this.adultsIncrBtn      = page.locator('#hrefIncAdt').first();
        this.childrenIncrBtn    = page.locator('#hrefIncChd');
        this.infantsIncrBtn     = page.locator('#hrefIncInf');
        this.passengersDoneBtn  = page.getByRole('button', { name: 'Done' });
    }

    async goto() {
        await super.goto(this.url);
    }

    // ── Trip type ─────────────────────────────────────────────────────────────
    async selectOneWay() {
        await this.oneWayRadio.click();
        await this.page.waitForTimeout(400);  // Wait for form to update
    }

    async selectRoundTrip() {
        await this.roundTripRadio.click();
        await this.page.waitForTimeout(400);
    }

    async selectMultiCity() {
        await this.multiCityRadio.click();
        await this.page.waitForTimeout(400);
    }

    async isReturnDateEnabled() {
        // Site uses readonly="readonly" (not disabled) to lock the return date in One Way mode
        const readonlyAttr = await this.returnDateField.getAttribute('readonly');
        const isDisabled = await this.returnDateField.isDisabled();
        return readonlyAttr === null && !isDisabled;
    }

    // ── Country ───────────────────────────────────────────────────────────────
    async selectCountry(countryName) {
        await this.countryInput.click();
        await this.countryInput.pressSequentially(countryName.substring(0, 3));
        await this.page.locator('.ui-menu-item')
            .filter({ hasText: new RegExp(`^${countryName}$`) })
            .click();
    }

    async getCountryValue() {
        return await this.countryInput.inputValue();
    }

    // ── City selection ────────────────────────────────────────────────────────
    async selectDepartureCity(cityName) {
        await this.departureCityDdl.click();
        await this.page.getByRole('link', { name: cityName }).first().click();
    }

    async selectDestinationCity(cityName) {
        await this.page.locator('[id*="destinationStation1_CTNR"]')
            .getByRole('link', { name: cityName })
            .click({ force: true });
    }

    // ── Date ──────────────────────────────────────────────────────────────────
    async selectDepartureDate(day) {
        await this.page.getByRole('link', { name: day }).first().click();
    }

    // ── Passengers ────────────────────────────────────────────────────────────
    async setPassengers({ adults = 1, children = 0, infants = 0 } = {}) {
        await this.passengersBtn.click();
        for (let i = 1; i < adults; i++) await this.adultsIncrBtn.click();
        for (let i = 0; i < children; i++) await this.childrenIncrBtn.click();
        for (let i = 0; i < infants; i++) await this.infantsIncrBtn.click();
        await this.passengersDoneBtn.click();
    }

    // ── Currency ──────────────────────────────────────────────────────────────
    async selectCurrency(currency) {
        await this.currencyDdl.selectOption(currency);
    }

    async getCurrencyValue() {
        return await this.currencyDdl.inputValue();
    }

    // ── Search ────────────────────────────────────────────────────────────────
    async clickSearch() {
        await this.searchBtn.click();
    }
}

module.exports = FlightBookingPage;
