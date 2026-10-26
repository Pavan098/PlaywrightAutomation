// ─── TODOMVC — POM-BASED TESTS ────────────────────────────────────────────────
// These are NEW tests not covered in todoMVC.spec.js:
//   ✅ Filter "Active" — shows only uncompleted todos
//   ✅ Filter "Completed" — shows only completed todos
//   ✅ Switch between All / Active / Completed filters
//   ✅ Items left count decrements on each completion
//   ✅ Clear completed removes ONLY done todos, keeps active ones
// ─────────────────────────────────────────────────────────────────────────────

const { test, expect } = require('@playwright/test');
const TodoMVCPage = require('../../Pages/TodoMVC');

const SAMPLE_TODOS = ['Buy groceries', 'Read a book', 'Write tests', 'Exercise'];

test.describe('TodoMVC — Filters & Counts @regression', () => {

    test.beforeEach(async ({ page }) => {
        const todo = new TodoMVCPage(page);
        await todo.goto();
        await todo.addMultipleTodos(SAMPLE_TODOS);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Filter "Active" shows only uncompleted todos @smoke', async ({ page }) => {
        const todo = new TodoMVCPage(page);

        // Complete two out of four
        await todo.completeTodoByText('Buy groceries');
        await todo.completeTodoByText('Exercise');

        await todo.filterByActive();

        const visibleTodos = await todo.getTodoTexts();
        expect(visibleTodos).toEqual(['Read a book', 'Write tests']);
        expect(visibleTodos).not.toContain('Buy groceries');
        expect(visibleTodos).not.toContain('Exercise');
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Filter "Completed" shows only completed todos @smoke', async ({ page }) => {
        const todo = new TodoMVCPage(page);

        await todo.completeTodoByText('Read a book');
        await todo.completeTodoByText('Write tests');

        await todo.filterByCompleted();

        const visibleTodos = await todo.getTodoTexts();
        expect(visibleTodos).toEqual(['Read a book', 'Write tests']);
        expect(visibleTodos).not.toContain('Buy groceries');
        expect(visibleTodos).not.toContain('Exercise');
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('Switching between All / Active / Completed filters shows correct counts @regression', async ({ page }) => {
        const todo = new TodoMVCPage(page);

        await todo.completeTodoByText('Buy groceries');  // 1 done, 3 active

        // All: 4 items total
        await todo.filterByAll();
        expect(await todo.getTodoCount()).toBe(4);

        // Active: 3 items
        await todo.filterByActive();
        expect(await todo.getTodoCount()).toBe(3);

        // Completed: 1 item
        await todo.filterByCompleted();
        expect(await todo.getTodoCount()).toBe(1);

        // Back to All: still 4
        await todo.filterByAll();
        expect(await todo.getTodoCount()).toBe(4);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('"Items left" count decrements as todos are completed @regression', async ({ page }) => {
        const todo = new TodoMVCPage(page);

        // Start: all 4 incomplete
        expect(await todo.getItemsLeftCount()).toBe(4);

        await todo.completeTodoByText('Buy groceries');
        expect(await todo.getItemsLeftCount()).toBe(3);

        await todo.completeTodoByText('Read a book');
        expect(await todo.getItemsLeftCount()).toBe(2);

        await todo.completeTodoByText('Write tests');
        expect(await todo.getItemsLeftCount()).toBe(1);

        await todo.completeTodoByText('Exercise');
        expect(await todo.getItemsLeftCount()).toBe(0);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('"Clear completed" removes only done todos, active ones remain @regression', async ({ page }) => {
        const todo = new TodoMVCPage(page);

        // Complete 2, leave 2 active
        await todo.completeTodoByText('Buy groceries');
        await todo.completeTodoByText('Exercise');

        await todo.clearCompletedTodos();

        const remaining = await todo.getTodoTexts();
        expect(remaining).toEqual(['Read a book', 'Write tests']);
        expect(remaining).not.toContain('Buy groceries');
        expect(remaining).not.toContain('Exercise');
        expect(await todo.getTodoCount()).toBe(2);
    });

    // ─────────────────────────────────────────────────────────────────────────
    test('"Items left" count re-increments when a completed todo is unchecked @regression', async ({ page }) => {
        const todo = new TodoMVCPage(page);

        await todo.completeTodoByText('Buy groceries');
        expect(await todo.getItemsLeftCount()).toBe(3);

        // Uncheck it — count should go back to 4
        await todo.completeTodoByText('Buy groceries');
        expect(await todo.getItemsLeftCount()).toBe(4);
    });
});
