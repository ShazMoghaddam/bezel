/**
 * Perimeter: everything runs round the edge. The time in words across the top,
 * the digital time with the week and day of the year up the left side, the date
 * down the right and the year along the bottom. In the middle, a dotted square
 * track with a marker that travels round it once a minute, showing the seconds
 * (or round once an hour showing the minutes, with `hide-seconds`).
 *
 * The words are in English; the date follows `locale`.
 */
import { names, isoWeek, dayOfYear, formatClock } from '../core/time.js';
import { squarePoint, numberWord, f } from './shared.js';

const TRACK = 27;
// The minute each tile last wrote its edge text for, so the text only changes once a minute.
const written = new WeakMap();
const pad = (n) => String(n).padStart(2, '0');

/** "ONE ELEVEN", "TEN OH FIVE", "TWELVE O'CLOCK". */
export function timeInWords(hours, minutes) {
  const h = numberWord(hours % 12 || 12);
  if (!minutes) return `${h} o'clock`;
  return `${h} ${minutes < 10 ? `oh ${numberWord(minutes)}` : numberWord(minutes)}`;
}

/** A font size that fits `text` into `width` viewBox units, but no bigger than `max`. */
const fit = (text, width, max, em = 0.74) => f(Math.min(max, width / (Math.max(1, text.length) * em)));

export const perimeter = {
  theme: 'phosphor',

  tickRate: (el) => (!el.showSeconds ? 'second' : el.getAttribute('sweep') === 'tick' ? 'second' : 'frame'),

  styles: /* css */ `
    .v-perimeter text { font-family: var(--bezel-font-mono, ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace); fill: var(--_ink); }
    .v-perimeter .edge { letter-spacing: 0.14em; font-weight: 500; }
    .v-perimeter .words { fill: color-mix(in srgb, var(--_ink), #fff 15%); letter-spacing: 0.18em; }
    .v-perimeter .dot { fill: var(--_ink); opacity: .5; }
    .v-perimeter .mark { fill: var(--_ink); opacity: .55; letter-spacing: 0; }
    .v-perimeter .marker line { stroke: var(--_accent); stroke-width: 0.6; stroke-linecap: round; }
    .v-perimeter .marker text { fill: var(--_accent); font-weight: 600; letter-spacing: 0; }
  `,

  template(el) {
    let track = '';
    for (let i = 0; i < 60; i++) {
      const p = squarePoint(i / 60, 50, 50, TRACK);
      track += `<circle class="dot" cx="${f(p.x)}" cy="${f(p.y)}" r="${i % 5 ? 0.38 : 0.7}" />`;
      if (i % 5 === 0) {
        const q = squarePoint(i / 60, 50, 50, TRACK + 4.4);
        track += `<text class="mark" x="${f(q.x)}" y="${f(q.y)}" font-size="3.2" text-anchor="middle" dominant-baseline="central">${pad(i)}</text>`;
      }
    }
    return `<svg class="face v-perimeter" viewBox="0 0 100 100" aria-hidden="true">
      <text class="edge words top" x="50" y="10.5" text-anchor="middle" dominant-baseline="central"></text>
      <text class="edge left" x="10.5" y="50" text-anchor="middle" dominant-baseline="central" transform="rotate(-90 10.5 50)"></text>
      <text class="edge right" x="89.5" y="50" text-anchor="middle" dominant-baseline="central" transform="rotate(90 89.5 50)"></text>
      <text class="edge bottom" x="50" y="89.5" text-anchor="middle" dominant-baseline="central" transform="rotate(180 50 89.5)"></text>
      ${track}
      <g class="marker"><line x1="50" y1="${50 - TRACK + 1.4}" x2="50" y2="${50 - TRACK - 1.4}" /><text x="50" y="${50 - TRACK + 4.6}" font-size="4.2" text-anchor="middle" dominant-baseline="central"></text></g>
    </svg>`;
  },

  update(el, z, first) {
    const seconds = el.showSeconds;
    const smooth = el.tickRate === 'frame';
    const s = z.seconds + (smooth ? z.millis / 1000 : 0);
    const t = seconds ? s / 60 : (z.minutes + s / 60) / 60;
    const value = seconds ? z.seconds : z.minutes;
    perimeter.marker(el, t, value);

    const key = `${z.hours}:${z.minutes}`;
    if (!first && written.get(el) === key) return;
    written.set(el, key);
    const n = names(el.locale);
    const up = (s) => s.toLocaleUpperCase(el.locale);
    const set = (sel, text, width, max) => {
      const node = el.$(sel);
      if (!node) return;
      node.textContent = text;
      node.setAttribute('font-size', fit(text, width, max));
    };
    set('.top', up(timeInWords(z.hours, z.minutes)), 64, 6.2);
    const week = isoWeek(z.year, z.month, z.day);
    set('.left', `${formatClock(z.hours, z.minutes, el.hour12)} · WK ${week} · DAY ${dayOfYear(z.year, z.month, z.day)}`, 66, 4.8);
    set('.right', up(`${n.weekdayLong[z.weekday]} ${z.day} ${n.monthLong[z.month]}`), 66, 4.8);
    set('.bottom', String(z.year), 40, 5.4);
  },

  /** Moves the marker to `t` of the way round the track, labelled with `value`. */
  marker(el, t, value) {
    const g = el.$('.marker');
    if (!g) return;
    // Travel round the square: slide along an edge, and turn with it at the corners.
    const p = squarePoint(t, 50, 50, TRACK);
    const side = Math.floor((((t * 8 + 1) % 8) + 8) % 8 / 2); // 0 top, 1 right, 2 bottom, 3 left
    const deg = side * 90;
    g.setAttribute('transform', `translate(${f(p.x - 50)} ${f(p.y - 50 + TRACK)}) rotate(${deg} 50 ${50 - TRACK})`);
    const label = g.querySelector('text');
    if (label) {
      const text = pad(value);
      if (label.textContent !== text) label.textContent = text;
      // Keep the number upright on every side.
      label.setAttribute('transform', `rotate(${-deg} 50 ${50 - TRACK + 4.6})`);
    }
  },
};
