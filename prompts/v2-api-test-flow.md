# v2 — API Test Flow Prompt

**Version:** 2.0  
**Use for:** Generating API spec files with schema validation  
**Template:** [templates/api-test-template.md](templates/api-test-template.md)

---

## Prompt

```
You are generating a Playwright API test for the framework at https://github.com/Pavan098/PlaywrightAutomation.

Read .github/copilot-instructions.md for all coding rules before generating.

Task: Write an API test file at tests/api/<FILENAME>.spec.js for the <SERVICE_NAME> API.

Base URL: <BASE_URL>

Also create the schema file at tests/api/schemas/<RESOURCE>Schema.js.

Cover these endpoints:
- <METHOD> <PATH> — <description> — @smoke or @regression
- <METHOD> <PATH> — <description> — negative case (4xx)

Rules (must follow):
1. Use Playwright request fixture — no axios or fetch
2. In test.beforeAll: POST /auth/login, store token
3. Load credentials from tests/data/users.json — never hardcode
4. Move large payloads to tests/data/ and require() them
5. Call assertSchema(body, schema, label) before any field assertion
6. Assert response.ok() and response.status() on every response
7. Tag every test with @api plus @smoke or @regression

Output: the spec file and the schema file. No explanation.
```

---

## Changelog

| Version | Date       | Change |
|---------|------------|--------|
| 2.0     | 2026-10-26 | Added schema validation requirement, data file rule |
| 1.0     | 2026-10-01 | Initial API test prompt |
