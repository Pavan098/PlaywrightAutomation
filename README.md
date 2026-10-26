# Playwright Automation Framework

A production-grade end-to-end test automation framework built with **Playwright** and **JavaScript**, featuring Page Object Model, AI self-healing locators, CI/CD integration, and Allure reporting.

![CI](https://github.com/Pavan098/PlaywrightAutomation/actions/workflows/playwright.yml/badge.svg)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Page Object Models](#page-object-models)
- [Test Coverage](#test-coverage)
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
| GitHub Actions | CI/CD pipeline |
| Jenkins | Alternative CI pipeline |
| Allure | Advanced test reporting |
| Claude Haiku (Anthropic) | AI self-healing locators |
| dotenv | Environment configuration |
| xlsx | Excel read/write for data-driven tests |

---

## Project Structure

```
PlaywrightAutomation/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI/CD workflow
├── Pages/                       # Page Object Models
│   ├── BasePage.js              # Base class with shared utilities
│   ├── Login.js                 # EventHub login page
│   ├── SauceLabs.js             # SauceLabs demo (inventory, cart, checkout)
│   ├── TodoMVC.js               # TodoMVC app
│   ├── FlightBooking.js         # Flight booking form
│   └── Flipkart.js              # Flipkart (modal dismiss + hover)
├── tests/
│   ├── config/
│   │   └── env.js               # Environment configs (dev / staging / prod)
│   ├── fixtures/
│   │   └── index.js             # Custom Playwright fixtures
│   ├── utils/
│   │   ├── SelfHealingLocator.js  # AI-powered locator recovery
│   │   ├── TestDataFactory.js     # Random test data generator
│   │   ├── Logger.js              # Structured JSON logger
│   │   ├── ApiUtils.js            # HTTP request helpers
│   │   └── ExcelHelper.js         # Excel download/read/write
│   ├── UIbasics.spec.js         # Core UI interaction tests
│   ├── saucelabs.spec.js        # SauceLabs login & product tests
│   ├── sauceLabs-pom.spec.js    # SauceLabs POM tests (cart, checkout, sort)
│   ├── todoMVC.spec.js          # TodoMVC basic tests
│   ├── todoMVC-pom.spec.js      # TodoMVC POM tests (filters, edit, clear)
│   ├── dropdownsWeb.spec.js     # Dropdowns & form elements
│   ├── flightBooking-pom.spec.js # Flight booking POM tests
│   ├── flipkart.spec.js         # Flipkart hover & modal tests
│   ├── flipkart-pom.spec.js     # Flipkart POM tests
│   ├── Apitests.spec.js         # REST API tests
│   ├── eventApi.spec.js         # EventHub REST API tests
│   ├── eventhubApi.spec.js      # EventHub API mock/intercept tests
│   ├── crossBooking.spec.js     # Cross-browser booking flow
│   ├── Interceptapirequest.spec.js  # Request interception tests
│   ├── Interceptapiresponse.spec.js # Response interception tests
│   ├── sessionStorage.spec.js   # Session & storage state tests
│   ├── readWriteExcel.spec.js   # Excel data-driven tests
│   └── example.spec.js          # Playwright starter example
├── .env.example                 # Environment variable template
├── .gitignore
├── Jenkinsfile                  # Jenkins declarative pipeline
├── package.json
└── playwright.config.js         # Playwright configuration
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
npm run test:smoke        # @smoke tests only
npm run test:regression   # @regression tests only
npm run test:api          # @api tests only

# Run specific file
npx playwright test tests/sauceLabs-pom.spec.js

# Run across all browsers
npm run test:all-browsers

# Open last HTML report
npm run report
```

### Test Tags

Tests are tagged for selective execution:

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

### 76 tests across 18 spec files

| Spec File | Tests | Tags |
|-----------|-------|------|
| `UIbasics.spec.js` | 20+ | UI fundamentals, forms, calendar, alerts |
| `sauceLabs-pom.spec.js` | 6 | `@smoke` `@regression` — cart, checkout, sort |
| `todoMVC-pom.spec.js` | 5 | `@smoke` `@regression` — CRUD, filters |
| `flightBooking-pom.spec.js` | 5 | `@smoke` `@regression` — trip type, cities, passengers |
| `flipkart-pom.spec.js` | 4 | `@smoke` `@regression` — modal, hover, search |
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

## CI/CD

### GitHub Actions

The workflow at [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) triggers on:

| Trigger | When |
|---------|------|
| `push` | Every push to `main`, `master`, `epic/**`, `feature/**` |
| `pull_request` | Every PR targeting `main` or `master` |
| `schedule` | Nightly at 02:00 UTC |
| `workflow_dispatch` | Manual run from GitHub UI (choose browser, file, tag) |

**Artifacts uploaded on every run:**
- `playwright-report-{run_id}` — HTML report (30-day retention)
- `test-results-{run_id}` — Failure screenshots, videos, traces (7-day retention)

#### Manual Dispatch Options

Go to **Actions → Playwright Tests → Run workflow** to choose:
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
(merge trigger — full regression)
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
# Install Allure CLI once
npm install --save-dev allure-playwright allure-commandline

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

| Environment | URL | Usage |
|-------------|-----|-------|
| `development` | rahulshettyacademy.com | Local development |
| `staging` | rahulshettyacademy.com | Epic branch CI runs |
| `production` | rahulshettyacademy.com | Main branch CI runs |

Override at runtime:

```bash
BASE_URL=https://your-staging-url.com npx playwright test
```

---

## Contributing

1. Branch from `main`: `git checkout -b feature/your-feature`
2. Write tests with appropriate `@smoke` / `@regression` tags
3. All tests must pass locally: `npm test`
4. Open a PR — CI runs automatically
