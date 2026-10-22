/**
 * A small iCalendar (.ics) reader for agenda tiles.
 *
 * Supports: line folding, escaped text, UTC / TZID / floating / all-day times,
 * and recurring events with FREQ=DAILY|WEEKLY|MONTHLY|YEARLY, INTERVAL, COUNT,
 * UNTIL, BYDAY (weekly) and EXDATE. That covers the calendars people actually
 * subscribe to; exotic rules are read as single events.
 */

import { zonedToUtc } from './time.js';

const DAY = 86_400_000;
const BYDAY = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

function unfold(text) {
  return text.replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
}

function unescapeText(value) {
  return value.replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');
}

function parseLine(line) {
  const colon = line.search(/:(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  if (colon < 0) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const [name, ...paramParts] = head.split(';');
  const params = {};
  for (const p of paramParts) {
    const eq = p.indexOf('=');
    if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1).replace(/^"|"$/g, '');
  }
  return { name: name.toUpperCase(), params, value };
}

/**
 * Parses an ICS date value into { ms, allDay }.
 * @param {string} value e.g. "20261022T093000Z", "20261022T093000", "20261022"
 * @param {object} params property parameters (TZID, VALUE)
 * @param {string} [fallbackZone] zone for floating times
 */
export function parseICSDate(value, params = {}, fallbackZone) {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  if (h === undefined || params.VALUE === 'DATE') {
    // All-day: anchor at midnight in the viewer's zone.
    return { ms: zonedToUtc(+y, +mo - 1, +d, 0, 0, 0, fallbackZone), allDay: true, ymd: [+y, +mo - 1, +d] };
  }
  const parts = [+y, +mo - 1, +d, +h, +mi, +(s ?? 0)];
  if (z) return { ms: Date.UTC(...parts), allDay: false };
  const zone = params.TZID && !params.TZID.startsWith('/') ? params.TZID : fallbackZone;
  let ms;
  try {
    ms = zonedToUtc(...parts, zone);
  } catch {
    ms = zonedToUtc(...parts, fallbackZone);
  }
  return { ms, allDay: false };
}

function parseRRule(value) {
  const rule = {};
  for (const part of value.split(';')) {
    const [k, v] = part.split('=');
    if (k && v) rule[k.toUpperCase()] = v;
  }
  return rule;
}

/**
 * Parses ICS text into raw events.
 * @returns {Array<{uid:string,title:string,location:string,start:number,end:number,allDay:boolean,rrule:object|null,exdates:Set<number>,recurrenceId:number|null}>}
 */
export function parseICS(text, { timeZone } = {}) {
  const events = [];
  let current = null;

  for (const raw of unfold(String(text ?? '')).split('\n')) {
    const line = raw.trimEnd();
    if (line === 'BEGIN:VEVENT') {
      current = { uid: '', title: '', location: '', start: null, end: null, allDay: false, rrule: null, exdates: new Set(), recurrenceId: null, cancelled: false };
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current && current.start != null && !current.cancelled) {
        if (current.end == null || current.end < current.start) {
          current.end = current.start + (current.allDay ? DAY : 0);
        }
        events.push(current);
      }
      current = null;
      continue;
    }
    if (!current) continue;
    const prop = parseLine(line);
    if (!prop) continue;

    switch (prop.name) {
      case 'UID':
        current.uid = prop.value;
        break;
      case 'SUMMARY':
        current.title = unescapeText(prop.value);
        break;
      case 'LOCATION':
        current.location = unescapeText(prop.value);
        break;
      case 'STATUS':
        current.cancelled = prop.value.toUpperCase() === 'CANCELLED';
        break;
      case 'DTSTART': {
        const d = parseICSDate(prop.value, prop.params, timeZone);
        if (d) {
          current.start = d.ms;
          current.allDay = d.allDay;
        }
        break;
      }
      case 'DTEND': {
        const d = parseICSDate(prop.value, prop.params, timeZone);
        if (d) current.end = d.ms;
        break;
      }
      case 'DURATION': {
        const m = /P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/.exec(prop.value);
        if (m && current.start != null) {
          const [, w = 0, d = 0, h = 0, mi = 0, s = 0] = m.map((x) => (x === undefined ? 0 : +x));
          current.end = current.start + (((+w * 7 + +d) * 24 + +h) * 60 + +mi) * 60_000 + +s * 1000;
        }
        break;
      }
      case 'RRULE':
        current.rrule = parseRRule(prop.value);
        break;
      case 'EXDATE':
        for (const v of prop.value.split(',')) {
          const d = parseICSDate(v, prop.params, timeZone);
          if (d) current.exdates.add(d.ms);
        }
        break;
      case 'RECURRENCE-ID': {
        const d = parseICSDate(prop.value, prop.params, timeZone);
        if (d) current.recurrenceId = d.ms;
        break;
      }
    }
  }
  return events;
}

