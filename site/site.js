// Bezel demo site: showcase, studio, code cards and desk mode.
// The tiles themselves come from the library; this file only drives the page.

const CDN = 'https://cdn.jsdelivr.net/gh/ShazMoghaddam/bezel@v2.0.0/dist/bezel.min.js';
const STORE_KEY = 'bezel-studio-v3'; // v3: themes and the sample agenda left the Studio

// [CSS value, label, Google Fonts family spec]. The copied code includes the line that loads the chosen face.
const FONTS = [
  ['', 'Default', ''],
  ['"Geist", sans-serif', 'Geist', 'Geist:wght@300..800'],
  ['"Fraunces", serif', 'Fraunces (serif)', 'Fraunces:opsz,wght@9..144,300..800'],
  ['"Nunito", sans-serif', 'Nunito (rounded)', 'Nunito:wght@300..900'],
  ['"Geist Mono", monospace', 'Geist Mono', 'Geist+Mono:wght@400..600'],
];
const fontLink = (value) => {
  const spec = FONTS.find(([v]) => v === value)?.[2];
  return spec ? `https://fonts.googleapis.com/css2?family=${spec}&display=swap` : '';
};
const ZONES = [
  ['', 'This device'],
  ['Europe/London', 'London'],
  ['Europe/Paris', 'Paris'],
  ['Europe/Berlin', 'Berlin'],
  ['America/New_York', 'New York'],
  ['America/Chicago', 'Chicago'],
  ['America/Los_Angeles', 'Los Angeles'],
  ['America/Sao_Paulo', 'São Paulo'],
  ['Asia/Dubai', 'Dubai'],
  ['Asia/Kolkata', 'Mumbai'],
  ['Asia/Singapore', 'Singapore'],
  ['Asia/Tokyo', 'Tokyo'],
  ['Australia/Sydney', 'Sydney'],
  ['Pacific/Auckland', 'Auckland'],
];
const LOCALES = [
  ['', 'This device'],
  ['en-GB', 'English (UK)'],
  ['en-US', 'English (US)'],
  ['fr-FR', 'Français'],
  ['de-DE', 'Deutsch'],
  ['es-ES', 'Español'],
  ['it-IT', 'Italiano'],
  ['ja-JP', '日本語'],
  ['fa-IR', 'فارسی'],
];

const COLOR_LABELS = { surface: 'Background', ink: 'Text', accent: 'Accent', hand: 'Hands', today: 'Today', muted: 'Other months', soft: 'Dial plate', rule: 'Rules', tint: 'Sky tint' };
const COLOR_KEYS = Object.keys(COLOR_LABELS);
// Every colour has a dark mode twin, set as --bezel-dark-<name> and stored as vars['dark-<name>'].
const VAR_KEYS = [...COLOR_KEYS, ...COLOR_KEYS.map((k) => `dark-${k}`), 'radius', 'font'];

const HAND_STYLES = [
  ['modern', 'Modern', 'The original slim hands'],
  ['lollipop', 'Lollipop', 'Batons with a round seconds tip'],
];

const timeZone = { type: 'select', key: 'timezone', label: 'Time zone', options: ZONES };
const language = { type: 'select', key: 'locale', label: 'Language', options: LOCALES };
/** The 12 or 24 hour choice, for tiles that show a digital time. `when` says when that time is on screen. */
const hours = (when, note = 'Auto follows the language setting.') => ({ type: 'hours', key: 'hour-cycle', label: 'Hours', when, note });
// Analog clocks show no digits, so they skip Hours.
// On the clock, language only changes the date ("Fri 23" or "ven. 23"), so it shows only when there is one.
const clockTime = [timeZone, { ...language, when: (a) => a.variant !== 'relief' && !a['hide-date'] }];
const locationField = { type: 'text', key: 'location', label: 'Location', placeholder: 'City or town', hint: "Weather comes live from Open-Meteo. If it can't be reached, the tile shows sample data and says so." };
const units = { type: 'seg', key: 'units', label: 'Units', options: [['', 'Auto'], ['metric', '°C · km/h'], ['imperial', '°F · mph']], hint: 'Auto follows the language setting: °F in the US, °C elsewhere.' };
const weekStart = { type: 'seg', key: 'week-start', label: 'Week starts', options: [['', 'Auto'], ['mon', 'Monday'], ['sun', 'Sunday']] };

/*
 * The Studio shows one group of settings at a time (Style, Colours, Hands, Options, Time),
 * so the panel stays short enough to sit beside the preview. Each component lists
 * only the settings that make sense for it:
 *   style     face controls shown above typeface, frame and size
 *   corners   false when a corner radius doesn't suit the tile (the poster)
 *   colors    the colour pickers; tiles with hands also get a Hands colour
 *   hands     true when the tile has an analog dial
 *   options   what the tile shows
 *   time      time zone, hours and language
 */
