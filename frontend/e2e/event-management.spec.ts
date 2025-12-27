import { test, expect } from './fixtures';

test.describe('Event Management', () => {
    test('should open event modal when clicking a date', async ({ page, calendarPage }) => {
        // Click on a date (e.g., 15th)
        await calendarPage.clickDate(15);

        // Check that modal is visible
        const modal = page.locator('.modal-overlay');
        await expect(modal).toBeVisible();
    });

    test('should close event modal when clicking close button', async ({ page, calendarPage }) => {
        // Open modal
        await calendarPage.clickDate(15);

        // Close modal
        await calendarPage.closeModal();

        // Check that modal is not visible
        const modal = page.locator('.modal-overlay');
        await expect(modal).not.toBeVisible();
    });

    test('should create a new event', async ({ page, calendarPage }) => {
        const eventTitle = 'Team Meeting';

        // Open modal by clicking a date
        await calendarPage.clickDate(20);

        // Fill in event details (only title is required in the actual modal)
        await calendarPage.fillEventTitle(eventTitle);

        // Save event
        await calendarPage.saveEvent();

        // Wait for modal to close
        const modal = page.locator('.modal-overlay');
        await expect(modal).not.toBeVisible();

        // Verify event appears on the calendar
        const hasEvent = await calendarPage.hasEvent(eventTitle);
        expect(hasEvent).toBeTruthy();
    });

    test('should persist events after page reload', async ({ page, calendarPage }) => {
        const eventTitle = 'Persistent Event Test';

        // Create an event
        await calendarPage.clickDate(25);
        await calendarPage.fillEventTitle(eventTitle);
        await calendarPage.saveEvent();

        // Reload the page
        await page.reload();

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Verify event still exists
        const hasEvent = await calendarPage.hasEvent(eventTitle);
        expect(hasEvent).toBeTruthy();
    });

    test('should allow creating multiple events on the same date', async ({ page, calendarPage }) => {
        const date = 18;

        // Create first event
        await calendarPage.clickDate(date);
        await calendarPage.fillEventTitle('Morning Event');
        await calendarPage.saveEvent();

        // Wait a bit for the modal to close
        await page.waitForTimeout(500);

        // Create second event
        await calendarPage.clickDate(date);
        await calendarPage.fillEventTitle('Afternoon Event');
        await calendarPage.saveEvent();

        // Verify both events exist
        const hasMorningEvent = await calendarPage.hasEvent('Morning Event');
        const hasAfternoonEvent = await calendarPage.hasEvent('Afternoon Event');

        expect(hasMorningEvent).toBeTruthy();
        expect(hasAfternoonEvent).toBeTruthy();
    });

    test('should not save event with empty title', async ({ page, calendarPage }) => {
        // Open modal
        await calendarPage.clickDate(10);

        // Try to save without filling title (just click save)
        await calendarPage.saveEvent();

        // Modal should still be visible (validation failed due to required field)
        const modal = page.locator('.modal-overlay');
        await expect(modal).toBeVisible();
    });
});
