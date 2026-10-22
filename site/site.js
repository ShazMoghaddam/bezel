// Bezel demo site: showcase, studio, code cards and desk mode.
// The tiles themselves come from the library; this file only drives the page.

const CDN = 'https://cdn.jsdelivr.net/gh/ShazMoghaddam/bezel@v1.0.0/dist/bezel.min.js';
const STORE_KEY = 'bezel-studio-v2';

const FONTS = [
  ['', 'Default'],
  ['"Geist", sans-serif', 'Geist'],
  ['"Geist Mono", monospace', 'Geist Mono'],
];
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

const HAND_STYLES = [
  ['modern', 'Modern', 'The original slim hands'],
  ['lollipop', 'Lollipop', 'Batons with a round seconds tip'],
];

const time = [
  { type: 'select', key: 'timezone', label: 'Time zone', options: ZONES },
  { type: 'seg', key: 'hour-cycle', label: 'Hours', options: [['', 'Auto'], ['12', '12 h'], ['24', '24 h']] },
  { type: 'select', key: 'locale', label: 'Language', options: LOCALES },
];
const place = [
  { type: 'place', key: 'location', label: 'Location' },
  { type: 'seg', key: 'units', label: 'Units', options: [['', 'Auto'], ['metric', '°C · km/h'], ['imperial', '°F · mph']] },
];
const weekStart = { type: 'seg', key: 'week-start', label: 'Week starts', options: [['', 'Auto'], ['mon', 'Monday'], ['sun', 'Sunday']] };

/*
 * Each component lists its controls by Studio section:
 *   look      extra Appearance controls, under the theme
 *   colors    the colour pickers shown under Colours (hand colour lives under Clock hands)
 *   hands     true when the tile has an analog dial; `handControls` adds to that section
 *   content   an optional [title, controls] section for what the tile shows
 *   display   extra Layout and display controls, under frame and size
 *   time      the Time and language controls
 */
const TYPES = {
  clock: {
    tag: 'bezel-clock',
    label: 'Clock',
    size: 380,
    attrs: { variant: 'numerals', theme: 'sage' },
    colors: ['surface', 'ink', 'accent'],
    colorLabels: { accent: 'Accent' },
    look: [
      { type: 'seg', key: 'variant', label: 'Face', options: [['numerals', 'Numerals'], ['relief', 'Relief'], ['classic', 'Classic']] },
      { type: 'seg', key: 'numerals', label: 'Numbers', options: [['', '1 2 3'], ['roman', 'I II III'], ['persian', '۱ ۲ ۳']] },
    ],
    hands: true,
    handControls: [
      { type: 'toggle', key: 'hide-seconds', label: 'Seconds hand', invert: true },
      { type: 'seg', key: 'sweep', label: 'Seconds motion', options: [['', 'Smooth sweep'], ['tick', 'Tick']] },
    ],
    display: [
      { type: 'toggle', key: 'hide-date', label: 'Show the date', invert: true, hint: 'Shown on the Numerals and Classic faces.' },
      { type: 'select', key: 'second-timezone', label: 'Second time zone', options: [['', 'None'], ...ZONES.slice(1)], hint: 'Adds a small dial for another city on the Classic face.' },
    ],
    time,
  },
  calendar: {
    tag: 'bezel-calendar',
    label: 'Calendar',
    size: 380,
    attrs: { theme: 'snow' },
    colors: ['surface', 'ink', 'accent', 'today', 'muted'],
    colorLabels: { accent: 'Month and backdrop' },
    display: [
      weekStart,
      { type: 'toggle', key: 'hide-time', label: 'Time in the header', invert: true },
      { type: 'toggle', key: 'hide-backdrop', label: 'Giant day numeral', invert: true },
    ],
    time,
  },
  weather: {
    tag: 'bezel-weather',
    label: 'Weather',
    size: 380,
    attrs: { location: 'London' },
    colors: ['ink', 'tint'],
    content: ['Forecast', [...place, { type: 'toggle', key: 'still', label: 'Animated sky', invert: true }]],
    display: [{ type: 'toggle', key: 'hide-time', label: 'Clock in the corner', invert: true }],
    time,
  },
  glance: {
    tag: 'bezel-glance',
    label: 'Glance',
    size: 400,
    attrs: { theme: 'mist', location: 'London' },
    colors: ['surface', 'ink', 'accent', 'soft'],
    colorLabels: { accent: 'Accent' },
    sample: false,
    hands: true,
    content: ['Content', [
      { type: 'toggle', key: 'hide-weather', label: 'Weather corner', invert: true },
      { type: 'sample', label: 'Sample agenda', hint: 'Without events, the lower left shows how far through the year you are. Use the events attribute or an ics feed for real ones.' },
      ...place,
    ]],
    display: [],
    time,
  },
  poster: {
    tag: 'bezel-poster',
    label: 'Poster',
    size: 560,
    attrs: { theme: 'noir' },
    colors: ['surface', 'ink', 'accent'],
    colorLabels: { accent: 'Today' },
    content: ['Month', [
      { type: 'month', key: 'month', label: 'Month', hint: 'Leave empty to follow the current month.' },
      weekStart,
      { type: 'toggle', key: 'no-highlight', label: 'Highlight today', invert: true },
    ]],
    display: [],
    time: time.slice(0, 1).concat(time.slice(2)),
  },
};