const TYPES = {
  clock: {
    tag: 'bezel-clock',
    darkTheme: 'midnight', // starting point for the dark mode colour set
    label: 'Clock',
    size: 380,
    attrs: { variant: 'numerals', theme: 'sage' },
    colors: ['surface', 'ink', 'hand', 'accent'],
    colorLabels: { accent: 'Seconds hand' },
    colorHint: 'The seconds hand colour also tints the date on the Classic face.',
    style: [
      { type: 'seg', key: 'variant', label: 'Face', options: [['numerals', 'Numerals'], ['relief', 'Relief'], ['classic', 'Classic']] },
      { type: 'seg', key: 'numerals', label: 'Numbers', options: [['', '1 2 3'], ['roman', 'I II III'], ['persian', '۱ ۲ ۳']] },
    ],
    hands: true,
    handControls: [
      { type: 'toggle', key: 'hide-seconds', label: 'Seconds hand', invert: true },
      { type: 'seg', key: 'sweep', label: 'Seconds motion', options: [['', 'Smooth sweep'], ['tick', 'Tick']], when: (a) => !a['hide-seconds'] },
    ],
    options: [
      // The Relief face has no date, and only the Classic face has room for a second dial.
      { type: 'toggle', key: 'hide-date', label: 'Show the date', invert: true, when: (a) => a.variant !== 'relief' },
      { type: 'select', key: 'second-timezone', label: 'Second time zone', options: [['', 'None'], ...ZONES.slice(1)], hint: 'A small dial for another city, in place of the 6.', when: (a) => a.variant === 'classic' },
    ],
    time: clockTime,
  },
  calendar: {
    tag: 'bezel-calendar',
    darkTheme: 'ink', // starting point for the dark mode colour set
    label: 'Calendar',
    size: 380,
    attrs: { theme: 'snow' },
    colors: ['surface', 'ink', 'accent', 'today', 'muted'],
    colorLabels: { accent: 'Month and backdrop' },
    options: [
      weekStart,
      { type: 'toggle', key: 'hide-time', label: 'Time in the header', invert: true },
      { type: 'toggle', key: 'hide-backdrop', label: 'Giant day numeral', invert: true },
    ],
    time: [timeZone, hours((a) => !a['hide-time']), language],
  },
  weather: {
    tag: 'bezel-weather',
    label: 'Weather',
    size: 380,
    attrs: { location: 'London' },
    colors: ['ink', 'tint'],
    colorHint: 'The sky follows the live weather. A tint recolours it while keeping the clouds and light.',
    options: [
      locationField,
      units,
      { type: 'toggle', key: 'still', label: 'Animated sky', invert: true },
      { type: 'toggle', key: 'hide-time', label: 'Clock in the corner', invert: true },
    ],
    // Language translates the conditions and labels; the time zone and Hours only affect the corner clock.
    time: [{ ...timeZone, when: (a) => !a['hide-time'] }, hours((a) => !a['hide-time']), language],
  },
  glance: {
    tag: 'bezel-glance',
    darkTheme: 'slate', // starting point for the dark mode colour set
    label: 'Glance',
    size: 400,
    attrs: { theme: 'mist', location: 'London' },
    colors: ['surface', 'ink', 'accent', 'soft', 'hand'],
    colorHint: 'Accent also colours the seconds hand.',
    hands: true,
    options: [
      { type: 'toggle', key: 'hide-weather', label: 'Weather corner', invert: true },
      { ...locationField, when: (a) => !a['hide-weather'] },
      { ...units, when: (a) => !a['hide-weather'] },
      {
        type: 'text', key: 'ics', label: 'Calendar link (optional)', placeholder: 'https://… .ics', inputmode: 'url',
        hint: "Paste your calendar's iCal (.ics) address to list today's events. On the Mac desktop any feed works. In a browser, Google and iCloud feeds are usually blocked, and the corner then shows how far through the year you are.",
      },
    ],
    time: [timeZone, hours((a) => Boolean(a.ics)), language], // times appear only in a calendar agenda
  },
  poster: {
    tag: 'bezel-poster',
    darkTheme: 'noir', // starting point for the dark mode colour set
    label: 'Poster',
    size: 560,
    attrs: { theme: 'noir' },
    corners: false,
    colors: ['surface', 'ink', 'accent'],
    colorLabels: { accent: 'Today' },
    options: [
      { type: 'month', key: 'month', label: 'Month', hint: 'Leave empty to follow the current month.' },
      weekStart,
      { type: 'toggle', key: 'no-highlight', label: 'Highlight today', invert: true },
    ],
    // A time zone would only move which day is "today" around midnight, so the poster offers language alone.
    time: [language],
    timeLabel: 'Language',
  },
};

const GROUPS = [
  ['style', 'Style'],
  ['colours', 'Colours'],
  ['hands', 'Hands'],
  ['options', 'Options'],
  ['time', 'Time'],
];

// ---------------------------------------------------------------------------

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function freshState() {
  const s = { current: 'clock', bg: 'desk', tiles: {} };
  for (const [k, t] of Object.entries(TYPES)) {
    s.tiles[k] = { attrs: { frame: k === 'poster' ? 'none' : 'device', ...t.attrs }, vars: {}, size: t.size };
  }
  return s;
}

function loadState() {
  const s = freshState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved && saved.tiles) {
      s.current = TYPES[saved.current] ? saved.current : s.current;
      s.bg = saved.bg || s.bg;
      for (const k of Object.keys(TYPES)) if (saved.tiles[k]) Object.assign(s.tiles[k], saved.tiles[k]);
      // Corners now stop at 30; bring older, rounder settings into range.
      for (const t of Object.values(s.tiles)) if (t.vars?.radius > 30) t.vars.radius = 30;
    }
  } catch {}
  return s;
}

const state = loadState();
let booted = false;
const save = () => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {}
  // Once the visitor starts designing, the address bar always holds a link to the current design.
  if (booted) history.replaceState(null, '', shareURL());
};

// ---- Shareable links ---------------------------------------------------------
// The current tile travels in ?design=, as base64url JSON: { t: type, a: attributes, v: CSS variables, s: size }.

