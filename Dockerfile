# ─── PLAYWRIGHT DOCKER IMAGE ──────────────────────────────────────────────────
# Base: Microsoft's official Playwright image
#   - Ubuntu Noble (24.04 LTS)
#   - Node.js 20
#   - Chromium, Firefox, WebKit pre-installed with all OS dependencies
#
# WHY THIS MATTERS:
#   Tests run in the exact same Linux environment as CI (GitHub Actions).
#   No more "works on my machine" — Windows, Mac, Linux all produce the same result.
#
# BUILD:
#   docker build -t playwright-tests .
#
# RUN (all tests):
#   docker run --rm --ipc=host playwright-tests
#
# RUN (smoke only):
#   docker run --rm --ipc=host playwright-tests npx playwright test --grep @smoke
#
# RUN (get HTML report back on host):
#   docker run --rm --ipc=host -v $(pwd)/playwright-report:/app/playwright-report playwright-tests
#
# GENERATE LINUX VISUAL BASELINES (fixes CI visual test mismatches):
#   docker run --rm --ipc=host \
#     -v $(pwd)/tests/visual.spec.js-snapshots:/app/tests/visual.spec.js-snapshots \
#     playwright-tests npx playwright test tests/visual.spec.js --update-snapshots
# ─────────────────────────────────────────────────────────────────────────────

FROM mcr.microsoft.com/playwright:v1.49.0-noble

# Set working directory inside container
WORKDIR /app

# ── Install dependencies ──────────────────────────────────────────────────────
# Copy package files FIRST — Docker caches this layer separately.
# If only test code changes (not package.json), this layer is reused → faster builds.
COPY package*.json ./
RUN npm ci

# ── Copy project files ────────────────────────────────────────────────────────
# .dockerignore excludes node_modules, reports, .env, .git
COPY . .

# ── Runtime config ────────────────────────────────────────────────────────────
# CI=true activates:
#   - 2 retries on failure
#   - 90s test timeout
#   - testIgnore for visual.spec.js (OS-specific baselines)
ENV CI=true

# ── Default command ───────────────────────────────────────────────────────────
# Override at runtime: docker run playwright-tests npx playwright test --grep @smoke
CMD ["npx", "playwright", "test"]
