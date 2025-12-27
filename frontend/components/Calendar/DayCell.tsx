import React from 'react';
import classNames from 'classnames';
import { LunarDate } from '@/lib/lunar';
import { isToday, isSameMonth } from 'date-fns';
import { CalendarEvent } from '@/types/event';

interface DayCellProps {
    date: Date;
    currentMonth: Date;
    events?: CalendarEvent[];
    onClick?: (date: Date) => void;
    lunar?: LunarDate;
}

export const DayCell: React.FC<DayCellProps> = ({ date, currentMonth, events = [], onClick, lunar }) => {
    const isCurrentMonth = isSameMonth(date, currentMonth);
    const isTodayDate = isToday(date);

    return (
        <div
            className={classNames('day-cell', {
                'day-cell--current-month': isCurrentMonth,
                'day-cell--other-month': !isCurrentMonth,
                'day-cell--today': isTodayDate,
            })}
            onClick={() => onClick?.(date)}
        >
            <div className="day-cell__header">
                <span className="day-cell__solar">{date.getDate()}</span>
                {lunar && (
                    <span className="day-cell__lunar">
                        {lunar.day}/{lunar.month}{lunar.leap ? 'L' : ''}
                    </span>
                )}
            </div>
            <div className="day-cell__events">
                {events.map(event => (
                    <div key={event.id} className="event-item">
                        {event.title}
                    </div>
                ))}
            </div>
        </div>
    );
};