const b64url = {
  encode: (text) => btoa(String.fromCharCode(...new TextEncoder().encode(text))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  decode: (code) => new TextDecoder().decode(Uint8Array.from(atob(code.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0))),
};

function shareURL() {
  const cfg = state.tiles[state.current];
  const a = Object.fromEntries(Object.entries(cfg.attrs).filter(([, v]) => v !== '' && v != null && v !== false));
  const v = Object.fromEntries(Object.entries(cfg.vars).filter(([, x]) => x !== '' && x != null));
  const url = new URL(location.href);
  url.searchParams.set('design', b64url.encode(JSON.stringify({ t: state.current, a, v, s: cfg.size })));
  url.hash = 'studio';
  return url.href;
}

/** Reads a shared design, keeping only settings the Studio knows, with safe values. */
function readSharedDesign() {
  const code = new URLSearchParams(location.search).get('design');
  if (!code) return false;
  try {
    const d = JSON.parse(b64url.decode(code));
    if (!TYPES[d.t]) return false;
    const cfg = freshState().tiles[d.t];
    for (const [k, v] of Object.entries(d.a ?? {})) {
      if (/^[a-z][a-z-]*$/.test(k) && k !== 'style' && !k.startsWith('on') && (typeof v === 'string' || v === true)) cfg.attrs[k] = typeof v === 'string' ? v.slice(0, 300) : v;
    }
    for (const [k, v] of Object.entries(d.v ?? {})) {
      if (!VAR_KEYS.includes(k)) continue;
      if (k === 'radius' && Number.isFinite(+v)) cfg.vars.radius = Math.min(30, Math.max(1, +v));
      else if (k === 'font' && FONTS.some(([f]) => f === v)) cfg.vars.font = v;
      else if (/^#[0-9a-f]{3,8}$/i.test(v)) cfg.vars[k] = v;
    }
    if (Number.isFinite(+d.s)) cfg.size = Math.min(d.t === 'poster' ? 760 : 560, Math.max(180, Math.round(+d.s)));
    state.current = d.t;
    state.tiles[d.t] = cfg;
    return true;
  } catch {
    return false;
  }
}

/** Applies a tile config to an element, adding and removing attributes as needed. */
function applyTo(el, cfg) {
  const attrs = { ...cfg.attrs };
  for (const a of [...el.attributes]) {
    if (['class', 'style', 'role', 'aria-label', 'aria-hidden', 'data-bezel-label'].includes(a.name)) continue;
    if (!(a.name in attrs)) el.removeAttribute(a.name);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false || v === '') el.removeAttribute(k);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of VAR_KEYS) {
    const v = cfg.vars[k];
    // Check for empty explicitly: a radius of 0 is a real value, not "unset".
    if (v !== undefined && v !== null && v !== '') el.style.setProperty(`--bezel-${k}`, k === 'radius' ? `${v}cqw` : v);
    else el.style.removeProperty(`--bezel-${k}`);
  }
}

function makeTile(type, cfg) {
  const el = document.createElement(TYPES[type].tag);
  applyTo(el, cfg);
  return el;
}

// ---- Showcase --------------------------------------------------------------

const SKIP_ATTRS = new Set(['class', 'style', 'role', 'aria-label', 'aria-hidden', 'data-bezel-label']);

/** Loads one of the hero examples into the Studio, using the example element's own attributes. */
function openExample(button) {
  const type = button.dataset.show;
  const tile = button.querySelector(TYPES[type].tag);
  const attrs = {};
  for (const a of tile.attributes) if (!SKIP_ATTRS.has(a.name)) attrs[a.name] = a.value === '' ? true : a.value;
  state.current = type;
  state.tiles[type] = { attrs: { frame: type === 'poster' ? 'none' : 'device', ...attrs }, vars: {}, size: TYPES[type].size };
  renderStudio(true);
  $('#studio').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  note(`${button.querySelector('.show__label b').textContent} example loaded. Every change below shows in the preview straight away.`);
}

function bindShowcase() {
  $('[data-showcase]')?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-show]');
    if (b) openExample(b);
  });
}

// ---- Studio --------------------------------------------------------------

let preview = null;

function renderTabs() {
  const host = $('[data-tabs]');
  host.innerHTML = Object.entries(TYPES)
    .map(([k, t]) => `<button type="button" role="tab" id="tab-${k}" aria-selected="${k === state.current}" tabindex="${k === state.current ? 0 : -1}" aria-controls="studio-panel" data-tab="${k}">${t.label}</button>`)
    .join('');
}

function themesFor(type) {
  return customElements.get(TYPES[type].tag)?.themes ?? {};
}

/** The built-in palette behind a tile. The Studio no longer offers themes; it only supplies the default colours. */
function effectiveThemeName(type, cfg) {
  const themes = themesFor(type);
  const name = cfg.attrs.theme;
  if (name && themes[name]) return name;
  if (type === 'clock') return { numerals: 'sage', relief: 'blush', classic: 'porcelain' }[cfg.attrs.variant || 'numerals'];
  return customElements.get(TYPES[type].tag)?.defaultTheme ?? '';
}

function effectiveTheme(type, cfg) {
  return themesFor(type)[effectiveThemeName(type, cfg)] ?? {};
}

/** The colour a picker should show: the custom value, else the tile's default. */
/** The colour a picker should show: the custom value, else the tile's default for that mode. */
function colorValue(type, cfg, key, mode = 'light') {
  const light = cfg.vars[key] || (key === 'tint' ? '#4f9be6' : effectiveTheme(type, cfg)[key] || '#000000');
  if (mode !== 'dark') return toHex(light);
  return toHex(cfg.vars[`dark-${key}`] || themesFor(type)[cfg.attrs['dark-theme']]?.[key] || light);
}

/** Which colour set the Colours tab edits and the preview shows. */
const editingMode = (cfg) => (cfg.attrs['dark-theme'] && state.editing === 'dark' ? 'dark' : 'light');

function colorKeys(type) {
  return TYPES[type].colors;
}

