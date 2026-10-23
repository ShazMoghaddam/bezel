import { BezelElement, define } from '../core/element.js';
import { handAngles, names, zoned, isValidTimeZone } from '../core/time.js';
import { esc } from '../core/frame.js';
import { handStyle, lollipopHands, HANDS_CSS } from '../core/hands.js';

/**
 * <bezel-clock>
 *
 * Attributes
 *   variant          numerals | relief | classic   (default numerals)
 *   numerals         western | roman | persian      (default western)
 *   theme            sage | cobalt | ember | graphite | blush | stone | midnight | porcelain
 *   night-theme      a theme to switch to at night (see README)
 *   second-timezone  classic face only: a small second dial for another city, e.g. "America/New_York"
 *   second-label     name shown under that dial (default: the city from the time zone)
 *   hide-seconds     hide the seconds hand
 *   hide-date        hide the date label
 *   sweep            smooth | tick   (default smooth; tick steps once a second)
 *   hands            modern | lollipop   (default modern)
 */

const VARIANTS = new Set(['numerals', 'relief', 'classic']);
const SCRIPTS = new Set(['western', 'roman', 'persian']);
const DEFAULT_THEME = { numerals: 'sage', relief: 'blush', classic: 'porcelain' };

// Clocks traditionally write four as IIII, which balances VIII on the other side of the dial.
const ROMAN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** The numeral for hour `h` (1 to 12) in a script. */
export function numeral(h, script = 'western') {
  if (script === 'roman') return ROMAN[h % 12];
  if (script === 'persian') return String(h).replace(/\d/g, (d) => PERSIAN_DIGITS[d]);
  return String(h);
}

/** "America/New_York" becomes "New York". */
export function cityName(timeZone) {
  return String(timeZone ?? '').split('/').pop().replace(/_/g, ' ');
}

const C = 50; // dial centre in the 100 x 100 viewBox

function hand({ cls, stem, length, width, cx = C, cy = C }) {
  // A thin stem from the hub, then a capsule, like a modern watch hand.
  return `<g class="hand ${cls}">
    <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - stem}" stroke-width="${Math.max(0.5, width * 0.32)}" />
    <line x1="${cx}" y1="${cy - stem}" x2="${cx}" y2="${cy - length}" stroke-width="${width}" />
  </g>`;
}

function secondHand(length, tail) {
  return `<g class="hand second">
    <line x1="${C}" y1="${C + tail}" x2="${C}" y2="${C - length}" stroke-width="0.55" />
  </g>`;
}

const DEFS = /* svg */ `
<defs>
  <filter id="lift" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
    <feDropShadow dx="0" dy="0.45" stdDeviation="0.55" flood-color="#000" flood-opacity="0.28" />
  </filter>
  <filter id="deboss" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feFlood class="shade" result="shade" />
    <feComposite in="shade" in2="SourceAlpha" operator="out" result="outside" />
    <feOffset in="outside" dx="0.35" dy="0.45" result="shifted" />
    <feGaussianBlur in="shifted" stdDeviation="0.28" result="soft" />
    <feComposite in="soft" in2="SourceAlpha" operator="in" result="inner" />
    <feFlood class="glint" result="glint" />
    <feComposite in="glint" in2="SourceAlpha" operator="in" result="glyph" />
    <feOffset in="glyph" dx="0.28" dy="0.34" result="glintShift" />
    <feGaussianBlur in="glintShift" stdDeviation="0.12" result="glintSoft" />
    <feMerge>
      <feMergeNode in="glintSoft" />
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="inner" />
    </feMerge>
  </filter>
</defs>`;

/** Placement of the four big numerals on the numerals face, per script. */
const BIG = {
  western: { size: 52, items: [[12, 49, 45.5], [9, 19.5, 68.5], [3, 80.5, 68.5], [6, 50, 95]] },
  roman: { size: 37, items: [[12, 50, 41], [9, 22, 64.5], [3, 78, 64.5], [6, 50, 92]] },
  persian: { size: 50, items: [[12, 50, 44], [9, 20, 69], [3, 80, 69], [6, 50, 95]] },
};

class BezelClock extends BezelElement {
  static attributes = ['variant', 'numerals', 'hide-seconds', 'hide-date', 'sweep', 'second-timezone', 'second-label', 'hands'];

