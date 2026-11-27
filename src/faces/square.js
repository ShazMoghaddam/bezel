/**
 * Square: a 24-hour dial on a square. The 24 hours run round the outside and the
 * 60 minutes round a smaller square inside (a dot for each, numbered every
 * five), both clockwise from the top, with 00 at the top.
 *
 * The hour hand goes round once a day, so it points straight at the hour; the
 * minute hand points at the minute. Because the numbers sit on a square, the
 * hands aim at each number's exact spot rather than turning at an even speed.
 * The current hour and minute are picked out in the accent colour.
 */
import { squarePoint, angleTo, analogHands, turnHands, digits, f } from './shared.js';

const OUTER = 40;
const INNER = 29;
const pad = (n) => String(n).padStart(2, '0');

export const square = {
  theme: 'rose',

  styles: /* css */ `
    :host([variant="square"]) { --_rim-r: var(--bezel-radius, 12cqw); }
    :host([variant="square"]) .screen { background: linear-gradient(color-mix(in srgb, var(--_surface), #fff 30%), color-mix(in srgb, var(--_surface), #000 6%)); }
    .v-square text { font-family: var(--_font); fill: var(--_ink); }
    .v-square .hr { font-weight: 500; letter-spacing: -0.06em; }
    .v-square .mn { font-weight: 500; letter-spacing: -0.02em; }
    .v-square .md { fill: var(--_ink); opacity: .55; }
    .v-square .is-now { fill: var(--_accent); opacity: 1; }
    .v-square .md.is-now { r: 0.95px; }
  `,

  template(el) {
    const script = el.script === 'persian' ? 'persian' : 'western';
    const label = (cls, i, p, size) =>
      `<text class="${cls}" data-n="${i}" x="${f(p.x)}" y="${f(p.y)}" font-size="${size}" text-anchor="middle" dominant-baseline="central">${digits(pad(i), script)}</text>`;
    const hours = Array.from({ length: 24 }, (_, i) => label('hr', i, squarePoint(i / 24, 50, 50, OUTER), 9.2)).join('');
    const minutes = Array.from({ length: 60 }, (_, i) => {
      const dot = squarePoint(i / 60, 50, 50, INNER);
      const dotMark = `<circle class="md" data-n="${i}" cx="${f(dot.x)}" cy="${f(dot.y)}" r="0.45" />`;
      return i % 5 ? dotMark : `${dotMark}${label('mn', i, squarePoint(i / 60, 50, 50, INNER - 4.2), 3.6)}`;
    }).join('');
    const dir = script === 'persian' ? ' direction="ltr"' : '';
    return `<svg class="face v-square" viewBox="0 0 100 100" aria-hidden="true"${dir}>
      ${hours}${minutes}
      ${analogHands(el, { hour: 12, minute: 19, second: 22, tail: 5, width: 1.9, weight: 0.8 })}</svg>`;
  },

  update(el, z, first) {
    const smooth = el.tickRate === 'frame';
    const s = z.seconds + (smooth ? z.millis / 1000 : 0);
    const m = z.minutes + s / 60;
    const h = z.hours + m / 60;
    const aim = (t, r) => angleTo(squarePoint(t, 50, 50, r), 50, 50);
    turnHands(el, { hour: aim(h / 24, OUTER), minute: aim(m / 60, INNER), second: aim(s / 60, INNER) });

    if (first || el.$('.md.is-now')?.dataset.n !== String(z.minutes)) {
      for (const t of el.$$('.is-now')) t.classList.remove('is-now');
      el.$(`.hr[data-n="${z.hours}"]`)?.classList.add('is-now');
      el.$(`.md[data-n="${z.minutes}"]`)?.classList.add('is-now');
      el.$(`.mn[data-n="${z.minutes}"]`)?.classList.add('is-now');
    }
  },
};
