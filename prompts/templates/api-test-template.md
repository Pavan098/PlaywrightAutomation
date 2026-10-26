# API Test Template

Use this template when asking AI to generate a new API spec file.

---

```
Generate a Playwright API test using the framework conventions in .github/copilot-instructions.md:

BASE URL: <https://api.example.com>
FILE:     tests/api/<resource-name>.spec.js
SCHEMA:   tests/api/schemas/<resource-name>Schema.js

ENDPOINTS TO TEST:
- POST /auth/login        → 200 success, 400 bad credentials
- GET  /resource          → 200 list, 401 unauthorized
- POST /resource          → 201 created, 400 validation error
- PUT  /resource/:id      → 200 updated, 404 not found
- DELETE /resource/:id    → 200 deleted, 404 not found

AUTH: Bearer token obtained in test.beforeAll via POST /auth/login

RULES:
- Use Playwright request fixture (no axios)
- assertSchema(body, schema, label) BEFORE any field assertions
- Store credentials in tests/data/users.json — never hardcode
- Store large payloads in tests/data/ — never hardcode inline
- assert response.ok() and response.status() before res.json()
- Tag every test with @api and @smoke or @regression
```
