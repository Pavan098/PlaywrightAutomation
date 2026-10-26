# Playwright Automation Framework

A production-grade end-to-end test automation framework built with **Playwright** and **JavaScript**. Built from scratch with Page Object Model architecture, AI self-healing locators, parallel test sharding, WCAG 2.1 accessibility scanning, visual regression testing, Docker containerization, and full CI/CD integration across GitHub Actions and Jenkins.

![CI](https://github.com/Pavan098/PlaywrightAutomation/actions/workflows/playwright.yml/badge.svg)

---

## Table of Contents

- [What Was Built](#what-was-built)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Page Object Models](#page-object-models)
- [Test Coverage](#test-coverage)
- [Accessibility Testing](#accessibility-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [AI Self-Healing Locators](#ai-self-healing-locators)
- [API Schema Validation](#api-schema-validation)
- [Auth State Reuse](#auth-state-reuse)
- [Flaky Test Quarantine](#flaky-test-quarantine)
- [Mobile Testing](#mobile-testing)
- [Copilot Instructions](#copilot-instructions)
- [Prompt Versioning](#prompt-versioning)
- [CI/CD](#cicd)
- [Docker](#docker)
- [Reporting](#reporting)
- [Environment Configuration](#environment-configuration)
- [Contributing](#contributing)

---

## What Was Built

This framework was built incrementally, adding real-world production capabilities at each stage:

| Stage | What Was Added |
|-------|----------------|
| **Foundation** | Playwright setup, `playwright.config.js`, `.env` support, `.gitignore` |
| **Page Object Model** | `BasePage.js` base class, 5 POMs (SauceLabs, TodoMVC, FlightBooking, Flipkart, Login) |
| **Test Suite** | 20 spec files covering UI, API, interception, storage, Excel, cross-context flows |
| **Test Tags** | `@smoke`, `@regression`, `@api` tags for selective test runs |
| **Custom Utilities** | `TestDataFactory`, `Logger`, `ApiUtils`, `ExcelHelper` |
| **Custom Fixtures** | Playwright fixture for `healingPage` |
| **AI Self-Healing** | `SelfHealingLocator.js` — Claude Haiku suggests alternative selectors on failure |
| **Allure Reporting** | HTML + Allure dual reporting, `allure-playwright` integration |
| **Accessibility Testing** | `@axe-core/playwright` WCAG 2.1 AA scans across SauceLabs and TodoMVC |
| **Visual Regression** | `toHaveScreenshot()` pixel-diff tests with committed baselines |
| **Test Sharding** | GitHub Actions matrix — 4 parallel VMs, blob reports merged into one HTML |
| **Docker** | `Dockerfile` + `.dockerignore` for consistent cross-platform execution |
| **Jenkins** | `Jenkinsfile` declarative pipeline upgraded to Docker agent |
| **GitHub Actions** | Full CI pipeline with sharding, artifacts, PR comments, nightly schedule |
| **Folder Structure** | Tests reorganized into `tests/ui/`, `tests/api/`, `tests/e2e/` by type |
| **Schema Validation** | `SchemaValidator.js` — validates API response shape before asserting values |
| **Auth State Reuse** | `global.setup.js` logs in once; all tests reuse saved session — no per-test login |
| **Test Data Layer** | `tests/data/` — users, products, mock responses decoupled from test code |
| **Component POMs** | `Pages/components/` — NavBar, ProductCard, Modal for reuse across POMs |
| **Flaky Quarantine** | `@flaky` tag + quarantine project isolates known flaky tests from main run |
| **Mobile Viewport** | `mobile-chrome` (Pixel 5) and `mobile-safari` (iPhone 12) projects |
| **Copilot Instructions** | `.github/copilot-instructions.md` — coding standards for AI-generated code |
| **Prompt Versioning** | `prompts/` — versioned AI prompts for consistent test generation |

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) v1.49+ | Browser automation & test runner |
| JavaScript (CommonJS) | Language |
| Page Object Model | Test architecture pattern |
| `tests/ui` / `api` / `e2e` folders | Organised test layers (UI, API, end-to-end) |
| `SchemaValidator.js` | Zero-dependency JSON schema validation for API responses |
| `global.setup.js` | Auth state reuse — login once, share session across all tests |
| `Pages/components/` | Reusable UI component classes (NavBar, ProductCard, Modal) |
| GitHub Actions | CI/CD — 4-shard parallel execution + nightly schedule |
| Jenkins | Alternative CI pipeline (Docker agent) |
| Docker | Consistent cross-platform test execution |
| Allure | Advanced test reporting with history and trends |
| `@axe-core/playwright` | WCAG 2.1 accessibility scanning (Deque axe-core) |
| `toHaveScreenshot()` | Built-in visual regression pixel-diff |
| Claude Haiku (Anthropic) | AI self-healing locators |
| `dotenv` | Environment configuration |
| `xlsx` | Excel read/write for data-driven tests |

---

## Project Structure

```
PlaywrightAutomation/
├── .github/
│   └── workflows/
│       └── playwright.yml              # GitHub Actions — 4 parallel shards + merge report
├── Pages/                              # Page Object Models
│   ├── components/                     # Reusable UI components (shared across POMs)
│   │   ├── NavBar.js                   # SauceLabs top-nav: cart count, logout, menu
│   │   ├── ProductCard.js              # Single product tile: name, price, add/remove
│   │   └── Modal.js                    # Generic modal: dismiss, confirm, getTitle
│   ├── BasePage.js                     # Base class: goto, waitForVisible, clickWithRetry
│   ├── Login.js                        # EventHub login page
│   ├── SauceLabs.js                    # SauceLabs (inventory, cart, checkout, sort)
│   ├── TodoMVC.js                      # TodoMVC (add, complete, delete, filter, edit)
│   ├── FlightBooking.js                # Flight booking form
│   └── Flipkart.js                     # Flipkart (modal dismiss + hover)
├── prompts/                            # Versioned AI prompts for test generation
│   ├── templates/
│   │   ├── ui-test-template.md         # Fill-in template for UI test generation
│   │   └── api-test-template.md        # Fill-in template for API test generation
│   ├── v1-ui-test-flow.md              # UI test generation prompt (v1)
│   ├── v2-api-test-flow.md             # API test generation prompt (v2)
│   └── v3-pom-creation.md              # POM/component creation prompt (v3)
├── tests/
│   ├── data/                           # Static test data decoupled from test files
│   │   ├── auth/                       # Saved session files (gitignored — auto-generated)
│   │   ├── mockResponses/
│   │   │   └── events.json             # Mock API event payloads
│   │   ├── users.json                  # Credentials for all apps (saucelabs, eventhub)
│   │   └── products.json               # SauceLabs product catalogue + checkout data
│   ├── global.setup.js                 # Logs in once to each app, saves storageState
│   ├── ui/                             # Browser-based UI tests
│   │   ├── visual.spec.js-snapshots/   # Committed baseline screenshots (6 PNGs, Windows)
│   │   ├── UIbasics.spec.js            # Forms, calendar, alerts, iframes, multi-tab
│   │   ├── saucelabs.spec.js           # SauceLabs login & product tests
│   │   ├── sauceLabs-pom.spec.js       # SauceLabs POM — cart, checkout, sort
│   │   ├── todoMVC.spec.js             # TodoMVC basic tests
│   │   ├── todoMVC-pom.spec.js         # TodoMVC POM — filters, edit, clearCompleted
│   │   ├── dropdownsWeb.spec.js        # Dropdowns, radio buttons, date pickers
│   │   ├── flightBooking-pom.spec.js   # Flight booking POM tests
│   │   ├── flipkart.spec.js            # Flipkart hover & modal tests
│   │   ├── flipkart-pom.spec.js        # Flipkart POM tests
│   │   ├── accessibility.spec.js       # WCAG 2.1 AA scans — SauceLabs + TodoMVC
│   │   ├── visual.spec.js              # Visual regression pixel-diff tests
│   │   ├── sessionStorage.spec.js      # Session & local storage state tests
│   │   └── example.spec.js             # Playwright starter example
│   ├── api/                            # Pure API & network layer tests
│   │   ├── schemas/                    # JSON schema definitions
│   │   │   ├── loginSchema.js          # token, userId, message fields
│   │   │   ├── orderSchema.js          # orders array + orderid
│   │   │   └── eventSchema.js          # event item + pagination structure
│   │   ├── Apitests.spec.js            # REST API — status codes, response body
│   │   ├── eventApi.spec.js            # EventHub CRUD (with schema validation)
│   │   ├── eventhubApi.spec.js         # API mock injection + response interception
│   │   ├── Interceptapirequest.spec.js # Intercept & modify outgoing requests
│   │   └── Interceptapiresponse.spec.js# Mock API responses
│   ├── e2e/                            # Full end-to-end flow tests
│   │   ├── crossBooking.spec.js        # Cross-browser-context booking flow
│   │   └── readWriteExcel.spec.js      # Excel data-driven download/read/write
│   ├── config/
│   │   └── env.js                      # Environment configs (dev / staging / prod)
│   ├── fixtures/
│   │   └── index.js                    # Custom Playwright fixtures (healingPage)
│   └── utils/
│       ├── SchemaValidator.js          # Zero-dependency JSON schema validator
│       ├── SelfHealingLocator.js       # AI-powered locator recovery via Claude Haiku
│       ├── TestDataFactory.js          # Random test data generator
│       ├── Logger.js                   # Structured JSON logger
│       ├── ApiUtils.js                 # HTTP request helpers
│       └── ExcelHelper.js              # Excel download/read/write
├── .github/
│   └── copilot-instructions.md         # Coding standards for GitHub Copilot
├── .dockerignore                       # Excludes node_modules, reports, .env, .git
├── .env.example                        # Environment variable template
├── .gitignore
├── Dockerfile                          # Playwright Docker image (Ubuntu 24.04 + Node 20)
├── Jenkinsfile                         # Jenkins declarative pipeline (Docker agent)
├── package.json
└── playwright.config.js                # Playwright config — retries, sharding, testIgnore
```

---

## Getting Started

### Option A — Local (Node.js)

**Prerequisites:** Node.js 18+, npm

```bash
# Clone the repository
git clone https://github.com/Pavan098/PlaywrightAutomation.git
cd PlaywrightAutomation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium

# Copy environment template
cp .env.example .env
# Edit .env — add BASE_URL and optionally ANTHROPIC_API_KEY
```

### Option B — Docker (no local Node.js needed)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop) running

```bash
git clone https://github.com/Pavan098/PlaywrightAutomation.git
cd PlaywrightAutomation

# Build once
npm run docker:build

# Run all tests
npm run docker:test
```

### Environment Variables

Edit `.env` after copying from `.env.example`:

```env
BASE_URL=https://rahulshettyacademy.com
ANTHROPIC_API_KEY=your_key_here   # Optional — enables AI self-healing
```

---

## Running Tests

### Local Commands

```bash
# Run all tests (headless)
npm test

# Run all tests (setup → chromium)
npm test

# Run by folder — fastest way to target a layer
npm run test:ui               # all tests/ui/ specs
npm run test:api              # all tests/api/ specs
npm run test:e2e              # all tests/e2e/ specs

# Filter by tag
npm run test:smoke            # @smoke — critical happy-path tests
npm run test:regression       # @regression — full regression suite

# Flaky test quarantine (isolated, 5 retries, does not run in main suite)
npm run test:quarantine

# Mobile viewports (Pixel 5 + iPhone 12)
npm run test:mobile

# Specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:all-browsers     # chromium + firefox + webkit

# Specific test types
npm run test:a11y             # Accessibility scans only
npm run test:visual           # Visual regression only
npm run test:visual:update    # Regenerate visual baselines after a UI change

# Run with a visible browser
npm run test:headed

# Open Playwright UI explorer (interactive test runner)
npm run test:explore

# Run a single spec file
npx playwright test tests/ui/sauceLabs-pom.spec.js --project=chromium
npx playwright test tests/api/eventApi.spec.js --project=chromium

# Open last HTML report
npm run report
```

### Docker Commands

```bash
npm run docker:build          # Build image (one-time / after package.json changes)
npm run docker:test           # Run all tests in Linux container
npm run docker:smoke          # @smoke tests in container
npm run docker:regression     # @regression tests in container
npm run docker:report         # Run tests + save HTML report to host machine
npm run docker:visual:update  # Regenerate Linux visual baselines inside container
```

### Test Tags

| Tag | When to Use |
|-----|-------------|
| `@smoke` | Every commit — critical happy-path only |
| `@regression` | PRs and nightly — full suite |
| `@api` | API-only runs |

---

## Page Object Models

All POMs extend `BasePage` which provides shared, reliable utilities:

| Method | Description |
|--------|-------------|
| `goto(url)` | Navigate and wait for `domcontentloaded` |
| `waitForVisible(locator)` | Assert element is visible before interacting |
| `clickWithRetry(locator, n)` | Auto-retry click up to `n` times |
| `getText(locator)` | Get trimmed text content |
| `getAllTexts(locator)` | Get text array from all matching elements |
| `takeScreenshot(name)` | Capture a named screenshot |

### Available POMs

| POM | Site | Key Actions |
|-----|------|-------------|
| `SauceLabs.js` | saucedemo.com | `login`, `addToCart`, `goToCart`, `fillShippingInfo`, `finishOrder`, `sort`, cart badge |
| `TodoMVC.js` | todomvc.com | `addTodo`, `completeTodo`, `deleteTodo`, `editTodo`, `filterBy`, `clearCompleted` |
| `FlightBooking.js` | rahulshettyacademy.com | `selectTripType`, `selectCity`, `setPassengers`, `selectCurrency` |
| `Flipkart.js` | flipkart.com | `dismissModal`, `searchProduct`, `hoverLoginButton` |
| `Login.js` | eventhub | `login`, `logout` |

---

## Test Coverage

### ~88 tests across 20 spec files in 3 layers

#### `tests/ui/` — Browser UI Tests

| Spec File | Tests | What It Covers |
|-----------|-------|----------------|
| `UIbasics.spec.js` | 20+ | UI fundamentals, forms, calendar, alerts, iframes, multi-tab |
| `sauceLabs-pom.spec.js` | 6 | `@smoke` `@regression` — cart, full checkout flow, sort by price |
| `todoMVC-pom.spec.js` | 5 | `@smoke` `@regression` — CRUD, all filters, edit, clearCompleted |
| `flightBooking-pom.spec.js` | 5 | `@smoke` `@regression` — round/one-way trip, city select, passengers |
| `flipkart-pom.spec.js` | 4 | `@smoke` `@regression` — modal dismiss, hover, search |
| `accessibility.spec.js` | 5 | WCAG 2.1 AA — SauceLabs (login/inventory/cart), TodoMVC (empty/with-items) |
| `visual.spec.js` | 6 | Pixel-diff baselines — SauceLabs (3), TodoMVC (2), Flight Booking (1) |
| `sessionStorage.spec.js` | 2 | Session/local storage state persistence across pages |
| `dropdownsWeb.spec.js` | 8+ | `<select>` dropdowns, radio buttons, date pickers, multi-select |

#### `tests/api/` — API & Network Tests

| Spec File | Tests | What It Covers |
|-----------|-------|----------------|
| `eventApi.spec.js` | 5+ | EventHub REST API CRUD — with **schema validation** on all responses |
| `eventhubApi.spec.js` | 2 | API mock injection + response interception via `page.route()` |
| `Apitests.spec.js` | 5+ | REST API — status codes, response body assertions |
| `Interceptapirequest.spec.js` | 2 | Intercept and modify outgoing requests |
| `Interceptapiresponse.spec.js` | 2 | Mock API responses |

#### `tests/e2e/` — End-to-End Flow Tests

| Spec File | Tests | What It Covers |
|-----------|-------|----------------|
| `crossBooking.spec.js` | 3+ | Cross-browser-context booking flow with shared auth state |
| `readWriteExcel.spec.js` | 3 | Excel file download, read cell values, write results |

---

## Accessibility Testing

Powered by **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)** — Deque's official integration of the industry-standard axe-core engine.

**What axe-core catches:**
- Missing form labels and image alt text
- Insufficient color contrast (WCAG AA)
- Improper ARIA roles and attributes
- Keyboard navigation traps
- Empty buttons and links
- Missing page language (`<html lang>`)

**Run:**
```bash
npm run test:a11y
```

**Strategy — only fail CI on critical/serious violations:**

Third-party sites we don't own often have minor/moderate issues we can't fix. The framework filters violations by impact level — only `critical` and `serious` block the build. Minor/moderate are logged as warnings.

```js
const AxeBuilder = require('@axe-core/playwright').default;

async function scanPage(page, pageName) {
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#onetrust-banner-sdk')   // ignore cookie banners
        .analyze();

    // Log all violations for visibility
    if (results.violations.length > 0) {
        console.log(`Violations on ${pageName}:`, results.violations.map(v => v.id));
    }

    // Only BLOCK CI on critical/serious
    const blockers = results.violations.filter(
        v => ['critical', 'serious'].includes(v.impact)
    );
    expect(blockers, `${pageName} has ${blockers.length} critical/serious violation(s)`).toEqual([]);
}
```

**Pages covered:**

| Page | Notes |
|------|-------|
| SauceLabs Login | Full WCAG 2.1 AA scan |
| SauceLabs Inventory | Post-login scan |
| SauceLabs Cart | Post-cart-add scan |
| TodoMVC (empty) | Full scan |
| TodoMVC (with items) | `label` rule disabled — known open-source app limitation (no `<label>` on checkboxes) |

---

## Visual Regression Testing

Uses Playwright's built-in **`toHaveScreenshot()`** — zero extra packages. Baseline screenshots are committed to the repo under `tests/ui/visual.spec.js-snapshots/`.

**How it works:**
- First run captures a **golden baseline** PNG
- Every subsequent run takes a screenshot and **pixel-diffs** it against the baseline
- Up to **0.2% pixel difference** is allowed (accounts for anti-aliasing and font rendering)
- Any difference beyond the threshold **fails the test** and saves a visual diff image to `test-results/`

**Important — baselines are OS-specific.** Screenshots taken on Windows are named `*-chromium-win32.png`. CI (Linux) needs `*-chromium-linux.png`. Use Docker to generate Linux baselines:

```bash
# Generate Linux-compatible baselines (for CI)
npm run docker:visual:update

# Run visual tests locally (Windows baselines)
npm run test:visual

# Update Windows baselines after an intentional UI change
npm run test:visual:update
# Then git add + commit the new .png files
```

> Visual tests are excluded from GitHub Actions CI (`testIgnore` in `playwright.config.js`) because baselines are OS-specific. Run them locally or via Docker.

**Baselines committed:**

| Page | Baseline File |
|------|---------------|
| SauceLabs Login | `saucelabs-login-chromium-win32.png` |
| SauceLabs Inventory | `saucelabs-inventory-chromium-win32.png` |
| SauceLabs Cart | `saucelabs-cart-chromium-win32.png` |
| TodoMVC (empty) | `todomvc-empty-chromium-win32.png` |
| TodoMVC (with items) | `todomvc-mixed-chromium-win32.png` |
| Flight Booking Form | `flight-booking-form-chromium-win32.png` |

---

## AI Self-Healing Locators

When a locator fails to find an element (e.g. after a UI refactor), `SelfHealingLocator` sends the page HTML to **Claude Haiku** (Anthropic) which suggests up to 3 alternative selectors. The first one that resolves is used automatically, and a heal report is saved to `test-results/heal-report.json`.

**Setup:**

1. Add `ANTHROPIC_API_KEY` to your `.env` (local) or GitHub / Jenkins secrets (CI)
2. Use the `healingPage` fixture in your test:

```js
const { test } = require('./tests/fixtures');

test('resilient login', async ({ healingPage }) => {
    const btn = await healingPage.heal('#submit-btn', 'submit button');
    await btn.click();
});
```

If no API key is configured, the locator silently falls back to the original selector — no test will break.

---

## API Schema Validation

`tests/utils/SchemaValidator.js` validates the **shape** of an API response before asserting individual values. This catches contract breaks — when the API returns a field with the wrong type, removes a required field, or changes the response structure.

**Zero dependencies** — no `ajv` or external packages needed.

### How It Works

```js
const { assertSchema } = require('../utils/SchemaValidator');

const loginResponseSchema = {
    token: { required: true,  type: 'string', minLength: 10 },
    user:  { required: true,  type: 'object' },
};

test('login returns correct schema', async ({ request }) => {
    const res  = await request.post('/api/auth/login', { data: creds });
    const body = await res.json();

    // Validates structure FIRST — fails with a readable list of schema errors
    assertSchema(body, loginResponseSchema, 'Login response');

    // Then assert specific values
    expect(body.user.email).toBe(creds.email);
});
```

If the schema is violated, you get a clear error:
```
Login response schema validation failed:
  [MISSING] token is required
  [TYPE] user: expected object, got string
```

### Schema Files

| File | Validates |
|------|-----------|
| `tests/api/schemas/loginSchema.js` | `token`, `userId`, `message` |
| `tests/api/schemas/orderSchema.js` | `orders[]` array + `orderid` |
| `tests/api/schemas/eventSchema.js` | Event item fields + `pagination` object |

### Supported Rules

| Rule | Description |
|------|-------------|
| `required: true` | Field must be present |
| `type: 'string'` | Checks `typeof` — supports `string`, `number`, `boolean`, `object`, `array` |
| `nullable: true` | Allows `null` even when `required` |
| `minLength: n` | Minimum string length |
| `min: n` | Minimum numeric value |
| `items: {}` | Schema for the first item of an array (spot-checks array contents) |
| `properties: {}` | Nested schema for an object field |

---

## Auth State Reuse

`tests/global.setup.js` runs **once before the whole suite** and logs into each app, saving browser session cookies/localStorage to `tests/data/auth/*.json`. Every subsequent test loads that file — no login call per test.

```
Without auth reuse:  60 tests × 2s login = 2 minutes wasted per run
With auth reuse:     login runs once = 2 seconds total
```

**How it works:**

```js
// tests/global.setup.js — runs automatically via 'setup' project
setup('authenticate: saucelabs', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#login-button').click();
    await page.context().storageState({ path: 'tests/data/auth/saucelabs.json' });
});
```

**Using it in a test file:**

```js
const path = require('path');
// Load session at the top of the spec — no login in beforeEach
test.use({ storageState: path.join(__dirname, '../data/auth/saucelabs.json') });

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html'); // already logged in
});
```

> `tests/data/auth/` is gitignored — state files are regenerated on each `npm test` run.

---

## Flaky Test Quarantine

Tests tagged `@flaky` are excluded from the main chromium run and only execute in a separate quarantine project with 5 retries. This keeps CI green without hiding flakiness.

```
npm test              → skips @flaky tests (fast, reliable CI signal)
npm run test:quarantine → runs ONLY @flaky tests with 5 retries
```

**Tagging a flaky test:**

```js
test('banner appears after load @smoke @flaky', async ({ page }) => {
    // known intermittent: banner sometimes renders after 3s on slow CI
});
```

**Workflow:** tag → quarantine → investigate root cause → fix → remove `@flaky`.

---

## Mobile Testing

Two mobile viewport projects are configured: `mobile-chrome` (Pixel 5) and `mobile-safari` (iPhone 12).

```bash
# Install webkit for mobile-safari
npx playwright install webkit

# Run all tests on mobile viewports
npm run test:mobile

# Run a single spec on mobile
npx playwright test tests/ui/sauceLabs-pom.spec.js --project=mobile-chrome
```

Mobile projects also run via the setup project (auth state reuse works on mobile too).

---

## Copilot Instructions

`.github/copilot-instructions.md` teaches GitHub Copilot this framework's standards so every AI-generated suggestion follows the correct patterns:

- Folder placement rules (`tests/ui/` vs `api/` vs `e2e/`)
- Locator priority order (role → label → text → testId — never XPath)
- POM structure (extend BasePage, locators in constructor only)
- Required tags on every test
- `assertSchema()` before any field assertions in API tests
- Auth state reuse instead of per-test login
- `@flaky` quarantine pattern
- What not to generate (hardcoded credentials, waitForTimeout, test.only)

---

## Prompt Versioning

`prompts/` stores versioned Markdown prompts for consistent AI test generation. Use them with GitHub Copilot Chat, Claude, or any LLM:

| File | Use for |
|------|---------|
| `v1-ui-test-flow.md` | Generating a new `tests/ui/` spec file |
| `v2-api-test-flow.md` | Generating a new `tests/api/` spec + schema file |
| `v3-pom-creation.md` | Generating a new POM or component class |
| `templates/ui-test-template.md` | Fill-in template with placeholders |
| `templates/api-test-template.md` | Fill-in template for API tests |

Each prompt is versioned — when framework conventions change, bump the version and update the prompt so generated code stays consistent.

---

## CI/CD

### GitHub Actions — Parallel Sharding

Tests run across **4 parallel VMs simultaneously**, cutting wall-clock time from ~5 minutes to ~1–2 minutes.

```
Push / PR / Nightly schedule
            │
            ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Shard 1 │  │ Shard 2 │  │ Shard 3 │  │ Shard 4 │  ← 4 VMs in parallel
│ tests   │  │ tests   │  │ tests   │  │ tests   │
│  1–22   │  │ 23–44   │  │ 45–66   │  │ 67–88   │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     └────────────┴────────────┴─────────────┘
                          │
                          ▼
                   Merge Reports Job
              (blob reports → single HTML)
```

Each shard writes a `blob` report. The `merge-reports` job downloads all 4 blobs and combines them into one downloadable HTML report. If one shard fails, the others keep running (`fail-fast: false`).

### Triggers

| Event | When |
|-------|------|
| `push` | Every push to `main`, `master`, `epic/**`, `feature/**` |
| `pull_request` | Every PR targeting `main` or `master` |
| `schedule` | Nightly at 02:00 UTC |
| `workflow_dispatch` | Manual run — pick browser, test file, or grep tag from GitHub UI |

### CI Artifacts

| Artifact | Retention | Contents |
|----------|-----------|---------|
| `playwright-report-{run_id}` | 30 days | Merged HTML report (all shards combined) |
| `test-results-shard-{n}-{run_id}` | 7 days | Failure screenshots, videos, Playwright traces |

### Manual Dispatch Options

Go to **Actions → Playwright Tests → Run workflow:**
- **Test file** — run a single spec (blank = all)
- **Browser** — `chromium` / `firefox` / `webkit`
- **Grep tag** — `@smoke`, `@regression`, `@api`

### Jenkins

Import [`Jenkinsfile`](Jenkinsfile) into Jenkins (**New Item → Pipeline → Pipeline script from SCM**).

The pipeline runs entirely inside the official Playwright Docker image — no need to install Node.js or browsers on the Jenkins server. Parameters mirror GitHub Actions: `TEST_FILE`, `BROWSER`, `GREP_TAG`, `HEADED`.

**Jenkins plugins required:**
- Docker Pipeline
- HTML Publisher

**Jenkins credentials required:**
- `anthropic-api-key` — optional, enables AI self-healing in CI

### Branch Strategy

```
main  ←── epic/feature-name  ←── feature/specific-change
 │              │
 │         CI triggers on push         Tests travel with the feature
 │         (sandbox / dev env)
 │
Full regression on merge
(4 shards, production env)
```

---

## Docker

Run tests in a fresh Linux container — identical environment on Windows, Mac, and CI. No local Node.js or browser install required.

**Why Docker?**
- Eliminates "works on my machine" — everyone uses the same Ubuntu 24.04 + Node 20 + browsers
- Browser versions pinned to the image tag (no surprise browser upgrades)
- Matches GitHub Actions environment exactly
- Jenkins pipeline uses the same image

### Quick Start

```bash
# 1. Build the image (one-time setup)
npm run docker:build

# 2. Run all tests
npm run docker:test

# 3. Run specific suites
npm run docker:smoke          # @smoke only
npm run docker:regression     # @regression only

# 4. Get HTML report on your host after tests
npm run docker:report
# Open playwright-report/index.html
```

### Generate Linux Visual Baselines

```bash
npm run docker:visual:update
# New *-chromium-linux.png files appear in tests/ui/visual.spec.js-snapshots/
# git add + commit them for CI to use
```

### Manual Docker Commands

```bash
# Run a single spec file
docker run --rm --ipc=host playwright-tests npx playwright test tests/ui/sauceLabs-pom.spec.js

# Run on Firefox
docker run --rm --ipc=host playwright-tests npx playwright test --project=firefox

# Inject ANTHROPIC_API_KEY for self-healing
docker run --rm --ipc=host -e ANTHROPIC_API_KEY=sk-ant-xxx playwright-tests

# Debug: open a shell inside the container
docker run --rm -it --ipc=host playwright-tests /bin/bash
```

### How the Image is Built

```
Dockerfile
├── FROM mcr.microsoft.com/playwright:v1.49.0-noble
│     └── Ubuntu 24.04 LTS + Node.js 20 + Chromium/Firefox/WebKit pre-installed
├── COPY package*.json → RUN npm ci
│     └── Cached layer — rebuilds only when package.json changes
├── COPY . .
│     └── Your test code (.dockerignore excludes node_modules, reports, .env, .git)
├── ENV CI=true
│     └── Activates: 2 retries, 90s timeout, visual test exclusion
└── CMD ["npx", "playwright", "test"]
      └── Override at runtime with any playwright test flags
```

> `--ipc=host` is required in `docker run` — Chromium uses shared memory which Docker isolates by default.

---

## Reporting

### Playwright HTML Report

```bash
npm run report
```

Opens the built-in HTML report at `playwright-report/index.html`. Shows pass/fail per test, screenshots on failure, network traces, and a timeline.

In CI, the merged report is uploaded as an artifact (`playwright-report-{run_id}`) and retained for 30 days.

### Allure Report

```bash
# Generate + open in browser
npm run allure:report

# Or separately
npm run allure:generate
npm run allure:open
```

Allure activates automatically when `allure-playwright` is installed. Provides test history, trend charts, severity tagging, and step-level breakdowns.

---

## Environment Configuration

Three environments pre-configured in [`tests/config/env.js`](tests/config/env.js):

| Environment | When | BASE_URL |
|-------------|------|----------|
| `development` | Local / feature branches | rahulshettyacademy.com |
| `staging` | Epic branches in CI | rahulshettyacademy.com |
| `production` | Main/master branch in CI | rahulshettyacademy.com |

Override at runtime:

```bash
BASE_URL=https://your-staging-url.com npx playwright test
NODE_ENV=staging npx playwright test
```

In GitHub Actions, `BASE_URL` and `NODE_ENV` are set automatically based on the branch name.

---

## Contributing

1. Branch from `main`: `git checkout -b feature/your-feature`
2. Place tests in the right folder:
   - `tests/ui/` for browser-based UI tests
   - `tests/api/` for API and network tests
   - `tests/e2e/` for full end-to-end flows
3. Tag tests appropriately (`@smoke` for critical path, `@regression` for full suite)
4. For API tests, add a schema in `tests/api/schemas/` and call `assertSchema()` before value assertions
5. All tests must pass locally: `npm test`
6. Accessibility: run `npm run test:a11y` — no new critical/serious violations allowed
7. Visual changes: regenerate baselines with `npm run test:visual:update`, then commit the new PNGs
8. Open a PR — CI runs all tests automatically across 4 parallel shards
9. PR gets an automatic comment with the test result table and a link to the HTML report
