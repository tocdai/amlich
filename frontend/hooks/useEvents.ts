import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/event';
import { isSameDay } from 'date-fns';
import { getLunarDate, LunarDate } from '@/lib/lunar';

const STORAGE_KEY = 'amlich_events';

export const useEvents = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events');
            if (response.ok) {
                const data = await response.json();
                const restored = data.map((e: any) => ({
                    ...e,
                    startDate: new Date(e.startDate),
                    endDate: e.endDate ? new Date(e.endDate) : undefined
                }));
                setEvents(restored);
            }
        } catch (e) {
            console.error("Failed to fetch events", e);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const addEvent = async (event: CalendarEvent) => {
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
            if (response.ok) {
                fetchEvents();
            }
        } catch (e) {
            console.error("Failed to add event", e);
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchEvents();
            }
        } catch (e) {
            console.error("Failed to delete event", e);
        }
    };

    const getEventsForDate = (date: Date, lunarDate?: LunarDate) => {
        return events.filter(event => {
            if (!event.isRecurring) {
                return isSameDay(new Date(event.startDate), date);
            }

            if (event.recurringPattern?.calendarType === 'solar') {
                if (event.recurringPattern.frequency === 'monthly') {
                    return new Date(event.startDate).getDate() === date.getDate();
                }
            } else if (event.recurringPattern?.calendarType === 'lunar' && lunarDate) {
                const eventLunar = event.lunarDetails;
                if (event.recurringPattern.frequency === 'monthly' && eventLunar) {
                    return lunarDate.day === eventLunar.day;
                }
            }

            return false;
        });
    };

    return { events, addEvent, deleteEvent, getEventsForDate };
};
