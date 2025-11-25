export type CalendarType = 'solar' | 'lunar';
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringPattern {
    frequency: Frequency;
    calendarType: CalendarType;
    interval: number; // e.g., 1 for every month, 2 for every other month
    // For weekly: days of week?
    // For monthly: day of month?
}

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: Date; // The start date (Solar)
    endDate?: Date;
    allDay: boolean;

    isRecurring: boolean;
    recurringPattern?: RecurringPattern;

    // For lunar recurring events, we might need to store the original lunar date
    lunarDetails?: {
        day: number;
        month: number;
        year?: number; // if yearly
    };
}
