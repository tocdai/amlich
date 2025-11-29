import { test, expect } from './fixtures';

test.describe('Dark Mode', () => {
    test('should have theme toggle button', async ({ page, calendarPage }) => {
        // Find the theme toggle button by its title attribute (more reliable than emoji)
        const themeButton = page.locator('button[title*="theme" i]');
        await expect(themeButton).toBeVisible();

        // Button should have a title attribute
        const title = await themeButton.getAttribute('title');
        expect(title).toBeTruthy();
        expect(title).toMatch(/theme/i);

        // Button should have content (emoji)
        const content = await calendarPage.getThemeButtonText();
        expect(content.trim()).toBeTruthy();
    });

    test('should have clickable theme toggle button', async ({ page, calendarPage }) => {
        // Find the theme toggle button
        const themeButton = page.locator('button[title*="theme" i]');
        await expect(themeButton).toBeVisible();

        // Verify button is enabled and clickable
        await expect(themeButton).toBeEnabled();

        // Click should not throw an error
        await themeButton.click();

        // Button should still be visible after click
        await expect(themeButton).toBeVisible();
    });

    test('should persist theme preference after page reload', async ({ page, calendarPage }) => {
        // Toggle to a specific theme (not system)
        await calendarPage.toggleDarkMode();
        await page.waitForTimeout(1500);

        // Get theme before reload
        const html = page.locator('html');
        const themeBeforeReload = await html.getAttribute('data-theme');

        // Reload page
        await page.reload({ waitUntil: 'networkidle' });
        await page.locator('.calendar-grid').waitFor({ state: 'visible', timeout: 15000 });

        // Verify theme persisted
        const themeAfterReload = await html.getAttribute('data-theme');
        expect(themeAfterReload).toBe(themeBeforeReload);
    });

    test('should have theme attribute on HTML element', async ({ page, calendarPage }) => {
        // Check that html element exists
        const html = page.locator('html');
        await expect(html).toBeVisible();

        // Theme attribute should exist (can be null for system, or 'light'/'dark')
        const theme = await html.getAttribute('data-theme');
        // Theme can be null (system), 'light', or 'dark'
        expect(theme === null || theme === 'light' || theme === 'dark' || theme === 'system').toBe(true);
    });

    test('should maintain theme across navigation', async ({ page, calendarPage }) => {
        // Get initial theme
        const html = page.locator('html');
        const initialTheme = await html.getAttribute('data-theme');

        // Navigate to different months
        await calendarPage.clickNextMonth();

        const themeAfterNav1 = await html.getAttribute('data-theme');
        expect(themeAfterNav1).toBe(initialTheme);

        await calendarPage.clickPrevMonth();

        const themeAfterNav2 = await html.getAttribute('data-theme');
        expect(themeAfterNav2).toBe(initialTheme);
    });
});
