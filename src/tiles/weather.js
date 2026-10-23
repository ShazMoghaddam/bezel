import { BezelElement, define } from '../core/element.js';
import { formatClock } from '../core/time.js';
import { esc } from '../core/frame.js';
import { icons, skyIcon } from '../core/icons.js';
import { nextSunEvent, isoClock, aqiBand } from '../core/weather.js';
import { WeatherSource, WEATHER_ATTRIBUTES } from '../core/weather-source.js';

/**
 * <bezel-weather>
 *
 * Attributes
 *   location      place name, geocoded with Open-Meteo (e.g. "Lisbon")
 *   latitude      and longitude, instead of a name
 *   units         metric | imperial (default: from locale)
 *   refresh       minutes between updates (default 15, minimum 5)
 *   hide-time     hide the clock in the corner
 *   still         turn off the drifting clouds and rain
 *
 * Property
 *   weather       assign your own data object to skip the network
 *
 * The sky is painted from the live conditions, day or night.
 */

const SKIES = {
  'clear-day': ['#1F6FCF', '#4F9BE6', '#A9D3F5'],
  'clear-night': ['#070D22', '#14224A', '#2B3F73'],
  'partly-day': ['#3779C8', '#6EA6DF', '#B8D6F0'],
  'partly-night': ['#0E1630', '#1E2C52', '#37466E'],
  'cloudy-day': ['#5D7186', '#8A9CAE', '#B9C5D0'],
  'cloudy-night': ['#141A24', '#262F3D', '#3C4657'],
  'fog-day': ['#7F8A95', '#A6AFB7', '#CDD2D6'],
  'fog-night': ['#1C2129', '#323843', '#4A515C'],
  'drizzle-day': ['#4C6175', '#72879B', '#9AAABA'],
  'drizzle-night': ['#121922', '#222D3A', '#344152'],
  'rain-day': ['#3E5166', '#5E7389', '#8597A9'],
  'rain-night': ['#0D131B', '#1C2633', '#2C3848'],
  'snow-day': ['#7E93AA', '#AEBFCF', '#DCE5ED'],
  'snow-night': ['#1D2636', '#36435A', '#56647C'],
  'storm-day': ['#262B38', '#3E4456', '#5B6276'],
  'storm-night': ['#0B0D13', '#1A1E29', '#2C3141'],
};

const CLOUDS = { clear: 0, partly: 3, cloudy: 6, fog: 0, drizzle: 6, rain: 6, snow: 5, storm: 6 };

/*
 * The sky art is SVG in a 100 x 100 box, scaled to cover the tile, so every shape stays sharp at
 * any size. Shapes use soft gradients rather than blur, which keeps them gentle without going fuzzy.
 * Animations are plain CSS on SVG groups, so `still` and reduced motion turn them off as before.
 */

// [x, y, width, opacity, drift seconds] in percent of the tile.
// The first three make a partly cloudy sky around the sun; all six make an overcast one.
// Later clouds sit lower and fainter so the temperature stays easy to read.
const CLOUD_SEEDS = [
  [56, 25, 48, 0.96, 52],
  [-18, 10, 58, 0.7, 64],
  [26, 48, 52, 0.5, 58],
  [62, 58, 50, 0.46, 72],
  [-12, 66, 58, 0.4, 60],
  [32, 78, 62, 0.32, 80],
];

// Cloud tops and undersides by weather and time of day.
const CLOUD_TONES = {
  day: ['#FFFFFF', '#D9E3EF'],
  grey: ['#F1F4F8', '#B4BFCC'],
  storm: ['#C6CDD8', '#7C8695'],
  night: ['#8A96AC', '#4A566C'],
};

const f1 = (n) => Number(n.toFixed(2));

/** One cloud: overlapping puffs on a rounded base, filled with a single top-to-bottom gradient. */
function cloud([x, y, w, o, dur], i, dim) {
  const k = w / 48; // the cloud is drawn 48 x 22 units, then scaled
  const puffs = '<circle cx="13" cy="14" r="8"/><circle cx="23" cy="9.5" r="10"/><circle cx="34" cy="12" r="8.5"/><circle cx="41.5" cy="15.5" r="6"/><ellipse cx="25" cy="17" rx="19" ry="5"/>';
  return `<g class="drift" style="--d:${dur}s;--delay:${-i * 7}s"><g transform="translate(${x} ${y}) scale(${f1(k)})" opacity="${f1(o * (dim ? 0.6 : 1))}">
      <g class="cloud-shade" transform="translate(0.8 1.6)">${puffs}</g>
      <g class="cloud-body">${puffs}</g>
    </g></g>`;
}

