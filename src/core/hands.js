/**
 * Clock-hand designs shared by every analog dial (<bezel-clock> and the
 * mini dial in <bezel-glance>).
 *
 *   modern     the original design: a thin stem from the hub, then a capsule
 *   lollipop   tapered baton hands, a pivot cap with a dark pin, and a fine
 *              seconds hand that ends in a round dot
 *
 * Each dial keeps drawing its own `modern` hands, so the original look is
 * untouched; this module adds the alternative and the shared parsing.
 * Colours come from the tile's theme variables: --_hand for the hour and
 * minute hands and pivot, --_accent for the seconds hand.
 */

export const HAND_STYLES = ['modern', 'lollipop'];

/** The hand design named by a `hands` attribute, or the default. */
export function handStyle(value) {
  return HAND_STYLES.includes(value) ? value : 'modern';
}

const f = (n) => Number(n.toFixed(3));

/**
 * A tapered baton pointing at 12 o'clock: `base` half-width at the hub,
 * `tip` half-width at the end, both ends rounded.
 */
export function baton(cx, cy, length, base, tip) {
  const top = cy - length;
  return `M${f(cx - base)} ${f(cy)} L${f(cx - tip)} ${f(top)} A${f(tip)} ${f(tip)} 0 0 1 ${f(cx + tip)} ${f(top)} L${f(cx + base)} ${f(cy)} A${f(base)} ${f(base)} 0 0 1 ${f(cx - base)} ${f(cy)} Z`;
}

/**
 * Markup for the lollipop hands, drawn pointing at 12 so the dial's own
 * update() can rotate them like any other hand.
 *
 * Lengths are in the dial's 100 x 100 viewBox. `weight` scales the widths for
 * small dials, where the reference proportions would look too thin.
 */
export function lollipopHands({
  cx = 50,
  cy = 50,
  hour,
  minute,
  second,
  tail = 7,
  weight = 1,
  seconds = true,
  classes = { hour: 'hour', minute: 'minute', second: 'second' },
  extra = '',
}) {
  const w = (n) => n * weight;
  const dot = w(2.9);
  const secondHand = seconds
    ? `<g class="${extra} lp-sec ${classes.second}">
        <line x1="${cx}" y1="${f(cy + tail)}" x2="${cx}" y2="${f(cy - second + dot * 0.6)}" stroke-width="${f(w(0.6))}" />
        <circle cx="${cx}" cy="${f(cy - second)}" r="${f(dot)}" />
      </g>`
    : '';
  return `
    <g class="${extra} lp ${classes.hour}"><path class="lp-arm" d="${baton(cx, cy, hour, w(1.35), w(0.95))}" /></g>
    <g class="${extra} lp ${classes.minute}"><path class="lp-arm" d="${baton(cx, cy, minute, w(1.2), w(0.72))}" /></g>
    ${secondHand}
    <circle class="lp-pivot" cx="${cx}" cy="${cy}" r="${f(w(2.05))}" />
    <circle class="lp-pin" cx="${cx}" cy="${cy}" r="${f(w(0.62))}" />`;
}

/** Colours for the lollipop hands. Dials include this in their styles. */
export const HANDS_CSS = /* css */ `
  .lp-arm, .lp-pivot { fill: var(--_hand); }
  .lp-sec line { stroke: var(--_accent); stroke-linecap: round; }
  .lp-sec circle { fill: var(--_accent); }
  .lp-pin { fill: color-mix(in srgb, var(--_hand), #000 88%); }
`;
