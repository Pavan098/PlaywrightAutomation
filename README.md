# Playwright Automation Framework

A production-grade end-to-end test automation framework built with **Playwright** and **JavaScript**, featuring Page Object Model, AI self-healing locators, test sharding, accessibility scanning, visual regression, CI/CD integration, and Allure reporting.

![CI](https://github.com/Pavan098/PlaywrightAutomation/actions/workflows/playwright.yml/badge.svg)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Page Object Models](#page-object-models)
- [Test Coverage](#test-coverage)
- [Accessibility Testing](#accessibility-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [CI/CD](#cicd)
- [Reporting](#reporting)
- [AI Self-Healing Locators](#ai-self-healing-locators)
- [Environment Configuration](#environment-configuration)

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) v1.49+ | Browser automation & test runner |
| JavaScript (CommonJS) | Language |
| Page Object Model | Test architecture pattern |
| GitHub Actions | CI/CD pipeline with 4-shard parallel execution |
| Jenkins | Alternative CI pipeline |
| Allure | Advanced test reporting |
| `@axe-core/playwright` | WCAG 2.1 accessibility scanning |
| `toHaveScreenshot()` | Built-in visual regression comparison |
| Claude Haiku (Anthropic) | AI self-healing locators |
| dotenv | Environment configuration |
| xlsx | Excel read/write for data-driven tests |

---

## Project Structure

```
PlaywrightAutomation/
├── .github/
│   └── workflows/
│       └── playwright.yml            # GitHub Actions — 4 parallel shards + merge report
├── Pages/                            # Page Object Models
│   ├── BasePage.js                   # Base class with shared utilities
│   ├── Login.js                      # EventHub login page
│   ├── SauceLabs.js                  # SauceLabs demo (inventory, cart, checkout)
│   ├── TodoMVC.js                    # TodoMVC app
│   ├── FlightBooking.js              # Flight booking form
│   └── Flipkart.js                   # Flipkart (modal dismiss + hover)
├── tests/
│   ├── config/
│   │   └── env.js                    # Environment configs (dev / staging / prod)
│   ├── fixtures/
│   │   └── index.js                  # Custom Playwright fixtures
│   ├── utils/
│   │   ├── SelfHealingLocator.js     # AI-powered locator recovery
│   │   ├── TestDataFactory.js        # Random test data generator
│   │   ├── Logger.js                 # Structured JSON logger
│   │   ├── ApiUtils.js               # HTTP request helpers
│   │   └── ExcelHelper.js            # Excel download/read/write
│   ├── visual.spec.js-snapshots/     # Committed baseline screenshots (6 PNGs)
│   ├── UIbasics.spec.js              # Core UI interaction tests
│   ├── saucelabs.spec.js             # SauceLabs login & product tests
│   ├── sauceLabs-pom.spec.js         # SauceLabs POM tests (cart, checkout, sort)
│   ├── todoMVC.spec.js               # TodoMVC basic tests
│   ├── todoMVC-pom.spec.js           # TodoMVC POM tests (filters, edit, clear)
│   ├── dropdownsWeb.spec.js          # Dropdowns & form elements
│   ├── flightBooking-pom.spec.js     # Flight booking POM tests
│   ├── flipkart.spec.js              # Flipkart hover & modal tests
│   ├── flipkart-pom.spec.js          # Flipkart POM tests
│   ├── accessibility.spec.js         # WCAG 2.1 accessibility scans
│   ├── visual.spec.js                # Visual regression tests
│   ├── Apitests.spec.js              # REST API tests
│   ├── eventApi.spec.js              # EventHub REST API tests
│   ├── eventhubApi.spec.js           # EventHub API mock/intercept tests
│   ├── crossBooking.spec.js          # Cross-context booking flow
│   ├── Interceptapirequest.spec.js   # Request interception tests
│   ├── Interceptapiresponse.spec.js  # Response mocking tests
│   ├── sessionStorage.spec.js        # Session & storage state tests
│   ├── readWriteExcel.spec.js        # Excel data-driven tests
│   └── example.spec.js               # Playwright starter example
├── .env.example                      # Environment variable template
├── .gitignore
├── Jenkinsfile                       # Jenkins declarative pipeline
├── package.json
└── playwright.config.js              # Playwright configuration
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Pavan098/PlaywrightAutomation.git
cd PlaywrightAutomation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps chromium
```

### Environment Setup

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your values:

```env
BASE_URL=https://rahulshettyacademy.com
ANTHROPIC_API_KEY=your_key_here   # Optional — enables AI self-healing
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run in headed (visible browser) mode
npm run test:headed

# Run with Playwright UI explorer
npm run test:ui

# Run by tag
npm run test:smoke            # @smoke tests only
npm run test:regression       # @regression tests only
npm run test:api              # @api tests only

# Run specific categories
npm run test:a11y             # Accessibility tests only
npm run test:visual           # Visual regression tests only
npm run test:visual:update    # Regenerate visual baselines after UI change

# Run a specific file
npx playwright test tests/sauceLabs-pom.spec.js

# Run across all browsers
npm run test:all-browsers

# Open last HTML report
npm run report
```

### Test Tags

| Tag | Purpose |
|-----|---------|
| `@smoke` | Critical happy-path tests — run on every commit |
| `@regression` | Full regression suite — run nightly or on PRs |
| `@api` | API-only tests |

---

## Page Object Models

All POMs extend `BasePage` which provides shared utilities:

| Method | Description |
|--------|-------------|
| `goto(url)` | Navigate with `domcontentloaded` wait |
| `waitForVisible(locator)` | Wait for element to be visible |
| `clickWithRetry(locator, retries)` | Click with automatic retry |
| `getText(locator)` | Get element text content |
| `getAllTexts(locator)` | Get all matching elements' text |
| `takeScreenshot(name)` | Capture named screenshot |

### Available POMs

| POM | Site | Key Actions |
|-----|------|-------------|
| `SauceLabs.js` | saucedemo.com | login, addToCart, checkout, sort, cart badge |
| `TodoMVC.js` | todomvc.com | addTodo, complete, delete, edit, filter, clearCompleted |
| `FlightBooking.js` | rahulshettyacademy.com | selectTripType, selectCity, setPassengers, selectCurrency |
| `Flipkart.js` | flipkart.com | dismissModal, searchProduct, hoverLoginButton |
| `Login.js` | eventhub | login, logout |

---

## Test Coverage

### 88 tests across 20 spec files

| Spec File | Tests | What It Covers |
|-----------|-------|----------------|
| `UIbasics.spec.js` | 20+ | UI fundamentals, forms, calendar, alerts |
| `sauceLabs-pom.spec.js` | 6 | `@smoke` `@regression` — cart, checkout, sort |
| `todoMVC-pom.spec.js` | 5 | `@smoke` `@regression` — CRUD, filters |
| `flightBooking-pom.spec.js` | 5 | `@smoke` `@regression` — trip type, cities, passengers |
| `flipkart-pom.spec.js` | 4 | `@smoke` `@regression` — modal, hover, search |
| `accessibility.spec.js` | 6 | WCAG 2.1 AA — SauceLabs, TodoMVC, Flight Booking |
| `visual.spec.js` | 6 | Pixel-diff baselines — SauceLabs, TodoMVC, Flight Booking |
| `eventhubApi.spec.js` | 2 | API mocking / response interception |
| `eventApi.spec.js` | 5+ | EventHub REST API CRUD |
| `Apitests.spec.js` | 5+ | REST API assertions |
| `crossBooking.spec.js` | 3+ | Cross-context booking flow |
| `Interceptapirequest.spec.js` | 2 | Request interception & modification |
| `Interceptapiresponse.spec.js` | 2 | Response mocking |
| `sessionStorage.spec.js` | 2 | Storage state persistence |
| `readWriteExcel.spec.js` | 3 | Excel download, read, write |
| `dropdownsWeb.spec.js` | 8+ | Dropdowns, radio buttons, date pickers |

---

## Accessibility Testing

Accessibility tests use **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)** (Deque's official package) to scan pages against WCAG 2.1 Level AA.

**What it catches:**
- Missing form labels and alt text
- Insufficient color contrast
- Improper ARIA roles and attributes
- Keyboard navigation traps
- Focus order issues

**Run:**
```bash
npm run test:a11y
```

**How it works in tests:**
```js
const AxeBuilder = require('@axe-core/playwright').default;

test('login page has no violations', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
    expect(results.violations).toEqual([]);
});
```

CI fails immediately if any accessibility violation is found, with a detailed breakdown of the affected elements.

---

## Visual Regression Testing

Visual regression uses Playwright's built-in **`toHaveScreenshot()`** — no extra packages needed. Baseline screenshots are committed to the repo under `tests/visual.spec.js-snapshots/`.

**How it works:**
- First run captures a **golden baseline** screenshot
- Every subsequent run takes a new screenshot and **pixel-diffs** it against the baseline
- Up to **0.2% pixel difference** is allowed (handles anti-aliasing across OS/GPU)
- Any difference beyond the threshold **fails the test** with a visual diff image

**Run:**
```bash
# Compare against baselines
npm run test:visual

# Regenerate baselines after an intentional UI change
npm run test:visual:update
# Then commit the new .png files
```

**Pages covered:**

| Page | Baseline File |
|------|---------------|
| SauceLabs Login | `saucelabs-login-chromium-win32.png` |
| SauceLabs Inventory | `saucelabs-inventory-chromium-win32.png` |
| SauceLabs Cart | `saucelabs-cart-chromium-win32.png` |
| TodoMVC (empty) | `todomvc-empty-chromium-win32.png` |
| TodoMVC (mixed items) | `todomvc-mixed-chromium-win32.png` |
| Flight Booking Form | `flight-booking-form-chromium-win32.png` |

---

## CI/CD

### GitHub Actions — Parallel Sharding

Tests run across **4 parallel VMs simultaneously**, cutting CI time from ~5 minutes to ~1-2 minutes.

```
Push to main
     │
     ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ Shard 1 │  │ Shard 2 │  │ Shard 3 │  │ Shard 4 │   ← 4 VMs in parallel
│ Tests   │  │ Tests   │  │ Tests   │  │ Tests   │
│ 1–22    │  │ 23–44   │  │ 45–66   │  │ 67–88   │
└────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘
     └────────────┴────────────┴─────────────┘
                          │
                          ▼
                   Merge Reports Job
                   (one HTML report)
```

Each shard outputs a `blob` report. A `merge-reports` job combines them into a single downloadable HTML report.

### Triggers

| Event | When |
|-------|------|
| `push` | Every push to `main`, `master`, `epic/**`, `feature/**` |
| `pull_request` | Every PR targeting `main` or `master` |
| `schedule` | Nightly at 02:00 UTC |
| `workflow_dispatch` | Manual — choose browser, file, or tag from GitHub UI |

### Artifacts

| Artifact | Retention |
|----------|-----------|
| `playwright-report-{run_id}` | 30 days — merged HTML report |
| `test-results-shard-{n}-{run_id}` | 7 days — failure screenshots, videos, traces |

### Manual Dispatch Options

Go to **Actions → Playwright Tests → Run workflow:**
- **Test file** — run a single spec (blank = all)
- **Browser** — `chromium` / `firefox` / `webkit`
- **Grep tag** — `@smoke`, `@regression`, `@api`

### Jenkins

Import [`Jenkinsfile`](Jenkinsfile) into your Jenkins instance. Parameters mirror the GitHub Actions inputs: `TEST_FILE`, `BROWSER`, `GREP_TAG`, `HEADED`.

### Branch Strategy

```
main  ←── epic/feature-name  ←── feature/specific-change
 │              │
 │         Sandbox env             New tests travel on the
 │         (push trigger)          same branch as the feature
 │
Production env
(merge trigger — full regression runs on 4 shards)
```

---

## Reporting

### Playwright HTML Report

```bash
npm run report
```

Opens the built-in Playwright HTML report at `playwright-report/index.html`.

### Allure Report

```bash
# Generate and open
npm run allure:report
```

Allure is auto-detected — if the package is installed, it activates automatically. No config change needed.

---

## AI Self-Healing Locators

When a locator fails to find an element, `SelfHealingLocator` sends the page HTML to **Claude Haiku** (Anthropic) which suggests up to 3 alternative selectors. The first one that resolves is used automatically, and a heal report is saved to `test-results/heal-report.json`.

**Setup:**

1. Add `ANTHROPIC_API_KEY` to your `.env` file (local) or GitHub Secrets (CI)
2. Use the healing fixture in your test:

```js
const { test } = require('./tests/fixtures');

test('example with self-healing', async ({ healingPage }) => {
    const btn = await healingPage.heal('#submit-btn', 'submit button');
    await btn.click();
});
```

If no API key is set, the utility silently falls back to the original locator — no test breakage.

---

## Environment Configuration

Three environments are pre-configured in [`tests/config/env.js`](tests/config/env.js):

| Environment | Usage |
|-------------|-------|
| `development` | Local development |
| `staging` | Epic branch CI runs |
| `production` | Main branch CI runs |

Override at runtime:

```bash
BASE_URL=https://your-staging-url.com npx playwright test
```

---

## Contributing

1. Branch from `main`: `git checkout -b feature/your-feature`
2. Write tests with appropriate `@smoke` / `@regression` tags
3. All tests must pass locally: `npm test`
4. For UI changes, regenerate visual baselines: `npm run test:visual:update`
5. Open a PR — CI runs automatically across 4 parallel shards
