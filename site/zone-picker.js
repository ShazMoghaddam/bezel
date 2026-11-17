// The Studio's time zone picker: a searchable list of cities, built as an ARIA combobox.
// Hand-picked cities come first (see cities.js), so people find the place they know. Every zone the
// browser knows is searched too, so typing "Aqtobe" or "Asia/Tehran" still works.
// Offsets and local times are worked out when the list opens, so summer time is always right.

import { CITIES, COUNTRY_ALIASES, CITY_ALIASES } from './cities.js';

// Chrome and Node still list some zones by their old names. Show the current name where the browser accepts it.
const RENAMED_ZONES = { 'Asia/Calcutta': 'Asia/Kolkata', 'Asia/Saigon': 'Asia/Ho_Chi_Minh', 'Asia/Katmandu': 'Asia/Kathmandu', 'Asia/Rangoon': 'Asia/Yangon', 'Europe/Kiev': 'Europe/Kyiv', 'America/Godthab': 'America/Nuuk', 'Atlantic/Faeroe': 'Atlantic/Faroe', 'Asia/Ulan_Bator': 'Asia/Ulaanbaatar' };
const REGION_NAMES = { America: 'Americas', Indian: 'Indian Ocean' };
const MAX_RESULTS = 80;
const PAGE = 8;

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Lower case, no accents or punctuation: "São Paulo" and "sao paulo" match. */
export const fold = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'ʻ.,]/g, '')
    .replace(/[_\-/·]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const validZone = (id) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: id });
    return true;
  } catch {
    return false;
  }
};

/** The city a zone id is named after: "America/New_York" → "New York". */
export const zoneCity = (id) => String(id ?? '').split('/').pop().replace(/_/g, ' ');

export const deviceZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

// ---- Live offsets and times ------------------------------------------------

const formatters = new Map();
let h12;
/** Whether this visitor reads 9:50 PM rather than 21:50. 24-hour times are padded, so the column lines up. */
const twelveHour = () => (h12 ??= Boolean(new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).resolvedOptions().hour12));
function formatter(id, kind) {
  const key = `${kind}|${id}`;
  let f = formatters.get(key);
  if (!f) {
    f = kind === 'offset'
      ? new Intl.DateTimeFormat('en', { timeZone: id, timeZoneName: 'shortOffset' })
      : new Intl.DateTimeFormat(undefined, { timeZone: id, hour: twelveHour() ? 'numeric' : '2-digit', minute: '2-digit' });
    formatters.set(key, f);
  }
  return f;
}