function control(c, cfg) {
  const id = `c-${c.key ?? c.type}`;
  const value = c.key ? cfg.attrs[c.key] ?? '' : '';
  const hintId = c.hint ? `${id}-h` : '';
  const hint = c.hint ? `<p class="hint" id="${hintId}">${esc(c.hint)}</p>` : '';
  const described = hintId ? ` aria-describedby="${hintId}"` : '';
  switch (c.type) {
    case 'hours': {
      // Show what each choice looks like, using 14:30 in the tile's language.
      // Some browsers report tags like "en-US@posix", which Intl rejects; trim them as the tiles do.
      const lang = String(cfg.attrs.locale || navigator.language || 'en-GB').split(/[@.]/)[0].replace('_', '-');
      const sample = (h12) => {
        for (const tag of [lang, 'en-GB']) {
          try {
            return new Intl.DateTimeFormat(tag, { hour: 'numeric', minute: '2-digit', hour12: h12, timeZone: 'UTC' }).format(Date.UTC(2026, 0, 1, 14, 30));
          } catch {}
        }
        return '';
      };
      const opts = [['', 'Auto', sample(undefined)], ['12', '12-hour', sample(true)], ['24', '24-hour', sample(false)]];
      return `<div class="field"><span class="field__l" id="${id}-l">${esc(c.label)}</span><div class="seg seg--tall" role="group" aria-labelledby="${id}-l">${opts
        .map(([v, l, ex]) => `<button type="button" data-attr="${c.key}" data-value="${v}" aria-pressed="${String(value) === v}"><span>${l}</span><span class="seg__s">${esc(ex)}</span></button>`)
        .join('')}</div><p class="hint">${esc(c.note)}</p></div>`;
    }
    case 'seg':
      return `<div class="field"><span class="field__l" id="${id}-l">${esc(c.label)}</span><div class="seg" role="group" aria-labelledby="${id}-l"${described}>${c.options
        .map(([v, l]) => `<button type="button" data-attr="${c.key}" data-value="${esc(v)}" aria-pressed="${String(value) === v}">${esc(l)}</button>`)
        .join('')}</div>${hint}</div>`;
    case 'toggle': {
      const on = c.invert ? !cfg.attrs[c.key] : Boolean(cfg.attrs[c.key]);
      return `<div class="field"><label class="toggle" for="${id}">${esc(c.label)}<input type="checkbox" role="switch" id="${id}" data-toggle="${c.key}" data-invert="${c.invert ? 1 : 0}" ${on ? 'checked' : ''}${described}></label>${hint}</div>`;
    }
    case 'select':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><select id="${id}" data-select="${c.key}"${described}>${c.options
        .map(([v, l]) => `<option value="${esc(v)}" ${String(value) === v ? 'selected' : ''}>${esc(l)}</option>`)
        .join('')}</select>${hint}</div>`;
    case 'month':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><input type="month" id="${id}" data-select="${c.key}" value="${esc(value)}"${described}>${hint}</div>`;
    case 'text':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><div class="inline"><input type="text" id="${id}" data-text="${c.key}" value="${esc(value)}" placeholder="${esc(c.placeholder ?? '')}" ${c.inputmode ? `inputmode="${c.inputmode}"` : ''} enterkeyhint="done" autocapitalize="off" spellcheck="false"${described}><button type="button" class="btn" data-text-apply="${c.key}">Apply</button></div>${hint}</div>`;
    default:
      return '';
  }
}

/** One colour picker row: swatch, name and hex value. Changed colours get a ring and a "Custom" tag. */
function colorRow(type, cfg, key, labelOverride) {
  const t = TYPES[type];
  const label = labelOverride ?? t.colorLabels?.[key] ?? COLOR_LABELS[key];
  const mode = editingMode(cfg);
  const v = colorValue(type, cfg, key, mode);
  const custom = Boolean(cfg.vars[mode === 'dark' ? `dark-${key}` : key]);
  return `<label class="crow" ${custom ? 'data-custom' : ''}>
    <input type="color" value="${v}" data-color="${key}" aria-label="${esc(label)} colour${mode === 'dark' ? ' in dark mode' : ''}">
    <span class="crow__l">${esc(label)}</span>
    <span class="crow__v"><span data-hex="${key}">${v.toUpperCase()}</span><em>Custom</em></span>
  </label>`;
}

/** The groups this tile offers, in order. */
/** A control is shown only when it has a visible effect with the tile's current settings. */
function visible(list, type) {
  const attrs = { variant: 'numerals', ...state.tiles[type].attrs };
  return (list ?? []).filter((c) => !c.when || c.when(attrs));
}

function groupsFor(type) {
  const t = TYPES[type];
  return GROUPS
    .filter(([g]) => (g !== 'hands' || t.hands) && (g !== 'options' || visible(t.options, type).length) && (g !== 'time' || visible(t.time, type).length))
    .map(([g, l]) => [g, g === 'time' && t.timeLabel ? t.timeLabel : l]);
}

function currentGroup(type) {
  const ids = groupsFor(type).map(([g]) => g);
  return ids.includes(state.group) ? state.group : ids[0];
}

function groupBody(type, group) {
  const t = TYPES[type];
  const cfg = state.tiles[type];
  const fields = (list) => visible(list, type).map((c) => control(c, cfg)).join('');

  if (group === 'style') {
    const font = `<div class="field"><label for="c-font">Typeface</label><select id="c-font" data-font aria-describedby="c-font-h">${FONTS.map(([v, l]) => `<option value="${esc(v)}" ${cfg.vars.font === v || (!cfg.vars.font && !v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select><p class="hint" id="c-font-h">Default uses SF Pro on Apple devices and Geist elsewhere. Other typefaces load free from Google Fonts, and the code includes the line for it.</p></div>`;
    // Two choices: the black bezel (the library's default "device" frame) or just the screen.
    const framed = (cfg.attrs.frame || (type === 'poster' ? 'none' : 'device')) !== 'none';
    const frame = `<div class="field"><span class="field__l" id="frame-l">Frame</span><div class="seg" role="group" aria-labelledby="frame-l">${[['device', 'Bezel', framed], ['none', 'None', !framed]]
      .map(([v, l, on]) => `<button type="button" data-attr="frame" data-value="${v}" aria-pressed="${on}">${l}</button>`)
      .join('')}</div></div>`;
    const size = `<div class="field"><label class="field__l" for="c-size">Size <output data-out="size">${cfg.size} px</output></label><input type="range" id="c-size" min="180" max="${type === 'poster' ? 760 : 560}" step="10" value="${cfg.size}" data-size></div>`;
    const radius = Math.min(30, cfg.vars.radius ?? 22);
    const corners = t.corners === false ? '' : `<div class="field"><label class="field__l" for="c-radius">Corners <output data-out="radius">${radius}</output></label><input type="range" id="c-radius" min="1" max="30" step="1" value="${radius}" data-radius></div>`;
    return fields(t.style) + frame + `<div class="row2${corners ? '' : ' row2--one'}">${size}${corners}</div>` + font;
  }

  if (group === 'colours') {
    const any = colorKeys(type).some((k) => cfg.vars[k] || cfg.vars[`dark-${k}`]);
    const note = t.colorHint ?? (type === 'clock' && (cfg.attrs.variant || 'numerals') === 'relief'
      ? 'Relief numerals are pressed into the background, so they take their colour from it.'
      : 'Click a swatch to pick any colour. The preview updates as you choose.');
    const darkOn = Boolean(cfg.attrs['dark-theme']);
    const mode = editingMode(cfg);
    // Tiles with a dark preset can carry a second colour set that the device's dark mode switches to.
    const dark = t.darkTheme
      ? `<div class="field"><label class="toggle" for="c-dark">Dark mode colours<input type="checkbox" role="switch" id="c-dark" data-dark ${darkOn ? 'checked' : ''} aria-describedby="c-dark-h"></label>
          <p class="hint" id="c-dark-h">The tile switches to these on its own when the device is in dark mode.</p></div>
        ${darkOn ? `<div class="field"><span class="field__l" id="mode-l">Showing</span><div class="seg" role="group" aria-labelledby="mode-l">${[['light', 'Light mode'], ['dark', 'Dark mode']]
          .map(([v, l]) => `<button type="button" data-editing="${v}" aria-pressed="${mode === v}">${l}</button>`).join('')}</div></div>` : ''}`
      : '';
    return `${dark}<div class="crows">${colorKeys(type).map((k) => colorRow(type, cfg, k)).join('')}</div>
      <p class="hint">${esc(note)}</p>
      <button type="button" class="btn btn--quiet btn--block" data-reset-colors ${any ? '' : 'disabled'}>Reset colours</button>`;
  }

  if (group === 'hands') {
    const handValue = cfg.attrs.hands || 'modern';
    return `<div class="field"><span class="field__l" id="hands-l">Design</span><div class="hstyles" role="radiogroup" aria-labelledby="hands-l">${HAND_STYLES.map(
        ([v, l, d]) => `<button type="button" class="hstyle" role="radio" data-hands="${v}" aria-checked="${handValue === v}" tabindex="${handValue === v ? 0 : -1}">
            <span class="hstyle__dial" data-hand-preview="${v}"></span>
            <span class="hstyle__t">${l}</span><span class="hstyle__d">${d}</span>
          </button>`,
      ).join('')}</div></div>
      ${fields(t.handControls)}
      <button type="button" class="link" data-goto="colours">Change hand colours in Colours</button>`;
  }

  if (group === 'options') return fields(t.options);
  if (group === 'time') return fields(t.time);
  return '';
}

function renderPanel() {
  const type = state.current;
  const group = currentGroup(type);
  const panel = $('[data-panel]');
  panel.id = 'studio-panel';
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', `tab-${type}`);
  panel.innerHTML = `
    <div class="ptabs" role="tablist" aria-label="Settings">${groupsFor(type)
      .map(([g, l]) => `<button type="button" role="tab" id="pt-${g}" data-group="${g}" aria-selected="${g === group}" tabindex="${g === group ? 0 : -1}" aria-controls="panel-body">${l}</button>`)
      .join('')}</div>
    <div class="panel__body" id="panel-body" role="tabpanel" aria-labelledby="pt-${group}">${groupBody(type, group)}</div>
    <div class="panel__foot"><button type="button" class="btn btn--quiet" data-reset-tile>Reset</button><button type="button" class="btn btn--quiet" data-share>Share</button><a class="btn btn--solid" href="#install" data-get-code>Get the code</a></div>`;
  renderHandPreviews();
}

/** Small live clocks inside the hand-design buttons, drawn by the real element in the current colours. */
function renderHandPreviews() {
  const type = state.current;
  const cfg = state.tiles[type];
  const theme = effectiveTheme(type, cfg);
  for (const slot of $$('[data-hand-preview]')) {
    const vars = {};
    for (const k of ['surface', 'ink', 'hand', 'accent']) vars[k] = cfg.vars[k] || theme[k] || '';
    const tile = makeTile('clock', {
      attrs: { variant: 'classic', frame: 'none', hands: slot.dataset.handPreview, 'hide-date': true, timezone: cfg.attrs.timezone ?? '' },
      vars: { ...vars, radius: 30 },
    });
    tile.setAttribute('aria-hidden', 'true');
    tile.style.setProperty('--bezel-size', '100%');
    slot.replaceChildren(tile);
  }
}

function toHex(color) {
  if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(color)) return `#${[...color.slice(1)].map((c) => c + c).join('')}`.toLowerCase();
  const m = /rgba?\(([^)]+)\)/.exec(color);
  if (m) {
    const [r, g, b] = m[1].split(',').map((x) => parseFloat(x));
    return `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`;
  }
  return '#000000';
}

