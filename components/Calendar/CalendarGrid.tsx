import React from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addDays } from 'date-fns';
import { DayCell } from './DayCell';

import { CalendarEvent } from '@/types/event';

interface CalendarGridProps {
    currentDate: Date;
    getEventsForDate: (date: Date) => CalendarEvent[];
    onDateClick: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, getEventsForDate, onDateClick }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    return (
        <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
                <div key={dayName} className="calendar-grid__header-cell">
                    {dayName}
                </div>
            ))}
            {calendarDays.map((date) => (
                <DayCell
                    key={date.toString()}
                    date={date}
                    currentMonth={currentDate}
                    events={getEventsForDate(date)}
                    onClick={onDateClick}
                />
            ))}
        </div>
    );
};
