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

export const getSolarDate = (lunarDay: number, lunarMonth: number, lunarYear: number, isLeap: boolean = false): Date => {
    // Note: lunar-javascript might handle leap months via specific methods
    const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay);
    // TODO: Handle leap month input correctly if library requires it
    const solar = lunar.getSolar();
    return new Date(solar.getYear(), solar.getMonth() - 1, solar.getDay());
};

export const formatLunarDate = (lunar: LunarDate): string => {
    return `${lunar.day}/${lunar.month}${lunar.leap ? ' (Leap)' : ''}/${lunar.year}`;
};