// ---------------------------------------------------------------------------

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function freshState() {
  const s = { current: 'clock', bg: 'desk', tiles: {} };
  for (const [k, t] of Object.entries(TYPES)) {
    s.tiles[k] = { attrs: { frame: k === 'poster' ? 'none' : 'device', ...t.attrs }, vars: {}, size: t.size, sample: Boolean(t.sample) };
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
    }
  } catch {}
  return s;
}

const state = loadState();
const save = () => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {}
};

function sampleEvents() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  // Local wall-clock time with the UTC offset, so the events land where they should in any time zone.
  const at = (h, m) => {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
    const off = -t.getTimezoneOffset();
    const sign = off >= 0 ? '+' : '-';
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}T${pad(h)}:${pad(m)}${sign}${pad(Math.floor(Math.abs(off) / 60))}:${pad(Math.abs(off) % 60)}`;
  };
  const later = Math.min(22, d.getHours() + 1);
  return [
    { title: 'Product review', start: at(later, 0), end: at(later + 1, 30) },
    { title: 'Design sync', start: at(Math.min(23, later + 2), 0), end: at(Math.min(23, later + 2), 45) },
    { title: 'Dinner with Jennie', start: at(23, 0), end: at(23, 55) },
  ];
}

/** Applies a tile config to an element, adding and removing attributes as needed. */
function applyTo(el, cfg, type) {
  const attrs = { ...cfg.attrs };
  if (type === 'glance' && cfg.sample) attrs.events = JSON.stringify(sampleEvents());
  for (const a of [...el.attributes]) {
    if (['class', 'style', 'role', 'aria-label', 'aria-hidden', 'data-bezel-label'].includes(a.name)) continue;
    if (!(a.name in attrs)) el.removeAttribute(a.name);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false || v === '') el.removeAttribute(k);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of [...COLOR_KEYS, 'radius', 'font']) {
    const v = cfg.vars[k];
    // Check for empty explicitly: a radius of 0 is a real value, not "unset".
    if (v !== undefined && v !== null && v !== '') el.style.setProperty(`--bezel-${k}`, k === 'radius' ? `${v}cqw` : v);
    else el.style.removeProperty(`--bezel-${k}`);
  }
}

function makeTile(type, cfg) {
  const el = document.createElement(TYPES[type].tag);
  applyTo(el, cfg, type);
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
  state.tiles[type] = { attrs: { frame: type === 'poster' ? 'none' : 'device', ...attrs }, vars: {}, size: TYPES[type].size, sample: false };
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

/** The colour a picker should show: the custom value, else the theme's own. */
function colorValue(type, cfg, key) {
  const custom = cfg.vars[key];
  const fallback = key === 'tint' ? '#4f9be6' : effectiveTheme(type, cfg)[key] || '#000000';
  return toHex(custom || fallback);
}

function control(c, cfg) {
  const id = `c-${c.key ?? c.type}`;
  const value = c.key ? cfg.attrs[c.key] ?? '' : '';
  const hintId = c.hint ? `${id}-h` : '';
  const hint = c.hint ? `<p class="hint" id="${hintId}">${esc(c.hint)}</p>` : '';
  const described = hintId ? ` aria-describedby="${hintId}"` : '';
  switch (c.type) {
    case 'seg':
      return `<div class="field"><span class="field__l" id="${id}-l">${esc(c.label)}</span><div class="seg" role="group" aria-labelledby="${id}-l"${described}>${c.options
        .map(([v, l]) => `<button type="button" data-attr="${c.key}" data-value="${esc(v)}" aria-pressed="${String(value) === v}">${esc(l)}</button>`)
        .join('')}</div>${hint}</div>`;
    case 'toggle': {
      const on = c.invert ? !cfg.attrs[c.key] : Boolean(cfg.attrs[c.key]);
      return `<div class="field"><label class="toggle" for="${id}">${esc(c.label)}<input type="checkbox" role="switch" id="${id}" data-toggle="${c.key}" data-invert="${c.invert ? 1 : 0}" ${on ? 'checked' : ''}${described}></label>${hint}</div>`;
    }
    case 'sample':
      return `<div class="field"><label class="toggle" for="${id}">${esc(c.label)}<input type="checkbox" role="switch" id="${id}" data-sample ${cfg.sample ? 'checked' : ''}${described}></label>${hint}</div>`;
    case 'select':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><select id="${id}" data-select="${c.key}"${described}>${c.options
        .map(([v, l]) => `<option value="${esc(v)}" ${String(value) === v ? 'selected' : ''}>${esc(l)}</option>`)
        .join('')}</select>${hint}</div>`;
    case 'month':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><input type="month" id="${id}" data-select="${c.key}" value="${esc(value)}"${described}>${hint}</div>`;
    case 'place':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><div class="inline"><input type="text" id="${id}" data-place value="${esc(value)}" placeholder="City or town" enterkeyhint="done" aria-describedby="${id}-h"><button type="button" class="btn" data-place-apply>Apply</button></div><p class="hint" id="${id}-h">Weather comes live from Open-Meteo. If it can't be reached, the tile shows sample data and says so.</p></div>`;
    default:
      return '';
  }
}

