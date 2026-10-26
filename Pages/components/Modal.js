/**
 * Modal — generic modal/dialog component.
 * Works for any site that renders a dialog with title, body, and action buttons.
 * Usage:
 *   const modal = new Modal(page);
 *   if (await modal.isVisible()) await modal.dismiss();
 *
 * Selectors are configurable so this works across different sites:
 *   new Modal(page, { root: '.my-modal', closeBtn: '.btn-close' })
 */
class Modal {
    constructor(page, selectors = {}) {
        this.page = page;
        const s = {
            root:      selectors.root      || '[role="dialog"], .modal, .popup',
            closeBtn:  selectors.closeBtn  || '[aria-label="Close"], .close, .modal-close',
            title:     selectors.title     || '.modal-title, [role="dialog"] h1, [role="dialog"] h2',
            body:      selectors.body      || '.modal-body, [role="dialog"] p',
            confirmBtn:selectors.confirmBtn|| '.btn-primary, .confirm, [data-action="confirm"]',
            cancelBtn: selectors.cancelBtn || '.btn-secondary, .cancel, [data-action="cancel"]',
        };
        this.root       = page.locator(s.root).first();
        this.closeBtn   = page.locator(s.closeBtn).first();
        this.title      = page.locator(s.title).first();
        this.body       = page.locator(s.body).first();
        this.confirmBtn = page.locator(s.confirmBtn).first();
        this.cancelBtn  = page.locator(s.cancelBtn).first();
    }

    async isVisible() {
        return await this.root.isVisible();
    }

    async waitForVisible() {
        await this.root.waitFor({ state: 'visible' });
    }

    async dismiss() {
        await this.closeBtn.click();
        await this.root.waitFor({ state: 'hidden' });
    }

    async confirm() {
        await this.confirmBtn.click();
        await this.root.waitFor({ state: 'hidden' });
    }

    async cancel() {
        await this.cancelBtn.click();
        await this.root.waitFor({ state: 'hidden' });
    }

    async getTitle() {
        return (await this.title.innerText()).trim();
    }

    async getBody() {
        return (await this.body.innerText()).trim();
    }
}

module.exports = Modal;
