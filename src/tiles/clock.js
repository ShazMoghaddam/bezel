import { BezelElement, define } from '../core/element.js';
import { handAngles, names } from '../core/time.js';

/**
 * <bezel-clock>
 *
 * Attributes
 *   variant       numerals | relief | classic   (default numerals)
 *   theme         sage | cobalt | ember | graphite | blush | stone | midnight | porcelain
 *   hide-seconds  hide the seconds hand
 *   hide-date     hide the date label
 *   sweep         smooth | tick   (default smooth; tick steps once a second)
 */

const VARIANTS = new Set(['numerals', 'relief', 'classic']);
const DEFAULT_THEME = { numerals: 'sage', relief: 'blush', classic: 'porcelain' };

const C = 50; // dial centre in the 100 x 100 viewBox

function hand({ cls, stem, length, width, tail = 0 }) {
  // A thin stem from the hub, then a capsule, like a modern watch hand.
  const stemLine = stem
    ? `<line x1="${C}" y1="${C}" x2="${C}" y2="${C - stem}" stroke-width="${Math.max(0.9, width * 0.32)}" />`
    : '';
  return `<g class="hand ${cls}">
    ${stemLine}
    <line x1="${C}" y1="${stem ? C - stem : C + tail}" x2="${C}" y2="${C - length}" stroke-width="${width}" />
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

class BezelClock extends BezelElement {
  static attributes = ['variant', 'hide-seconds', 'hide-date', 'sweep'];

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
    .numeral { font-family: var(--_font); fill: var(--_ink); font-variant-numeric: lining-nums proportional-nums; }

    /* numerals */
    .v-numerals .numeral { font-weight: var(--bezel-numeral-weight, 300); letter-spacing: -0.035em; }
    .v-numerals .date { font-weight: 650; fill: var(--_ink); font-size: 4.3px; letter-spacing: 0.02em; }

    /* relief */
    .v-relief .numeral { fill: color-mix(in srgb, var(--_surface), #000 5%); filter: url(#deboss); font-weight: 500; letter-spacing: -0.02em; transition: opacity .9s ease, font-size .9s ease; }
    .v-relief .shade { flood-color: color-mix(in srgb, var(--_surface), #000 55%); flood-opacity: .55; }
    .v-relief .glint { flood-color: color-mix(in srgb, var(--_surface), #fff 70%); flood-opacity: .9; }
    .v-relief .date { display: none; }

    /* classic */
    .tick { stroke: var(--_ink); stroke-linecap: round; }
    .tick.minor { stroke-width: 0.35; opacity: .45; }
    .tick.major { stroke-width: 0.9; }
    .v-classic .numeral { font-weight: 560; font-size: 8.2px; }
    .v-classic .date { font-weight: 650; fill: var(--_accent); font-size: 3.6px; letter-spacing: 0.08em; }

    .screen { background:
      radial-gradient(120% 90% at 30% 10%, color-mix(in srgb, var(--_surface), #fff 7%) 0%, var(--_surface) 55%, color-mix(in srgb, var(--_surface), #000 8%) 100%); }
  `;

  #reliefSecond = -1;
  #dateMinute = -1;

  get variant() {
    const v = this.getAttribute('variant');
    return VARIANTS.has(v) ? v : 'numerals';
  }

  get themeName() {
    const t = this.getAttribute('theme');
    return t && BezelClock.themes[t] ? t : DEFAULT_THEME[this.variant];
  }

  get showSeconds() {
    return !this.flag('hide-seconds');
  }

  get tickRate() {
    if (!this.showSeconds) return 'second';
    return this.getAttribute('sweep') === 'tick' ? 'second' : 'frame';
  }

  template(z) {
    const v = this.variant;
    let dial = '';

    if (v === 'numerals') {
      dial = `
        <g class="numerals">
          <text class="numeral" x="49" y="45.5" font-size="52" text-anchor="middle">12</text>
          <text class="numeral" x="19.5" y="68.5" font-size="52" text-anchor="middle">9</text>
          <text class="numeral" x="80.5" y="68.5" font-size="52" text-anchor="middle">3</text>
          <text class="numeral" x="50" y="95" font-size="52" text-anchor="middle">6</text>
        </g>
        <text class="date" x="7" y="93.5"></text>`;
    } else if (v === 'relief') {
      // Numerals follow the ring, but the lower half turns to stay readable (so 6 never reads as 9).
      dial = `<g class="ring">${Array.from({ length: 12 }, (_, i) => {
        const deg = i * 30;
        const rad = (deg * Math.PI) / 180;
        const x = (C + Math.sin(rad) * 35).toFixed(2);
        const y = (C - Math.cos(rad) * 35).toFixed(2);
        const turn = deg > 90 && deg < 270 ? deg - 180 : deg;
        return `<text class="numeral" data-h="${i || 12}" text-anchor="middle" dominant-baseline="central" font-size="15" transform="rotate(${turn} ${x} ${y})" x="${x}" y="${y}">${i || 12}</text>`;
      }).join('')}</g>`;
    } else {
      const ticks = Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        const r1 = major ? 41 : 43;
        return `<line class="tick ${major ? 'major' : 'minor'}" x1="${C}" y1="${C - r1}" x2="${C}" y2="${C - 45.2}" transform="rotate(${i * 6} ${C} ${C})" />`;
      }).join('');
      const nums = Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const a = (h * 30 * Math.PI) / 180;
        const x = C + Math.sin(a) * 33.5;
        const y = C - Math.cos(a) * 33.5;
        return `<text class="numeral" x="${x.toFixed(2)}" y="${y.toFixed(2)}" text-anchor="middle" dominant-baseline="central">${h}</text>`;
      }).join('');
      dial = `${ticks}${nums}<text class="date" x="${C}" y="${C + 16}" text-anchor="middle"></text>`;
    }

    const heavy = v === 'classic' ? 2.2 : 3.1;
    const hands = `
      <g class="hands">
        ${hand({ cls: 'hour', stem: 6, length: v === 'classic' ? 22 : 27, width: heavy })}
        ${hand({ cls: 'minute', stem: 6, length: v === 'classic' ? 36 : 40, width: heavy })}
        ${this.showSeconds ? secondHand(v === 'classic' ? 42 : 46, 8) : ''}
        <circle class="hub" cx="${C}" cy="${C}" r="1.7" />
        ${this.showSeconds ? `<circle class="hub-ring" cx="${C}" cy="${C}" r="1.15" />` : ''}
        <circle class="hub-pin" cx="${C}" cy="${C}" r="0.55" />
      </g>`;

    return `<svg class="face v-${v}" viewBox="0 0 100 100" aria-hidden="true">${DEFS}${dial}${hands}</svg>`;
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
        date.textContent = `${wd} ${z.day}`;
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
      let d = Math.abs(h - pos);
      d = Math.min(d, 12 - d);
      const t = Math.min(1, Math.max(0, (d - 1.2) / 2.6));
      const ease = t * t * (3 - 2 * t);
      el.style.opacity = (1 - ease).toFixed(3);
      el.setAttribute('font-size', (16.5 - ease * 5).toFixed(2));
    }
  }

  describe(z) {
    const time = new Intl.DateTimeFormat(this.locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: this.hour12,
      timeZone: this.timeZone,
    }).format(z.ms);
    return `Clock showing ${time}`;
  }
}

define('bezel-clock', BezelClock);
export { BezelClock };
