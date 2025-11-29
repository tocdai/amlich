import { test as base, Page } from '@playwright/test';

/**
 * Page object model for the Calendar application
 */
export class CalendarPage {
    constructor(public readonly page: Page) { }

    // Navigation methods
    async goto() {
        await this.page.goto('/', { waitUntil: 'networkidle' });
        // Wait for the calendar to be fully loaded with a longer timeout
        await this.page.locator('.calendar-grid').waitFor({ state: 'visible', timeout: 15000 });
        // Also wait for at least one day cell to ensure content is loaded
        await this.page.locator('.day-cell').first().waitFor({ state: 'visible', timeout: 5000 });
    }

    async clickNextMonth() {
        await this.page.getByRole('button').filter({ hasText: '>' }).click();
        await this.page.waitForTimeout(500); // Wait for calendar to update
    }

    async clickPrevMonth() {
        await this.page.getByRole('button').filter({ hasText: '<' }).click();
        await this.page.waitForTimeout(500); // Wait for calendar to update
    }

    async clickToday() {
        await this.page.getByRole('button', { name: 'Today' }).click();
        await this.page.waitForTimeout(500); // Wait for calendar to update
    }

    // Event modal methods
    async clickDate(date: number) {
        // Click on the date in the calendar grid - target the solar date number
        await this.page.locator('.day-cell__solar').filter({ hasText: new RegExp(`^${date}$`) }).first().click();
    }

    async fillEventTitle(title: string) {
        // The label is not associated with the input, so we need to find the input directly
        await this.page.locator('.modal-content input[type="text"]').first().fill(title);
    }

    async saveEvent() {
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    async closeModal() {
        await this.page.getByRole('button', { name: 'Cancel' }).click();
    }

    // Theme methods
    async toggleDarkMode() {
        // The theme button has a title attribute - use that for more reliable selection
        const themeButton = this.page.locator('button[title*="theme" i]');
        await themeButton.click();
    }

    async getThemeButtonText(): Promise<string> {
        const themeButton = this.page.locator('button[title*="theme" i]');
        return await themeButton.textContent() || '';
    }

    async isDarkMode(): Promise<boolean> {
        const html = this.page.locator('html');
        const theme = await html.getAttribute('data-theme');
        return theme === 'dark';
    }

    // Getters
    async getMonthYearText(): Promise<string> {
        return await this.page.locator('h1').textContent() || '';
    }

    async hasEvent(title: string): Promise<boolean> {
        return await this.page.locator('.event-item').filter({ hasText: title }).isVisible().catch(() => false);
    }
}

/**
 * Extended test with CalendarPage fixture
 */
export const test = base.extend<{ calendarPage: CalendarPage }>({
    calendarPage: async ({ page }, use) => {
        const calendarPage = new CalendarPage(page);
        await calendarPage.goto();
        await use(calendarPage);
    },
});

export { expect } from '@playwright/test';
