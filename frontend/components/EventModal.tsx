import React, { useState } from 'react';
import { CalendarEvent, Frequency, CalendarType } from '@/types/event';
import { getLunarDate } from '@/lib/lunar';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: CalendarEvent) => void;
    selectedDate: Date;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<Frequency>('monthly');
    const [calendarType, setCalendarType] = useState<CalendarType>('solar');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent: CalendarEvent = {
            id: crypto.randomUUID(),
            title,
            startDate: selectedDate,
            allDay: true,
            isRecurring,
            recurringPattern: isRecurring ? {
                frequency,
                calendarType,
                interval: 1
            } : undefined,
            lunarDetails: isRecurring && calendarType === 'lunar' ? getLunarDate(selectedDate) : undefined
        };

        onSave(newEvent);
        onClose();
        setTitle('');
        setIsRecurring(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add Event</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={isRecurring}
                                onChange={e => setIsRecurring(e.target.checked)}
                            />
                            Recurring Event
                        </label>
                    </div>

                    {isRecurring && (
                        <div className="recurring-options">
                            <div className="form-group">
                                <label>Type</label>
                                <select value={calendarType} onChange={e => setCalendarType(e.target.value as CalendarType)}>
                                    <option value="solar">Solar</option>
                                    <option value="lunar">Lunar</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Frequency</label>
                                <select value={frequency} onChange={e => setFrequency(e.target.value as Frequency)}>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
