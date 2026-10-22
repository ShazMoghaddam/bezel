/** Month-grid maths shared by the calendar and poster tiles. */

export function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * Builds a month as rows of 7 cells.
 * @param {number} year
 * @param {number} month 0-based
 * @param {object} [opts]
 * @param {number} [opts.weekStart=1] 0 = Sunday, 1 = Monday
 * @param {boolean} [opts.fixedRows=false] always return 6 rows, like a phone calendar
 * @param {boolean} [opts.fillAdjacent=true] fill leading and trailing cells with neighbouring months' days
 */
export function monthGrid(year, month, { weekStart = 1, fixedRows = false, fillAdjacent = true } = {}) {
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const lead = (firstDow - weekStart + 7) % 7;
  const total = daysInMonth(year, month);
  const rows = fixedRows ? 6 : Math.ceil((lead + total) / 7);
  const weeks = [];

  for (let r = 0; r < rows; r++) {
    const week = [];
    for (let c = 0; c < 7; c++) {
      const offset = r * 7 + c - lead; // days after the 1st
      const d = new Date(Date.UTC(year, month, 1 + offset));
      const inMonth = offset >= 0 && offset < total;
      week.push(
        inMonth || fillAdjacent
          ? { year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate(), inMonth }
          : null,
      );
    }
    weeks.push(week);
  }
  return weeks;
}

/** Weekday indices in display order for a given week start. */
export function weekdayOrder(weekStart = 1) {
  return Array.from({ length: 7 }, (_, i) => (weekStart + i) % 7);
}

/** Parses "2026-12" into { year, month } (month 0-based), or null. */
export function parseMonth(value) {
  const m = /^(\d{4})-(\d{1,2})$/.exec(String(value ?? '').trim());
  if (!m) return null;
  const month = Number(m[2]) - 1;
  if (month < 0 || month > 11) return null;
  return { year: Number(m[1]), month };
}
