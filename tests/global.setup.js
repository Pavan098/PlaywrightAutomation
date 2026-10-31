const { test: setup, expect } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');
const users = require('./data/users.json');
const env   = require('../config/environments');

const SAUCELABS_AUTH = path.join(__dirname, 'data/auth/saucelabs.json');
const EVENTHUB_AUTH  = path.join(__dirname, 'data/auth/eventhub.json');

// ── SauceLabs ─────────────────────────────────────────────────────────────────
// Logs in once and saves cookies + localStorage to saucelabs.json.
// Tests that add  test.use({ storageState: SAUCELABS_AUTH })  skip the login
// step entirely — the browser opens already authenticated.
setup('authenticate: saucelabs', async ({ page }) => {
    const { username, password } = users.saucelabs.standard;

    await page.goto(env.saucelabs.url);
    await page.locator('#user-name').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory/);

    fs.mkdirSync(path.dirname(SAUCELABS_AUTH), { recursive: true });
    await page.context().storageState({ path: SAUCELABS_AUTH });
    console.log('✅ SauceLabs auth state saved');
});

// ── EventHub ──────────────────────────────────────────────────────────────────
setup('authenticate: eventhub', async ({ page }) => {
    const { email, password } = users.eventhub.primary;

    await page.goto(`${env.eventhub.url}/login`);
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();

    fs.mkdirSync(path.dirname(EVENTHUB_AUTH), { recursive: true });
    await page.context().storageState({ path: EVENTHUB_AUTH });
    console.log('✅ EventHub auth state saved');
});
