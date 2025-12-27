import { test, expect } from './fixtures';

test.describe('Calendar Navigation', () => {
    test('should display the current month and year on initial load', async ({ calendarPage }) => {
        const monthYear = await calendarPage.getMonthYearText();
        expect(monthYear).toBeTruthy();
        expect(monthYear).toMatch(/\w+\s+\d{4}/); // e.g., "November 2025"
    });

    test('should navigate to next month', async ({ calendarPage }) => {
        const initialMonthYear = await calendarPage.getMonthYearText();
        await calendarPage.clickNextMonth();

        const newMonthYear = await calendarPage.getMonthYearText();
        expect(newMonthYear).not.toBe(initialMonthYear);
    });

    test('should navigate to previous month', async ({ calendarPage }) => {
        const initialMonthYear = await calendarPage.getMonthYearText();
        await calendarPage.clickPrevMonth();

        const newMonthYear = await calendarPage.getMonthYearText();
        expect(newMonthYear).not.toBe(initialMonthYear);
    });

    test('should return to current month when clicking Today button', async ({ calendarPage }) => {
        // Get current month/year
        const currentMonthYear = await calendarPage.getMonthYearText();

        // Navigate away
        await calendarPage.clickNextMonth();
        await calendarPage.clickNextMonth();

        // Verify we're on a different month
        const differentMonthYear = await calendarPage.getMonthYearText();
        expect(differentMonthYear).not.toBe(currentMonthYear);

        // Click Today button
        await calendarPage.clickToday();

        // Verify we're back to current month
        const backToCurrentMonthYear = await calendarPage.getMonthYearText();
        expect(backToCurrentMonthYear).toBe(currentMonthYear);
    });

    test('should navigate forward and backward multiple months', async ({ calendarPage }) => {
        const initialMonthYear = await calendarPage.getMonthYearText();

        // Navigate forward 3 months
        await calendarPage.clickNextMonth();
        await calendarPage.clickNextMonth();
        await calendarPage.clickNextMonth();

        const forwardMonthYear = await calendarPage.getMonthYearText();
        expect(forwardMonthYear).not.toBe(initialMonthYear);

        // Navigate back 3 months
        await calendarPage.clickPrevMonth();
        await calendarPage.clickPrevMonth();
        await calendarPage.clickPrevMonth();

        const backMonthYear = await calendarPage.getMonthYearText();
        expect(backMonthYear).toBe(initialMonthYear);
    });

    test('should display calendar grid with dates', async ({ page, calendarPage }) => {
        // Calendar grid should already be loaded by fixture
        const calendarGrid = page.locator('.calendar-grid');
        await expect(calendarGrid).toBeVisible();

        // Check that there are date cells (should be at least 28 for a month)
        const dateCells = page.locator('.day-cell');
        const count = await dateCells.count();
        expect(count).toBeGreaterThan(20);
    });
});
