/**
 * Dots: a five-by-five grid of dots behind the hands. The four corners and the
 * middle of each edge are picked out in colour, from the palette or `colors`.
 *
 * `numerals="western|roman|persian"` swaps the dots at 12, 3, 6 and 9 for
 * coloured numbers. Without it, the face is dots only.
 */
import { tileColors } from '../core/palettes.js';
import { numeral, analogHands, turnHands } from './shared.js';
import { handAngles } from '../core/time.js';

const XS = [12, 31, 50, 69, 88];
// Clockwise from the top-left corner: the eight dots that take a colour, and their palette slot.
// Eight different hues, spread round the wheel so neighbours never clash.
const ACCENTS = [[0, 0, 0], [2, 0, 7], [4, 0, 2], [4, 2, 10], [4, 4, 4], [2, 4, 1], [0, 4, 9], [0, 2, 6]];
const NUMERAL_AT = { '2,0': 12, '4,2': 3, '2,4': 6, '0,2': 9 };

export const dots = {
  theme: 'porcelain',

  styles: /* css */ `
    .v-dots .dot { fill: var(--_ink); }
    .v-dots .numeral { font-family: var(--_font); font-weight: 700; letter-spacing: -0.03em; }
  `,

  template(el) {
    const colors = tileColors(el);
    const script = el.numeralsOrNone('none');
    const accent = new Map(ACCENTS.map(([c, r, slot], i) => [`${c},${r}`, colors.length >= 12 ? colors[slot] : colors[i % colors.length]]));
    let grid = '';
    XS.forEach((y, row) => XS.forEach((x, col) => {
      const key = `${col},${row}`;
      if (key === '2,2') return; // the hub sits here
      const fill = accent.get(key);
      if (script !== 'none' && NUMERAL_AT[key]) {
        const text = numeral(NUMERAL_AT[key], script);
        const size = script === 'roman' ? Math.min(11, 24 / text.length) : 11;
        grid += `<text class="numeral" x="${x}" y="${y}" font-size="${size}" text-anchor="middle" dominant-baseline="central" style="fill:${fill}">${text}</text>`;
        return;
      }
      grid += `<circle class="dot" cx="${x}" cy="${y}" r="3.3"${fill ? ` style="fill:${fill}"` : ''} />`;
    }));
    const dir = script === 'persian' ? ' direction="ltr"' : '';
    return `<svg class="face v-dots" viewBox="0 0 100 100" aria-hidden="true"${dir}>${grid}${analogHands(el, { hour: 22, minute: 33, second: 38, tail: 8, width: 3.6, weight: 1.25 })}</svg>`;
  },

  update(el, z) {
    turnHands(el, handAngles(z, { smooth: el.tickRate === 'frame' }));
  },
};
