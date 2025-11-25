import { getLunarDate, formatLunarDate } from './lib/lunar';

// Test Case: May 23, 2020 (Solar) -> April 1, 2020 (Lunar Leap)
// 2020 is a leap year in Lunar calendar with a leap 4th month.
// The first 4th month starts on April 23, 2020.
// The second (leap) 4th month starts on May 23, 2020.

const testDate = new Date(2020, 4, 23); // Month is 0-indexed in JS Date, so 4 is May
const lunar = getLunarDate(testDate);

console.log(`Solar: ${testDate.toDateString()}`);
console.log(`Lunar: ${formatLunarDate(lunar)}`);
console.log(`Expected: 1/4 (Leap)/2020`);

if (lunar.day === 1 && lunar.month === 4 && lunar.year === 2020) {
    console.log("Basic date conversion: PASS");
} else {
    console.error("Basic date conversion: FAIL");
}

// Check leap flag
// Note: We need to verify how lunar-javascript reports leap months.
// If my assumption in lib/lunar.ts (month < 0) was wrong, this will help debug.
console.log(`Leap status: ${lunar.leap}`);