function updatePreview(rebuild) {
  const type = state.current;
  const cfg = state.tiles[type];
  const stage = $('[data-stage]');
  if (rebuild || !preview || preview.localName !== TYPES[type].tag) {
    stage.innerHTML = '';
    preview = makeTile(type, cfg);
    stage.append(preview);
  } else {
    applyTo(preview, cfg);
  }
  preview.style.setProperty('--bezel-size', `${cfg.size}px`);
  // The preview shows whichever colour set is being edited; the real tile follows the device.
  if (cfg.attrs['dark-theme']) preview.setAttribute('appearance', editingMode(cfg));
  else preview.removeAttribute('appearance');
  $('[data-size-label]').textContent = `${cfg.size} px${type === 'poster' ? ` × ${Math.round((cfg.size * 3) / 4)} px` : ''}`;
  renderSnippet();
  save();
}

function snippetParts() {
  const type = state.current;
  const t = TYPES[type];
  const cfg = state.tiles[type];
  const attrs = { ...cfg.attrs };
  if (attrs.frame === (type === 'poster' ? 'none' : 'device')) delete attrs.frame;
  if (attrs.hands === 'modern') delete attrs.hands;
  const vars = {};
  for (const k of VAR_KEYS) if (k !== 'radius' && k !== 'font' && cfg.vars[k]) vars[k] = cfg.vars[k];
  if (cfg.vars.radius != null) vars.radius = cfg.vars.radius;
  if (cfg.vars.font) vars.font = cfg.vars.font;
  const style = [`--bezel-size: ${cfg.size}px`, ...Object.entries(vars).map(([k, v]) => `--bezel-${k}: ${k === 'radius' ? `${v}cqw` : v}`)];
  return { tag: t.tag, attrs, style, vars };
}

