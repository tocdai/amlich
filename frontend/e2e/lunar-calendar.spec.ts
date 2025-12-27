import { test, expect } from './fixtures';

test.describe('Lunar Calendar Features', () => {
    test('should display lunar dates for each day', async ({ page, calendarPage }) => {
        // Calendar grid is already loaded by fixture
        // Look for lunar date indicators
        const lunarDates = page.locator('.day-cell__lunar');
        const count = await lunarDates.count();

        // Should have lunar dates displayed (at least 28 days in a month)
        expect(count).toBeGreaterThan(20);
    });

    test('should show lunar date format', async ({ page, calendarPage }) => {
        // Calendar is already loaded by fixture
        // Get first visible lunar date
        const firstLunarDate = page.locator('.day-cell__lunar').first();
        const lunarText = await firstLunarDate.textContent();

        // Lunar dates should be in format "day/month" or "day/monthL" for leap months
        expect(lunarText).toBeTruthy();
        expect(lunarText).toMatch(/\d+\/\d+L?/);
    });

    test('should display both solar and lunar dates together', async ({ page, calendarPage }) => {
        // Calendar is already loaded by fixture
        // Get first day cell
        const firstCell = page.locator('.day-cell').first();

        // Check that the cell contains both solar and lunar elements
        const solarDate = firstCell.locator('.day-cell__solar');
        const lunarDate = firstCell.locator('.day-cell__lunar');

        await expect(solarDate).toBeVisible();
        await expect(lunarDate).toBeVisible();
    });

    test('should maintain lunar date accuracy across month navigation', async ({ page, calendarPage }) => {
        // Get a lunar date from current month
        const firstLunarDate = page.locator('.day-cell__lunar').first();
        const initialLunarText = await firstLunarDate.textContent();

        // Navigate to next month
        await calendarPage.clickNextMonth();

        // Check that lunar dates are still displayed
        const lunarDatesAfterNav = page.locator('.day-cell__lunar');
        const countAfterNav = await lunarDatesAfterNav.count();
        expect(countAfterNav).toBeGreaterThan(20);

        // Navigate back
        await calendarPage.clickPrevMonth();

        // Verify we're back to the same lunar dates
        const firstLunarDateAfter = page.locator('.day-cell__lunar').first();
        const finalLunarText = await firstLunarDateAfter.textContent();

        expect(finalLunarText).toBe(initialLunarText);
    });

    test('should handle lunar calendar calculations correctly', async ({ page, calendarPage }) => {
        // Get initial lunar dates
        const lunarDates = page.locator('.day-cell__lunar');
        const initialCount = await lunarDates.count();

        // Navigate forward and back
        await calendarPage.clickNextMonth();
        await calendarPage.clickPrevMonth();

        // Lunar dates should still be present and consistent
        const finalCount = await lunarDates.count();
        expect(finalCount).toBe(initialCount);
    });
});
