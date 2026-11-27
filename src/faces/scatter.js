/**
 * Scatter: the time in large bright digits, above a tumble of clock numbers that
 * look as if they've been tipped out of a dial.
 *
 * The tumble comes from `seed`, so it stays exactly where it is from minute to
 * minute; change the seed for a different arrangement. With a `palette` or
 * `colors`, every tumbled number takes its own colour.
 */
import { tileColors } from '../core/palettes.js';
import { numeral, digits, seeded, seedOf, f } from './shared.js';

// Clock numbers in dial order, starting at 11 as if read from the top-left.
const ORDER = [11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ROWS = [7, 6, 7, 6];

export const scatter = {
  theme: 'moss',
  tickRate: () => 'minute',

  styles: /* css */ `
    :host([variant="scatter"]) .screen { background: linear-gradient(color-mix(in srgb, var(--_surface), #fff 14%), color-mix(in srgb, var(--_surface), #000 38%)); }
    .v-scatter text { font-family: var(--_font); }
    .v-scatter .now { fill: var(--_accent); font-weight: 800; letter-spacing: -0.03em; }
    .v-scatter .ampm { font-weight: 700; letter-spacing: 0; fill: var(--_ink); }
    .v-scatter .n { fill: var(--_ink); font-weight: 700; letter-spacing: -0.04em; }
  `,

  template(el) {
    const script = el.script;
    const r = seeded(seedOf(el));
    // Plain ink unless the tile asks for colours.
    const colors = el.hasAttribute('palette') || el.hasAttribute('colors') ? tileColors(el) : null;
    let k = 0;
    let last = -1;
    const nums = ROWS.flatMap((count, row) => {
      const y = 47.5 + row * 12.6;
      const xs = Array.from({ length: count }, (_, i) => 17 + (i * 66) / (count - 1));
      if (row % 2) xs.reverse(); // snake, so the numbers run on round the corner like a dial
      return xs.map((x) => {
        const h = ORDER[k++ % 12];
        const size = 11.5 + r() * 4.5;
        const rot = r() * 70 - 35;
        const dx = r() * 5 - 2.5;
        const dy = r() * 5 - 2.5;
        let fill = '';
        if (colors) {
          let i;
          do i = Math.floor(r() * colors.length); while (colors.length > 1 && i === last);
          last = i;
          fill = ` style="fill:${colors[i]}"`;
        }
        return `<text class="n" x="${f(x + dx)}" y="${f(y + dy)}" font-size="${f(size)}" text-anchor="middle" dominant-baseline="central" transform="rotate(${f(rot)} ${f(x + dx)} ${f(y + dy)})"${fill}>${numeral(h, script)}</text>`;
      });
    }).join('');
    const dir = script === 'persian' ? ' direction="ltr"' : '';
    return `<svg class="face v-scatter" viewBox="0 0 100 100" aria-hidden="true"${dir}>
      <text class="now" x="50" y="28" font-size="25" text-anchor="middle"></text>
      ${nums}</svg>`;
  },

  update(el, z) {
    const now = el.$('.now');
    if (!now) return;
    const h12 = el.hour12;
    const h = h12 ? z.hours % 12 || 12 : z.hours;
    const script = el.script === 'persian' ? 'persian' : 'western';
    const text = `${digits(h12 ? h : String(h).padStart(2, '0'), script)}${digits(String(z.minutes).padStart(2, '0'), script)}`;
    const ampm = h12 ? `<tspan class="ampm" font-size="7" dx="1" dy="-11">${z.hours < 12 ? 'am' : 'pm'}</tspan>` : '';
    now.innerHTML = `${text}${ampm}`;
  },
};
