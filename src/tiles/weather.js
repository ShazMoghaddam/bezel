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

function cloudLayer(count, dim) {
  const seeds = [
    [52, 10, 62, 0.62, 52],
    [-12, 22, 66, 0.55, 64],
    [30, 34, 58, 0.42, 58],
    [66, 48, 52, 0.38, 72],
    [-6, 58, 56, 0.3, 60],
    [40, 66, 60, 0.26, 80],
  ];
  return seeds
    .slice(0, count)
    .map(
      ([x, y, w, o, dur], i) =>
        `<i class="cloud" style="--x:${x}cqw;--y:${y}cqh;--w:${w}cqw;--o:${(o * (dim ? 0.55 : 1)).toFixed(2)};--d:${dur}s;--delay:${-i * 7}s"></i>`,
    )
    .join('');
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
    .sun { position: absolute; inset-block-start: -22cqh; inset-inline-end: -18cqw; inline-size: 80cqw; aspect-ratio: 1; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,246,214,.75) 0%, rgba(255,226,150,.28) 26%, rgba(255,226,150,0) 62%); }
    .stars { position: absolute; inset: 0; opacity: .8;
      background-image:
        radial-gradient(0.35cqw 0.35cqw at 12% 18%, #fff 50%, transparent 52%),
        radial-gradient(0.25cqw 0.25cqw at 28% 9%, #fff 50%, transparent 52%),
        radial-gradient(0.3cqw 0.3cqw at 47% 22%, #fff 50%, transparent 52%),
        radial-gradient(0.22cqw 0.22cqw at 66% 12%, #fff 50%, transparent 52%),
        radial-gradient(0.32cqw 0.32cqw at 84% 26%, #fff 50%, transparent 52%),
        radial-gradient(0.2cqw 0.2cqw at 74% 40%, #fff 50%, transparent 52%),
        radial-gradient(0.26cqw 0.26cqw at 18% 44%, #fff 50%, transparent 52%),
        radial-gradient(0.2cqw 0.2cqw at 92% 8%, #fff 50%, transparent 52%);
      animation: twinkle 6s ease-in-out infinite alternate; }
    .cloud { position: absolute; inset-inline-start: var(--x); inset-block-start: var(--y); inline-size: var(--w); aspect-ratio: 2.2; opacity: var(--o);
      background:
        radial-gradient(38% 62% at 30% 62%, #fff 0 58%, transparent 72%),
        radial-gradient(34% 70% at 55% 42%, #fff 0 56%, transparent 72%),
        radial-gradient(30% 54% at 78% 64%, #fff 0 56%, transparent 72%),
        radial-gradient(60% 40% at 52% 78%, #fff 0 60%, transparent 76%);
      filter: blur(0.9cqw);
      animation: drift var(--d) ease-in-out var(--delay) infinite alternate; }
    .fogband { position: absolute; inset-inline: -20cqw; block-size: 18cqh; border-radius: 50%;
      background: radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,.55), transparent 70%);
      filter: blur(1.5cqw); animation: drift 40s ease-in-out infinite alternate; }
    .rain { position: absolute; inset: -20cqh 0 0; opacity: .38;
      background-image: repeating-linear-gradient(104deg, transparent 0 2.6cqw, rgba(255,255,255,.75) 2.6cqw 2.75cqw, transparent 2.75cqw 5.2cqw);
      -webkit-mask-image: repeating-linear-gradient(180deg, #000 0 4cqh, transparent 4cqh 9cqh);
              mask-image: repeating-linear-gradient(180deg, #000 0 4cqh, transparent 4cqh 9cqh);
      animation: fall .55s linear infinite; }
    .rain.light { opacity: .22; animation-duration: .9s; }
    .snowfall { position: absolute; inset: -40cqh 0 0;
      background-image:
        radial-gradient(0.7cqw 0.7cqw at 20% 10%, rgba(255,255,255,.9) 50%, transparent 55%),
        radial-gradient(0.5cqw 0.5cqw at 60% 30%, rgba(255,255,255,.85) 50%, transparent 55%),
        radial-gradient(0.8cqw 0.8cqw at 80% 60%, rgba(255,255,255,.9) 50%, transparent 55%),
        radial-gradient(0.55cqw 0.55cqw at 35% 75%, rgba(255,255,255,.8) 50%, transparent 55%);
      background-size: 30cqw 30cqh;
      animation: snow 9s linear infinite; }
    .flash { position: absolute; inset: 0; background: #fff; opacity: 0; animation: flash 7s infinite; }
    :host([still]) .sky * { animation: none !important; }
    @keyframes drift { to { translate: 9cqw 0; } }
    @keyframes fall { to { translate: -2.2cqw 9cqh; } }
    @keyframes snow { to { translate: 3cqw 30cqh; } }
    @keyframes twinkle { to { opacity: .45; } }
    @keyframes flash { 0%, 91%, 93%, 95%, 100% { opacity: 0; } 92%, 94% { opacity: .35; } }

    .content { position: absolute; inset: 0; display: grid; grid-template-rows: auto 1fr auto; padding: 8cqw 8cqw 7.5cqw;
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

    const layers = [];
    if (sky === 'clear' && isDay) layers.push('<i class="sun"></i>');
    if (!isDay && (sky === 'clear' || sky === 'partly')) layers.push('<i class="stars"></i>');
    if (sky === 'partly' && isDay) layers.push('<i class="sun" style="opacity:.7"></i>');
    layers.push(cloudLayer(CLOUDS[sky] ?? 3, !isDay));
    if (sky === 'fog') layers.push('<i class="fogband" style="top:22cqh"></i><i class="fogband" style="top:52cqh;animation-delay:-12s"></i><i class="fogband" style="top:74cqh;animation-delay:-24s"></i>');
    if (sky === 'drizzle') layers.push('<i class="rain light"></i>');
    if (sky === 'rain' || sky === 'storm') layers.push('<i class="rain"></i>');
    if (sky === 'snow') layers.push('<i class="snowfall"></i>');
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
