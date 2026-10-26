// ─── ENVIRONMENT CONFIGURATION ────────────────────────────────────────────────
// Single source of truth for all URLs and settings per environment.
// Tests import this instead of hardcoding URLs — changing sandbox URL in CI
// is then a single env var change, not a code change.
//
// Usage in tests:
//   const env = require('./config/env');
//   await page.goto(env.ecomUiUrl);
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const configs = {
    development: {
        apiUrl:     process.env.API_URL     || 'https://api.eventhub.rahulshettyacademy.com/api',
        uiUrl:      process.env.UI_URL      || 'https://eventhub.rahulshettyacademy.com',
        ecomApiUrl: process.env.ECOM_API_URL|| 'https://rahulshettyacademy.com/api/ecom',
        ecomUiUrl:  process.env.ECOM_UI_URL || 'https://rahulshettyacademy.com/client',
        timeout: 60000,
        retries: 0,
    },
    staging: {
        apiUrl:     process.env.API_URL     || 'https://staging-api.eventhub.rahulshettyacademy.com/api',
        uiUrl:      process.env.UI_URL      || 'https://staging.eventhub.rahulshettyacademy.com',
        ecomApiUrl: process.env.ECOM_API_URL|| 'https://rahulshettyacademy.com/api/ecom',
        ecomUiUrl:  process.env.ECOM_UI_URL || 'https://rahulshettyacademy.com/client',
        timeout: 90000,
        retries: 1,
    },
    production: {
        apiUrl:     process.env.API_URL     || 'https://api.eventhub.rahulshettyacademy.com/api',
        uiUrl:      process.env.UI_URL      || 'https://eventhub.rahulshettyacademy.com',
        ecomApiUrl: process.env.ECOM_API_URL|| 'https://rahulshettyacademy.com/api/ecom',
        ecomUiUrl:  process.env.ECOM_UI_URL || 'https://rahulshettyacademy.com/client',
        timeout: 90000,
        retries: 2,
    },
};

const currentEnv = process.env.NODE_ENV || 'development';
const config = configs[currentEnv] || configs.development;

// Shared across all environments
config.credentials = {
    gmail:  { email: process.env.GMAIL_USER || 'luxortest1@gmail.com',  password: process.env.GMAIL_PASS || 'Oneplus@0908' },
    yahoo:  { email: process.env.YAHOO_USER || 'luxor@yahoo.com',       password: process.env.YAHOO_PASS || 'Oneplus@0908' },
    sauce:  { username: process.env.SAUCE_USER || 'standard_user',      password: process.env.SAUCE_PASS || 'secret_sauce' },
    ecom:   { email: process.env.ECOM_USER || 'rahul.shetty@example.com', password: process.env.ECOM_PASS || 'learning' },
};

module.exports = config;
