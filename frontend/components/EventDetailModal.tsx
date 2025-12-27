import React, { useState } from 'react';
import { CalendarEvent } from '@/types/event';
import { format } from 'date-fns';

interface EventDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: CalendarEvent | null;
    eventDate: Date; // The specific date instance being viewed
    onEdit: (scope?: 'this-only' | 'this-and-future') => void;
    onDelete: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
    isOpen,
    onClose,
    event,
    eventDate,
    onEdit,
    onDelete,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditOptions, setShowEditOptions] = useState(false);

    if (!isOpen || !event) return null;

    const handleDelete = () => {
        onDelete();
        setShowDeleteConfirm(false);
        onClose();
    };

    const handleEdit = (scope?: 'this-only' | 'this-and-future') => {
        onEdit(scope);
        setShowEditOptions(false);
    };

    const isRecurringEvent = event.isRecurring && !event.originalEventId;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-detail" onClick={(e) => e.stopPropagation()}>
                <h2>Event Details</h2>

                <div className="event-detail-info">
                    <div className="detail-row">
                        <strong>Title:</strong>
                        <span>{event.title}</span>
                    </div>

                    <div className="detail-row">
                        <strong>Date:</strong>
                        <span>{format(eventDate, 'MMMM d, yyyy')}</span>
                    </div>

                    {event.description && (
                        <div className="detail-row">
                            <strong>Description:</strong>
                            <span>{event.description}</span>
                        </div>
                    )}

                    {isRecurringEvent && (
                        <>
                            <div className="detail-row">
                                <strong>Recurrence:</strong>
                                <span>
                                    {event.recurringPattern?.frequency &&
                                        event.recurringPattern.frequency.charAt(0).toUpperCase() +
                                        event.recurringPattern.frequency.slice(1)}
                                    {' '}({event.recurringPattern?.calendarType})
                                </span>
                            </div>

                            {event.recurringPattern?.calendarType === 'lunar' && event.lunarDetails && (
                                <div className="detail-row">
                                    <strong>Lunar Date:</strong>
                                    <span>
                                        Day {event.lunarDetails.day}, Month {event.lunarDetails.month}
                                        {event.lunarDetails.year && `, Year ${event.lunarDetails.year}`}
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    {event.originalEventId && (
                        <div className="detail-row">
                            <span className="exception-badge">Modified Instance</span>
                        </div>
                    )}
                </div>

                {showDeleteConfirm ? (
                    <div className="confirmation-dialog">
                        <p>Are you sure you want to delete this event?</p>
                        <div className="modal-actions">
                            <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                                Cancel
                            </button>
                            <button type="button" className="btn-danger" onClick={handleDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                ) : showEditOptions && isRecurringEvent ? (
                    <div className="edit-options-dialog">
                        <p>How would you like to edit this recurring event?</p>
                        <div className="modal-actions">
                            <button type="button" onClick={() => setShowEditOptions(false)}>
                                Cancel
                            </button>
                            <button type="button" onClick={() => handleEdit('this-only')}>
                                This event only
                            </button>
                            <button type="button" onClick={() => handleEdit('this-and-future')}>
                                This and all future events
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="event-detail-actions">
                        <button type="button" onClick={onClose}>
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => isRecurringEvent ? setShowEditOptions(true) : handleEdit()}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="btn-danger"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
