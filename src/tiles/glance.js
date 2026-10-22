import { BezelElement, define } from '../core/element.js';
import { names, handAngles, isoWeek, dayOfYear, daysInYear, zonedToUtc } from '../core/time.js';
import { esc } from '../core/frame.js';
import { icons, skyIcon } from '../core/icons.js';
import { parseICS, expandEvents, normaliseEvents } from '../core/ics.js';
import { WeatherSource, WEATHER_ATTRIBUTES } from '../core/weather-source.js';
import { handStyle, lollipopHands, HANDS_CSS } from '../core/hands.js';

/**
 * <bezel-glance>  A dashboard tile: date, analog clock, agenda and weather.
 *
 * Attributes
 *   theme         mist | orchid | sand | slate
 *   events        JSON array of { title, start, end?, location? }
 *   ics           URL of an .ics feed (the server must allow cross-origin requests)
 *   max-events    events to show (default 3)
 *   hide-weather  replace the weather corner with the week number
 *   hands         modern | lollipop   (default modern)
 *   location, latitude, longitude, units, refresh   (see <bezel-weather>)
 *
 * Properties
 *   events        array of event objects
 *   icsText       raw .ics text, for when you fetch the feed yourself
 *   weather       weather data object, to skip the network
 *
 * With no events source, the lower-left corner shows how far through the year you are.
 */

const C = 50;

function miniDial(style) {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const major = i % 5 === 0;
    return `<line class="t${major ? ' M' : ''}" x1="${C}" y1="${major ? 7.5 : 8.6}" x2="${C}" y2="${4.6}" transform="rotate(${i * 6} ${C} ${C})"/>`;
  }).join('');
  const nums = Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    const a = (h * Math.PI) / 6;
    return `<text x="${(C + Math.sin(a) * 33).toFixed(2)}" y="${(C - Math.cos(a) * 33).toFixed(2)}" text-anchor="middle" dominant-baseline="central">${h}</text>`;
  }).join('');
  return `<svg class="dial" viewBox="0 0 100 100" aria-hidden="true">
    <circle class="plate" cx="50" cy="50" r="48"/>
    ${ticks}${nums}
    ${style === 'lollipop'
      ? lollipopHands({ hour: 24, minute: 36, second: 34, tail: 8, weight: 1.45, classes: { hour: 'hr', minute: 'mn', second: 'sc' } })
      : `<g class="h hr"><line x1="50" y1="50" x2="50" y2="44"/><line class="w" x1="50" y1="44" x2="50" y2="27"/></g>
    <g class="h mn"><line x1="50" y1="50" x2="50" y2="44"/><line class="w" x1="50" y1="44" x2="50" y2="13"/></g>
    <g class="h sc"><line x1="50" y1="58" x2="50" y2="8"/></g>
    <circle class="hub" cx="50" cy="50" r="2.4"/><circle class="pin" cx="50" cy="50" r="0.9"/>`}
  </svg>`;
}

class BezelGlance extends BezelElement {
  static attributes = [...WEATHER_ATTRIBUTES, 'events', 'ics', 'max-events', 'hide-weather', 'hands'];
  static defaultTheme = 'mist';
  static themes = {
    mist: { surface: '#B9C6CE', ink: '#0F1316', accent: '#FFFFFF', soft: '#DCE3E8', hand: '#0F1316' },
    orchid: { surface: '#D98CF2', ink: '#160F1A', accent: '#4A35D4', soft: '#EBC4F8', hand: '#160F1A' },
    sand: { surface: '#E9DCC6', ink: '#1E1913', accent: '#C2410C', soft: '#F5EDE0', hand: '#1E1913' },
    slate: { surface: '#1C2127', ink: '#EEF1F4', accent: '#7CC4FF', soft: '#2B323A', hand: '#EEF1F4' },
  };

