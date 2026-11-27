/**
 * Grammar: the time, date, week and day of the year written out as a loose
 * collage of words, some of them tagged with their part of speech.
 *
 * It's organised mess: the time is always the biggest, chunkiest line, so the eye
 * lands there first, then the date, then the week and day in small type. Sizes,
 * typefaces, tilts and which words get a tag all come from `seed`, so the layout
 * holds still from minute to minute.
 *
 * Attributes (on top of the clock's own)
 *   palette    vibrant | neon | pastel | subtle | spring | summer | autumn | winter
 *   colors     your own colours, comma separated
 *   color-by   word | pos   (default word: every word its own colour;
 *                           pos: one colour per part of speech)
 *   lines      which lines to show, any of: time, date, week, day (default all four)
 *   hide-tags  hide the part-of-speech tags and highlights, leaving just the words
 *   seed       a whole number for a different arrangement
 *
 * The sentence patterns are written by hand, so every tag is known in advance and
 * always right; there's no language model or tagger involved. The words are English.
 *
 * Typefaces: --bezel-font (chunky, used heavy), --bezel-font-serif and --bezel-font-mono.
 */
import { isoWeek, dayOfYear, daysInYear } from '../core/time.js';
import { tileColors, inkFor } from '../core/palettes.js';
import { esc } from '../core/frame.js';
import { seeded, seedOf, numberWord, ordinal, f } from './shared.js';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Parts of speech, and the palette slot each takes when colouring by part of speech.
const POS_SLOT = { pronoun: 10, verb: 0, number: 2, preposition: 6, noun: 7, 'proper noun': 4, determiner: 8, adverb: 1, ordinal: 9 };
const LINES = ['time', 'date', 'week', 'day'];

/** The time as tagged words: "It is ten minutes past eleven", "It is quarter to one". */
export function timeWords(hours, minutes) {
  const h = hours % 12 || 12;
  const next = (h % 12) + 1;
  const w = [['It', 'pronoun'], ['is', 'verb']];
  const num = (n) => [numberWord(n), 'number'];
  if (minutes === 0) return [...w, num(h), ["o'clock", 'adverb']];
  if (minutes === 15) return [...w, ['quarter', 'noun'], ['past', 'preposition'], num(h)];
  if (minutes === 30) return [...w, ['half', 'noun'], ['past', 'preposition'], num(h)];
  if (minutes === 45) return [...w, ['quarter', 'noun'], ['to', 'preposition'], num(next)];
  const past = minutes < 30;
  const m = past ? minutes : 60 - minutes;
  return [...w, num(m), [m === 1 ? 'minute' : 'minutes', 'noun'], [past ? 'past' : 'to', 'preposition'], num(past ? h : next)];
}

/** Every line of the face as tagged words, for a zoned time. */
export function grammarLines(z) {
  const days = daysInYear(z.year);
  // The last ISO week of a year is the one holding 28 December: 52 most years, 53 in some (2026 is one).
  const weeks = isoWeek(z.year, 11, 28);
  return {
    time: timeWords(z.hours, z.minutes),
    date: [[DAYS[z.weekday], 'proper noun'], ['the', 'determiner'], [ordinal(z.day), 'ordinal'], ['of', 'preposition'], [MONTHS[z.month], 'proper noun'], [String(z.year), 'number']],
    week: [['week', 'noun'], [String(isoWeek(z.year, z.month, z.day)), 'number'], ['of', 'preposition'], [String(weeks), 'number']],
    day: [['day', 'noun'], [String(dayOfYear(z.year, z.month, z.day)), 'number'], ['of', 'preposition'], [String(days), 'number']],
  };
}

const FONTS = ['chunky', 'serif', 'mono'];
const JUSTIFY = ['flex-start', 'center', 'flex-end', 'space-between'];