  static themes = {
    sage: { surface: '#5C9268', ink: '#0A0C0A', hand: '#FFFFFF', accent: '#E3F4E6' },
    cobalt: { surface: '#2D4BD2', ink: '#F3F5FF', hand: '#FFFFFF', accent: '#FFD43B' },
    ember: { surface: '#E25A2C', ink: '#1A0E09', hand: '#FFF6EF', accent: '#FFF6EF' },
    graphite: { surface: '#121315', ink: '#F2F2F0', hand: '#F2F2F0', accent: '#FF6B35' },
    blush: { surface: '#E7C8C2', ink: '#5A2A26', hand: '#6E2B27', accent: '#E8409E' },
    stone: { surface: '#D9DADC', ink: '#2B2D31', hand: '#25272B', accent: '#FF5A1F' },
    midnight: { surface: '#1B1F27', ink: '#E9E3D6', hand: '#E9E3D6', accent: '#FFB547' },
    porcelain: { surface: '#F4F4F2', ink: '#17181A', hand: '#17181A', accent: '#FF5A1F' },
  };

  static styles = /* css */ `
    .face { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; }
    .hand line { stroke: var(--_hand); stroke-linecap: round; }
    .hand.second line { stroke: var(--_accent); }
    .hands { filter: url(#lift); }
    .hub { fill: var(--_hand); }
    .hub-ring { fill: none; stroke: var(--_accent); stroke-width: 0.55; }
    .hub-pin { fill: var(--_surface); }
    ${HANDS_CSS}
    .numeral { font-family: var(--_font); fill: var(--_ink); font-variant-numeric: lining-nums proportional-nums; }
    .s-roman .numeral { letter-spacing: -0.02em; }

    /* numerals */
    .v-numerals .numeral { font-weight: var(--bezel-numeral-weight, 300); letter-spacing: -0.035em; }
    .v-numerals.s-roman .numeral { letter-spacing: -0.06em; }
    .corner-date { position: absolute; z-index: 0; inset-inline-start: calc(7cqw + var(--_safe)); inset-block-end: calc(6.4cqw + var(--_safe));
      font-weight: 650; font-size: 4.3cqw; line-height: 1; letter-spacing: 0.02em; color: var(--_ink); font-family: var(--_font); }

    /* relief */
    .v-relief .numeral { fill: color-mix(in srgb, var(--_surface), #000 5%); filter: url(#deboss); font-weight: 500; letter-spacing: -0.02em; transition: opacity .9s ease, font-size .9s ease; }
    .v-relief .shade { flood-color: color-mix(in srgb, var(--_surface), #000 55%); flood-opacity: .55; }
    .v-relief .glint { flood-color: color-mix(in srgb, var(--_surface), #fff 70%); flood-opacity: .9; }
    .v-relief .date { display: none; }

    /* classic */
    .tick { stroke: var(--_ink); stroke-linecap: round; }
    .tick.minor { stroke-width: 0.35; opacity: .45; }
    .tick.major { stroke-width: 0.9; }
    .v-classic .numeral { font-weight: 560; }
    .v-classic .date { font-weight: 650; fill: var(--_accent); font-size: 3.6px; letter-spacing: 0.08em; }
    .sub .plate { fill: color-mix(in srgb, var(--_surface), var(--_ink) 6%); stroke: color-mix(in srgb, var(--_ink), transparent 80%); stroke-width: 0.3; }
    .sub .t { stroke: var(--_ink); stroke-width: 0.4; stroke-linecap: round; opacity: .6; }
    .sub .hand line { stroke: var(--_ink); }
    .sub .pin { fill: var(--_accent); }
    .sub .city { font-family: var(--_font); font-size: 2.5px; font-weight: 650; letter-spacing: 0.1em; fill: var(--_ink); opacity: .75; }
    .sub .night { fill: color-mix(in srgb, var(--_ink), transparent 88%); }

    .screen { background:
      radial-gradient(120% 90% at 30% 10%, color-mix(in srgb, var(--_surface), #fff 7%) 0%, var(--_surface) 55%, color-mix(in srgb, var(--_surface), #000 8%) 100%); }
  `;

  #reliefSecond = -1;
  #dateMinute = -1;

  get variant() {
    const v = this.getAttribute('variant');
    return VARIANTS.has(v) ? v : 'numerals';
  }

  get script() {
    const s = this.getAttribute('numerals');
    return SCRIPTS.has(s) ? s : 'western';
  }

  get dayTheme() {
    const t = this.getAttribute('theme');
    return t && BezelClock.themes[t] ? t : DEFAULT_THEME[this.variant];
  }