  static styles = /* css */ `
    .screen { background: radial-gradient(120% 100% at 20% 0%, color-mix(in srgb, var(--_surface), #fff 10%), var(--_surface) 60%); }
    .g { position: absolute; inset: 0; display: grid; grid-template: 1fr auto / 1fr 1fr; gap: 3cqw 5cqw; padding: 8cqw; }
    .date { display: grid; align-content: start; gap: 0; }
    .date .md { font-size: 6.6cqw; font-weight: 700; letter-spacing: -0.01em; line-height: 1; }
    .date .md b { color: var(--_accent); font-weight: 700; }
    .date .dd { font-size: 31cqw; font-weight: 600; letter-spacing: -0.06em; line-height: .86; margin-inline-start: -1.2cqw; margin-block-start: 1cqw; font-variant-numeric: lining-nums; }
    .clock { display: grid; place-items: start end; }
    .dial { inline-size: 40cqw; aspect-ratio: 1; }
    .plate { fill: color-mix(in srgb, var(--_soft), transparent 55%); stroke: color-mix(in srgb, var(--_ink), transparent 88%); stroke-width: .6; }
    .dial .t { stroke: var(--_ink); stroke-width: .5; opacity: .35; stroke-linecap: round; }
    .dial .t.M { stroke-width: 1.2; opacity: .9; }
    .dial text { font-size: 10px; font-weight: 600; fill: var(--_ink); font-family: var(--_font); }
    .dial .h line { stroke: var(--_hand); stroke-linecap: round; stroke-width: 1.4; }
    .dial .h line.w { stroke-width: 3.6; }
    .dial .sc line { stroke: var(--_accent); stroke-width: .9; }
    .dial .hub { fill: var(--_hand); } .dial .pin { fill: var(--_accent); }
    .dial .h, .dial .lp, .dial .lp-sec { filter: drop-shadow(0 .4px .5px rgba(0,0,0,.2)); }
    ${HANDS_CSS}

    .agenda { display: grid; align-content: end; gap: 2.2cqw; min-inline-size: 0; }
    .ev { display: grid; gap: .2cqw; padding-inline-start: 2.6cqw; border-inline-start: 0.9cqw solid var(--_accent); min-inline-size: 0; }
    .ev .when { font-size: 3.5cqw; font-weight: 700; color: var(--_accent); font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ev .what { font-size: 4.3cqw; font-weight: 560; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ev.now { border-inline-start-color: var(--_ink); }
    .none { font-size: 4.3cqw; font-weight: 560; opacity: .7; }

    .year { display: grid; align-content: end; gap: 1.6cqw; }
    .year .wk { font-size: 4.4cqw; font-weight: 700; color: var(--_accent); letter-spacing: .02em; }
    .year .big { font-size: 13cqw; font-weight: 600; letter-spacing: -0.04em; line-height: .9; }
    .bar { block-size: 1.6cqw; border-radius: 1cqw; background: color-mix(in srgb, var(--_ink), transparent 85%); overflow: hidden; }
    .bar i { display: block; block-size: 100%; background: var(--_ink); border-radius: inherit; }
    .year .lbl { font-size: 3.5cqw; font-weight: 560; opacity: .75; font-variant-numeric: tabular-nums; }

    .wx { display: grid; align-content: end; justify-items: start; gap: .4cqw; min-inline-size: 0; }
    .wx .place { display: flex; align-items: center; gap: 1cqw; font-size: 4.3cqw; font-weight: 650; max-inline-size: 100%; }
    .wx .place span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .wx .place .icon { inline-size: 3.2cqw; flex: none; }
    .wx .temp { font-size: 22cqw; font-weight: 560; letter-spacing: -0.06em; line-height: .92; margin-inline-start: -1cqw; font-variant-numeric: lining-nums; }
    .wx .cond { display: flex; align-items: center; gap: 1.2cqw; font-size: 3.7cqw; font-weight: 600; }
    .wx .cond .icon { inline-size: 4.6cqw; }
    .wx .hl { font-size: 3.6cqw; font-weight: 560; opacity: .75; font-variant-numeric: tabular-nums; }
    .shim { display: block; inline-size: 24cqw; block-size: 3.4cqw; border-radius: 1cqw; margin-block-start: 1cqw;
      background: linear-gradient(100deg, color-mix(in srgb, var(--_ink), transparent 90%) 30%, color-mix(in srgb, var(--_ink), transparent 78%) 50%, color-mix(in srgb, var(--_ink), transparent 90%) 70%) 0 0 / 300% 100%;
      animation: shimmer 1.6s ease-in-out infinite; }
    .shim.big { inline-size: 26cqw; block-size: 16cqw; border-radius: 2.4cqw; }
    .shim.short { inline-size: 16cqw; }
    @keyframes shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
    .sample { font-size: 2.8cqw; letter-spacing: .06em; text-transform: uppercase; opacity: .6; }
  `;

