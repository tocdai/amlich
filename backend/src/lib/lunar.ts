import { Lunar, Solar } from 'lunar-javascript';

export interface LunarDate {
    day: number;
    month: number;
    year: number;
    leap: boolean;
    yearInGanZhi?: string;
    monthInGanZhi?: string;
    dayInGanZhi?: string;
}

export const getLunarDate = (date: Date): LunarDate => {
    const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const lunar = solar.getLunar();

    return {
        day: lunar.getDay(),
        month: Math.abs(lunar.getMonth()),
        year: lunar.getYear(),
        leap: lunar.getMonth() < 0,
        yearInGanZhi: lunar.getYearInGanZhi(),
        monthInGanZhi: lunar.getMonthInGanZhi(),
        dayInGanZhi: lunar.getDayInGanZhi(),
    };
};

export const getLunarRange = (start: Date, end: Date): Record<string, LunarDate> => {
    const results: Record<string, LunarDate> = {};
    const curr = new Date(start);
    // Ensure we start at 00:00:00
    curr.setHours(0, 0, 0, 0);
    const stop = new Date(end);
    stop.setHours(23, 59, 59, 999);

    while (curr <= stop) {
        const dateStr = curr.toISOString().split('T')[0];
        results[dateStr] = getLunarDate(new Date(curr));
        curr.setDate(curr.getDate() + 1);
    }
    return results;
};