/** "GMT+1" for a zone right now (or "GMT+2" in summer), '' where the browser can't say. */
export function zoneOffset(id, ms = Date.now()) {
  try {
    return formatter(id, 'offset').formatToParts(ms).find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

/** The time in a zone right now, in the visitor's own format: "21:45" or "9:45 PM". */
function zoneTime(id, ms = Date.now()) {
  try {
    return formatter(id, 'time').format(ms);
  } catch {
    return '';
  }
}

// ---- The list --------------------------------------------------------------

let entryCache;
/** Every place as { id, city, country, curated }, plus folded text for searching. Built once. */
export function entries() {
  if (entryCache) return entryCache;
  const list = [];
  const taken = new Set();
  for (const [city, country, id] of CITIES) {
    if (!validZone(id)) continue;
    taken.add(`${fold(city)}|${id}`);
    list.push(entry({ id, city, country, curated: true, rank: list.length }, CITY_ALIASES[city], COUNTRY_ALIASES[country]));
  }
  let ids = [];
  try {
    if (typeof Intl.supportedValuesOf === 'function') ids = Intl.supportedValuesOf('timeZone');
  } catch {
    // Older browsers: the hand-picked cities are enough.
  }
  const seen = new Set();
  for (const raw of ids) {
    const id = RENAMED_ZONES[raw] && validZone(RENAMED_ZONES[raw]) ? RENAMED_ZONES[raw] : raw;
    if (!id.includes('/') || id.startsWith('Etc/') || seen.has(id)) continue;
    seen.add(id);
    const city = zoneCity(id);
    if (taken.has(`${fold(city)}|${id}`)) continue;
    const parts = id.split('/');
    // Three-part names carry a state or country in the middle: "Knox, Indiana", "Salta, Argentina".
    const country = (parts.length > 2 ? parts[1] : REGION_NAMES[parts[0]] ?? parts[0]).replace(/_/g, ' ');
    list.push(entry({ id, city, country, curated: false, rank: Infinity }));
  }
  entryCache = list.sort((a, b) => b.curated - a.curated || a.city.localeCompare(b.city, 'en'));
  return entryCache;
}

function entry(e, cityAka = '', countryAka = '') {
  e.cityF = fold(e.city);
  e.words = fold(`${e.city} ${cityAka}`).split(' ');
  e.place = fold(`${e.country} ${countryAka}`);
  e.hay = `${e.cityF} ${fold(cityAka)} ${e.place} ${fold(e.id)}`;
  e.hayWords = e.hay.split(' ');
  return e;
}

/** How well a place matches the search, lower is better; -1 for no match. Hand-picked cities win ties. */
function score(e, q, tokens) {
  let s;
  if (e.cityF === q) s = 0;
  else if (e.cityF.startsWith(q)) s = 1;
  else if (e.words.some((w) => w.startsWith(q))) s = 2;
  else if (e.place.startsWith(q)) s = 3;
  else if (tokens.every((t) => e.hayWords.some((w) => w.startsWith(t)))) s = 4;
  else if (e.hay.includes(q)) s = 5;
  else return -1;
  return s + (e.curated ? 0 : 0.5);
}

/** Places matching what was typed, best first. An empty search lists the hand-picked cities. */
export function search(text) {
  const q = fold(text);
  const all = entries();
  if (!q) return all.filter((e) => e.curated);
  const tokens = q.split(' ');
  return all
    .map((e) => [score(e, q, tokens), e])
    .filter(([s]) => s >= 0)
    // Ties go to the list's own order, which puts the best-known cities first: Paris before Paramaribo.
    .sort((a, b) => a[0] - b[0] || a[1].rank - b[1].rank || a[1].city.localeCompare(b[1].city, 'en'))
    .slice(0, MAX_RESULTS)
    .map(([, e]) => e);
}

/** What the box shows for a place: "Munich, Germany", or just "Singapore". */
export const entryText = (e) => (fold(e.city) === fold(e.country) ? e.city : `${e.city}, ${e.country}`);

/**
 * The place behind a stored zone and label. Munich and Berlin share Europe/Berlin, so the label says which.
 * Falls back to the zone's own city, then to the first hand-picked city on that zone.
 */
export function findEntry(id, label) {
  if (!id) return null;
  const target = RENAMED_ZONES[id] ?? id;
  const onZone = entries().filter((e) => e.id === id || e.id === target);
  const want = fold(label || zoneCity(target));
  return onZone.find((e) => e.cityF === want) ?? onZone.find((e) => e.cityF === fold(zoneCity(target))) ?? onZone[0] ?? null;
}

/** The label a tile needs so its dial reads the picked city: null when the zone's own name already does. */
export const labelFor = (e) => (e && e.city !== zoneCity(e.id) ? e.city : null);

/** The place for a finished bit of typing: an exact city, "City, Country", or a zone id. undefined when unsure. */
export function resolve(text) {
  const q = fold(text);
  if (!q) return null;
  const all = entries();
  const exact = all.find((e) => fold(entryText(e)) === q) ?? all.find((e) => e.cityF === q || e.words.join(' ') === q);
  if (exact) return exact;
  const id = text.trim().replace(/ /g, '_');
  if (id.includes('/') && validZone(id)) return findEntry(id) ?? entry({ id, city: zoneCity(id), country: id.split('/')[0], curated: false });
  const results = search(text);
  return results.length === 1 ? results[0] : undefined;
}

// ---- The field ---------------------------------------------------------------

const CHEVRON = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * The picker's markup. value is the stored zone id, label the stored city name, empty the
 * wording for no zone ("This device", "None" or "UTC").
 */
export function zoneField({ id, key, label, empty, hint, value, place }) {
  const e = findEntry(value, place);
  const text = value ? (e ? entryText(e) : place || zoneCity(value)) : '';
  const off = value ? zoneOffset(value) : '';
  const hintId = hint ? `${id}-h` : '';
  return `<div class="field zp" data-zp="${esc(key)}" data-empty="${esc(empty)}">
  <label for="${id}">${esc(label)}</label>
  <div class="zp__box">
    <input type="text" id="${id}" data-zone="${esc(key)}" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="${id}-list" value="${esc(text)}" placeholder="${esc(empty)}" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done"${hintId ? ` aria-describedby="${hintId}"` : ''}>
    <span class="zp__off" data-zp-off aria-hidden="true">${esc(off)}</span>
    <button type="button" class="zp__toggle" data-zp-toggle tabindex="-1" aria-label="Show cities">${CHEVRON}</button>
  </div>
  <ul class="zp__list" id="${id}-list" role="listbox" aria-label="${esc(label)}" hidden></ul>
  <span class="sr-only" role="status" data-zp-status></span>
  ${hint ? `<p class="hint" id="${hintId}">${esc(hint)}</p>` : ''}
</div>`;
}

// ---- Behaviour -----------------------------------------------------------------
// One list is open at a time. The panel re-renders often, so everything hangs off delegated listeners.

let open = null; // { field, input, list, items, active, dirty, timer }
let currentOf = () => ({}); // set by bindZonePickers

/**
 * Wires every picker inside root.
 *   onPick(key, place)  place is an entry, or null for "no zone"
 *   current(key)        { id, label } stored for that picker
 *   onMiss(text)        typing that matched nothing
 */
export function bindZonePickers(root, { onPick, current, onMiss }) {
  currentOf = current;
  const fieldOf = (el) => el?.closest?.('[data-zp]');

  const commit = (field, place) => {
    const key = field.dataset.zp;
    close(field);
    onPick(key, place);
    const input = field.querySelector('[data-zone]');
    // onPick may have redrawn the panel; refresh whichever input is now on the page.
    const live = root.querySelector(`[data-zp="${key}"] [data-zone]`) ?? input;
    const { id, label } = current(key);
    const e = findEntry(id, label);
    live.value = id ? (e ? entryText(e) : label || zoneCity(id)) : '';
    const off = live.parentElement.querySelector('[data-zp-off]');
    if (off) off.textContent = id ? zoneOffset(id) : '';
  };

  const restore = (field) => {
    const input = field.querySelector('[data-zone]');
    const { id, label } = current(field.dataset.zp);
    const e = findEntry(id, label);
    input.value = id ? (e ? entryText(e) : label || zoneCity(id)) : '';
  };

  /** Finishes free typing when the box loses focus or Enter is pressed with nothing highlighted. */
  const settle = (field) => {
    const input = field.querySelector('[data-zone]');
    const text = input.value;
    if (!fold(text)) return commit(field, null);
    const place = resolve(text);
    if (place) return commit(field, place);
    close(field);
    restore(field);
    onMiss?.(text.trim());
  };

  root.addEventListener('input', (e) => {
    const field = fieldOf(e.target);
    if (!field || !e.target.matches('[data-zone]')) return;
    show(field, e.target.value, true);
  });

  root.addEventListener('focusin', (e) => {
    if (e.target.matches?.('[data-zone]')) requestAnimationFrame(() => e.target.select());
  });

  root.addEventListener('focusout', (e) => {
    const field = fieldOf(e.target);
    if (!field || field.contains(e.relatedTarget)) return;
    if (open?.field === field && open.dirty) settle(field);
    else close(field);
  });

  root.addEventListener('pointerdown', (e) => {
    const field = fieldOf(e.target);
    if (!field) return;
    // Keep focus in the box while choosing, so the list doesn't close under the pointer.
    if (e.target.closest('.zp__list, [data-zp-toggle]')) e.preventDefault();
  });

  root.addEventListener('click', (e) => {
    const field = fieldOf(e.target);
    if (!field) return;
    const input = field.querySelector('[data-zone]');
    if (e.target.closest('[data-zp-toggle]')) {
      if (open?.field === field) close(field);
      else show(field, '', false);
      input.focus();
      return;
    }
    const opt = e.target.closest('[role="option"]');
    if (opt && open?.field === field) return commit(field, open.items[+opt.dataset.i]);
    if (e.target === input && open?.field !== field) show(field, '', false);
  });

  root.addEventListener('keydown', (e) => {
    const field = fieldOf(e.target);
    if (!field || !e.target.matches('[data-zone]')) return;
    const isOpen = open?.field === field;
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!isOpen) {
          show(field, '', false);
          move(e.key === 'ArrowDown' ? 'first' : 'last');
        } else if (e.altKey && e.key === 'ArrowUp') close(field);
        else move(e.key === 'ArrowDown' ? 1 : -1);
        break;
      }
      case 'PageDown':
      case 'PageUp':
        if (isOpen) {
          e.preventDefault();
          move(e.key === 'PageDown' ? PAGE : -PAGE);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && open.active >= 0) commit(field, open.items[open.active]);
        else if (isOpen && open.dirty && open.items.length) commit(field, open.items[0]);
        else settle(field);
        break;
      case 'Escape':
        if (isOpen) {
          // Close the list without closing anything around it.
          e.preventDefault();
          e.stopPropagation();
          close(field);
          restore(field);
          e.target.select();
        }
        break;
      case 'Tab':
        if (isOpen && !open.dirty) close(field);
        break;
    }
  });
}

