// ─── TEST DATA FACTORY ────────────────────────────────────────────────────────
// Generates dynamic test data so tests don't conflict with each other or
// depend on static data that might already exist in the system.
//
// WHY: If two tests create a user with email "test@test.com", they'll conflict.
// Using unique timestamps prevents that.
// ─────────────────────────────────────────────────────────────────────────────

class TestDataFactory {

    // ── Users ─────────────────────────────────────────────────────────────────
    static generateUser(overrides = {}) {
        const ts = Date.now();
        return {
            email: `testuser${ts}@autotest.com`,
            password: 'Test@Secure123',
            firstName: 'Auto',
            lastName: `Tester${ts}`,
            phone: `+91-${Math.floor(6000000000 + Math.random() * 3999999999)}`,
            ...overrides,
        };
    }

    static generateGmailUser() {
        return TestDataFactory.generateUser({ email: `autotest${Date.now()}@gmail.com` });
    }

    // ── Events (EventHub API) ─────────────────────────────────────────────────
    static generateEvent(overrides = {}) {
        // Always at least 2 years in the future so the API never rejects it
        const future = new Date();
        future.setFullYear(future.getFullYear() + 2);
        const ts = Date.now();

        return {
            title: `Auto Event ${ts}`,
            description: `Test event created by automation at ${new Date().toISOString()}`,
            category: TestDataFactory.pick(['Workshop', 'Conference', 'Festival', 'Meetup']),
            venue: `Test Venue ${ts}`,
            city: TestDataFactory.pick(['Pune', 'Mumbai', 'Bangalore', 'Delhi']),
            eventDate: future.toISOString(),
            price: TestDataFactory.randomInt(100, 5000),
            totalSeats: TestDataFactory.randomInt(50, 500),
            imageUrl: 'https://example.com/event-banner.jpg',
            ...overrides,
        };
    }

    // ── Bookings ──────────────────────────────────────────────────────────────
    static generateBooking(eventId, overrides = {}) {
        const ts = Date.now();
        return {
            eventId,
            customerName: `Auto Customer ${ts}`,
            customerEmail: `customer${ts}@autotest.com`,
            customerPhone: '+91-9876543210',
            quantity: 1,
            ...overrides,
        };
    }

    // ── SauceLabs products ────────────────────────────────────────────────────
    static sauceProducts() {
        return [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt (Red)',
        ];
    }

    static randomSauceProduct() {
        return TestDataFactory.pick(TestDataFactory.sauceProducts());
    }

    // ── Address / Checkout ────────────────────────────────────────────────────
    static generateAddress(overrides = {}) {
        return {
            firstName: 'John',
            lastName: 'Doe',
            zipCode: `${TestDataFactory.randomInt(10000, 99999)}`,
            ...overrides,
        };
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    static pick(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static uniqueEmail(prefix = 'user') {
        return `${prefix}${Date.now()}@autotest.com`;
    }

    static timestamp() {
        return Date.now();
    }
}

module.exports = TestDataFactory;