function renderSnippet() {
  const { tag, attrs, style, vars } = snippetParts();
  const lines = [];
  const plain = [];
  lines.push(`<span class="c">&lt;!-- Load once per page --&gt;</span>`);
  plain.push('<!-- Load once per page -->');
  const font = fontLink(state.tiles[state.current].vars.font);
  if (font) {
    lines.push(`<span class="t">&lt;link</span> <span class="a">rel</span>=<span class="v">"stylesheet"</span> <span class="a">href</span>=<span class="v">"${esc(font)}"</span><span class="t">&gt;</span>`);
    plain.push(`<link rel="stylesheet" href="${font}">`);
  }
  lines.push(`<span class="t">&lt;script</span> <span class="a">type</span>=<span class="v">"module"</span> <span class="a">src</span>=<span class="v">"${CDN}"</span><span class="t">&gt;&lt;/script&gt;</span>`, '');
  plain.push(`<script type="module" src="${CDN}"></script>`, '');

  const entries = Object.entries(attrs).filter(([, v]) => v !== '' && v != null && v !== false);
  const attrHTML = entries.map(([k, v]) => (v === true ? `  <span class="a">${k}</span>` : `  <span class="a">${k}</span>=<span class="v">${k === 'events' ? `'${esc(v)}'` : `"${esc(v)}"`}</span>`));
  const attrPlain = entries.map(([k, v]) => (v === true ? `  ${k}` : `  ${k}=${k === 'events' ? `'${v}'` : `"${v}"`}`));
  attrHTML.push(`  <span class="a">style</span>=<span class="v">"${esc(style.join('; '))}"</span>`);
  attrPlain.push(`  style="${style.join('; ')}"`);
  lines.push(`<span class="t">&lt;${tag}</span>`, ...attrHTML, `<span class="t">&gt;&lt;/${tag}&gt;</span>`);
  plain.push(`<${tag}`, ...attrPlain, `></${tag}>`);

  const code = $('[data-snippet]');
  code.innerHTML = lines.join('\n');
  code.dataset.plain = plain.join('\n');

  // The desk display and Übersicht cards follow the same tile.
  const url = displayURL();
  $('[data-code="desk-url"]').textContent = url;
  $('[data-desk-open]').href = url;
  const js = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const key = (k) => (/^[a-z]+$/i.test(k) ? k : js(k));
  const obj = (o) => `{ ${Object.entries(o).map(([k, v]) => `${key(k)}: ${v === true ? 'true' : typeof v === 'number' ? v : js(v)}`).join(', ')} }`;
  const mac = { ...entries.reduce((o, [k, v]) => ((o[k] = v), o), {}) };
  // Übersicht downloads calendar feeds itself with curl, so the link goes in its own key.
  const ics = mac.ics;
  delete mac.ics;
  const tile = [`{`, `  tag: '${tag}',`, `  attrs: ${obj(mac)},`];
  if (ics) tile.push(`  ics: ${js(ics)},`);
  if (Object.keys(vars).length) tile.push(`  style: ${obj(vars)},`);
  tile.push(`  size: ${Math.min(state.tiles[state.current].size, 320)},`, `  top: 48,`, `  left: 48,`, `},`);
  $('[data-code="mac-tile"]').textContent = tile.join('\n');
}

function displayURL() {
  const type = state.current;
  const cfg = state.tiles[type];
  const params = new URLSearchParams({ tile: type });
  for (const [k, v] of Object.entries(cfg.attrs)) if (v !== '' && v != null && v !== false) params.set(k, v === true ? '' : v);
  for (const [k, v] of Object.entries(cfg.vars)) if (v !== '' && v != null) params.set(`--${k}`, v);
  return new URL(`display.html?${params}`, location.href).href;
}

async function shareDesign(button) {
  const url = shareURL();
  try {
    await navigator.clipboard.writeText(url);
    button.textContent = 'Copied';
    setTimeout(() => (button.textContent = 'Share'), 1800);
    note('Link copied. Anyone who opens it sees this design in the Studio.');
  } catch {
    note(`Copy this link to share the design: ${url}`);
  }
}

function note(text, el = $('[data-note]')) {
  el.textContent = text;
  clearTimeout(el._t);
  el._t = setTimeout(() => (el.textContent = ''), 5000);
}

function renderStudio(rebuild = false) {
  renderTabs();
  renderPanel();
  updatePreview(rebuild);
  const canvas = $('[data-canvas]');
  canvas.dataset.bg = state.bg;
  for (const b of $$('[data-bg]', $('[data-backdrops]'))) b.setAttribute('aria-pressed', String(b.dataset.bg === state.bg));
}

/** After a colour change, enable or disable the reset button without rebuilding the panel. */
function refreshPanelMeta() {
  const cfg = state.tiles[state.current];
  const reset = $('[data-reset-colors]');
  if (reset) reset.disabled = !colorKeys(state.current).some((k) => cfg.vars[k] || cfg.vars[`dark-${k}`]);
}

