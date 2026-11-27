/**
 * Colour palettes shared by every face that uses more than one colour
 * (the Circles, Dots, Scatter and Grammar clocks).
 *
 * Each palette has twelve colours that run once around the colour wheel, so any
 * face can take as many as it needs and still get a full spread of hues:
 *
 *   vibrant  bold, saturated colours (the default)
 *   neon     electric, glowing colours; best on dark faces
 *   pastel   soft, milky colours
 *   subtle   muted, earthy colours for a quieter look
 *   spring   blossom, daffodil, new leaf, bluebell
 *   summer   bright sun, sea and ice lolly colours
 *   autumn   rust, burnt orange, mustard, moss, plum
 *   winter   holly, frost, pine, midnight, snow
 *
 * `colors="#f00, #0a0, ..."` replaces the palette with colours of your own.
 */

export const PALETTES = {
  vibrant: ['#FF3B30', '#FF7A00', '#FFC300', '#A6E22E', '#22C55E', '#00C2A8', '#00B4FF', '#2F6BFF', '#6C4BFF', '#B44CFF', '#FF3DA8', '#FF6F61'],
  neon: ['#FF1744', '#FF6D00', '#FFEA00', '#C6FF00', '#39FF14', '#1DE9B6', '#00E5FF', '#2979FF', '#651FFF', '#D500F9', '#FF00A8', '#FFAB00'],
  pastel: ['#FFB3BA', '#FFCBA4', '#FFF3B0', '#DFF5B5', '#B9F2C8', '#B4EAE2', '#B3E5FC', '#B8C9FF', '#C9BFFF', '#E2C2FF', '#FFC2E2', '#F5D6C6'],
  subtle: ['#B5615A', '#C0703F', '#C9A657', '#9BA65A', '#6E9B7B', '#5E9A96', '#6A93AE', '#5C6F9E', '#7D6FA3', '#A3769A', '#C08A8A', '#8C6A55'],
  spring: ['#FF8FAB', '#FFB86B', '#FFE66D', '#C5E86C', '#7BD389', '#5ED1B6', '#7FD6F2', '#8FB3FF', '#B19CFF', '#E09CFF', '#FF9CD6', '#F7A072'],
  summer: ['#FF4D4D', '#FF8C42', '#FFD23F', '#B5E61D', '#3DDC84', '#1FC8C0', '#29B6F6', '#1E88E5', '#7C4DFF', '#E040FB', '#FF5CA8', '#FFA987'],
  autumn: ['#9E2A2B', '#C1440E', '#D96C1A', '#E9A23B', '#C9B037', '#8A9A3B', '#5B7F3A', '#2F6F68', '#4A5F8A', '#6B4C8A', '#8C4A3C', '#B07A4F'],
  winter: ['#E63946', '#F4A6A6', '#FFE8A3', '#D7E8BA', '#2E7D5B', '#7FC8C2', '#A8DADC', '#6FA8DC', '#2F4B7C', '#8E7CC3', '#C9B6E4', '#EDEFF2'],
};

export const PALETTE_NAMES = Object.keys(PALETTES);

// Hex, a named colour, or a colour function. Anything else is ignored, so an attribute can't inject CSS.
const COLOUR = /^(#[0-9a-f]{3,8}|[a-z]{3,20}|(rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\([\d\s.,%/+-]+\))$/i;

/** Splits a `colors` attribute into valid colours. */
export function parseColors(value) {
  return String(value ?? '')
    .split(/,(?![^(]*\))/)
    .map((c) => c.trim())
    .filter((c) => COLOUR.test(c));
}

/**
 * The colours a tile should use: its own `colors` if set, else the named `palette`,
 * else `fallback`. Returns `null` when neither attribute is set and there's no fallback.
 */
export function tileColors(el, fallback = 'vibrant') {
  const own = parseColors(el.getAttribute('colors'));
  if (own.length) return own;
  const name = el.getAttribute('palette');
  if (PALETTES[name]) return PALETTES[name];
  return fallback ? PALETTES[fallback] : null;
}

/**
 * Black or white, whichever reads better on `color`. Works for hex colours; for
 * anything else it returns `fallback`, so the face's own ink is used.
 */
export function inkFor(color, fallback = null) {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})([0-9a-f]{2})?$/i.exec(color ?? '');
  if (!m) return fallback;
  let hex = m[1];
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
  const n = parseInt(hex, 16);
  const lin = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  // 0.3 rather than the textbook 0.18: white on mid-tones (teal, orange) looks right on a watch face.
  return L > 0.3 ? '#111111' : '#FFFFFF';
}
