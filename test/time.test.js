import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  zoned, zonedToUtc, tzOffset, handAngles, formatClock, isoWeek, dayOfYear,
  daysInYear, parseWeekStart, weekStartFor, names, isValidTimeZone,
} from '../src/core/time.js';

test('zoned reads wall-clock time in a named zone', () => {
  const ms = Date.UTC(2026, 9, 22, 12, 7, 30); // 12:07:30 UTC, London is on BST (+1)
  const z = zoned(ms, 'Europe/London');
  assert.deepEqual([z.year, z.month, z.day, z.hours, z.minutes, z.seconds], [2026, 9, 22, 13, 7, 30]);
  assert.equal(z.weekday, 4); // Thursday

  const tokyo = zoned(ms, 'Asia/Tokyo');
  assert.equal(tokyo.hours, 21);
  const kathmandu = zoned(ms, 'Asia/Kathmandu'); // +5:45
  assert.equal(`${kathmandu.hours}:${kathmandu.minutes}`, '17:52');
});

test('zoned rolls the date over across zones', () => {
  const ms = Date.UTC(2026, 11, 31, 23, 30);
  const z = zoned(ms, 'Pacific/Auckland');
  assert.deepEqual([z.year, z.month, z.day], [2027, 0, 1]);
});

test('zonedToUtc round-trips, including around daylight saving', () => {
  for (const [tz, parts] of [
    ['Europe/London', [2026, 9, 22, 9, 30]],
    ['Europe/London', [2026, 9, 25, 3, 0]], // the morning the clocks go back
    ['America/New_York', [2026, 2, 8, 12, 0]],
    ['Australia/Sydney', [2026, 0, 15, 18, 45]],
  ]) {
    const ms = zonedToUtc(...parts, 0, tz);
    const z = zoned(ms, tz);
    assert.deepEqual([z.year, z.month, z.day, z.hours, z.minutes], parts, tz);
  }
});

test('tzOffset matches known offsets', () => {
  assert.equal(tzOffset(Date.UTC(2026, 0, 1), 'Europe/London'), 0);
  assert.equal(tzOffset(Date.UTC(2026, 6, 1), 'Europe/London'), 3_600_000);
  assert.equal(tzOffset(Date.UTC(2026, 6, 1), 'America/Los_Angeles'), -7 * 3_600_000);
});

test('an unknown zone falls back instead of throwing', () => {
  assert.equal(isValidTimeZone('Mars/Olympus_Mons'), false);
  assert.doesNotThrow(() => zoned(Date.now(), 'Mars/Olympus_Mons'));
});

test('hand angles', () => {
  const a = handAngles({ hours: 15, minutes: 0, seconds: 0, millis: 0 });
  assert.deepEqual(a, { hour: 90, minute: 0, second: 0 });
  const b = handAngles({ hours: 10, minutes: 9, seconds: 30, millis: 500 });
  assert.equal(b.second, 183);
  assert.equal(b.minute.toFixed(4), (9.5083333 * 6).toFixed(4));
  const tick = handAngles({ hours: 0, minutes: 0, seconds: 30, millis: 999 }, { smooth: false });
  assert.equal(tick.second, 180);
});

test('formatClock', () => {
  assert.equal(formatClock(10, 9, false), '10:09');
  assert.equal(formatClock(0, 5, false), '00:05');
  assert.equal(formatClock(0, 5, true), '12:05');
  assert.equal(formatClock(13, 21, true), '1:21');
});

test('calendar numbers', () => {
  assert.equal(isoWeek(2026, 9, 22), 43);
  assert.equal(isoWeek(2027, 0, 1), 53); // Friday 1 Jan 2027 belongs to week 53 of 2026
  assert.equal(dayOfYear(2026, 9, 22), 295);
  assert.equal(daysInYear(2024), 366);
  assert.equal(daysInYear(2100), 365);
});

test('week start parsing', () => {
  assert.equal(parseWeekStart('mon'), 1);
  assert.equal(parseWeekStart('Sunday'), 0);
  assert.equal(parseWeekStart('6'), 6);
  assert.equal(weekStartFor('en-GB'), 1);
  assert.equal(weekStartFor('en-US'), 0);
});

test('localised names', () => {
  const en = names('en-GB');
  assert.equal(en.weekdayShort[4], 'Thu');
  assert.equal(en.monthLong[11], 'December');
  const fr = names('fr-FR');
  assert.equal(fr.monthLong[9], 'octobre');
  assert.doesNotThrow(() => names('not a locale'));
});