  #weather = new WeatherSource(this);
  #rawEvents = null;
  #icsTimer = 0;
  #icsRequest = 0;

  connected() {
    if (!this.flag('hide-weather')) this.#weather.start();
    this.#loadEvents();
  }

  disconnected() {
    this.#weather.stop();
    clearTimeout(this.#icsTimer);
  }

  attributeChanged(name) {
    if (WEATHER_ATTRIBUTES.includes(name) && name !== 'refresh') this.#weather.start();
    if (name === 'hide-weather') this.flag('hide-weather') ? this.#weather.stop() : this.#weather.start();
    if (name === 'events' || name === 'ics') this.#loadEvents();
  }

  get weather() {
    return this.#weather.data;
  }
  set weather(data) {
    this.#weather.set(data);
  }

  get events() {
    return this.#rawEvents;
  }
  set events(list) {
    this.#rawEvents = normaliseEvents(list);
    this.invalidate();
  }

  set icsText(text) {
    this.#rawEvents = parseICS(text, { timeZone: this.timeZone });
    this.invalidate();
  }

  async #loadEvents() {
    clearTimeout(this.#icsTimer);
    const json = this.getAttribute('events');
    if (json) {
      try {
        this.#rawEvents = normaliseEvents(JSON.parse(json));
      } catch {
        console.warn('[bezel] The events attribute is not valid JSON.');
        this.#rawEvents = [];
      }
      this.invalidate();
      return;
    }
    const url = this.getAttribute('ics');
    if (!url) return;
    const id = ++this.#icsRequest;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (id !== this.#icsRequest) return;
      this.#rawEvents = parseICS(text, { timeZone: this.timeZone });
      this.invalidate();
    } catch (err) {
      console.warn(`[bezel] Could not load the calendar feed (${err.message}). Many feeds block browsers; see the README for options.`);
    }
    this.#icsTimer = setTimeout(() => this.#loadEvents(), 15 * 60_000);
  }

  get tickRate() {
    return this.reducedMotion ? 'second' : 'frame';
  }

  #todaysEvents(z) {
    if (!this.#rawEvents) return null;
    const dayStart = zonedToUtc(z.year, z.month, z.day, 0, 0, 0, this.timeZone);
    const dayEnd = zonedToUtc(z.year, z.month, z.day + 1, 0, 0, 0, this.timeZone);
    const max = Math.max(1, parseInt(this.getAttribute('max-events'), 10) || 3);
    return expandEvents(this.#rawEvents, dayStart, dayEnd)
      .filter((e) => e.end > z.ms || (e.allDay && e.end > dayStart))
      .slice(0, max);
  }

  /** Short, never-clipped label: the start time, or "Now · until 11:30" while it runs. */
  #when(e, z) {
    if (e.allDay) return 'All day';
    const opts = { hour: 'numeric', minute: '2-digit', hour12: this.hour12, timeZone: this.timeZone };
    let f;
    try {
      f = new Intl.DateTimeFormat(this.locale, opts);
    } catch {
      f = new Intl.DateTimeFormat('en-GB', opts);
    }
    if (e.start <= z.ms && e.end > z.ms) return `Now · until ${f.format(e.end)}`;
    return f.format(e.start);
  }

