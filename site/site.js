// Bezel demo site: presets, studio and desk mode.
// The tiles themselves come from the library; this file only drives the page.

const CDN = 'https://cdn.jsdelivr.net/gh/ShazMoghaddam/bezel@v1.0.0/dist/bezel.min.js';
const STORE_KEY = 'bezel-studio-v1';

const FONTS = [
  ['', 'System (SF Pro on Apple)'],
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

const COLOR_LABELS = { surface: 'Surface', ink: 'Ink', accent: 'Accent', hand: 'Hands', today: 'Today', muted: 'Muted', soft: 'Plate', rule: 'Rules' };

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

const TYPES = {
  clock: {
    tag: 'bezel-clock',
    label: 'Clock',
    size: 380,
    attrs: { variant: 'numerals', theme: 'sage' },
    colors: ['surface', 'ink', 'hand', 'accent'],
    groups: [
      ['Face', [
        { type: 'seg', key: 'variant', label: 'Style', options: [['numerals', 'Numerals'], ['relief', 'Relief'], ['classic', 'Classic']] },
        { type: 'toggle', key: 'hide-seconds', label: 'Seconds hand', invert: true },
        { type: 'seg', key: 'sweep', label: 'Second hand motion', options: [['', 'Sweep'], ['tick', 'Tick']] },
        { type: 'toggle', key: 'hide-date', label: 'Date', invert: true, hint: 'Shown on the Numerals and Classic faces.' },
      ]],
      ['Time', time],
    ],
  },
  calendar: {
    tag: 'bezel-calendar',
    label: 'Calendar',
    size: 380,
    attrs: { theme: 'snow' },
    colors: ['surface', 'ink', 'accent', 'today', 'muted'],
    groups: [
      ['Layout', [
        weekStart,
        { type: 'toggle', key: 'hide-time', label: 'Time in header', invert: true },
        { type: 'toggle', key: 'hide-backdrop', label: 'Giant day numeral', invert: true },
      ]],
      ['Time', time],
    ],
  },
  weather: {
    tag: 'bezel-weather',
    label: 'Weather',
    size: 380,
    attrs: { location: 'London' },
    colors: [],
    groups: [
      ['Forecast', [...place, { type: 'toggle', key: 'still', label: 'Animated sky', invert: true }, { type: 'toggle', key: 'hide-time', label: 'Clock', invert: true }]],
      ['Time', time],
    ],
  },
  glance: {
    tag: 'bezel-glance',
    label: 'Glance',
    size: 400,
    attrs: { theme: 'mist', location: 'London' },
    colors: ['surface', 'ink', 'accent', 'soft'],
    sample: false,
    groups: [
      ['Corners', [
        { type: 'toggle', key: 'hide-weather', label: 'Weather', invert: true },
        { type: 'sample', label: 'Sample agenda', hint: 'Without events, the lower left shows how far through the year you are. Use the events attribute or an ics feed for real ones.' },
        ...place,
      ]],
      ['Time', time],
    ],
  },
  poster: {
    tag: 'bezel-poster',
    label: 'Poster',
    size: 560,
    attrs: { theme: 'noir' },
    colors: ['surface', 'ink', 'accent'],
    groups: [
      ['Month', [
        { type: 'month', key: 'month', label: 'Month', hint: 'Leave empty to follow the current month.' },
        weekStart,
        { type: 'toggle', key: 'no-highlight', label: 'Highlight today', invert: true },
      ]],
      ['Time', time.slice(0, 1).concat(time.slice(2))],
    ],
  },
};

const PRESETS = [
  { type: 'clock', name: 'Numerals', sub: 'sage', attrs: { variant: 'numerals', theme: 'sage' } },
  { type: 'clock', name: 'Relief', sub: 'blush', attrs: { variant: 'relief', theme: 'blush' } },
  { type: 'calendar', name: 'Calendar', sub: 'snow', attrs: { theme: 'snow' } },
  { type: 'weather', name: 'Weather', sub: 'live sky', attrs: { location: 'London' } },
  { type: 'glance', name: 'Glance', sub: 'mist', attrs: { theme: 'mist', location: 'London' } },
  { type: 'glance', name: 'Glance', sub: 'orchid, agenda', attrs: { theme: 'orchid', location: 'New York', 'hour-cycle': '12' }, sample: true },
  { type: 'clock', name: 'Classic', sub: 'porcelain', attrs: { variant: 'classic', theme: 'porcelain', frame: 'bezel' } },
  { type: 'clock', name: 'Numerals', sub: 'cobalt', attrs: { variant: 'numerals', theme: 'cobalt' } },
  { type: 'clock', name: 'Relief', sub: 'midnight', attrs: { variant: 'relief', theme: 'midnight' } },
  { type: 'calendar', name: 'Calendar', sub: 'ink', attrs: { theme: 'ink' } },
  { type: 'clock', name: 'Classic', sub: 'graphite', attrs: { variant: 'classic', theme: 'graphite' } },
  { type: 'poster', name: 'Poster', sub: 'noir', attrs: { theme: 'noir' }, wide: true },
  { type: 'poster', name: 'Poster', sub: 'signal', attrs: { theme: 'signal' }, wide: true },
];

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
  const at = (h, m) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m).toISOString().slice(0, 16);
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
    if (['class', 'style', 'role', 'aria-label', 'data-bezel-label'].includes(a.name)) continue;
    if (!(a.name in attrs)) el.removeAttribute(a.name);
  }
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false || v === '') el.removeAttribute(k);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of ['surface', 'ink', 'accent', 'hand', 'today', 'muted', 'soft', 'rule', 'radius', 'font']) {
    const v = cfg.vars[k];
    if (v) el.style.setProperty(`--bezel-${k}`, k === 'radius' ? `${v}cqw` : v);
    else el.style.removeProperty(`--bezel-${k}`);
  }
}