function addMonthsUTC(ms, n) {
  const d = new Date(ms);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const max = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  if (day > max) return null; // e.g. 31st in a 30-day month: no occurrence, per RFC 5545
  d.setUTCDate(day);
  return d.getTime();
}

/** Yields occurrence start times for a recurring event, up to `until`. */
function* occurrences(ev, until) {
  const r = ev.rrule;
  const freq = r.FREQ;
  const interval = Math.max(1, parseInt(r.INTERVAL ?? '1', 10) || 1);
  const count = r.COUNT ? parseInt(r.COUNT, 10) : Infinity;
  const ruleUntil = r.UNTIL ? parseICSDate(r.UNTIL)?.ms ?? Infinity : Infinity;
  const stop = Math.min(until, ruleUntil);
  let emitted = 0;
  const cap = 5000;

  if (freq === 'WEEKLY' && r.BYDAY) {
    const days = r.BYDAY.split(',').map((d) => BYDAY[d.slice(-2)]).filter((d) => d != null).sort();
    const startDow = new Date(ev.start).getUTCDay();
    const weekAnchor = ev.start - startDow * DAY;
    for (let week = 0; week < cap && emitted < count; week += interval) {
      for (const dow of days) {
        const t = weekAnchor + week * 7 * DAY + dow * DAY;
        if (t < ev.start) continue;
        if (t > stop || emitted >= count) return;
        emitted++;
        yield t;
      }
    }
    return;
  }

  for (let i = 0; i < cap && emitted < count; i++) {
    let t;
    if (freq === 'DAILY') t = ev.start + i * interval * DAY;
    else if (freq === 'WEEKLY') t = ev.start + i * interval * 7 * DAY;
    else if (freq === 'MONTHLY') t = addMonthsUTC(ev.start, i * interval);
    else if (freq === 'YEARLY') t = addMonthsUTC(ev.start, i * interval * 12);
    else return;
    if (t == null) continue;
    if (t > stop) return;
    emitted++;
    yield t;
  }
}

/**
 * Expands events into concrete instances overlapping [from, to).
 * Recurring times are expanded in UTC steps, which keeps wall-clock times
 * stable except across a daylight-saving change, where they shift by an hour.
 */
export function expandEvents(events, from, to) {
  const overrides = new Map();
  for (const ev of events) {
    if (ev.recurrenceId != null) overrides.set(`${ev.uid}@${ev.recurrenceId}`, ev);
  }

  const out = [];
  for (const ev of events) {
    if (ev.recurrenceId != null) {
      if (ev.end > from && ev.start < to) out.push(ev);
      continue;
    }
    const duration = ev.end - ev.start;
    if (!ev.rrule) {
      if (ev.end > from && ev.start < to) out.push(ev);
      continue;
    }
    for (const start of occurrences(ev, to)) {
      if (ev.exdates.has(start) || overrides.has(`${ev.uid}@${start}`)) continue;
      const end = start + duration;
      if (end > from && start < to) out.push({ ...ev, start, end, rrule: null });
    }
  }
  return out.sort((a, b) => a.start - b.start || a.title.localeCompare(b.title));
}

/**
 * Normalises events supplied as JavaScript objects or JSON.
 * Accepts { title, start, end?, location?, allDay? } where start/end are
 * ISO strings, Date objects or timestamps.
 */
export function normaliseEvents(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((e) => {
      const start = new Date(e.start).getTime();
      if (!Number.isFinite(start)) return null;
      const end = e.end != null ? new Date(e.end).getTime() : start;
      return {
        uid: e.id ?? '',
        title: String(e.title ?? e.summary ?? 'Untitled'),
        location: String(e.location ?? ''),
        start,
        end: Number.isFinite(end) ? end : start,
        allDay: Boolean(e.allDay),
        rrule: null,
        exdates: new Set(),
        recurrenceId: null,
      };
    })
    .filter(Boolean);
}
