// ─── TODOMVC PAGE OBJECT MODEL ────────────────────────────────────────────────
// Covers: https://todomvc.com/examples/react/dist/
// ─────────────────────────────────────────────────────────────────────────────

const BasePage = require('./BasePage');

class TodoMVCPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = 'https://todomvc.com/examples/react/dist/';

        this.newTodoInput    = page.locator('.new-todo');
        this.todoItems       = page.locator('.todo-list li');
        this.toggleAllBtn    = page.locator('#toggle-all');
        this.clearCompleted  = page.locator('.clear-completed');
        this.itemsLeftLabel  = page.locator('.todo-count');
        this.filterAll       = page.getByRole('link', { name: 'All' });
        this.filterActive    = page.getByRole('link', { name: 'Active' });
        this.filterCompleted = page.getByRole('link', { name: 'Completed' });
    }

    async goto() {
        await super.goto(this.url);
    }

    // ── Add todos ─────────────────────────────────────────────────────────────
    async addTodo(text) {
        await this.newTodoInput.fill(text);
        await this.newTodoInput.press('Enter');
    }

    async addMultipleTodos(texts) {
        for (const text of texts) await this.addTodo(text);
    }

    // ── Read ──────────────────────────────────────────────────────────────────
    async getTodoCount() {
        return await this.todoItems.count();
    }

    async getTodoTexts() {
        return await this.getAllTexts(this.todoItems.locator('label'));
    }

    async getItemsLeftCount() {
        const text = await this.getText(this.itemsLeftLabel);
        const match = text.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    }

    async isTodoCompleted(index) {
        return await this.todoItems.nth(index).locator('.toggle').isChecked();
    }

    // ── Complete / Uncheck ────────────────────────────────────────────────────
    async completeTodoByText(text) {
        const item = this.todoItems.filter({ hasText: text });
        await item.locator('.toggle').click();
    }

    async completeTodo(index) {
        await this.todoItems.nth(index).locator('.toggle').click();
    }

    async completeAllTodos() {
        await this.toggleAllBtn.click();
    }

    async uncheckTodo(index) {
        await this.todoItems.nth(index).locator('.toggle').click();
    }

    // ── Delete ────────────────────────────────────────────────────────────────
    async deleteTodo(index) {
        const item = this.todoItems.nth(index);
        await item.hover();
        await item.locator('.destroy').click();
    }

    // ── Edit ─────────────────────────────────────────────────────────────────
    async editTodo(index, newText) {
        await this.todoItems.nth(index).locator('label').dblclick();
        const editInput = this.todoItems.nth(index).locator('.edit');
        await editInput.clear();
        await editInput.fill(newText);
        await editInput.press('Enter');
    }

    async cancelEditTodo(index) {
        await this.todoItems.nth(index).locator('label').dblclick();
        await this.todoItems.nth(index).locator('.edit').press('Escape');
    }

    // ── Filters ───────────────────────────────────────────────────────────────
    async filterByAll()       { await this.filterAll.click(); }
    async filterByActive()    { await this.filterActive.click(); }
    async filterByCompleted() { await this.filterCompleted.click(); }

    // ── Clear ─────────────────────────────────────────────────────────────────
    async clearCompletedTodos() {
        await this.clearCompleted.click();
    }
}

module.exports = TodoMVCPage;
