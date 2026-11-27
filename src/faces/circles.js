/**
 * Circles: nine solid circles in a three-by-three grid, with the hands turning
 * over the middle one. Each circle takes a colour from the palette, or set all
 * nine yourself with `colors` (read left to right, top to bottom; a shorter
 * list repeats).
 *
 * 12, 3, 6 and 9 sit in the middle of each edge; `numerals="roman"` writes them
 * as XII, III, VI and IX, and `numerals="none"` leaves the circles plain. Each
 * number turns black or white to suit its circle.
 */
import { tileColors, inkFor } from '../core/palettes.js';
import { numeral, analogHands, turnHands } from './shared.js';
import { handAngles } from '../core/time.js';

const XS = [18.5, 50, 81.5];
// Palette slots for the nine circles: a spread of hues with no two neighbours alike.
const SLOTS = [3, 6, 10, 1, 2, 7, 0, 5, 9];
const NUMERAL_AT = { 1: 12, 5: 3, 7: 6, 3: 9 };

export const circles = {
  theme: 'porcelain',

  styles: /* css */ `
    .v-circles .numeral { font-family: var(--_font); font-weight: 600; letter-spacing: -0.02em; }
  `,

  template(el) {
    const colors = tileColors(el);
    const own = el.hasAttribute('colors');
    const script = el.numeralsOrNone('western');
    let body = '';
    XS.forEach((y, row) => XS.forEach((x, col) => {
      const i = row * 3 + col;
      const fill = own || colors.length < 12 ? colors[i % colors.length] : colors[SLOTS[i]];
      body += `<circle class="disc" cx="${x}" cy="${y}" r="15" style="fill:${fill}" />`;
      if (script !== 'none' && NUMERAL_AT[i]) {
        const text = numeral(NUMERAL_AT[i], script);
        const size = script === 'roman' ? Math.min(9, 21 / text.length) : 9;
        const ink = inkFor(fill, 'var(--_ink)');
        body += `<text class="numeral" x="${x}" y="${y}" font-size="${size}" text-anchor="middle" dominant-baseline="central" style="fill:${ink}">${text}</text>`;
      }
    }));
    const dir = script === 'persian' ? ' direction="ltr"' : '';
    return `<svg class="face v-circles" viewBox="0 0 100 100" aria-hidden="true"${dir}>${body}${analogHands(el, { hour: 21, minute: 31, second: 35, tail: 7, width: 2.8, weight: 1.1 })}</svg>`;
  },

  update(el, z) {
    turnHands(el, handAngles(z, { smooth: el.tickRate === 'frame' }));
  },
};
