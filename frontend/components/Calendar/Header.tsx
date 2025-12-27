import React from 'react';
import { format } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
    currentDate: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => {
    const { theme, toggleTheme } = useTheme();

    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return '☀️';
            case 'dark': return '🌙';
            case 'system': return '⚙️';
        }
    };

    return (
        <header className="calendar-header">
            <div className="calendar-header__title">
                <h1>{format(currentDate, 'MMMM yyyy')}</h1>
            </div>
            <div className="calendar-header__controls">
                <button onClick={toggleTheme} title={`Current theme: ${theme}`}>
                    {getThemeIcon()}
                </button>
                <button onClick={onPrevMonth}>&lt;</button>
                <button onClick={onToday}>Today</button>
                <button onClick={onNextMonth}>&gt;</button>
            </div>
        </header>
    );
};
