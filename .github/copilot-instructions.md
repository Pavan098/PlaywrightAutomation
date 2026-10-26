# Playwright Automation Framework — Copilot Instructions

These instructions tell GitHub Copilot how to generate code that fits this framework's architecture, patterns, and standards. Follow them for every suggestion in this repository.

---

## Language & Module System

- **JavaScript (CommonJS)** — use `require()` / `module.exports`, never `import`/`export`
- Node.js 18+ — async/await throughout, no callbacks or `.then()` chains
- No TypeScript — but be precise with types in JSDoc `@param` / `@returns` comments where helpful

---

## Folder Structure Rules

Place new files in the correct layer:

| What you're creating | Where it goes |
|----------------------|---------------|
| Browser UI test | `tests/ui/` |
| API or network test | `tests/api/` |
| Full end-to-end flow | `tests/e2e/` |
| Page Object (full page) | `Pages/` |
| Reusable UI component | `Pages/components/` |
| JSON schema definition | `tests/api/schemas/` |
| Shared test data / fixtures | `tests/data/` |
| Reusable utility function | `tests/utils/` |
| Custom Playwright fixture | `tests/fixtures/` |

---

## Locator Strategy (in priority order)

1. `page.getByRole()` — semantic, accessibility-first
2. `page.getByLabel()` — form fields
3. `page.getByText()` — visible text
4. `page.getByTestId()` — `data-testid` attributes
5. `page.locator('[data-test="..."]')` — `data-test` attributes (SauceLabs pattern)
6. CSS class only as last resort — avoid brittle `.btn-primary` selectors
7. **Never use XPath** unless there is no other option

---

## Page Object Model Rules

Every POM must:
- Extend `BasePage` (`require('../Pages/BasePage')`)
- Declare all locators in the `constructor` — no locators inside methods
- Expose action methods, not raw locators, to tests
- One method = one user action (e.g. `login()`, `addToCart()`, `checkout()`)

```js
const BasePage = require('../BasePage');

class ExamplePage extends BasePage {
    constructor(page) {
        super(page);
        this.url       = 'https://example.com';
        this.nameInput = page.locator('#name');
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
    }

    async goto() { await super.goto(this.url); }

    async submitForm(name) {
        await this.nameInput.fill(name);
        await this.submitBtn.click();
    }
}

module.exports = ExamplePage;
```

For reusable UI parts (nav bar, modal, product card), create a component in `Pages/components/` instead of duplicating locators across POMs.

---

## Test Structure Rules

```js
const { test, expect } = require('@playwright/test');
const PageName = require('../../Pages/PageName');

test.describe('Feature — Suite Name @regression', () => {

    test.beforeEach(async ({ page }) => {
        // setup — navigate, auth state
    });

    test('should do the thing @smoke', async ({ page }) => {
        // Arrange
        const pg = new PageName(page);
        // Act
        await pg.doSomething();
        // Assert
        await expect(page.locator('.result')).toBeVisible();
    });
});
```

- **One logical assertion per test** where practical
- Always use `await expect(locator)` — never assert on raw `.textContent()` strings unless there is no matcher for it
- Use `waitFor({ state: 'visible' })` before `count()` — `count()` has no built-in wait
- After any navigation, use `await page.waitForURL(...)` before asserting page state

---

## Test Tags (required on every test)

| Tag | When to use |
|-----|-------------|
| `@smoke` | Critical happy path — must pass before every merge |
| `@regression` | Full suite — runs nightly and on PRs |
| `@api` | API-only tests in `tests/api/` |
| `@flaky` | Known intermittent test — runs in quarantine project with 5 retries |

Every `test.describe` block and every individual `test()` must carry at least one tag.

---

## API Test Rules

- Use Playwright's built-in `request` fixture — no `axios` or `node-fetch`
- Always assert `response.ok()` and `response.status()` before parsing body
- **Always call `assertSchema()` before asserting individual field values**

```js
const { assertSchema } = require('../utils/SchemaValidator');
const { mySchema }     = require('./schemas/mySchema');

test('GET /resource returns correct shape @api', async ({ request }) => {
    const res  = await request.get('/api/resource');
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    assertSchema(body, mySchema, 'GET /resource');   // shape first
    expect(body.id).toBeDefined();                    // values second
});
```

- Store schema definitions in `tests/api/schemas/`
- Store reusable request payloads in `tests/data/`

---

## Auth State Reuse

Do **not** log in inside every test. Use the session saved by `tests/global.setup.js`:

```js
const path = require('path');
test.use({ storageState: path.join(__dirname, '../data/auth/saucelabs.json') });
```

The setup project runs `global.setup.js` before any browser project, so the auth file is always fresh.

---

## Flaky Test Handling

Do not silently retry. Tag the test and quarantine it:

```js
test('checkout completes @smoke @flaky', async ({ page }) => {
    // This test is known to be intermittent on CI — tracked in issue #42
});
```

- Main `chromium` project skips `@flaky` tests (`grepInvert: /@flaky/`)
- Run quarantine explicitly: `npm run test:quarantine`
- Fix the root cause; remove `@flaky` once stable

---

## What NOT to Generate

- No `page.waitForTimeout()` (except inside POM sort methods where DOM re-render is required)
- No hardcoded credentials in test files — read from `tests/data/users.json`
- No hardcoded large payloads in test files — put them in `tests/data/`
- No `test.only` committed to the repo (`forbidOnly: true` in CI)
- No XPath locators
- No `async` functions that don't `await` their inner calls
