/**
 * Clock-hand designs shared by every analog dial (<bezel-clock> and the
 * mini dial in <bezel-glance>).
 *
 *   modern     the original design: a thin stem from the hub, then a capsule
 *   lollipop   tapered baton hands, a layered pivot cap like the modern hands
 *              (hand-coloured disc, accent ring, face-coloured pin) and a fine
 *              seconds hand that ends in a round dot
 *   slender    needle-thin tapered hands with a short tail, a small pivot and a
 *              hairline seconds hand with a round counterweight
 *
 * Each dial keeps drawing its own `modern` hands, so the original look is
 * untouched; this module adds the alternatives and the shared parsing.
 * Colours come from the tile's theme variables: --_hand for the hour and
 * minute hands and pivot, --_accent for the seconds hand.
 */

export const HAND_STYLES = ['modern', 'lollipop', 'slender'];

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
    ${seconds ? `<circle class="lp-ring" cx="${cx}" cy="${cy}" r="${f(w(1.35))}" stroke-width="${f(w(0.6))}" />` : ''}
    <circle class="lp-pin" cx="${cx}" cy="${cy}" r="${f(w(0.62))}" />`;
}

/**
 * Markup for the slender hands, drawn pointing at 12 like the lollipop hands.
 *
 * The hour and minute hands run a little past the pivot, as on a watch, and the
 * seconds hand carries a small round counterweight on its tail.
 */
export function slenderHands({
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
  const secondHand = seconds
    ? `<g class="${extra} sl-sec ${classes.second}">
        <line x1="${cx}" y1="${f(cy + tail)}" x2="${cx}" y2="${f(cy - second)}" stroke-width="${f(w(0.26))}" />
        <circle cx="${cx}" cy="${f(cy + tail - w(0.9))}" r="${f(w(0.85))}" />
      </g>`
    : '';
  return `
    <g class="${extra} sl ${classes.hour}"><path class="sl-arm" d="${baton(cx, cy + w(2.4), hour + w(2.4), w(0.72), w(0.48))}" /></g>
    <g class="${extra} sl ${classes.minute}"><path class="sl-arm" d="${baton(cx, cy + w(3.2), minute + w(3.2), w(0.5), w(0.28))}" /></g>
    ${secondHand}
    <circle class="sl-hub" cx="${cx}" cy="${cy}" r="${f(w(1.45))}" />
    <circle class="sl-pin" cx="${cx}" cy="${cy}" r="${f(w(0.52))}" />`;
}

/** Markup for any hand style except `modern`, which each dial draws itself. */
export function styledHands(style, options) {
  return style === 'slender' ? slenderHands(options) : lollipopHands(options);
}

/** Colours for the lollipop and slender hands. Dials include this in their styles. */
export const HANDS_CSS = /* css */ `
  .lp-arm, .lp-pivot { fill: var(--_hand); }
  .lp-sec line { stroke: var(--_accent); stroke-linecap: round; }
  .lp-sec circle { fill: var(--_accent); }
  .lp-ring { fill: none; stroke: var(--_accent); }
  .lp-pin { fill: var(--_surface); }
  .sl-arm, .sl-hub { fill: var(--_hand); }
  .sl-pin { fill: var(--_surface); }
  .sl-sec line { stroke: var(--_accent); stroke-linecap: round; }
  .sl-sec circle { fill: var(--_accent); }
`;
