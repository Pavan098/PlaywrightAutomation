// ─── FLIPKART PAGE OBJECT MODEL ───────────────────────────────────────────────
// Covers: https://www.flipkart.com/
// Note: Flipkart shows a login modal on every fresh visit that must be
// dismissed before interacting with the page. dismissModal() handles this.
// ─────────────────────────────────────────────────────────────────────────────

const BasePage = require('./BasePage');

class FlipkartPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = 'https://www.flipkart.com/';

        this.searchBox  = page.locator('input[name="q"], input[type="text"]').first();
        this.loginBtn   = page.getByLabel('Login');
        this.moreLink   = page.getByRole('link', { name: 'More', exact: true });
        this.flipkartLogo = page.getByLabel('Flipkart');
    }

    // ── Navigation ────────────────────────────────────────────────────────────
    async goto() {
        await this.page.goto(this.url);
        await this.dismissModal();
    }

    // ── Modal dismissal ───────────────────────────────────────────────────────
    // Flipkart shows a login promo modal on every page load.
    // Strategy: find and click the ✕ close button via DOM walk,
    //           then force-hide any remaining overlay with CSS.
    async dismissModal() {
        await this.page.waitForTimeout(1500);

        // Walk text nodes to find the ✕ close button
        const dismissed = await this.page.evaluate(() => {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            let node;
            while ((node = walker.nextNode())) {
                const txt = node.textContent.trim();
                if (txt === '✕' || txt === '×') {
                    const el = node.parentElement;
                    if (el && el.offsetParent !== null) { el.click(); return true; }
                }
            }
            return false;
        });

        if (!dismissed) await this.page.keyboard.press('Escape');

        // Force-hide any leftover overlay (belt and suspenders)
        await this.page.evaluate(() => {
            document.querySelectorAll('[class*="mcO4kT"],[class*="Overlay"],[class*="modal__"]')
                .forEach(el => { if (el.offsetParent !== null) el.style.display = 'none'; });
        });

        await this.page.waitForTimeout(300);
    }

    // ── Actions ───────────────────────────────────────────────────────────────
    async search(query) {
        await this.searchBox.fill(query);
        await this.searchBox.press('Enter');
        await this.page.waitForURL(/q=/i, { timeout: 10000 });
    }

    async hoverLogin() {
        await this.loginBtn.scrollIntoViewIfNeeded();
        await this.loginBtn.hover();
        await this.page.waitForTimeout(800);
    }

    async hoverMore() {
        await this.moreLink.hover();
        await this.page.waitForTimeout(400);
    }

    // ── Assertions helpers ───────────────────────────────────────────────────
    async isOnSearchResultsPage() {
        return this.page.url().includes('q=');
    }
}

module.exports = FlipkartPage;