function makeTile(type, cfg) {
  const el = document.createElement(TYPES[type].tag);
  applyTo(el, cfg, type);
  return el;
}

// ---- Presets -------------------------------------------------------------

function renderPresets() {
  const host = $('[data-presets]');
  if (!host) return;
  host.innerHTML = '';
  for (const p of PRESETS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `preset${p.wide ? ' preset--wide' : ''}`;
    b.setAttribute('aria-label', `Open ${p.name}, ${p.sub}, in the studio`);
    const cfg = { attrs: { frame: TYPES[p.type].attrs.frame ?? (p.type === 'poster' ? '' : 'device'), ...p.attrs }, vars: {}, sample: p.sample };
    if (p.type === 'poster') delete cfg.attrs.frame;
    const tile = makeTile(p.type, cfg);
    tile.setAttribute('aria-hidden', 'true');
    tile.removeAttribute('role');
    b.append(tile);
    b.insertAdjacentHTML('beforeend', `<span class="preset__label"><b>${esc(p.name)}</b><span>${esc(p.sub)}</span></span>`);
    b.addEventListener('click', () => {
      state.current = p.type;
      state.tiles[p.type] = { attrs: { ...cfg.attrs, frame: cfg.attrs.frame ?? (p.type === 'poster' ? 'none' : 'device') }, vars: {}, size: TYPES[p.type].size, sample: Boolean(p.sample) };
      renderStudio(true);
      $('#studio').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    host.append(b);
  }
}

// ---- Studio --------------------------------------------------------------

let preview = null;

function renderTabs() {
  const host = $('[data-tabs]');
  host.innerHTML = Object.entries(TYPES)
    .map(([k, t]) => `<button type="button" role="tab" id="tab-${k}" aria-selected="${k === state.current}" aria-controls="studio-panel" data-tab="${k}">${t.label}</button>`)
    .join('');
}

function themesFor(type) {
  return customElements.get(TYPES[type].tag)?.themes ?? {};
}

function effectiveTheme(type, cfg) {
  const themes = themesFor(type);
  const ctor = customElements.get(TYPES[type].tag);
  let name = cfg.attrs.theme;
  if (!name || !themes[name]) {
    if (type === 'clock') name = { numerals: 'sage', relief: 'blush', classic: 'porcelain' }[cfg.attrs.variant || 'numerals'];
    else name = ctor?.defaultTheme;
  }
  return themes[name] ?? {};
}

function control(c, cfg) {
  const id = `c-${c.key ?? c.type}`;
  const value = c.key ? cfg.attrs[c.key] ?? '' : '';
  const hint = c.hint ? `<p class="hint">${esc(c.hint)}</p>` : '';
  switch (c.type) {
    case 'seg':
      return `<div class="field"><span class="field__l" id="${id}-l">${esc(c.label)}</span><div class="seg" role="group" aria-labelledby="${id}-l">${c.options
        .map(([v, l]) => `<button type="button" data-attr="${c.key}" data-value="${esc(v)}" aria-pressed="${String(value) === v}">${esc(l)}</button>`)
        .join('')}</div>${hint}</div>`;
    case 'toggle': {
      const on = c.invert ? !cfg.attrs[c.key] : Boolean(cfg.attrs[c.key]);
      return `<div class="field"><label class="toggle" for="${id}">${esc(c.label)}<input type="checkbox" id="${id}" data-toggle="${c.key}" data-invert="${c.invert ? 1 : 0}" ${on ? 'checked' : ''}></label>${hint}</div>`;
    }
    case 'sample':
      return `<div class="field"><label class="toggle" for="${id}">${esc(c.label)}<input type="checkbox" id="${id}" data-sample ${cfg.sample ? 'checked' : ''}></label>${hint}</div>`;
    case 'select':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><select id="${id}" data-select="${c.key}">${c.options
        .map(([v, l]) => `<option value="${esc(v)}" ${String(value) === v ? 'selected' : ''}>${esc(l)}</option>`)
        .join('')}</select>${hint}</div>`;
    case 'month':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><input type="month" id="${id}" data-select="${c.key}" value="${esc(value)}">${hint}</div>`;
    case 'place':
      return `<div class="field"><label for="${id}">${esc(c.label)}</label><div class="inline"><input type="text" id="${id}" data-place value="${esc(value)}" placeholder="City or town" enterkeyhint="done"><button type="button" class="btn" data-place-apply>Apply</button></div><p class="hint">Weather comes live from Open-Meteo. If it can't be reached, the tile shows sample data and says so.</p></div>`;
    default:
      return '';
  }
}

function renderPanel() {
  const type = state.current;
  const t = TYPES[type];
  const cfg = state.tiles[type];
  const themes = themesFor(type);
  const active = effectiveTheme(type, cfg);

  const themeNames = Object.keys(themes);
  const swatches = themeNames.length > 1
    ? `<div class="field"><span class="field__l" id="theme-l">Theme</span><div class="swatches" role="group" aria-labelledby="theme-l">${themeNames
        .map((n) => {
          const th = themes[n];
          const pressed = active === th;
          return `<button type="button" class="swatch" data-theme-name="${n}" aria-pressed="${pressed}" style="--sw-surface:${th.surface};--sw-accent:${th.accent}"><i></i>${n}</button>`;
        })
        .join('')}</div></div>`
    : '';

  const colors = t.colors.length
    ? `<div class="field"><span class="field__l">Colours <button type="button" class="link" data-reset-colors>Reset</button></span><div class="colors">${t.colors
        .map((k) => {
          const custom = cfg.vars[k];
          const v = toHex(custom || active[k] || '#000000');
          return `<label class="color" ${custom ? 'data-custom' : ''}><input type="color" value="${v}" data-color="${k}" aria-label="${COLOR_LABELS[k]} colour"><span>${COLOR_LABELS[k]}</span></label>`;
        })
        .join('')}</div></div>`
    : '';

  const frameOptions = [['device', 'Device'], ['bezel', 'Bezel'], ['none', 'None']];
  const frameValue = cfg.attrs.frame || (type === 'poster' ? 'none' : 'device');
  const radius = cfg.vars.radius ?? (type === 'poster' ? 4 : 22);

  const look = `<div class="group"><span class="group__t">Look</span>${swatches}${colors}
    <div class="field"><label for="c-font">Typeface</label><select id="c-font" data-font>${FONTS.map(([v, l]) => `<option value="${esc(v)}" ${cfg.vars.font === v || (!cfg.vars.font && !v) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></div>
  </div>`;

  const frame = `<div class="group"><span class="group__t">Frame</span>
    <div class="field"><span class="field__l" id="frame-l">Style</span><div class="seg" role="group" aria-labelledby="frame-l">${frameOptions
      .map(([v, l]) => `<button type="button" data-attr="frame" data-value="${v}" aria-pressed="${frameValue === v}">${l}</button>`)
      .join('')}</div></div>
    <div class="row2">
      <div class="field"><label class="field__l" for="c-size">Size <output data-out="size">${cfg.size} px</output></label><input type="range" id="c-size" min="180" max="${type === 'poster' ? 760 : 560}" step="10" value="${cfg.size}" data-size></div>
      <div class="field"><label class="field__l" for="c-radius">Corners <output data-out="radius">${radius}</output></label><input type="range" id="c-radius" min="0" max="40" step="1" value="${radius}" data-radius></div>
    </div>
  </div>`;

  const groups = t.groups
    .map(([title, controls]) => `<div class="group"><span class="group__t">${esc(title)}</span>${controls.map((c) => control(c, cfg)).join('')}</div>`)
    .join('');

  const panel = $('[data-panel]');
  const scroll = panel.scrollTop;
  panel.id = 'studio-panel';
  panel.setAttribute('aria-labelledby', `tab-${type}`);
  panel.innerHTML = look + frame + groups;
  panel.scrollTop = scroll;
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
  if (type === 'glance' && cfg.sample) attrs.events = JSON.stringify(sampleEvents());
  const style = [`--bezel-size: ${cfg.size}px`];
  for (const k of ['surface', 'ink', 'accent', 'hand', 'today', 'muted', 'soft', 'rule']) if (cfg.vars[k]) style.push(`--bezel-${k}: ${cfg.vars[k]}`);
  if (cfg.vars.radius != null) style.push(`--bezel-radius: ${cfg.vars.radius}cqw`);
  if (cfg.vars.font) style.push(`--bezel-font: ${cfg.vars.font}`);
  return { tag: t.tag, attrs, style };
}

function renderSnippet() {
  const { tag, attrs, style } = snippetParts();
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

  $('[data-snippet]').innerHTML = lines.join('\n');
  $('[data-snippet]').dataset.plain = plain.join('\n');
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

function note(text) {
  const n = $('[data-note]');
  n.textContent = text;
  clearTimeout(note.t);
  note.t = setTimeout(() => (n.textContent = ''), 4000);
}

async function copy(text, label) {
  try {
    await navigator.clipboard.writeText(text);
    note(`${label} copied.`);
  } catch {
    const code = $('[data-snippet]');
    const range = document.createRange();
    range.selectNodeContents(code);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    note('Copying is blocked here. The code is selected, so press ⌘C or Ctrl+C.');
  }
}

function renderStudio(rebuild = false) {
  renderTabs();
  renderPanel();
  updatePreview(rebuild);
  const canvas = $('[data-canvas]');
  canvas.dataset.bg = state.bg;
  for (const b of $$('[data-bg]', $('[data-backdrops]'))) b.setAttribute('aria-pressed', String(b.dataset.bg === state.bg));
}

function bindStudio() {
  $('[data-tabs]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    state.current = b.dataset.tab;
    renderStudio();
    $(`#tab-${state.current}`)?.focus();
  });
  $('[data-tabs]').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const keys = Object.keys(TYPES);
    const i = keys.indexOf(state.current);
    state.current = keys[(i + (e.key === 'ArrowRight' ? 1 : keys.length - 1)) % keys.length];
    renderStudio();
    $(`#tab-${state.current}`)?.focus();
  });

  const panel = $('[data-panel]');
  panel.addEventListener('submit', (e) => e.preventDefault());

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
    const sw = e.target.closest('[data-theme-name]');
    if (sw) {
      cfg.attrs.theme = sw.dataset.themeName;
      for (const k of TYPES[state.current].colors) delete cfg.vars[k];
      renderPanel();
      updatePreview();
      panel.querySelector(`[data-theme-name="${sw.dataset.themeName}"]`)?.focus();
      return;
    }
    if (e.target.closest('[data-reset-colors]')) {
      for (const k of TYPES[state.current].colors) delete cfg.vars[k];
      renderPanel();
      updatePreview();
      return;
    }
    if (e.target.closest('[data-place-apply]')) applyPlace();
  });

  panel.addEventListener('input', (e) => {
    const cfg = state.tiles[state.current];
    const t = e.target;
    if (t.matches('[data-color]')) {
      cfg.vars[t.dataset.color] = t.value;
      t.closest('.color').setAttribute('data-custom', '');
      updatePreview();
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

  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('[data-place]')) {
      e.preventDefault();
      applyPlace();
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

  $('[data-copy]').addEventListener('click', () => copy($('[data-snippet]').dataset.plain, 'Code'));
  $('[data-copy-link]').addEventListener('click', () => copy(displayURL(), 'Display link'));
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
renderPresets();
bindStudio();
renderStudio(true);
