import React from 'react';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addDays, format } from 'date-fns';
import { DayCell } from './DayCell';

import { CalendarEvent } from '@/types/event';

import { LunarDate } from '@/lib/lunar';

interface CalendarGridProps {
    currentDate: Date;
    getEventsForDate: (date: Date, lunar?: LunarDate) => CalendarEvent[];
    onDateClick: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, getEventsForDate, onDateClick }) => {
    const [lunarData, setLunarData] = React.useState<Record<string, LunarDate>>({});

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    React.useEffect(() => {
        const fetchLunar = async () => {
            const startStr = format(startDate, 'yyyy-MM-dd');
            const endStr = format(endDate, 'yyyy-MM-dd');
            try {
                const response = await fetch(`/api/lunar?start=${startStr}&end=${endStr}`);
                if (response.ok) {
                    const data = await response.json();
                    setLunarData(data);
                }
            } catch (err) {
                console.error("Failed to fetch lunar data", err);
            }
        };
        fetchLunar();
    }, [currentDate]);

    return (
        <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
                <div key={dayName} className="calendar-grid__header-cell">
                    {dayName}
                </div>
            ))}
            {calendarDays.map((date) => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const lunar = lunarData[dateKey];
                return (
                    <DayCell
                        key={date.toString()}
                        date={date}
                        currentMonth={currentDate}
                        events={getEventsForDate(date, lunar)}
                        onClick={onDateClick}
                        lunar={lunar}
                    />
                );
            })}
        </div>
    );
};