function bindStudio() {
  const tabs = $('[data-tabs]');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    state.current = b.dataset.tab;
    renderStudio();
    $(`#tab-${state.current}`)?.focus();
  });
  tabs.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const keys = Object.keys(TYPES);
    const i = keys.indexOf(state.current);
    state.current = keys[(i + (e.key === 'ArrowRight' ? 1 : keys.length - 1)) % keys.length];
    renderStudio();
    $(`#tab-${state.current}`)?.focus();
  });

  const panel = $('[data-panel]');

  const setHands = (value) => {
    const cfg = state.tiles[state.current];
    // Only the hands change; theme, colours and every other setting stay as they are.
    cfg.attrs.hands = value === 'modern' ? '' : value;
    renderPanel();
    updatePreview();
    panel.querySelector(`[data-hands="${value}"]`)?.focus();
  };

  panel.addEventListener('click', (e) => {
    const cfg = state.tiles[state.current];
    const seg = e.target.closest('[data-attr]');
    if (seg) {
      const key = seg.dataset.attr;
      const value = seg.dataset.value;
      if (key === 'variant' && state.current === 'clock') {
        // Follow the new face's own palette unless the user picked one deliberately.
        const defaults = { numerals: 'sage', relief: 'blush', classic: 'porcelain' };
        if (!cfg.attrs.theme || cfg.attrs.theme === defaults[cfg.attrs.variant || 'numerals']) cfg.attrs.theme = defaults[value];
        // Only the Classic face draws the second dial, so don't carry the setting into code where it does nothing.
        if (value !== 'classic') delete cfg.attrs['second-timezone'];
      }
      cfg.attrs[key] = value;
      renderPanel();
      updatePreview();
      panel.querySelector(`[data-attr="${key}"][data-value="${CSS.escape(value)}"]`)?.focus();
      return;
    }
    const hs = e.target.closest('[data-hands]');
    if (hs) {
      setHands(hs.dataset.hands);
      return;
    }
    const tab = e.target.closest('[data-group]');
    if (tab) {
      setGroup(tab.dataset.group);
      return;
    }
    const ed = e.target.closest('[data-editing]');
    if (ed) {
      state.editing = ed.dataset.editing;
      renderPanel();
      updatePreview();
      panel.querySelector(`[data-editing="${ed.dataset.editing}"]`)?.focus();
      return;
    }
    if (e.target.closest('[data-share]')) {
      shareDesign(e.target.closest('[data-share]'));
      return;
    }
    const go = e.target.closest('[data-goto]');
    if (go) {
      setGroup(go.dataset.goto);
      return;
    }
    if (e.target.closest('[data-reset-colors]')) {
      for (const k of colorKeys(state.current)) {
        delete cfg.vars[k];
        delete cfg.vars[`dark-${k}`];
      }
      renderPanel();
      updatePreview();
      panel.querySelector('[data-group="colours"]')?.focus();
      note('Colours reset to the defaults.');
      return;
    }
    if (e.target.closest('[data-get-code]')) {
      e.preventDefault();
      openWay('html', true);
      return;
    }
    const apply = e.target.closest('[data-text-apply]');
    if (apply) applyText(apply.dataset.textApply);
    if (e.target.closest('[data-reset-tile]')) {
      state.tiles[state.current] = freshState().tiles[state.current];
      renderPanel();
      updatePreview(true);
      note(`${TYPES[state.current].label} reset to its defaults.`);
    }
  });

  // Arrow keys move between the two hand designs, as in any radio group.
  panel.addEventListener('keydown', (e) => {
    const hs = e.target.closest('[data-hands]');
    if (hs && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      const values = HAND_STYLES.map(([v]) => v);
      const i = values.indexOf(hs.dataset.hands);
      const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : values.length - 1;
      setHands(values[(i + step) % values.length]);
    }
    const tab = e.target.closest('[data-group]');
    if (tab && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      const ids = groupsFor(state.current).map(([g]) => g);
      const i = ids.indexOf(tab.dataset.group);
      setGroup(ids[(i + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length]);
    }
    if (e.key === 'Enter' && e.target.matches('[data-text]')) {
      e.preventDefault();
      applyText(e.target.dataset.text);
    }
  });

  function setGroup(group) {
    state.group = group;
    renderPanel();
    save();
    panel.querySelector(`[data-group="${group}"]`)?.focus();
  }

  panel.addEventListener('input', (e) => {
    const cfg = state.tiles[state.current];
    const t = e.target;
    if (t.matches('[data-color]')) {
      const key = t.dataset.color;
      cfg.vars[editingMode(cfg) === 'dark' ? `dark-${key}` : key] = t.value;
      const row = t.closest('.crow');
      row.setAttribute('data-custom', '');
      row.querySelector('[data-hex]').textContent = t.value.toUpperCase();
      refreshPanelMeta();
      updatePreview();
      if ($('[data-hand-preview]')) renderHandPreviews();
    } else if (t.matches('[data-size]')) {
      cfg.size = Number(t.value);
      panel.querySelector('[data-out="size"]').textContent = `${cfg.size} px`;
      updatePreview();
    } else if (t.matches('[data-radius]')) {
      cfg.vars.radius = Number(t.value);
      panel.querySelector('[data-out="radius"]').textContent = t.value;
      updatePreview();
    }
  });

  panel.addEventListener('change', (e) => {
    const cfg = state.tiles[state.current];
    const t = e.target;
    if (t.matches('[data-dark]')) {
      // Turning dark mode on starts from the tile's dark preset; turning it off drops the dark set.
      if (t.checked) {
        cfg.attrs['dark-theme'] = TYPES[state.current].darkTheme;
        state.editing = 'dark';
      } else {
        delete cfg.attrs['dark-theme'];
        for (const k of COLOR_KEYS) delete cfg.vars[`dark-${k}`];
        state.editing = 'light';
      }
      renderPanel();
      updatePreview();
      panel.querySelector('[data-dark]')?.focus();
      return;
    }
    if (t.matches('[data-toggle]')) {
      const on = t.checked;
      const present = t.dataset.invert === '1' ? !on : on;
      cfg.attrs[t.dataset.toggle] = present ? true : '';
      updatePreview();
      if (['hide-seconds', 'hide-weather', 'hide-time', 'hide-date'].includes(t.dataset.toggle)) {
        renderPanel();
        panel.querySelector(`[data-toggle="${t.dataset.toggle}"]`)?.focus();
      }
    } else if (t.matches('[data-select]')) {
      cfg.attrs[t.dataset.select] = t.value;
      updatePreview();
      // The Hours examples are written in the chosen language, so redraw them.
      if (t.dataset.select === 'locale') {
        renderPanel();
        panel.querySelector('[data-select="locale"]')?.focus();
      }
    } else if (t.matches('[data-font]')) {
      cfg.vars.font = t.value;
      updatePreview();
    }
  });

  function applyText(key) {
    const input = panel.querySelector(`[data-text="${key}"]`);
    if (!input) return;
    let value = input.value.trim();
    if (key === 'ics') value = value.replace(/^webcal:/i, 'https:');
    state.tiles[state.current].attrs[key] = value;
    updatePreview();
    if (key === 'location') note(value ? `Looking up ${value}.` : 'Location cleared. The tile will use London.');
    if (key === 'ics') note(value ? 'Loading your calendar. If the feed blocks browsers, the corner keeps showing the year.' : 'Calendar link removed.');
  }

  $('[data-backdrops]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-bg]');
    if (!b) return;
    state.bg = b.dataset.bg;
    renderStudio();
  });
}

