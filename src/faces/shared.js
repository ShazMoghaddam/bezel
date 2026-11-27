/**
 * Helpers shared by the clock faces in this folder.
 */
import { styledHands } from '../core/hands.js';

// Clocks traditionally write four as IIII, which balances VIII on the other side of the dial.
const ROMAN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** The numeral for hour `h` (1 to 12) in a script. */
export function numeral(h, script = 'western') {
  if (script === 'roman') return ROMAN[h % 12];
  if (script === 'persian') return String(h).replace(/\d/g, (d) => PERSIAN_DIGITS[d]);
  return String(h);
}

/** Any number, in Persian digits when asked. */
export function digits(n, script = 'western') {
  return script === 'persian' ? String(n).replace(/\d/g, (d) => PERSIAN_DIGITS[d]) : String(n);
}

export const f = (n) => Number(n.toFixed(2));

/**
 * A small seeded random number generator (mulberry32). The same seed always gives the
 * same sequence, so a "messy" layout stays put from one minute to the next.
 */
export function seeded(seed) {
  let s = Number.isFinite(seed) ? seed | 0 : 7;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The `seed` attribute as a whole number, or 7. */
export function seedOf(el) {
  const n = parseInt(el.getAttribute('seed'), 10);
  return Number.isFinite(n) ? n : 7;
}

/**
 * A point on a square of half-size `s` around (cx, cy), `t` of the way round it
 * (0 to 1), clockwise from the middle of the top edge. Points are spaced evenly
 * along the edge, so labels never bunch up at the corners.
 */
export function squarePoint(t, cx, cy, s) {
  let d = (((t % 1) + 1) % 1) * 8 * s;
  if (d < s) return { x: cx + d, y: cy - s };
  d -= s;
  if (d < 2 * s) return { x: cx + s, y: cy - s + d };
  d -= 2 * s;
  if (d < 2 * s) return { x: cx + s - d, y: cy + s };
  d -= 2 * s;
  if (d < 2 * s) return { x: cx - s, y: cy + s - d };
  d -= 2 * s;
  return { x: cx - s + d, y: cy - s };
}

/** Degrees clockwise from 12 o'clock, from (cx, cy) towards a point. */
export function angleTo(p, cx, cy) {
  return (Math.atan2(p.x - cx, cy - p.y) * 180) / Math.PI;
}

/** The original Bezel hands: a thin stem from the hub, then a capsule. */
function modernHands({ cx, cy, hour, minute, second, tail, width, seconds }) {
  const arm = (cls, length) => `<g class="hand ${cls}">
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${f(cy - 6)}" stroke-width="${f(Math.max(0.5, width * 0.32))}" />
    <line x1="${cx}" y1="${f(cy - 6)}" x2="${cx}" y2="${f(cy - length)}" stroke-width="${width}" />
  </g>`;
  return `${arm('hour', hour)}${arm('minute', minute)}${
    seconds ? `<g class="hand second"><line x1="${cx}" y1="${f(cy + tail)}" x2="${cx}" y2="${f(cy - second)}" stroke-width="0.55" /></g>` : ''
  }<circle class="hub" cx="${cx}" cy="${cy}" r="1.7" />${seconds ? `<circle class="hub-ring" cx="${cx}" cy="${cy}" r="1.15" />` : ''}<circle class="hub-pin" cx="${cx}" cy="${cy}" r="0.55" />`;
}

/**
 * Hands in the tile's chosen style (modern, lollipop or slender), drawn pointing at 12
 * so `turnHands` can rotate them.
 */
export function analogHands(el, { cx = 50, cy = 50, hour, minute, second, tail = 7, width = 3, weight = 1 }) {
  const style = el.hands;
  const seconds = el.showSeconds;
  const inner = style === 'modern'
    ? modernHands({ cx, cy, hour, minute, second, tail, width, seconds })
    : styledHands(style, { cx, cy, hour, minute, second, tail, weight: weight * (style === 'slender' ? 1.1 : 1), seconds, extra: 'hand' });
  return `<g class="hands">${inner}</g>`;
}

/** Turns the hour, minute and second hands to angles in degrees. */
export function turnHands(el, { hour, minute, second }, cx = 50, cy = 50) {
  const turn = (sel, deg) => el.$(sel)?.setAttribute('transform', `rotate(${deg.toFixed(3)} ${cx} ${cy})`);
  turn('.hour', hour);
  turn('.minute', minute);
  if (second !== undefined) turn('.second', second);
}

// ---- Numbers as English words, for the Perimeter and Grammar faces ----

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty'];

/** 0 to 59 in words: "seven", "twenty-one", "forty". */
export function numberWord(n) {
  if (n < 20) return ONES[n];
  const t = TENS[Math.floor(n / 10)];
  return n % 10 ? `${t}-${ONES[n % 10]}` : t;
}

/** "1st", "2nd", "23rd", "11th". */
export function ordinal(n) {
  const s = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th');
  return `${n}${s}`;
}