const STARS = [[12, 18, 0.35], [28, 9, 0.28], [47, 22, 0.32], [66, 12, 0.26], [84, 26, 0.36], [74, 40, 0.24], [18, 44, 0.3], [92, 8, 0.24], [38, 34, 0.22], [57, 5, 0.3], [6, 30, 0.22], [90, 46, 0.2]];

function skyArt(sky, isDay) {
  const tone = !isDay ? CLOUD_TONES.night : sky === 'storm' ? CLOUD_TONES.storm : sky === 'rain' || sky === 'drizzle' || sky === 'snow' ? CLOUD_TONES.grey : CLOUD_TONES.day;
  const defs = `<defs>
      <mask id="moon-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><circle cx="80.4" cy="29.4" r="5.9" fill="#000"/></mask>
      <linearGradient id="cloud-fill" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="22"><stop offset="0" stop-color="${tone[0]}"/><stop offset="1" stop-color="${tone[1]}"/></linearGradient>
      <radialGradient id="sun-disc" cx=".4" cy=".38" r=".7"><stop offset="0" stop-color="#FFFDF2"/><stop offset=".55" stop-color="#FFEFB0"/><stop offset="1" stop-color="#FFD966"/></radialGradient>
      <radialGradient id="sun-halo"><stop offset="0" stop-color="#FFF4CC" stop-opacity=".75"/><stop offset=".35" stop-color="#FFE7A3" stop-opacity=".28"/><stop offset="1" stop-color="#FFE7A3" stop-opacity="0"/></radialGradient>
      <radialGradient id="moon-halo"><stop offset="0" stop-color="#E8ECF8" stop-opacity=".35"/><stop offset="1" stop-color="#E8ECF8" stop-opacity="0"/></radialGradient>
      <radialGradient id="fog-fill"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <pattern id="rain-p" patternUnits="userSpaceOnUse" width="11" height="16"><g stroke="#fff" stroke-opacity=".55" stroke-width=".3" stroke-linecap="round"><line x1="2.4" y1="0.5" x2="1.7" y2="4"/><line x1="8.2" y1="8.6" x2="7.5" y2="12.1"/><line x1="5.3" y1="12.4" x2="4.9" y2="14.4"/></g></pattern>
      <pattern id="snow-p" patternUnits="userSpaceOnUse" width="24" height="24"><g fill="#fff" fill-opacity=".92"><circle cx="3" cy="4" r=".75"/><circle cx="14" cy="2" r=".5"/><circle cx="20" cy="11" r=".8"/><circle cx="8" cy="15" r=".55"/><circle cx="17" cy="20" r=".65"/><circle cx="2" cy="22" r=".45"/></g></pattern>
    </defs>`;

  const parts = [];
  if (isDay && (sky === 'clear' || sky === 'partly')) {
    parts.push(`<g class="sun"${sky === 'partly' ? ' opacity=".85"' : ''}><circle class="glow" cx="77" cy="32" r="34" fill="url(#sun-halo)"/><circle cx="77" cy="32" r="9.5" fill="url(#sun-disc)"/></g>`);
  }
  if (!isDay && (sky === 'clear' || sky === 'partly')) {
    parts.push(`<g class="stars">${STARS.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" style="--delay:${-i * 0.7}s"/>`).join('')}</g>`);
    // A crescent, cut out with a mask so the sky shows through cleanly.
    parts.push(`<g class="moon"><circle cx="77" cy="32" r="20" fill="url(#moon-halo)"/><circle cx="77" cy="32" r="6.5" fill="#EEF1F8" mask="url(#moon-cut)"/></g>`);
  }
  const count = CLOUDS[sky] ?? 3;
  if (count) parts.push(`<g class="clouds">${CLOUD_SEEDS.slice(0, count).map((seed, i) => cloud(seed, i, !isDay)).join('')}</g>`);
  if (sky === 'fog') {
    parts.push(`<g class="fog">${[22, 50, 74].map((y, i) => `<g class="drift" style="--d:40s;--delay:${-i * 12}s"><ellipse cx="${[40, 62, 36][i]}" cy="${y}" rx="78" ry="9" fill="url(#fog-fill)"/></g>`).join('')}</g>`);
  }
  if (sky === 'drizzle' || sky === 'rain' || sky === 'storm') {
    parts.push(`<g class="rain${sky === 'drizzle' ? ' light' : ''}"><rect class="fall" x="-20" y="-30" width="140" height="160" fill="url(#rain-p)"/></g>`);
  }
  if (sky === 'snow') {
    parts.push(`<g class="snowfall"><rect class="fall" x="-20" y="-40" width="140" height="180" fill="url(#snow-p)"/><rect class="fall slow" x="-20" y="-40" width="140" height="180" fill="url(#snow-p)" transform="translate(9 5) scale(1.4)" opacity=".55"/></g>`);
  }
  return `<svg class="art" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${parts.join('')}</svg>`;
}

class BezelWeather extends BezelElement {
  static attributes = [...WEATHER_ATTRIBUTES, 'hide-time', 'still'];
  static defaultTheme = 'sky';
  static themes = { sky: { surface: '#4F9BE6', ink: '#FFFFFF', accent: '#FFFFFF' } };

  static styles = /* css */ `
    .sky { position: absolute; inset: 0; overflow: hidden; pointer-events: none; background: linear-gradient(180deg, var(--s0) 0%, var(--s1) 55%, var(--s2) 100%); }
    .tint { position: absolute; inset: 0; z-index: 1; background: var(--bezel-tint, transparent); mix-blend-mode: color; }
    .shim { display: block; border-radius: 1cqw; background: linear-gradient(100deg, rgba(255,255,255,.14) 30%, rgba(255,255,255,.38) 50%, rgba(255,255,255,.14) 70%) 0 0 / 300% 100%; animation: shimmer 1.6s ease-in-out infinite; }
    .shim.t { inline-size: 46cqw; block-size: 30cqw; border-radius: 3cqw; }
    .shim.l { inline-size: 26cqw; block-size: 3.6cqw; }
    .shim.s { inline-size: 12cqw; block-size: 3.6cqw; }
    .stat .shim.i { inline-size: 6.4cqw; block-size: 6.4cqw; border-radius: 50%; }
    @keyframes shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
    .sky::after { content: ""; position: absolute; inset: 0; z-index: 2;
      background: linear-gradient(180deg, rgba(8,20,40,.30) 0%, rgba(8,20,40,.08) 30%, rgba(8,20,40,0) 52%, rgba(8,20,40,0) 70%, rgba(8,20,40,.18) 100%); }
    .art { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; }
    .cloud-body * { fill: url(#cloud-fill); }
    .cloud-shade * { fill: rgba(15, 35, 70, .12); }
    .drift { animation: art-drift var(--d) ease-in-out var(--delay) infinite alternate; }
    .sun .glow { transform-origin: 77px 32px; animation: art-glow 7s ease-in-out infinite alternate; }
    .stars circle { fill: #fff; animation: art-twinkle 5s ease-in-out var(--delay) infinite alternate; }
    .rain .fall { animation: art-rain .55s linear infinite; }
    .rain.light { opacity: .6; }
    .rain.light .fall { animation-duration: .9s; }
    .snowfall .fall { animation: art-snow 7s linear infinite; }
    .snowfall .fall.slow { animation-duration: 11s; }
    .flash { position: absolute; inset: 0; background: #fff; opacity: 0; animation: flash 7s infinite; }
    :host([still]) .sky * { animation: none !important; }
    @keyframes art-drift { to { translate: 9px 0; } }
    @keyframes art-glow { to { scale: 1.08; opacity: .8; } }
    @keyframes art-twinkle { to { opacity: .35; } }
    @keyframes art-rain { to { translate: 0 16px; } }
    @keyframes art-snow { to { translate: 0 24px; } }
    @keyframes flash { 0%, 91%, 93%, 95%, 100% { opacity: 0; } 92%, 94% { opacity: .35; } }

    .content { position: absolute; inset: 0; display: grid; grid-template-rows: auto 1fr auto; padding: calc(8cqw + var(--_safe)) calc(8cqw + var(--_safe)) calc(7.5cqw + var(--_safe));
      text-shadow: 0 0.15cqw 0.6cqw rgba(0,0,0,.18), 0 0 2.4cqw rgba(0,0,0,.12); z-index: 3; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 3cqw; }
    .meta { display: grid; gap: 0.6cqw; font-size: 4.6cqw; font-weight: 600; line-height: 1.15; min-inline-size: 0; }
    .meta .place { font-size: 5.2cqw; font-weight: 700; letter-spacing: -0.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .meta .cond { display: flex; align-items: center; gap: 1.2cqw; opacity: .95; }
    .meta .hl { opacity: .85; font-variant-numeric: tabular-nums; }
    .meta .icon { inline-size: 5.2cqw; flex: none; }
    .sample { font-weight: 600; font-size: 3.2cqw; letter-spacing: .06em; text-transform: uppercase; opacity: .7; margin-inline-start: 1cqw; }
    .time { font-size: 6.2cqw; font-weight: 700; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
    .temp { align-self: center; font-size: 44cqw; font-weight: 200; letter-spacing: -0.055em; line-height: .9; margin-inline-start: -2.4cqw;
      font-variant-numeric: lining-nums proportional-nums; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; }
    .stat { display: grid; justify-items: center; gap: 0.8cqw; min-inline-size: 0; }
    .stat .icon { inline-size: 6.4cqw; opacity: .95; }
    .stat b { font-size: 4.4cqw; font-weight: 650; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .stat b small { font-size: .72em; font-weight: 600; opacity: .85; margin-inline-start: .3em; }
    .stat span { font-size: 3.5cqw; font-weight: 550; opacity: .82; }
    .loading .temp { align-self: center; }
  `;

  #source = new WeatherSource(this);

  connected() {
    this.#source.start();
  }

  disconnected() {
    this.#source.stop();
  }

  attributeChanged(name) {
    if (WEATHER_ATTRIBUTES.includes(name) && name !== 'refresh') this.#source.start();
  }

  /** The current weather object, or assign one to drive the tile yourself. */
  get weather() {
    return this.#source.data;
  }

  set weather(data) {
    this.#source.set(data);
  }

  get tickRate() {
    return this.flag('hide-time') ? null : 'second';
  }

  template() {
    const w = this.#source.data;
    const sky = w ? w.sky : 'partly';
    const isDay = w ? w.isDay : true;
    const [s0, s1, s2] = SKIES[`${sky}-${isDay ? 'day' : 'night'}`] ?? SKIES['partly-day'];

    const layers = [skyArt(sky, isDay)];
    if (sky === 'storm') layers.push('<i class="flash"></i>');
    layers.push('<i class="tint"></i>');

    const deg = (v) => (v == null || Number.isNaN(v) ? '--' : `${Math.round(v)}°`);
    const place = w?.place || this.getAttribute('location') || '';
    let stats = Array.from({ length: 4 }, () => '<div class="stat"><span class="shim i"></span><span class="shim s"></span></div>').join('');
    if (w) {
      const sun = nextSunEvent(w);
      const windUnit = w.units === 'imperial' ? 'mph' : 'km/h';
      stats = `
        <div class="stat">${sun?.kind === 'sunrise' ? icons.sunrise() : icons.sunset()}<b class="num">${isoClock(sun?.time, this.hour12)}</b><span>${sun?.kind === 'sunrise' ? 'Sunrise' : 'Sunset'}</span></div>
        <div class="stat">${icons.wind()}<b class="num">${Math.round(w.wind ?? 0)}<small>${windUnit}</small></b><span>Wind</span></div>
        <div class="stat">${icons.humidity()}<b class="num">${Math.round(w.humidity ?? 0)}%</b><span>Humidity</span></div>
        <div class="stat">${icons.air()}<b class="num">${w.aqi ?? '--'}</b><span>AQI</span></div>`;
    }

    return `
      <div class="sky" aria-hidden="true" style="--s0:${s0};--s1:${s1};--s2:${s2}">${layers.join('')}</div>
      <div class="content${w ? '' : ' loading'}" aria-hidden="true">
        <div class="top">
          <div class="meta">
            <div class="place">${esc(place || (w ? '' : 'Weather'))}${w?.sample ? '<span class="sample">Sample</span>' : ''}</div>
            ${w
              ? `<div class="cond">${skyIcon(sky, isDay)}<span>${esc(w.condition)}</span></div><div class="hl">H:${deg(w.high)} L:${deg(w.low)}</div>`
              : '<span class="shim l"></span><span class="shim s"></span>'}
          </div>
          ${this.flag('hide-time') ? '' : '<div class="time"></div>'}
        </div>
        <div class="temp">${w ? deg(w.temperature) : '<span class="shim t"></span>'}</div>
        <div class="stats">${stats}</div>
      </div>`;
  }

  update(z) {
    const t = this.$('.time');
    if (!t) return;
    const text = formatClock(z.hours, z.minutes, this.hour12);
    if (t.textContent !== text) t.textContent = text;
  }

  describe() {
    const w = this.#source.data;
    if (!w) return 'Weather, loading';
    const aqi = w.aqi != null ? `, air quality ${aqiBand(w.aqi, w.aqiScale).toLowerCase()}` : '';
    return `Weather${w.place ? ` in ${w.place}` : ''}: ${Math.round(w.temperature)} degrees, ${w.condition.toLowerCase()}, high ${Math.round(w.high)}, low ${Math.round(w.low)}${aqi}${w.sample ? ' (sample data)' : ''}`;
  }
}

define('bezel-weather', BezelWeather);
export { BezelWeather };