export const grammar = {
  theme: 'graphite',
  tickRate: () => 'minute',

  styles: /* css */ `
    .v-grammar { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; gap: 2.6cqw;
      padding: calc(7cqw + var(--_safe)) calc(6cqw + var(--_safe)); overflow: hidden; color: var(--_ink); }
    .v-grammar .row { display: flex; flex-wrap: wrap; align-items: flex-end; column-gap: 1.8cqw; row-gap: 1.2cqw; }
    .v-grammar .w { display: inline-flex; flex-direction: column; line-height: 1; }
    .v-grammar .tag { font-family: var(--_mono); font-size: 3cqw; line-height: 1.15; padding: 0 1.1cqw; border-radius: 0.7cqw;
      margin-block-end: 0.7cqw; inline-size: max-content; white-space: nowrap; }
    .v-grammar .tag.blank { visibility: hidden; }
    .v-grammar .t { padding: 0 0.9cqw; border-radius: 0.7cqw; white-space: nowrap; }
    .v-grammar .chunky { font-family: var(--_font); font-weight: 900; letter-spacing: -0.03em; }
    .v-grammar .serif { font-family: var(--_serif); font-weight: 400; }
    .v-grammar .mono { font-family: var(--_mono); font-weight: 400; letter-spacing: -0.02em; }
    .v-grammar .italic { font-style: italic; }
    :host([hide-tags]) .v-grammar .tag { visibility: hidden; }
    :host([hide-tags]) .v-grammar .t { background: none !important; }
    :host([variant="grammar"]) {
      --_serif: var(--bezel-font-serif, "DM Serif Display", "Playfair Display", "Iowan Old Style", Georgia, serif);
      --_mono: var(--bezel-font-mono, "Space Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace);
    }
  `,

  template(el, z) {
    return `<div class="v-grammar" aria-hidden="true">${grammar.body(el, z)}</div>`;
  },

  /** The rows of words. Rebuilt each minute, with the same seed, so the look holds steady. */
  body(el, z) {
    const r = seeded(seedOf(el));
    const pick = seeded(seedOf(el) + 99); // colours draw from their own sequence
    const colors = tileColors(el);
    const byPos = el.getAttribute('color-by') === 'pos';
    const wanted = (el.getAttribute('lines') ?? '').split(/[\s,]+/).filter((l) => LINES.includes(l));
    const shown = wanted.length ? LINES.filter((l) => wanted.includes(l)) : LINES;
    const all = grammarLines(z);
    let last = -1;

    return shown.map((line) => {
      const tier = line === 'time' ? 1 : line === 'date' ? 2 : 3;
      const words = all[line];
      const pad = f(r() * 7.5);
      const justify = JUSTIFY[Math.floor(r() * JUSTIFY.length)];
      const tagged = words.map(() => r() < 0.4);
      if (!tagged.some(Boolean)) tagged[Math.floor(r() * words.length)] = true;

      const html = words.map(([text, pos], i) => {
        // Sizes in cqw of the screen. Big words are capped by their length so they always fit.
        let size;
        let font;
        if (tier === 1) {
          const big = r() < 0.5;
          size = big ? 8.6 + r() * 6.4 : 4.6 + r() * 2.8;
          font = big ? 'chunky' : FONTS[1 + Math.floor(r() * 2)];
        } else if (tier === 2) {
          size = 4.2 + r() * 4.6;
          font = FONTS[Math.floor(r() * 3)];
        } else {
          size = 3.7 + r() * 1.8;
          font = r() < 0.7 ? 'mono' : 'serif';
        }
        size = Math.min(size, 82 / (text.length * 0.62));
        const tilt = (tier === 1 ? r() * 16 - 8 : r() * 10 - 5).toFixed(1);
        const lift = f(r() * 2.6 - 1.3);
        const align = r() < 0.5 ? 'flex-start' : 'flex-end';
        const italic = font === 'serif' && r() < 0.5 ? ' italic' : '';

        let slot;
        if (byPos) slot = POS_SLOT[pos];
        else {
          do slot = Math.floor(pick() * 12); while (slot === last);
          last = slot;
        }
        const color = colors.length >= 12 && byPos ? colors[slot] : colors[slot % colors.length];
        const ink = inkFor(color, '#111');
        const tag = tagged[i]
          ? `<span class="tag" style="background:${color};color:${ink}">${pos}</span>`
          : '<span class="tag blank">-</span>';
        const highlight = tagged[i] ? `;background:color-mix(in srgb, ${color} 26%, transparent)` : '';
        return `<span class="w" style="transform:rotate(${tilt}deg) translateY(${lift}cqw);align-items:${align}">${tag}<span class="t ${font}${italic}" style="font-size:calc(var(--k, 1) * ${f(size)}cqw)${highlight}">${esc(text)}</span></span>`;
      }).join('');
      return `<div class="row" style="justify-content:${justify};padding-inline-start:${pad}cqw">${html}</div>`;
    }).join('');
  },

  update(el, z, first) {
    const root = el.$('.v-grammar');
    if (!root) return;
    if (!first) root.innerHTML = grammar.body(el, z); // on first paint, template() has just drawn it
    grammar.fit(root);
  },

  /**
   * Shrinks the words a step at a time until everything fits on the screen. Most
   * minutes need nothing; long times such as "twenty-nine minutes to twelve" might.
   */
  fit(root) {
    let k = 1;
    root.style.setProperty('--k', '1');
    while (root.scrollHeight > root.clientHeight + 1 && k > 0.55) {
      k -= 0.05;
      root.style.setProperty('--k', k.toFixed(2));
    }
  },
};