/** One colour picker row: swatch, name and hex value. Custom colours get a ring and a "Custom" tag. */
function colorRow(type, cfg, key, labelOverride) {
  const t = TYPES[type];
  const label = labelOverride ?? t.colorLabels?.[key] ?? COLOR_LABELS[key];
  const v = colorValue(type, cfg, key);
  const custom = Boolean(cfg.vars[key]);
  return `<label class="crow" ${custom ? 'data-custom' : ''}>
    <input type="color" value="${v}" data-color="${key}" aria-label="${esc(label)} colour">
    <span class="crow__l">${esc(label)}</span>
    <span class="crow__v"><span data-hex="${key}">${v.toUpperCase()}</span><em>Custom</em></span>
  </label>`;
}

// Sections open on first visit. After that the Studio remembers what you opened and closed.
const DEFAULT_OPEN = { Appearance: true, Colours: true, 'Clock hands': true, Forecast: true, Content: true, Month: true, 'Layout and display': true, 'Time and language': false };

function section(title, body, meta = '') {
  const open = state.open?.[title] ?? DEFAULT_OPEN[title] ?? true;
  return `<details class="group" data-section="${esc(title)}" ${open ? 'open' : ''}><summary class="group__t"><span>${esc(title)}</span><span class="group__meta">${esc(meta)}</span></summary><div class="group__body">${body}</div></details>`;
}