/** Opens (or refilters) a picker's list. dirty: the visitor has typed, so filter by the box. */
function show(field, text, dirty) {
  if (open && open.field !== field) close(open.field);
  const input = field.querySelector('[data-zone]');
  const list = field.querySelector('.zp__list');
  const items = search(dirty ? text : '');
  // With nothing typed, the first row is "no zone": This device, None or UTC.
  if (!dirty || !fold(text)) items.unshift(null);
  const stored = currentOf(field.dataset.zp);
  const chosen = stored.id ? findEntry(stored.id, stored.label) : null;
  const now = Date.now();
  const id = input.id;
  list.innerHTML = items.length
    ? items
        .map((e, i) => {
          const isNone = e === null;
          const zone = isNone ? (field.dataset.empty === 'This device' ? deviceZone() : field.dataset.empty === 'UTC' ? 'UTC' : '') : e.id;
          const selected = isNone ? !stored.id : e === chosen;
          const name = isNone ? field.dataset.empty : e.city;
          const where = isNone ? (zone && zone !== 'UTC' ? zoneCity(zone) : field.dataset.empty === 'None' ? 'No second dial' : 'Coordinated Universal Time') : e.country;
          return `<li role="option" id="${id}-o${i}" data-i="${i}" aria-selected="false" class="zp__opt${selected ? ' is-current' : ''}${isNone ? ' is-none' : ''}">
  <span class="zp__name"><span class="zp__city">${esc(name)}${selected ? '<span class="sr-only"> (current)</span>' : ''}</span><span class="zp__where">${esc(where)}</span></span>
  <span class="zp__meta">${zone ? `<span class="zp__time" data-zone-id="${esc(zone)}">${esc(zoneTime(zone, now))}</span><span class="zp__gmt">${esc(zoneOffset(zone, now))}</span>` : ''}</span>
</li>`;
        })
        .join('')
    : '<li class="zp__empty" role="presentation">No matching city. Try a nearby big city or a country.</li>';
  list.hidden = false;
  input.setAttribute('aria-expanded', 'true');
  input.removeAttribute('aria-activedescendant');
  field.classList.add('is-open');
  clearInterval(open?.timer);
  open = { field, input, list, items, active: -1, dirty, timer: setInterval(() => tick(list), 15000) };
  const status = field.querySelector('[data-zp-status]');
  const count = items.filter(Boolean).length;
  status.textContent = dirty ? (count ? `${count} ${count === 1 ? 'city' : 'cities'} found` : 'No matching city') : '';
  // Start with the current choice in view.
  // On phones the preview and tabs stay pinned at the top; bring the box and its list into view below them.
  // .zp's scroll-margin-top keeps it clear of the pinned parts.
  if (list.getBoundingClientRect().bottom > innerHeight || input.getBoundingClientRect().top < 0) field.scrollIntoView({ block: 'start' });
  const current = !dirty && list.querySelector('.is-current');
  if (current) reveal(list, current);
}

