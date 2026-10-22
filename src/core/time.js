/**
 * Time-zone and locale helpers built on Intl, so tiles never need a date library.
 *
 * A "zoned" object holds the wall-clock fields for one instant in one time zone.
 * Months are 0-based and weekdays run 0 (Sunday) to 6 (Saturday), matching Date.
 */

const MINUTE = 60_000;
const offsetCache = new Map();
const partsFormatters = new Map();
const warned = new Set();

function partsFormatter(timeZone) {
  let f = partsFormatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    partsFormatters.set(timeZone, f);
  }
  return f;
}

/** Returns true when the string is a time zone this runtime understands. */
export function isValidTimeZone(timeZone) {
  if (!timeZone) return false;
  try {
    partsFormatter(timeZone);
    return true;
  } catch {
    return false;
  }
}

/**
 * Offset in milliseconds between UTC and the wall clock in `timeZone` at `ms`.
 * Cached per zone and per minute, because offsets only change on the minute.
 */
export function tzOffset(ms, timeZone) {
  if (!timeZone) return -new Date(ms).getTimezoneOffset() * MINUTE;
  const minuteKey = Math.floor(ms / MINUTE);
  const cached = offsetCache.get(timeZone);
  if (cached && cached.minuteKey === minuteKey) return cached.offset;

  let offset;
  try {
    const p = {};
    for (const { type, value } of partsFormatter(timeZone).formatToParts(new Date(ms))) p[type] = value;
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    offset = asUTC - Math.floor(ms / 1000) * 1000;
  } catch {
    if (!warned.has(timeZone)) {
      warned.add(timeZone);
      console.warn(`[bezel] Unknown time zone "${timeZone}", using the device time zone.`);
    }
    offset = -new Date(ms).getTimezoneOffset() * MINUTE;
  }
  offsetCache.set(timeZone, { minuteKey, offset });
  return offset;
}

/** Wall-clock fields for `ms` in `timeZone` (device zone when omitted). */
export function zoned(ms = Date.now(), timeZone) {
  const offset = tzOffset(ms, timeZone);
  const d = new Date(ms + offset);
  return {
    ms,
    offset,
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
    seconds: d.getUTCSeconds(),
    millis: d.getUTCMilliseconds(),
  };
}

/** Converts a wall-clock time in `timeZone` to a UTC timestamp. */
export function zonedToUtc(year, month, day, hours = 0, minutes = 0, seconds = 0, timeZone) {
  const guess = Date.UTC(year, month, day, hours, minutes, seconds);
  if (!timeZone) return new Date(year, month, day, hours, minutes, seconds).getTime();
  const first = guess - tzOffset(guess, timeZone);
  // A second pass settles instants that sit next to a daylight-saving change.
  return guess - tzOffset(first, timeZone);
}

/** Clock-hand angles in degrees, clockwise from 12. */
export function handAngles(z, { smooth = true } = {}) {
  const s = z.seconds + (smooth ? z.millis / 1000 : 0);
  const m = z.minutes + s / 60;
  const h = (z.hours % 12) + m / 60;
  return { hour: h * 30, minute: m * 6, second: s * 6 };
}

const nameCache = new Map();

/** Localised weekday and month names, cached per locale. */
export function names(locale = 'en-GB') {
  let n = nameCache.get(locale);
  if (n) return n;
  const fmt = (opts) => {
    try {
      return new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...opts });
    } catch {
      return new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...opts });
    }
  };
  // 4 Jan 1970 was a Sunday.
  const days = (style) => Array.from({ length: 7 }, (_, i) => fmt({ weekday: style }).format(Date.UTC(1970, 0, 4 + i)));
  const months = (style) => Array.from({ length: 12 }, (_, i) => fmt({ month: style }).format(Date.UTC(2001, i, 15)));
  n = {
    weekdayShort: days('short'),
    weekdayNarrow: days('narrow'),
    weekdayLong: days('long'),
    monthShort: months('short'),
    monthLong: months('long'),
  };
  nameCache.set(locale, n);
  return n;
}

const SUNDAY_REGIONS = new Set(['US', 'CA', 'MX', 'BR', 'JP', 'KR', 'TW', 'HK', 'IL', 'PH', 'ZA', 'AU', 'IN', 'SA', 'AR', 'CO', 'PE', 'VE', 'GT', 'PA']);

/** First day of the week for a locale: 0 = Sunday, 1 = Monday, 6 = Saturday. */
export function weekStartFor(locale = 'en-GB') {
  try {
    const loc = new Intl.Locale(locale);
    const info = typeof loc.getWeekInfo === 'function' ? loc.getWeekInfo() : loc.weekInfo;
    if (info && info.firstDay) return info.firstDay % 7;
    const region = loc.maximize().region;
    return SUNDAY_REGIONS.has(region) ? 0 : 1;
  } catch {
    return 1;
  }
}

/** Parses a week-start attribute: "mon", "sunday", "0", "1" and so on. */
export function parseWeekStart(value, locale) {
  if (value == null || value === '') return weekStartFor(locale);
  const v = String(value).trim().toLowerCase();
  if (/^[0-6]$/.test(v)) return Number(v);
  const map = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };
  return map[v.slice(0, 2)] ?? weekStartFor(locale);
}

/** True when the locale normally shows a 12-hour clock. */
export function prefers12h(locale = 'en-GB') {
  try {
    const hc = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle;
    return hc === 'h11' || hc === 'h12';
  } catch {
    return false;
  }
}

/** "10:09" style time. 12-hour times drop the leading zero and the AM/PM marker, like a watch face. */
export function formatClock(hours, minutes, hour12) {
  const mm = String(minutes).padStart(2, '0');
  if (hour12) return `${hours % 12 || 12}:${mm}`;
  return `${String(hours).padStart(2, '0')}:${mm}`;
}

/** ISO week number (1 to 53). */
export function isoWeek(year, month, day) {
  const d = new Date(Date.UTC(year, month, day));
  const dow = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dow);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d - yearStart) / 86_400_000 + 1) / 7);
}

/** Day of the year, 1-based. */
export function dayOfYear(year, month, day) {
  return Math.round((Date.UTC(year, month, day) - Date.UTC(year, 0, 1)) / 86_400_000) + 1;
}

export function daysInYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
}
