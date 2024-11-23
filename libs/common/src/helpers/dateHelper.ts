import {
  getTime,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subSeconds,
  subWeeks,
  subYears,
} from 'date-fns';

export function getAgoToSeconds(duration: string): number {
  const { value, unit } = getUnitAndNumberFromAgoRange(duration);
  switch (unit) {
    case 's': // Seconds
      return value;
    case 'm': // Minutes
      return value * 60;
    case 'h': // Hours
      return value * 60 * 60;
    case 'd': // Days
      return value * 24 * 60 * 60;
    case 'w': // Weeks
      return value * 7 * 24 * 60 * 60;
    case 'mn': // Months (approximate as 30 days)
      return value * 30 * 24 * 60 * 60;
    case 'y': // Years
      return value * 24 * 60 * 60 * 365;
    default:
      throw new Error(`Unsupported time unit: ${unit}`);
  }
}

export function getUnitAndNumberFromAgoRange(timeRange: string): {
  value;
  unit;
} {
  const regex = /^(\d+)([hdwmny]{1,2})$/i; // Match number followed by h, d, or w (case insensitive)
  // Use the provided timeRange or fallback to default
  const match = (timeRange || '0h').toLowerCase().match(regex);
  console.log('match', match);
  if (!match) {
    return { value: 0, unit: 'h' };
  }

  const value = parseInt(match[1], 10); // Extract numeric value
  const unit = match[2]; // Extract unit (h, d, w, m)
  return { value, unit };
}

export function getStartOfTimeFromAgo(
  timeRange: string,
  toUnixTimeStamp: boolean = true,
): Date | number {
  const now = new Date();
  let startDate = now;

  const { value, unit } = getUnitAndNumberFromAgoRange(timeRange);

  switch (unit) {
    case 's': // Seconds
      startDate = subSeconds(now, value); // Subtract seconds
      break;
    case 'm':
      startDate = subMinutes(now, value); // Subtract minutes
      break;
    case 'h':
      startDate = subHours(now, value); // Subtract hours
      break;
    case 'd':
      startDate = subDays(now, value); // Subtract days
      break;
    case 'w':
      startDate = subWeeks(now, value); // Subtract weeks
      break;
    case 'mn':
      startDate = subMonths(now, value); // Subtract weeks
      break;
    case 'y':
      startDate = subYears(now, value); // Subtract weeks
      break;
  }
  return toUnixTimeStamp ? getTime(startDate) / 1000 : startDate;
}
