# UI Test Template

Use this template when asking AI to generate a new UI spec file.
Copy the block below and fill in the placeholders before sending.

---

```
Generate a Playwright UI test for the following using the framework conventions in .github/copilot-instructions.md:

PAGE: <page URL>
POM:  <Pages/SomePage.js or "none — write raw locators">
FILE: tests/ui/<feature-name>.spec.js

SCENARIOS:
1. <happy path description> @smoke
2. <secondary scenario> @regression
3. <edge case> @regression

AUTH: <"none" | "use storageState: tests/data/auth/saucelabs.json" | "login inline">

RULES:
- Extend BasePage; locators only in constructor
- Use getByRole / getByLabel / getByText locators in priority order
- waitForURL() after every navigation
- waitFor({ state: 'visible' }) before count()
- assertSchema() in any test that calls an API
- No waitForTimeout() except inside POM sort methods
- Tag every describe block and every test
```
