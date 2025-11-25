'use client';

import React, { useState } from 'react';
import { addMonths, subMonths } from 'date-fns';
import { Header } from '@/components/Calendar/Header';
import { CalendarGrid } from '@/components/Calendar/CalendarGrid';
import { useEvents } from '@/hooks/useEvents';
import { EventModal } from '@/components/EventModal';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { addEvent, getEventsForDate } = useEvents();

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <main className="main-container">
      <Header
        currentDate={currentDate}
        onNextMonth={nextMonth}
        onPrevMonth={prevMonth}
        onToday={goToToday}
      />
      <CalendarGrid
        currentDate={currentDate}
        getEventsForDate={getEventsForDate}
        onDateClick={handleDateClick}
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addEvent}
        selectedDate={selectedDate}
      />
    </main>
  );
}