/** Scrolls the list, and only the list, so a row is in view. */
function reveal(list, el) {
  const top = el.offsetTop;
  const bottom = top + el.offsetHeight;
  if (top < list.scrollTop) list.scrollTop = top - 4;
  else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 4;
}

function tick(list) {
  const now = Date.now();
  for (const t of list.querySelectorAll('[data-zone-id]')) t.textContent = zoneTime(t.dataset.zoneId, now);
}

function move(step) {
  if (!open) return;
  const { items, list, input } = open;
  const n = items.length;
  if (!n) return;
  let i = step === 'first' ? 0 : step === 'last' ? n - 1 : open.active < 0 ? (step > 0 ? 0 : n - 1) : Math.min(n - 1, Math.max(0, open.active + step));
  list.querySelector('[aria-selected="true"]')?.setAttribute('aria-selected', 'false');
  const opt = list.querySelector(`[data-i="${i}"]`);
  open.active = i;
  if (!opt) return;
  opt.setAttribute('aria-selected', 'true');
  input.setAttribute('aria-activedescendant', opt.id);
  reveal(list, opt);
}

function close(field) {
  const list = field.querySelector('.zp__list');
  const input = field.querySelector('[data-zone]');
  if (list) {
    list.hidden = true;
    list.innerHTML = '';
  }
  input?.setAttribute('aria-expanded', 'false');
  input?.removeAttribute('aria-activedescendant');
  field.classList.remove('is-open');
  if (open?.field === field) {
    clearInterval(open.timer);
    open = null;
  }
}