// ---- Get the code: four cards --------------------------------------------

/** Opens one card and closes the others. Cards can also be closed again, leaving none open. */
function openWay(name, scroll = false) {
  for (const card of $$('[data-way]')) {
    const open = card.dataset.way === name;
    card.setAttribute('aria-expanded', String(open));
    $(`[data-way-panel="${card.dataset.way}"]`).hidden = !open;
  }
  if (scroll) $('#install').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}

function closeWays() {
  for (const card of $$('[data-way]')) {
    card.setAttribute('aria-expanded', 'false');
    $(`[data-way-panel="${card.dataset.way}"]`).hidden = true;
  }
}

async function copyCode(button) {
  const key = button.dataset.copy;
  const code = key === 'snippet' ? $('[data-snippet]') : $(`[data-code="${key}"]`);
  const text = key === 'snippet' ? code.dataset.plain : code.textContent;
  const label = button.textContent;
  const status = $('[data-copy-note]');
  try {
    await navigator.clipboard.writeText(text);
    button.dataset.copied = '';
    button.textContent = 'Copied';
    note(`${label.replace(/^Copy /, '').replace(/^./, (c) => c.toUpperCase())} copied to the clipboard.`, status);
    setTimeout(() => {
      delete button.dataset.copied;
      button.textContent = label;
    }, 1800);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    note('Copying is blocked here. The code is selected, so press ⌘C or Ctrl+C.', status);
  }
}

function bindWays() {
  const host = $('[data-ways]');
  host.addEventListener('click', (e) => {
    const card = e.target.closest('[data-way]');
    if (card) {
      if (card.getAttribute('aria-expanded') === 'true') closeWays();
      else openWay(card.dataset.way);
      return;
    }
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) copyCode(copyBtn);
  });
  $('[data-desk]').addEventListener('click', openDesk);
}

// ---- Desk mode ---------------------------------------------------------

let wakeLock = null;
let idleTimer = 0;
let shiftTimer = 0;

async function openDesk() {
  const overlay = $('[data-desk-overlay]');
  const stage = $('[data-desk-stage]');
  const type = state.current;
  const tile = makeTile(type, state.tiles[type]);
  const wide = type === 'poster';
  tile.style.setProperty('--bezel-size', wide ? 'min(94vw, calc(94vh * 4 / 3))' : 'min(90vw, 90vh)');
  stage.replaceChildren(tile);
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  $('[data-desk-exit]').focus();

  try {
    await overlay.requestFullscreen?.();
  } catch {}
  try {
    wakeLock = await navigator.wakeLock?.request('screen');
  } catch {}

  const wake = () => {
    overlay.removeAttribute('data-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => overlay.setAttribute('data-idle', ''), 2500);
  };
  overlay.onpointermove = wake;
  overlay.onpointerdown = wake;
  wake();

  // Nudge the tile a few pixels each minute so a static image never burns in.
  shiftTimer = setInterval(() => {
    const dx = Math.round((Math.random() - 0.5) * 12);
    const dy = Math.round((Math.random() - 0.5) * 12);
    stage.style.transform = `translate(${dx}px, ${dy}px)`;
  }, 60_000);
}

async function closeDesk() {
  const overlay = $('[data-desk-overlay]');
  if (overlay.hidden) return;
  overlay.hidden = true;
  document.body.style.overflow = '';
  $('[data-desk-stage]').replaceChildren();
  clearInterval(shiftTimer);
  clearTimeout(idleTimer);
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {}
  try {
    await wakeLock?.release();
  } catch {}
  wakeLock = null;
  $('[data-desk]').focus();
}

$('[data-desk-exit]')?.addEventListener('click', closeDesk);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDesk();
});
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && !$('[data-desk-overlay]').hidden) closeDesk();
});

// ---- Boot ----------------------------------------------------------------

// ---- Footer: the copy for the periwinkle half -----------------------

/**
 * The footer is split on its diagonal. The real content shows in deep plum on the pink half;
 * this copy shows in deep indigo on the periwinkle half. Screen readers and keyboards only meet the
 * real content; the copy's links still work for a mouse or a tap on the periwinkle side.
 */
function buildFooterCopy() {
  const layer = $('.foot__layer');
  if (!layer || $('.foot__layer--sun')) return;
  const copy = layer.cloneNode(true);
  copy.classList.add('foot__layer--sun');
  copy.setAttribute('aria-hidden', 'true');
  for (const el of copy.querySelectorAll('a, button, [tabindex]')) el.setAttribute('tabindex', '-1');
  for (const el of copy.querySelectorAll('[id]')) el.removeAttribute('id');
  layer.after(copy);
}
buildFooterCopy();

await Promise.all(Object.values(TYPES).map((t) => customElements.whenDefined(t.tag)));
const shared = readSharedDesign();
bindShowcase();
bindStudio();
bindWays();
renderStudio(true);
booted = true;
if (shared) {
  save();
  $('#studio').scrollIntoView();
  note('Shared design loaded. Change anything you like, then copy the code.');
}
