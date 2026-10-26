# v1 — UI Test Flow Prompt

**Version:** 1.0  
**Use for:** Generating browser-based UI spec files  
**Template:** [templates/ui-test-template.md](templates/ui-test-template.md)

---

## Prompt

```
You are generating a Playwright UI test for the framework at https://github.com/Pavan098/PlaywrightAutomation.

Read .github/copilot-instructions.md for all coding rules before generating.

Task: Write a test file at tests/ui/<FILENAME>.spec.js for <PAGE_URL>.

The page has a POM at Pages/<PAGE>.js. Use it — do not write raw locators in tests.

Cover these scenarios:
- <SCENARIO_1> — tag @smoke
- <SCENARIO_2> — tag @regression
- <SCENARIO_3> — tag @regression

Auth: Load storageState from tests/data/auth/<APP>.json using test.use() at the top of the file.

Output: only the spec file content. No explanation needed.
```

---

## Example Usage

Filled-in prompt for SauceLabs sorting tests:

```
You are generating a Playwright UI test for the framework at https://github.com/Pavan098/PlaywrightAutomation.

Read .github/copilot-instructions.md for all coding rules before generating.

Task: Write a test file at tests/ui/saucelabs-sort.spec.js for https://www.saucedemo.com/inventory.html.

The page has a POM at Pages/SauceLabs.js. Use it.

Cover these scenarios:
- Sort by name A-Z and verify ascending order — tag @smoke
- Sort by name Z-A and verify descending order — tag @regression
- Sort by price low-to-high and verify ascending order — tag @regression
- Sort by price high-to-low and verify descending order — tag @regression

Auth: Load storageState from tests/data/auth/saucelabs.json using test.use() at the top.

Output: only the spec file content.
```

---

## Changelog

| Version | Date       | Change |
|---------|------------|--------|
| 1.0     | 2026-10-26 | Initial prompt for UI test generation |
