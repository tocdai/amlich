import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/event';
import { isSameDay } from 'date-fns';
import { getLunarDate } from '@/lib/lunar';

const STORAGE_KEY = 'amlich_events';

export const useEvents = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Restore Date objects
                const restored = parsed.map((e: any) => ({
                    ...e,
                    startDate: new Date(e.startDate),
                    endDate: e.endDate ? new Date(e.endDate) : undefined
                }));
                setEvents(restored);
            } catch (e) {
                console.error("Failed to parse events", e);
            }
        }
    }, []);

    const saveEvents = (newEvents: CalendarEvent[]) => {
        setEvents(newEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    };

    const addEvent = (event: CalendarEvent) => {
        const newEvents = [...events, event];
        saveEvents(newEvents);
    };

    const deleteEvent = (id: string) => {
        const newEvents = events.filter(e => e.id !== id);
        saveEvents(newEvents);
    };

    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            if (!event.isRecurring) {
                return isSameDay(new Date(event.startDate), date);
            }

            // Recurring Logic
            if (event.recurringPattern?.calendarType === 'solar') {
                // Simple monthly recurring check for demo
                if (event.recurringPattern.frequency === 'monthly') {
                    return new Date(event.startDate).getDate() === date.getDate();
                }
            } else if (event.recurringPattern?.calendarType === 'lunar') {
                // Lunar recurring check
                const targetLunar = getLunarDate(date);
                const eventLunar = event.lunarDetails;

                if (event.recurringPattern.frequency === 'monthly' && eventLunar) {
                    // Check if day matches (e.g. 15th)
                    return targetLunar.day === eventLunar.day;
                }
            }

            return false;
        });
    };

    return { events, addEvent, deleteEvent, getEventsForDate };
};