  get secondZone() {
    const tz = this.getAttribute('second-timezone');
    return this.variant === 'classic' && tz && isValidTimeZone(tz) ? tz : null;
  }

  get hands() {
    return handStyle(this.getAttribute('hands'));
  }

  get showSeconds() {
    return !this.flag('hide-seconds');
  }

  get tickRate() {
    if (!this.showSeconds) return 'second';
    return this.getAttribute('sweep') === 'tick' ? 'second' : 'frame';
  }

  template() {
    const v = this.variant;
    const script = this.script;
    let dial = '';

    if (v === 'numerals') {
      const { size, items } = BIG[script];
      dial = `
        <g class="numerals">${items
          .map(([h, x, y]) => `<text class="numeral" x="${x}" y="${y}" font-size="${size}" text-anchor="middle">${numeral(h, script)}</text>`)
          .join('')}</g>
`;
    } else if (v === 'relief') {
      // Numerals follow the ring, but the lower half turns to stay readable (so 6 never reads as 9).
      dial = `<g class="ring">${Array.from({ length: 12 }, (_, i) => {
        const h = i || 12;
        const deg = i * 30;
        const rad = (deg * Math.PI) / 180;
        const x = (C + Math.sin(rad) * 35).toFixed(2);
        const y = (C - Math.cos(rad) * 35).toFixed(2);
        const turn = deg > 90 && deg < 270 ? deg - 180 : deg;
        const text = numeral(h, script);
        // Long Roman numerals (VIII) shrink so they don't crowd their neighbours.
        const scale = script === 'roman' ? Math.min(1, 2 / Math.max(2, text.length)) * 0.95 : 1;
        return `<text class="numeral" data-h="${h}" data-scale="${scale.toFixed(3)}" text-anchor="middle" dominant-baseline="central" font-size="${(15 * scale).toFixed(2)}" transform="rotate(${turn} ${x} ${y})" x="${x}" y="${y}">${text}</text>`;
      }).join('')}</g>`;
    } else {
      const ticks = Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        const r1 = major ? 41 : 43;
        return `<line class="tick ${major ? 'major' : 'minor'}" x1="${C}" y1="${C - r1}" x2="${C}" y2="${C - 45.2}" transform="rotate(${i * 6} ${C} ${C})" />`;
      }).join('');
      const roman = script === 'roman';
      const zone = this.secondZone;
      const nums = Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        if (zone && h === 6) return ''; // the second dial takes the 6 o'clock position, as on a watch
        const a = (h * 30 * Math.PI) / 180;
        const r = roman ? 32.5 : 33.5;
        const text = numeral(h, script);
        const size = roman ? Math.min(7.4, 15 / Math.max(2, text.length)) : 8.2;
        return `<text class="numeral" x="${(C + Math.sin(a) * r).toFixed(2)}" y="${(C - Math.cos(a) * r).toFixed(2)}" font-size="${size.toFixed(2)}" text-anchor="middle" dominant-baseline="central">${text}</text>`;
      }).join('');

      let sub = '';
      if (zone) {
        const sx = C;
        const sy = 68;
        const subTicks = Array.from({ length: 12 }, (_, i) =>
          `<line class="t" x1="${sx}" y1="${sy - 7.6}" x2="${sx}" y2="${sy - (i % 3 === 0 ? 6.2 : 6.9)}" transform="rotate(${i * 30} ${sx} ${sy})" />`,
        ).join('');
        const label = this.getAttribute('second-label') || cityName(zone);
        sub = `<g class="sub">
          <circle class="plate" cx="${sx}" cy="${sy}" r="8.6" />
          <path class="night" d="" />
          ${subTicks}
          ${hand({ cls: 'sub-hour', stem: 1.4, length: 4.4, width: 1.1, cx: sx, cy: sy })}
          ${hand({ cls: 'sub-minute', stem: 1.4, length: 6.6, width: 1.1, cx: sx, cy: sy })}
          <circle class="pin" cx="${sx}" cy="${sy}" r="0.7" />
          <text class="city" x="${sx}" y="${sy + 13.2}" text-anchor="middle">${esc(label.toLocaleUpperCase(this.locale))}</text>
        </g>`;
      }
      dial = `${ticks}${nums}${sub}<text class="date" x="${C}" y="${zone ? C - 15 : C + 16}" text-anchor="middle"></text>`;
    }

    const heavy = v === 'classic' ? 2.2 : 3.1;
    const classic = v === 'classic';
    const hands = this.hands === 'lollipop'
      ? `<g class="hands">${lollipopHands({
          hour: classic ? 21 : 26,
          minute: classic ? 33.5 : 39,
          second: classic ? 31.5 : 37,
          tail: classic ? 7 : 8,
          weight: classic ? 1 : 1.12,
          seconds: this.showSeconds,
          extra: 'hand',
        })}</g>`
      : `
      <g class="hands">
        ${hand({ cls: 'hour', stem: 6, length: v === 'classic' ? 22 : 27, width: heavy })}
        ${hand({ cls: 'minute', stem: 6, length: v === 'classic' ? 36 : 40, width: heavy })}
        ${this.showSeconds ? secondHand(v === 'classic' ? 42 : 46, 8) : ''}
        <circle class="hub" cx="${C}" cy="${C}" r="1.7" />
        ${this.showSeconds ? `<circle class="hub-ring" cx="${C}" cy="${C}" r="1.15" />` : ''}
        <circle class="hub-pin" cx="${C}" cy="${C}" r="0.55" />
      </g>`;

    const dir = script === 'persian' ? ' direction="ltr"' : '';
    // On the Numerals face the date sits in the corner, as HTML so it can move in when corners get rounder.
    const corner = v === 'numerals' ? '<span class="date corner-date" aria-hidden="true"></span>' : '';
    return `${corner}<svg class="face v-${v} s-${script}" viewBox="0 0 100 100" aria-hidden="true"${dir}>${DEFS}${dial}${hands}</svg>`;
  }

  update(z, first) {
    const smooth = this.tickRate === 'frame';
    const a = handAngles(z, { smooth });
    this.$('.hour')?.setAttribute('transform', `rotate(${a.hour.toFixed(3)} ${C} ${C})`);
    this.$('.minute')?.setAttribute('transform', `rotate(${a.minute.toFixed(3)} ${C} ${C})`);
    this.$('.second')?.setAttribute('transform', `rotate(${a.second.toFixed(3)} ${C} ${C})`);

    if (first || z.minutes !== this.#dateMinute) {
      this.#dateMinute = z.minutes;
      const date = this.$('.date');
      if (date && !this.flag('hide-date')) {
        const wd = names(this.locale).weekdayShort[z.weekday].replace('.', '').toLocaleUpperCase(this.locale);
        const day = this.script === 'persian' ? numeral(z.day, 'persian') : z.day;
        date.textContent = `${wd} ${day}`;
      }
      const zone = this.secondZone;
      if (zone) {
        const s = handAngles(zoned(z.ms, zone), { smooth: false });
        this.$('.sub-hour')?.setAttribute('transform', `rotate(${s.hour.toFixed(2)} ${C} 68)`);
        this.$('.sub-minute')?.setAttribute('transform', `rotate(${s.minute.toFixed(2)} ${C} 68)`);
      }
    }

    if (this.variant === 'relief' && (first || z.seconds !== this.#reliefSecond)) {
      this.#reliefSecond = z.seconds;
      this.#relief(a.minute);
    }
  }

  /** Numerals near the minute hand rise to full size; the rest recede into the surface. */
  #relief(minuteAngle) {
    const pos = minuteAngle / 30; // in hours, 0..12
    for (const el of this.$$('.numeral')) {
      const h = Number(el.dataset.h) % 12;
      const scale = Number(el.dataset.scale) || 1;
      let d = Math.abs(h - pos);
      d = Math.min(d, 12 - d);
      const t = Math.min(1, Math.max(0, (d - 1.2) / 2.6));
      const ease = t * t * (3 - 2 * t);
      el.style.opacity = (1 - ease).toFixed(3);
      el.setAttribute('font-size', ((16.5 - ease * 5) * scale).toFixed(2));
    }
  }

  describe(z) {
    const fmt = (tz) =>
      new Intl.DateTimeFormat(this.locale, { hour: 'numeric', minute: '2-digit', hour12: this.hour12, timeZone: tz }).format(z.ms);
    const zone = this.secondZone;
    const second = zone ? `, ${fmt(zone)} in ${this.getAttribute('second-label') || cityName(zone)}` : '';
    return `Clock showing ${fmt(this.timeZone)}${second}`;
  }
}

define('bezel-clock', BezelClock);
export { BezelClock };