function renderPanel() {
  const type = state.current;
  const t = TYPES[type];
  const cfg = state.tiles[type];
  const themes = themesFor(type);
  const activeName = effectiveThemeName(type, cfg);
  const themeNames = Object.keys(themes);

  // Appearance: theme, face, typeface and night theme.
  const swatches = themeNames.length > 1
    ? `<div class="field"><span class="field__l" id="theme-l">Theme</span><div class="swatches" role="group" aria-labelledby="theme-l">${themeNames
        .map((n) => {
          const th = themes[n];
          return `<button type="button" class="swatch" data-theme-name="${n}" aria-pressed="${n === activeName}" title="${n}" style="--sw-surface:${th.surface};--sw-accent:${th.accent}"><i></i>${n}</button>`;
        })
        .join('')}</div></div>`
    : '';
  const font = `<div class="field"><label for="c-font">Typeface</label><select id="c-font" data-font aria-describedby="c-font-h">${FONTS.map(([v, l]) => `<option value="${esc(v)}" ${cfg.vars.font === v || (!cfg.vars.font && !v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select><p class="hint" id="c-font-h">Default uses SF Pro on Apple devices and Geist elsewhere.</p></div>`;
  const night = themeNames.length > 1
    ? `<div class="field"><label for="c-night-theme">At night, switch to</label><select id="c-night-theme" data-select="night-theme" aria-describedby="c-night-h"><option value="">Keep the same theme</option>${themeNames
        .map((n) => `<option value="${n}" ${cfg.attrs['night-theme'] === n ? 'selected' : ''}>${n}</option>`)
        .join('')}</select><p class="hint" id="c-night-h">Night runs from 7 pm to 7 am in the tile's time zone.</p></div>`
    : '';
  const appearance = swatches + (t.look ?? []).map((c) => control(c, cfg)).join('') + font + night;

  // Colours: every picker applies instantly; picking a theme restores its colours.
  const customCount = [...t.colors, ...(t.hands ? ['hand'] : [])].filter((k) => cfg.vars[k]).length;
  const colors = `<div class="field">
      <span class="field__l">Pick any colour <button type="button" class="link" data-reset-colors ${customCount ? '' : 'hidden'}>Use theme colours</button></span>
      <div class="crows">${t.colors.map((k) => colorRow(type, cfg, k)).join('')}</div>
      <p class="hint">${type === 'weather'
        ? 'The sky follows the live weather. A tint recolours it while keeping the clouds and light.'
        : type === 'clock' && (cfg.attrs.variant || 'numerals') === 'relief'
          ? 'Relief numerals are pressed into the background, so they take their colour from it.'
          : 'Custom colours sit on top of the theme. Choosing a theme again resets them.'}</p>
    </div>`;

  // Clock hands: design, colour and seconds.
  const handValue = cfg.attrs.hands || 'modern';
  const hands = t.hands
    ? `<div class="field"><span class="field__l" id="hands-l">Design</span><div class="hstyles" role="radiogroup" aria-labelledby="hands-l">${HAND_STYLES.map(
        ([v, l, d]) => `<button type="button" class="hstyle" role="radio" data-hands="${v}" aria-checked="${handValue === v}" tabindex="${handValue === v ? 0 : -1}">
            <span class="hstyle__dial" data-hand-preview="${v}"></span>
            <span class="hstyle__t">${l}</span><span class="hstyle__d">${d}</span>
          </button>`,
      ).join('')}</div></div>
      <div class="field"><span class="field__l">Colour</span><div class="crows">${colorRow(type, cfg, 'hand')}${t.colors.includes('accent') ? colorRow(type, cfg, 'accent', 'Seconds hand') : ''}</div></div>
      ${(t.handControls ?? []).map((c) => control(c, cfg)).join('')}`
    : '';

  // Layout and display: frame, size and corners, then tile-specific layout.
  const frameOptions = [['device', 'Device'], ['bezel', 'Bezel'], ['none', 'None']];
  const frameValue = cfg.attrs.frame || (type === 'poster' ? 'none' : 'device');
  const radius = cfg.vars.radius ?? (type === 'poster' ? 4 : 22);
  const layout = `<div class="field"><span class="field__l" id="frame-l">Frame</span><div class="seg" role="group" aria-labelledby="frame-l" aria-describedby="frame-h">${frameOptions
      .map(([v, l]) => `<button type="button" data-attr="frame" data-value="${v}" aria-pressed="${frameValue === v}">${l}</button>`)
      .join('')}</div><p class="hint" id="frame-h">Device adds a camera dot and shadow to the black bezel. None shows just the screen.</p></div>
    <div class="row2">
      <div class="field"><label class="field__l" for="c-size">Size <output data-out="size">${cfg.size} px</output></label><input type="range" id="c-size" min="180" max="${type === 'poster' ? 760 : 560}" step="10" value="${cfg.size}" data-size></div>
      <div class="field"><label class="field__l" for="c-radius">Corners <output data-out="radius">${radius}</output></label><input type="range" id="c-radius" min="1" max="40" step="1" value="${radius}" data-radius></div>
    </div>
    ${(t.display ?? []).map((c) => control(c, cfg)).join('')}`;

  const frameLabel = frameOptions.find(([v]) => v === frameValue)[1];
  const panel = $('[data-panel]');
  const scroll = panel.scrollTop;
  panel.id = 'studio-panel';
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', `tab-${type}`);
  panel.innerHTML =
    `<p class="panel__intro">Changes apply to the preview straight away.</p>` +
    section('Appearance', appearance, activeName) +
    section('Colours', colors, customCount ? `${customCount} custom` : 'From theme') +
    (t.hands ? section('Clock hands', hands, HAND_STYLES.find(([v]) => v === handValue)[1]) : '') +
    (t.content ? section(t.content[0], t.content[1].map((c) => control(c, cfg)).join('')) : '') +
    section('Layout and display', layout, `${frameLabel} · ${cfg.size} px`) +
    section('Time and language', t.time.map((c) => control(c, cfg)).join(''), cfg.attrs.timezone ? ZONES.find(([z]) => z === cfg.attrs.timezone)?.[1] ?? '' : 'This device') +
    `<div class="panel__foot"><button type="button" class="btn btn--quiet" data-reset-tile>Reset ${esc(t.label.toLowerCase())}</button><a class="btn btn--solid" href="#install" data-get-code>Get the code</a></div>`;
  renderHandPreviews();
  panel.scrollTop = scroll;
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
    applyTo(preview, cfg, type);
  }
  preview.style.setProperty('--bezel-size', `${cfg.size}px`);
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
  if (type === 'glance' && cfg.sample) attrs.events = JSON.stringify(sampleEvents());
  const vars = {};
  for (const k of COLOR_KEYS) if (cfg.vars[k]) vars[k] = cfg.vars[k];
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
  delete mac.events;
  const tile = [`{`, `  tag: '${tag}',`, `  attrs: ${obj(mac)},`];
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
  if (type === 'glance' && cfg.sample) params.set('sample', '1');
  return new URL(`display.html?${params}`, location.href).href;
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

/** After a colour or hands change, refresh the bits of the panel that describe it without rebuilding it. */
function refreshPanelMeta() {
  const type = state.current;
  const cfg = state.tiles[type];
  const t = TYPES[type];
  const n = [...t.colors, ...(t.hands ? ['hand'] : [])].filter((k) => cfg.vars[k]).length;
  const meta = $('[data-section="Colours"] .group__meta');
  if (meta) meta.textContent = n ? `${n} custom` : 'From theme';
  const reset = $('[data-reset-colors]');
  if (reset) reset.hidden = !n;
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
  panel.addEventListener('submit', (e) => e.preventDefault());

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
    const sw = e.target.closest('[data-theme-name]');
    if (sw) {
      const had = [...TYPES[state.current].colors, 'hand'].some((k) => cfg.vars[k]);
      cfg.attrs.theme = sw.dataset.themeName;
      for (const k of [...TYPES[state.current].colors, 'hand']) delete cfg.vars[k];
      renderPanel();
      updatePreview();
      panel.querySelector(`[data-theme-name="${sw.dataset.themeName}"]`)?.focus();
      if (had) note(`Switched to ${sw.dataset.themeName}. Your custom colours were replaced by the theme's.`);
      return;
    }
    if (e.target.closest('[data-reset-colors]')) {
      for (const k of [...TYPES[state.current].colors, 'hand']) delete cfg.vars[k];
      renderPanel();
      updatePreview();
      note('Back to the theme colours.');
      return;
    }
    if (e.target.closest('[data-get-code]')) {
      e.preventDefault();
      openWay('html', true);
      return;
    }
    if (e.target.closest('[data-place-apply]')) applyPlace();
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
    if (e.key === 'Enter' && e.target.matches('[data-place]')) {
      e.preventDefault();
      applyPlace();
    }
  });

  panel.addEventListener('toggle', (e) => {
    const d = e.target.closest?.('[data-section]');
    if (!d) return;
    state.open = { ...(state.open || {}), [d.dataset.section]: d.open };
    save();
  }, true);

  panel.addEventListener('input', (e) => {
    const cfg = state.tiles[state.current];
    const t = e.target;
    if (t.matches('[data-color]')) {
      const key = t.dataset.color;
      cfg.vars[key] = t.value;
      // The accent picker appears twice for clocks (Colours and Clock hands); keep both in step.
      for (const input of panel.querySelectorAll(`[data-color="${key}"]`)) {
        if (input !== t) input.value = t.value;
        input.closest('.crow').setAttribute('data-custom', '');
      }
      for (const hex of panel.querySelectorAll(`[data-hex="${key}"]`)) hex.textContent = t.value.toUpperCase();
      refreshPanelMeta();
      updatePreview();
      if (key === 'hand' || key === 'accent' || key === 'surface' || key === 'ink') renderHandPreviews();
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
    if (t.matches('[data-toggle]')) {
      const on = t.checked;
      const present = t.dataset.invert === '1' ? !on : on;
      cfg.attrs[t.dataset.toggle] = present ? true : '';
      updatePreview();
    } else if (t.matches('[data-sample]')) {
      cfg.sample = t.checked;
      updatePreview();
    } else if (t.matches('[data-select]')) {
      cfg.attrs[t.dataset.select] = t.value;
      updatePreview();
    } else if (t.matches('[data-font]')) {
      cfg.vars.font = t.value;
      updatePreview();
    }
  });

  function applyPlace() {
    const input = panel.querySelector('[data-place]');
    if (!input) return;
    state.tiles[state.current].attrs.location = input.value.trim();
    updatePreview();
    note(input.value.trim() ? `Looking up ${input.value.trim()}.` : 'Location cleared. The tile will use London.');
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

await Promise.all(Object.values(TYPES).map((t) => customElements.whenDefined(t.tag)));
bindShowcase();
bindStudio();
bindWays();
renderStudio(true);
