import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthGrid, weekdayOrder, parseMonth, daysInMonth } from '../src/core/calendar.js';
import { parseICS, expandEvents, normaliseEvents, parseICSDate } from '../src/core/ics.js';

test('monthGrid lays out October 2026 starting Monday', () => {
  const g = monthGrid(2026, 9, { weekStart: 1 });
  assert.equal(g.length, 5);
  // 1 Oct 2026 is a Thursday: three leading days from September.
  assert.deepEqual(g[0].map((c) => c.day), [28, 29, 30, 1, 2, 3, 4]);
  assert.equal(g[0][0].inMonth, false);
  assert.equal(g[0][3].inMonth, true);
  assert.deepEqual(g[4].map((c) => c.day), [26, 27, 28, 29, 30, 31, 1]);
});

test('monthGrid with Sunday start, fixed rows and blanks', () => {
  const fixed = monthGrid(2026, 1, { weekStart: 0, fixedRows: true });
  assert.equal(fixed.length, 6);
  const blank = monthGrid(2026, 11, { weekStart: 0, fillAdjacent: false });
  assert.deepEqual(blank[0].map((c) => c && c.day), [null, null, 1, 2, 3, 4, 5]);
  assert.equal(blank.length, 5);
});

test('helpers', () => {
  assert.deepEqual(weekdayOrder(1), [1, 2, 3, 4, 5, 6, 0]);
  assert.deepEqual(parseMonth('2026-12'), { year: 2026, month: 11 });
  assert.equal(parseMonth('2026-13'), null);
  assert.equal(daysInMonth(2028, 1), 29);
});

const ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'BEGIN:VEVENT',
  'UID:a',
  'DTSTART;TZID=Europe/London:20261022T093000',
  'DTEND;TZID=Europe/London:20261022T103000',
  'SUMMARY:Design review\\, round two',
  'LOCATION:Studio',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:b',
  'DTSTART:20261019T080000Z',
  'DURATION:PT15M',
  'RRULE:FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  'EXDATE:20261026T080000Z',
  'SUMMARY:Stand-up',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:c',
  'DTSTART;VALUE=DATE:20261022',
  'DTEND;VALUE=DATE:20261023',
  'SUMMARY:Ada\'s birthday',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:d',
  'DTSTART:20261022T150000Z',
  'STATUS:CANCELLED',
  'SUMMARY:Cancelled thing',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:e',
  'DTSTART:20261001T120000Z',
  'DTEND:20261001T130000Z',
  'RRULE:FREQ=DAILY;INTERVAL=7',
  'SUMMARY:Long',
  ' er lunch',
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

test('parseICS reads text, zones, durations and skips cancelled events', () => {
  const events = parseICS(ICS, { timeZone: 'Europe/London' });
  assert.equal(events.length, 4);
  const review = events.find((e) => e.uid === 'a');
  assert.equal(review.title, 'Design review, round two');
  assert.equal(review.start, Date.UTC(2026, 9, 22, 8, 30)); // 09:30 BST
  assert.equal(review.end - review.start, 3_600_000);
  const standup = events.find((e) => e.uid === 'b');
  assert.equal(standup.end - standup.start, 15 * 60_000);
  assert.equal(events.find((e) => e.uid === 'e').title, 'Longer lunch'); // folded line
  assert.equal(events.find((e) => e.uid === 'c').allDay, true);
});

test('expandEvents expands weekly BYDAY rules and honours EXDATE', () => {
  const events = parseICS(ICS, { timeZone: 'Europe/London' });
  const from = Date.UTC(2026, 9, 19);
  const to = Date.UTC(2026, 10, 2);
  const standups = expandEvents(events, from, to).filter((e) => e.uid === 'b');
  const days = standups.map((e) => new Date(e.start).getUTCDate());
  assert.deepEqual(days, [19, 22, 29]); // 26th excluded
});

test('expandEvents finds a day\'s agenda in order', () => {
  const events = parseICS(ICS, { timeZone: 'Europe/London' });
  const day = expandEvents(events, Date.UTC(2026, 9, 21, 23), Date.UTC(2026, 9, 22, 23));
  assert.deepEqual(day.map((e) => e.uid), ['c', 'b', 'a', 'e']);
});

test('parseICSDate handles each form', () => {
  assert.equal(parseICSDate('20261022T120000Z').ms, Date.UTC(2026, 9, 22, 12));
  assert.equal(parseICSDate('20261022', {}, 'UTC').allDay, true);
  assert.equal(parseICSDate('garbage'), null);
});

test('normaliseEvents accepts loose objects', () => {
  const out = normaliseEvents([
    { title: 'A', start: '2026-10-22T09:00:00Z' },
    { summary: 'B', start: 0, end: 60_000 },
    { title: 'bad', start: 'nope' },
  ]);
  assert.equal(out.length, 2);
  assert.equal(out[1].title, 'B');
  assert.equal(out[0].end, out[0].start);
});