  template(z) {
    const n = names(this.locale);
    const events = this.#todaysEvents(z);

    let lower;
    if (events) {
      lower = events.length
        ? `<div class="agenda">${events
            .map((e) => `<div class="ev${e.start <= z.ms && e.end > z.ms && !e.allDay ? ' now' : ''}"><span class="when">${esc(this.#when(e, z))}</span><span class="what">${esc(e.title)}</span></div>`)
            .join('')}</div>`
        : '<div class="agenda"><span class="none">Nothing else today</span></div>';
    } else {
      const doy = dayOfYear(z.year, z.month, z.day);
      const total = daysInYear(z.year);
      const pct = Math.round((doy / total) * 100);
      lower = `<div class="year">
        <span class="wk">Week ${isoWeek(z.year, z.month, z.day)}</span>
        <span class="big num">${pct}%</span>
        <div class="bar"><i style="inline-size:${((doy / total) * 100).toFixed(2)}%"></i></div>
        <span class="lbl">Day ${doy} of ${total}</span>
      </div>`;
    }

    let wx;
    if (this.flag('hide-weather')) {
      wx = `<div class="wx"><span class="place"><span>${esc(n.monthLong[z.month])}</span></span><span class="temp num">${isoWeek(z.year, z.month, z.day)}</span><span class="cond">Week of the year</span></div>`;
    } else {
      const w = this.#weather.data;
      const deg = (v) => (v == null ? '--' : `${Math.round(v)}°`);
      const place = w?.place || this.getAttribute('location') || '';
      wx = `<div class="wx">
        <span class="place">${icons.arrow()}<span>${esc(place)}</span>${w?.sample ? '<span class="sample">Sample</span>' : ''}</span>
        ${w
          ? `<span class="temp num">${deg(w.temperature)}</span>
             <span class="cond">${skyIcon(w.sky, w.isDay)}<span>${esc(w.condition)}</span></span>
             <span class="hl">H:${deg(w.high)} L:${deg(w.low)}</span>`
          : '<span class="shim big"></span><span class="shim"></span><span class="shim short"></span>'}
      </div>`;
    }

    return `<div class="g" aria-hidden="true">
      <div class="date"><span class="md"><b>${esc(n.weekdayShort[z.weekday].replace('.', ''))}</b> ${esc(n.monthShort[z.month].replace('.', ''))}</span><span class="dd">${z.day}</span></div>
      <div class="clock">${miniDial(handStyle(this.getAttribute('hands')))}</div>
      ${lower}
      ${wx}
    </div>`;
  }

  #lastMinute = -1;

  update(z, first) {
    const a = handAngles(z, { smooth: this.tickRate === 'frame' });
    this.$('.hr')?.setAttribute('transform', `rotate(${a.hour.toFixed(3)} 50 50)`);
    this.$('.mn')?.setAttribute('transform', `rotate(${a.minute.toFixed(3)} 50 50)`);
    this.$('.sc')?.setAttribute('transform', `rotate(${a.second.toFixed(3)} 50 50)`);
    // Agenda entries expire as the day goes on; refresh them once a minute.
    if (!first && z.minutes !== this.#lastMinute && this.#rawEvents) this.invalidate();
    this.#lastMinute = z.minutes;
  }

  describe(z) {
    const date = new Intl.DateTimeFormat(this.locale, { dateStyle: 'full', timeZone: 'UTC' }).format(Date.UTC(z.year, z.month, z.day));
    const w = this.#weather.data;
    return `${date}${w ? `. ${Math.round(w.temperature)} degrees and ${w.condition.toLowerCase()}${w.place ? ` in ${w.place}` : ''}` : ''}`;
  }
}

define('bezel-glance', BezelGlance);
export { BezelGlance };
