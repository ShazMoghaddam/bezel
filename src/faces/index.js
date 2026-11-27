/**
 * The extra clock faces, keyed by their `variant` name. Each face supplies:
 *
 *   theme              its default theme
 *   styles             CSS, added to the clock's
 *   template(el, z)    markup for the screen
 *   update(el, z, first)
 *   tickRate(el)       optional; otherwise the clock's own (smooth or ticking seconds)
 */
import { scatter } from './scatter.js';
import { dots } from './dots.js';
import { circles } from './circles.js';
import { square } from './square.js';

export const FACES = { scatter, dots, circles, square };
