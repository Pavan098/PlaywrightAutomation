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

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Playwright](https://playwright.dev) v1.49+ | Browser automation & test runner |
| JavaScript (CommonJS) | Language |
| Page Object Model | Test architecture pattern |
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
│       └── playwright.yml            # GitHub Actions — 4 parallel shards + merge report
├── Pages/                            # Page Object Models
│   ├── BasePage.js                   # Base class: goto, waitForVisible, clickWithRetry
│   ├── Login.js                      # EventHub login page
│   ├── SauceLabs.js                  # SauceLabs (inventory, cart, checkout, sort)
│   ├── TodoMVC.js                    # TodoMVC (add, complete, delete, filter, edit)
│   ├── FlightBooking.js              # Flight booking form
│   └── Flipkart.js                   # Flipkart (modal dismiss + hover)
├── tests/
│   ├── config/
│   │   └── env.js                    # Environment configs (dev / staging / prod)
│   ├── fixtures/
│   │   └── index.js                  # Custom Playwright fixtures (healingPage)
│   ├── utils/
│   │   ├── SelfHealingLocator.js     # AI-powered locator recovery via Claude Haiku
│   │   ├── TestDataFactory.js        # Random test data generator
│   │   ├── Logger.js                 # Structured JSON logger
│   │   ├── ApiUtils.js               # HTTP request helpers
│   │   └── ExcelHelper.js            # Excel download/read/write
│   ├── visual.spec.js-snapshots/     # Committed baseline screenshots (6 PNGs, Windows)
│   ├── UIbasics.spec.js              # Core UI tests — forms, calendar, alerts, iframes
│   ├── saucelabs.spec.js             # SauceLabs login & product tests (raw)
│   ├── sauceLabs-pom.spec.js         # SauceLabs POM tests (cart, checkout, sort)
│   ├── todoMVC.spec.js               # TodoMVC basic tests (raw)
│   ├── todoMVC-pom.spec.js           # TodoMVC POM tests (filters, edit, clearCompleted)
│   ├── dropdownsWeb.spec.js          # Dropdowns, radio buttons, date pickers
│   ├── flightBooking-pom.spec.js     # Flight booking POM tests
│   ├── flipkart.spec.js              # Flipkart hover & modal tests (raw)
│   ├── flipkart-pom.spec.js          # Flipkart POM tests
│   ├── accessibility.spec.js         # WCAG 2.1 AA scans — SauceLabs + TodoMVC
│   ├── visual.spec.js                # Visual regression pixel-diff tests
│   ├── Apitests.spec.js              # REST API tests (JSONPlaceholder)
│   ├── eventApi.spec.js              # EventHub REST API CRUD
│   ├── eventhubApi.spec.js           # EventHub API mock & response interception
│   ├── crossBooking.spec.js          # Cross-browser-context booking flow
│   ├── Interceptapirequest.spec.js   # Request interception & modification
│   ├── Interceptapiresponse.spec.js  # Response mocking
│   ├── sessionStorage.spec.js        # Session & local storage state
│   ├── readWriteExcel.spec.js        # Excel data-driven tests
│   └── example.spec.js               # Playwright starter example
├── .dockerignore                     # Excludes node_modules, reports, .env, .git
├── .env.example                      # Environment variable template
├── .gitignore
├── Dockerfile                        # Playwright Docker image (Ubuntu 24.04 + Node 20)
├── Jenkinsfile                       # Jenkins declarative pipeline (Docker agent)
├── package.json
└── playwright.config.js              # Playwright config — retries, sharding, testIgnore
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

# Run with a visible browser
npm run test:headed

# Open Playwright UI explorer (interactive)
npm run test:ui

# Filter by tag
npm run test:smoke            # @smoke — critical happy-path tests
npm run test:regression       # @regression — full regression suite
npm run test:api              # @api — API-only tests

# Specific test types
npm run test:a11y             # Accessibility scans only
npm run test:visual           # Visual regression only
npm run test:visual:update    # Regenerate visual baselines after a UI change

# Specific browsers
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run test:all-browsers     # All 3 browsers in sequence

# Run a single spec file
npx playwright test tests/sauceLabs-pom.spec.js

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

### ~88 tests across 20 spec files

| Spec File | Tests | What It Covers |
|-----------|-------|----------------|
| `UIbasics.spec.js` | 20+ | UI fundamentals, forms, calendar, alerts, iframes, multi-tab |
| `sauceLabs-pom.spec.js` | 6 | `@smoke` `@regression` — cart, full checkout flow, sort by price |
| `todoMVC-pom.spec.js` | 5 | `@smoke` `@regression` — CRUD, all filters, edit, clearCompleted |
| `flightBooking-pom.spec.js` | 5 | `@smoke` `@regression` — round/one-way trip, city select, passengers |
| `flipkart-pom.spec.js` | 4 | `@smoke` `@regression` — modal dismiss, hover, search |
| `accessibility.spec.js` | 5 | WCAG 2.1 AA — SauceLabs (login/inventory/cart), TodoMVC (empty/with-items) |
| `visual.spec.js` | 6 | Pixel-diff baselines — SauceLabs (3), TodoMVC (2), Flight Booking (1) |
| `eventhubApi.spec.js` | 2 | API mock injection + response interception |
| `eventApi.spec.js` | 5+ | EventHub REST API CRUD (GET, POST, PUT, DELETE) |
| `Apitests.spec.js` | 5+ | REST API assertions, status codes, response body |
| `crossBooking.spec.js` | 3+ | Cross-browser-context booking with shared state |
| `Interceptapirequest.spec.js` | 2 | Intercept and modify outgoing requests |
| `Interceptapiresponse.spec.js` | 2 | Mock API responses |
| `sessionStorage.spec.js` | 2 | Session/local storage state persistence across pages |
| `readWriteExcel.spec.js` | 3 | Excel file download, read cell values, write results |
| `dropdownsWeb.spec.js` | 8+ | `<select>` dropdowns, radio buttons, date pickers, multi-select |

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

Uses Playwright's built-in **`toHaveScreenshot()`** — zero extra packages. Baseline screenshots are committed to the repo under `tests/visual.spec.js-snapshots/`.

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
# New *-chromium-linux.png files appear in tests/visual.spec.js-snapshots/
# git add + commit them for CI to use
```

### Manual Docker Commands

```bash
# Run a single spec file
docker run --rm --ipc=host playwright-tests npx playwright test tests/sauceLabs-pom.spec.js

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
2. Write tests with appropriate tags (`@smoke` for critical path, `@regression` for full suite)
3. All tests must pass locally: `npm test`
4. Accessibility: run `npm run test:a11y` — no new critical/serious violations
5. Visual changes: regenerate baselines with `npm run test:visual:update`, then commit the new PNGs
6. Open a PR — CI runs all 88 tests automatically across 4 parallel shards
7. PR gets an automatic comment with the test result table and a link to the HTML report
