# v3 — POM / Component Creation Prompt

**Version:** 3.0  
**Use for:** Generating a new Page Object or component class  
**Template:** [templates/ui-test-template.md](templates/ui-test-template.md)

---

## Prompt — Full Page POM

```
Generate a Playwright Page Object Model for the framework at https://github.com/Pavan098/PlaywrightAutomation.

Read .github/copilot-instructions.md before generating.

Page URL: <URL>
File: Pages/<PageName>.js

The page has these interactive elements:
- <element description and selector hint>
- <element description and selector hint>

Actions needed:
- <action name>: <what it does>
- <action name>: <what it does>

Rules:
- Extend BasePage (require('./BasePage'))
- All locators declared in constructor only
- Use getByRole/getByLabel/getByText locators first
- Each method = one user action, returns nothing unless fetching data
- waitForURL() after navigation actions
- waitFor({ state: 'visible' }) before count() calls
- Export with module.exports = <ClassName>

Output: only the POM file content.
```

---

## Prompt — Reusable Component

```
Generate a Playwright component class for the framework at https://github.com/Pavan098/PlaywrightAutomation.

File: Pages/components/<ComponentName>.js

This component appears on multiple pages: <page1>, <page2>.

It contains:
- <element and purpose>
- <element and purpose>

Actions:
- <action>: <what it does>

Rules:
- Do NOT extend BasePage — components are standalone
- Constructor receives page and optional selectors object for customisation
- All locators in constructor
- Use getByRole/getByLabel/getByText in priority order
- Export with module.exports = <ClassName>

Output: only the component file content.
```

---

## Changelog

| Version | Date       | Change |
|---------|------------|--------|
| 3.0     | 2026-10-26 | Added component variant prompt |
| 2.0     | 2026-10-10 | Added locator priority rules |
| 1.0     | 2026-09-15 | Initial POM prompt |
