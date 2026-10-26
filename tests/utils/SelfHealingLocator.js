// ─── AI SELF-HEALING LOCATOR ──────────────────────────────────────────────────
//
// CONCEPT: Tests break most often because a CSS selector changed in the UI,
// not because the feature itself is broken. Self-healing detects this and
// asks Claude to suggest alternative selectors automatically.
//
// FLOW:
//   1. Test tries its selector → FAILS (element not found / hidden)
//   2. Grab the page's HTML (truncated to stay within token limits)
//   3. Send to Claude: "This selector failed. Here's the HTML. Suggest 3 alternatives."
//   4. Try each suggestion until one works
//   5. Return the working locator so the test continues
//   6. Log the heal: "HEALED: .old-btn → [data-testid='submit']"
//
// REQUIREMENTS:
//   - npm install @anthropic-ai/sdk
//   - Set ANTHROPIC_API_KEY in .env or GitHub Secrets
//   - If no key is set, self-healing is silently disabled (test fails normally)
//
// ─────────────────────────────────────────────────────────────────────────────

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

class SelfHealingLocator {
    constructor(page, options = {}) {
        this.page = page;
        this.healLog = [];

        // Initialize Anthropic client only if API key exists
        const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
        if (apiKey) {
            this.client = new Anthropic({ apiKey });
            // Use Haiku — fastest and cheapest model, perfect for quick selector fixes
            this.model = options.model || 'claude-haiku-4-5-20251001';
        } else {
            this.client = null;
            console.warn('⚠️  ANTHROPIC_API_KEY not set — self-healing disabled. Tests will fail normally on broken selectors.');
        }
    }

    // ── Main method ───────────────────────────────────────────────────────────
    // selector    = the original CSS selector or role locator that's failing
    // description = human description of what the element is (e.g. "Login button")
    //               Used in the AI prompt to get better suggestions
    async locate(selector, description = '') {
        // Step 1: Try the original selector first
        const originalLocator = this.page.locator(selector);
        try {
            await originalLocator.waitFor({ state: 'visible', timeout: 5000 });
            return originalLocator;  // All good — return immediately
        } catch (originalError) {

            // No AI client — bail out immediately
            if (!this.client) throw originalError;

            console.log(`\n🔧 Self-healing triggered`);
            console.log(`   Broken selector  : "${selector}"`);
            console.log(`   Element described: "${description || 'not provided'}"`);
            console.log(`   Page URL         : ${this.page.url()}`);

            try {
                // Step 2: Grab visible DOM (body only, 10k chars to stay under token limit)
                const pageHtml = await this.page.evaluate(() =>
                    document.body.innerHTML.substring(0, 10000)
                );

                // Step 3: Ask Claude for alternative selectors
                const message = await this.client.messages.create({
                    model: this.model,
                    max_tokens: 300,
                    messages: [{
                        role: 'user',
                        content: `You are a Playwright test automation expert. A locator has failed.

FAILED SELECTOR: "${selector}"
ELEMENT DESCRIPTION: "${description || 'the element described by the selector above'}"
ERROR: ${originalError.message}

PAGE HTML (truncated):
${pageHtml}

Task: Suggest exactly 3 alternative CSS selectors that could find the same element in this HTML.
Rules:
- Return ONLY a JSON array of 3 strings — no markdown, no explanation
- Prefer stable attributes: data-testid, id, aria-label, name, type
- Avoid fragile selectors like nth-child or long class chains
- Each selector must be different

Example format: ["[data-testid='login']", "#login-button", "button[type='submit']"]`
                    }]
                });

                const rawResponse = message.content[0].text.trim();
                let suggestions;

                try {
                    suggestions = JSON.parse(rawResponse);
                } catch {
                    // Claude sometimes wraps JSON in backticks — strip them
                    const jsonMatch = rawResponse.match(/\[.*\]/s);
                    suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
                }

                if (!Array.isArray(suggestions) || suggestions.length === 0) {
                    throw new Error('AI returned no suggestions');
                }

                console.log(`   AI suggested     : ${suggestions.join(', ')}`);

                // Step 4: Try each AI suggestion
                for (const altSelector of suggestions) {
                    try {
                        const altLocator = this.page.locator(altSelector);
                        await altLocator.waitFor({ state: 'visible', timeout: 3000 });

                        // Step 5: Record the successful heal
                        const heal = {
                            original: selector,
                            healed: altSelector,
                            description,
                            url: this.page.url(),
                            timestamp: new Date().toISOString(),
                        };
                        this.healLog.push(heal);
                        console.log(`✅ Healed: "${selector}" → "${altSelector}"\n`);

                        return altLocator;
                    } catch {
                        // This suggestion didn't work — try next
                    }
                }

                // None of AI's suggestions worked
                console.error('❌ All AI suggestions failed — test will fail with original error\n');
                throw originalError;

            } catch (err) {
                // Rethrow original error if AI fails for any reason
                // (network issue, rate limit, bad JSON, etc.)
                if (err === originalError) throw err;
                console.error(`⚠️  AI healing error: ${err.message}`);
                throw originalError;
            }
        }
    }

    // ── Save heal log to disk ─────────────────────────────────────────────────
    // Called at end of each test (via fixture). Shows you which selectors
    // need to be updated in your test code after healing.
    async saveHealReport() {
        if (this.healLog.length === 0) return;

        const dir = path.join(process.cwd(), 'test-results');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const reportPath = path.join(dir, 'heal-report.json');
        const existing = fs.existsSync(reportPath)
            ? JSON.parse(fs.readFileSync(reportPath, 'utf-8'))
            : [];

        fs.writeFileSync(reportPath, JSON.stringify([...existing, ...this.healLog], null, 2));
        console.log(`\n📋 Heal report updated: ${reportPath}`);
        console.log('   ACTION NEEDED: Update these selectors in your tests to avoid future heals.');
    }

    getHealLog() { return this.healLog; }
}

module.exports = SelfHealingLocator;
