require('dotenv').config();

// ─── ENVIRONMENT CONFIGURATION ────────────────────────────────────────────────
// Set ENV=staging (or any key below) via .env or CI env vars to point the
// whole suite at a different target without touching test code.
//
// Usage in tests:
//   const env = require('../../config/environments');
//   await page.goto(env.saucelabs.url);
// ─────────────────────────────────────────────────────────────────────────────

const configs = {
    dev: {
        saucelabs: {
            url: 'https://www.saucedemo.com',
        },
        eventhub: {
            url:    'https://eventhub.rahulshettyacademy.com',
            apiUrl: 'https://eventbookingapi.onrender.com',
        },
        rahulshetty: {
            url: 'https://rahulshettyacademy.com',
        },
        flipkart: {
            url: 'https://www.flipkart.com',
        },
        todoMVC: {
            url: 'https://todomvc.com/examples/react/dist',
        },
    },

    staging: {
        saucelabs: {
            url: process.env.SAUCELABS_URL || 'https://www.saucedemo.com',
        },
        eventhub: {
            url:    process.env.EVENTHUB_URL     || 'https://eventhub.rahulshettyacademy.com',
            apiUrl: process.env.EVENTHUB_API_URL || 'https://eventbookingapi.onrender.com',
        },
        rahulshetty: {
            url: process.env.RAHULSHETTY_URL || 'https://rahulshettyacademy.com',
        },
        flipkart: {
            url: process.env.FLIPKART_URL || 'https://www.flipkart.com',
        },
        todoMVC: {
            url: process.env.TODOMVC_URL || 'https://todomvc.com/examples/react/dist',
        },
    },
};

const ENV = process.env.ENV || 'dev';

if (!configs[ENV]) {
    throw new Error(
        `Unknown ENV "${ENV}". Valid values: ${Object.keys(configs).join(', ')}`
    );
}

module.exports = { env: ENV, ...configs[ENV] };
