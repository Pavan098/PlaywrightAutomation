// ─── BASE PAGE ────────────────────────────────────────────────────────────────
// All POM classes extend this. Common utilities live here once — not repeated
// in every page class. Principle: DRY (Don't Repeat Yourself).
// ─────────────────────────────────────────────────────────────────────────────

class BasePage {
    constructor(page) {
        this.page = page;
    }

    // ── Navigation ────────────────────────────────────────────────────────────
    async goto(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getTitle() {
        return await this.page.title();
    }

    async getCurrentUrl() {
        return this.page.url();
    }

    // ── Waiting ───────────────────────────────────────────────────────────────
    async waitForVisible(locator, timeout = 10000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async waitForHidden(locator, timeout = 10000) {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    // ── Visibility check (returns boolean, never throws) ──────────────────────
    async isVisible(locator, timeout = 5000) {
        try {
            await locator.waitFor({ state: 'visible', timeout });
            return true;
        } catch {
            return false;
        }
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    async scrollTo(locator) {
        await locator.scrollIntoViewIfNeeded();
    }

    // Retries click if element is temporarily stale or covered
    async clickWithRetry(locator, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                await locator.click();
                return;
            } catch (e) {
                if (i === retries - 1) throw e;
                await this.page.waitForTimeout(800);
            }
        }
    }

    // ── Text ──────────────────────────────────────────────────────────────────
    async getText(locator) {
        await this.waitForVisible(locator);
        return (await locator.textContent()).trim();
    }

    async getAllTexts(locator) {
        return (await locator.allTextContents()).map(t => t.trim());
    }

    // ── Screenshot ────────────────────────────────────────────────────────────
    async takeScreenshot(name = 'screenshot') {
        await this.page.screenshot({ path: `test-results/${name}-${Date.now()}.png` });
    }
}

module.exports = BasePage;
