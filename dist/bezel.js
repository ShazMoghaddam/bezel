/*! Bezel v2.0.0 | MIT | github.com/ShazMoghaddam/bezel */
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/core/frame.js
var FRAME_CSS = (
  /* css */
  `
:host {
  --_font: var(--bezel-font, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Geist", "Inter Display", "Segoe UI Variable Display", "Helvetica Neue", Roboto, Arial, sans-serif);
  --_rim-r: var(--bezel-radius, 22cqw);
  /* No metal rim: the black bezel is the outermost layer, so nothing light shows around it. */
  --_rim-pad: 0px;
  --_bezel-pad: var(--bezel-thickness, 1.7cqw);
  /* Extra inset for content when corners are rounder than the 22cqw the layouts were drawn for,
     so text near a corner never runs into the curve. Zero at the default radius and below. */
  --_safe: max(0cqw, calc((var(--_rim-r) - 22cqw) * 0.36));
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  inline-size: var(--bezel-size, 320px);
  max-inline-size: 100%;
  aspect-ratio: var(--bezel-aspect, 1);
  vertical-align: top;
  container-type: inline-size;
  font-family: var(--_font);
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: geometricPrecision;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}
:host([hidden]) { display: none; }
*, *::before, *::after { box-sizing: border-box; }

.frame { position: absolute; inset: 0; }

/* Device: a thin black glass bezel of even width on every side, a camera dot and a lifted shadow.
   There is deliberately no light rim or highlight outside the black. */
.frame--device {
  border-radius: var(--_rim-r);
  box-shadow:
    0 0.2cqw 0.4cqw rgba(0,0,0,.10),
    0 1.6cqw 3.2cqw -0.6cqw rgba(0,0,0,.20),
    0 6cqw 10cqw -3cqw rgba(0,0,0,.30);
}
.bezel {
  position: relative;
  block-size: 100%;
  border-radius: calc(var(--_rim-r) - var(--_rim-pad));
  padding: var(--_bezel-pad);
  background: #050506;
}
.frame--device .bezel::before {
  content: "";
  position: absolute;
  inset-block-start: calc(var(--_bezel-pad) * 0.5);
  inset-inline-start: 50%;
  inline-size: calc(var(--_bezel-pad) * 0.42);
  aspect-ratio: 1;
  translate: -50% -50%;
  border-radius: 50%;
  z-index: 60;
  background: radial-gradient(circle at 35% 35%, #3c4a66 0%, #12151c 45%, #050608 75%);
  box-shadow: 0 0 0 0.12cqw #0c0d10;
}
.screen {
  position: relative;
  block-size: 100%;
  overflow: hidden;
  border-radius: calc(var(--_rim-r) - var(--_rim-pad) - var(--_bezel-pad));
  container-type: size;
  background: var(--_surface);
  color: var(--_ink);
  isolation: isolate;
}
.frame--device .screen::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 50;
  background: linear-gradient(155deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 34%);
  box-shadow: inset 0 0 0 0.15cqw rgba(0,0,0,.2);
}

/* Bezel: black border, no rim. */
.frame--bezel .bezel {
  border-radius: var(--_rim-r);
  box-shadow: 0 1.2cqw 3cqw -1cqw rgba(0,0,0,.35);
}
.frame--bezel .screen { border-radius: calc(var(--_rim-r) - var(--_bezel-pad)); }

/* None: just the screen, for embedding inside your own UI. */
.frame--none .bezel { padding: 0; background: none; box-shadow: none; border-radius: var(--_rim-r); }
.frame--none .screen { border-radius: calc(var(--_rim-r) * 0.72); }

svg { display: block; overflow: visible; }
.num { font-variant-numeric: tabular-nums lining-nums; font-feature-settings: "tnum" 1, "lnum" 1; }
.sr { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
`
);
function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

// src/core/ticker.js
var subscribers = { frame: /* @__PURE__ */ new Set(), second: /* @__PURE__ */ new Set(), minute: /* @__PURE__ */ new Set() };
var rafId = 0;
var timeoutId = 0;
var lastSecond = -1;
var lastMinute = -1;
var hasWindow = typeof window !== "undefined";
var raf = hasWindow && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : null;
var caf = hasWindow && window.cancelAnimationFrame ? window.cancelAnimationFrame.bind(window) : null;
function prefersReducedMotion() {
  return hasWindow && typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
}
function emit(set, now) {
  for (const fn of set) {
    try {
      fn(now);
    } catch (err) {
      console.error("[bezel]", err);
    }
  }
}
function step() {
  rafId = 0;
  timeoutId = 0;
  const now = Date.now();
  emit(subscribers.frame, now);
  const second = Math.floor(now / 1e3);
  if (second !== lastSecond) {
    lastSecond = second;
    emit(subscribers.second, now);
    const minute = Math.floor(second / 60);
    if (minute !== lastMinute) {
      lastMinute = minute;
      emit(subscribers.minute, now);
    }
  }
  schedule();
}
function schedule() {
  if (rafId || timeoutId) return;
  const total = subscribers.frame.size + subscribers.second.size + subscribers.minute.size;
  if (!total) return;
  const pageVisible = !hasWindow || typeof document === "undefined" || document.visibilityState !== "hidden";
  if (subscribers.frame.size && raf && pageVisible) {
    rafId = raf(step);
  } else {
    timeoutId = setTimeout(step, 1e3 - Date.now() % 1e3 + 2);
  }
}
if (hasWindow && typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (rafId && caf) caf(rafId);
    if (timeoutId) clearTimeout(timeoutId);
    rafId = 0;
    timeoutId = 0;
    lastSecond = -1;
    lastMinute = -1;
    schedule();
  });
}
function subscribe(rate, fn) {
  const set = subscribers[rate];
  if (!set) throw new Error(`[bezel] Unknown tick rate "${rate}"`);
  set.add(fn);
  schedule();
  return () => set.delete(fn);
}

// src/core/time.js
var time_exports = {};
__export(time_exports, {
  dayOfYear: () => dayOfYear,
  daysInYear: () => daysInYear,
  formatClock: () => formatClock,
  handAngles: () => handAngles,
  isValidTimeZone: () => isValidTimeZone,
  isoWeek: () => isoWeek,
  names: () => names,
  parseWeekStart: () => parseWeekStart,
  prefers12h: () => prefers12h,
  tzOffset: () => tzOffset,
  weekStartFor: () => weekStartFor,
  zoned: () => zoned,
  zonedToUtc: () => zonedToUtc
});
var MINUTE = 6e4;
var offsetCache = /* @__PURE__ */ new Map();
var partsFormatters = /* @__PURE__ */ new Map();
var warned = /* @__PURE__ */ new Set();
function partsFormatter(timeZone) {
  let f2 = partsFormatters.get(timeZone);
  if (!f2) {
    f2 = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    partsFormatters.set(timeZone, f2);
  }
  return f2;
}
function isValidTimeZone(timeZone) {
  if (!timeZone) return false;
  try {
    partsFormatter(timeZone);
    return true;
  } catch {
    return false;
  }
}
function tzOffset(ms, timeZone) {
  if (!timeZone) return -new Date(ms).getTimezoneOffset() * MINUTE;
  const minuteKey = Math.floor(ms / MINUTE);
  const cached = offsetCache.get(timeZone);
  if (cached && cached.minuteKey === minuteKey) return cached.offset;
  let offset;
  try {
    const p = {};
    for (const { type, value } of partsFormatter(timeZone).formatToParts(new Date(ms))) p[type] = value;
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
    offset = asUTC - Math.floor(ms / 1e3) * 1e3;
  } catch {
    if (!warned.has(timeZone)) {
      warned.add(timeZone);
      console.warn(`[bezel] Unknown time zone "${timeZone}", using the device time zone.`);
    }
    offset = -new Date(ms).getTimezoneOffset() * MINUTE;
  }
  offsetCache.set(timeZone, { minuteKey, offset });
  return offset;
}
function zoned(ms = Date.now(), timeZone) {
  const offset = tzOffset(ms, timeZone);
  const d = new Date(ms + offset);
  return {
    ms,
    offset,
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
    seconds: d.getUTCSeconds(),
    millis: d.getUTCMilliseconds()
  };
}
function zonedToUtc(year, month, day, hours = 0, minutes = 0, seconds = 0, timeZone) {
  const guess = Date.UTC(year, month, day, hours, minutes, seconds);
  if (!timeZone) return new Date(year, month, day, hours, minutes, seconds).getTime();
  const first = guess - tzOffset(guess, timeZone);
  return guess - tzOffset(first, timeZone);
}
function handAngles(z, { smooth = true } = {}) {
  const s = z.seconds + (smooth ? z.millis / 1e3 : 0);
  const m = z.minutes + s / 60;
  const h = z.hours % 12 + m / 60;
  return { hour: h * 30, minute: m * 6, second: s * 6 };
}
var nameCache = /* @__PURE__ */ new Map();
function names(locale = "en-GB") {
  let n = nameCache.get(locale);
  if (n) return n;
  const fmt = (opts) => {
    try {
      return new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...opts });
    } catch {
      return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts });
    }
  };
  const days = (style) => Array.from({ length: 7 }, (_, i) => fmt({ weekday: style }).format(Date.UTC(1970, 0, 4 + i)));
  const months = (style) => Array.from({ length: 12 }, (_, i) => fmt({ month: style }).format(Date.UTC(2001, i, 15)));
  n = {
    weekdayShort: days("short"),
    weekdayNarrow: days("narrow"),
    weekdayLong: days("long"),
    monthShort: months("short"),
    monthLong: months("long")
  };
  nameCache.set(locale, n);
  return n;
}
var SUNDAY_REGIONS = /* @__PURE__ */ new Set(["US", "CA", "MX", "BR", "JP", "KR", "TW", "HK", "IL", "PH", "ZA", "AU", "IN", "SA", "AR", "CO", "PE", "VE", "GT", "PA"]);
function weekStartFor(locale = "en-GB") {
  try {
    const loc = new Intl.Locale(locale);
    const info = typeof loc.getWeekInfo === "function" ? loc.getWeekInfo() : loc.weekInfo;
    if (info && info.firstDay) return info.firstDay % 7;
    const region = loc.maximize().region;
    return SUNDAY_REGIONS.has(region) ? 0 : 1;
  } catch {
    return 1;
  }
}
function parseWeekStart(value, locale) {
  if (value == null || value === "") return weekStartFor(locale);
  const v = String(value).trim().toLowerCase();
  if (/^[0-6]$/.test(v)) return Number(v);
  const map = { su: 0, mo: 1, tu: 2, we: 3, th: 4, fr: 5, sa: 6 };
  return map[v.slice(0, 2)] ?? weekStartFor(locale);
}
function prefers12h(locale = "en-GB") {
  try {
    const hc = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions().hourCycle;
    return hc === "h11" || hc === "h12";
  } catch {
    return false;
  }
}
function formatClock(hours, minutes, hour12) {
  const mm = String(minutes).padStart(2, "0");
  if (hour12) return `${hours % 12 || 12}:${mm}`;
  return `${String(hours).padStart(2, "0")}:${mm}`;
}
function isoWeek(year, month, day) {
  const d = new Date(Date.UTC(year, month, day));
  const dow = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dow);
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.ceil(((d - yearStart) / 864e5 + 1) / 7);
}
function dayOfYear(year, month, day) {
  return Math.round((Date.UTC(year, month, day) - Date.UTC(year, 0, 1)) / 864e5) + 1;
}
function daysInYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ? 366 : 365;
}

// src/core/element.js
var localeCache = /* @__PURE__ */ new Map();
function safeLocale(tag) {
  if (!tag) return "en-GB";
  if (localeCache.has(tag)) return localeCache.get(tag);
  let ok = "en-GB";
  for (const candidate of [tag, String(tag).split(/[@.]/)[0].replace("_", "-")]) {
    try {
      ok = Intl.getCanonicalLocales(candidate)[0];
      break;
    } catch {
    }
  }
  localeCache.set(tag, ok);
  return ok;
}
var COMMON_ATTRIBUTES = ["frame", "theme", "dark-theme", "appearance", "timezone", "locale", "hour-cycle"];
var FRAMES = /* @__PURE__ */ new Set(["device", "bezel", "none"]);
var BezelElement = class extends HTMLElement {
  static attributes = [];
  static styles = "";
  static themes = {};
  static defaultTheme = "";
  static defaultFrame = "device";
  static get observedAttributes() {
    return [...COMMON_ATTRIBUTES, ...this.attributes];
  }
  #queued = false;
  #unsubscribe = null;
  #observer = null;
  #visible = true;
  #connected = false;
  #lastDayKey = "";
  #authorLabel = false;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.#connected = true;
    if (!this.hasAttribute("role")) this.setAttribute("role", "img");
    this.#authorLabel = this.hasAttribute("aria-label") && this.dataset.bezelLabel === void 0;
    this.render();
    this.#watchVisibility();
    this.#resubscribe();
    this.connected?.();
  }
  disconnectedCallback() {
    this.#connected = false;
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#observer?.disconnect();
    this.#observer = null;
    this.disconnected?.();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.#connected) return;
    this.attributeChanged?.(name, oldValue, newValue);
    this.invalidate();
  }
  /** Re-renders on the next microtask, batching several attribute changes into one paint. */
  invalidate() {
    if (this.#queued) return;
    this.#queued = true;
    queueMicrotask(() => {
      this.#queued = false;
      if (!this.#connected) return;
      this.render();
      this.#resubscribe();
    });
  }
  // ---- Shared settings -------------------------------------------------
  get frame() {
    const f2 = this.getAttribute("frame");
    return FRAMES.has(f2) ? f2 : this.constructor.defaultFrame;
  }
  get timeZone() {
    const tz = this.getAttribute("timezone");
    return tz && isValidTimeZone(tz) ? tz : void 0;
  }
  get locale() {
    return safeLocale(this.getAttribute("locale") || typeof navigator !== "undefined" && navigator.language);
  }
  get hour12() {
    const hc = this.getAttribute("hour-cycle");
    if (hc === "12") return true;
    if (hc === "24") return false;
    return prefers12h(this.locale);
  }
  /** The theme chosen with the `theme` attribute, or the tile's default. */
  get themeName() {
    const t = this.getAttribute("theme");
    return t && this.constructor.themes[t] ? t : this.constructor.defaultTheme;
  }
  /** The theme for dark mode, from the `dark-theme` attribute, if it names one. */
  get darkThemeName() {
    const t = this.getAttribute("dark-theme");
    return t && this.constructor.themes[t] ? t : null;
  }
  /** Boolean attribute helper: present and not "false". */
  flag(name) {
    const v = this.getAttribute(name);
    return v !== null && v !== "false";
  }
  now() {
    return zoned(Date.now(), this.timeZone);
  }
  get tickRate() {
    return "minute";
  }
  get reducedMotion() {
    return prefersReducedMotion();
  }
  // ---- Rendering --------------------------------------------------------
  /**
   * CSS custom properties for the theme. Inline styles and page CSS override them.
   *
   * In dark mode (the device's setting, or `appearance="dark"`) each colour comes from
   * `--bezel-dark-*` if set, then the `dark-theme`, then the light colour, so a tile with no
   * dark settings looks the same in both. `appearance="light"` opts out of dark mode.
   */
  themeCSS() {
    const themes = this.constructor.themes;
    const light = themes[this.themeName] ?? {};
    const dark = themes[this.darkThemeName] ?? null;
    const keys = Object.keys({ ...light, ...dark });
    const lightDecl = keys.map((k) => `--_${k}: var(--bezel-${k}, ${light[k] ?? dark[k]});`).join("");
    const darkDecl = keys.map((k) => `--_${k}: var(--bezel-dark-${k}, ${dark ? dark[k] ?? light[k] : `var(--bezel-${k}, ${light[k]})`});`).join("");
    return `:host { ${lightDecl} }
      @media (prefers-color-scheme: dark) { :host(:not([appearance="light"])) { ${darkDecl} } }
      :host([appearance="dark"]) { ${darkDecl} }`;
  }
  render() {
    const z = this.now();
    this.#lastDayKey = this.#key(z);
    const frame = this.frame;
    this.shadowRoot.innerHTML = `
      <style>${FRAME_CSS}${this.themeCSS()}${this.constructor.styles}</style>
      <div class="frame frame--${frame}" part="frame">
        <div class="bezel" part="bezel">
          <div class="screen" part="screen">${this.template(z)}</div>
        </div>
      </div>`;
    this.$ = (sel) => this.shadowRoot.querySelector(sel);
    this.$$ = (sel) => this.shadowRoot.querySelectorAll(sel);
    this.update(z, true);
    this.#label(z);
  }
  template() {
    return "";
  }
  update() {
  }
  /** Accessible description. Subclasses return a sentence. */
  describe() {
    return "";
  }
  #label(z) {
    const text = this.describe(z);
    if (!text || this.#authorLabel || this.getAttribute("aria-label") === text) return;
    this.setAttribute("aria-label", text);
    this.dataset.bezelLabel = "";
  }
  #tick = (ms) => {
    const z = zoned(ms, this.timeZone);
    if (this.#key(z) !== this.#lastDayKey) {
      this.render();
      return;
    }
    this.update(z, false);
    if (z.seconds === 0 && z.millis < 1e3) this.#label(z);
  };
  #key(z) {
    return `${z.year}-${z.month}-${z.day}`;
  }
  #resubscribe() {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    let rate = this.tickRate;
    if (!rate || !this.#visible) return;
    if (rate === "frame" && this.reducedMotion) rate = "second";
    this.#unsubscribe = subscribe(rate, this.#tick);
  }
  #watchVisibility() {
    if (this.#observer || typeof IntersectionObserver === "undefined") return;
    this.#observer = new IntersectionObserver((entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible === this.#visible) return;
      this.#visible = visible;
      if (visible) {
        this.update(this.now(), false);
      }
      this.#resubscribe();
    });
    this.#observer.observe(this);
  }
};
function define(tag, ctor) {
  if (typeof customElements !== "undefined" && !customElements.get(tag)) customElements.define(tag, ctor);
}

// src/core/hands.js
var HAND_STYLES = ["modern", "lollipop"];
function handStyle(value) {
  return HAND_STYLES.includes(value) ? value : "modern";
}
var f = (n) => Number(n.toFixed(3));
function baton(cx, cy, length, base, tip) {
  const top = cy - length;
  return `M${f(cx - base)} ${f(cy)} L${f(cx - tip)} ${f(top)} A${f(tip)} ${f(tip)} 0 0 1 ${f(cx + tip)} ${f(top)} L${f(cx + base)} ${f(cy)} A${f(base)} ${f(base)} 0 0 1 ${f(cx - base)} ${f(cy)} Z`;
}
function lollipopHands({
  cx = 50,
  cy = 50,
  hour,
  minute,
  second,
  tail = 7,
  weight = 1,
  seconds = true,
  classes = { hour: "hour", minute: "minute", second: "second" },
  extra = ""
}) {
  const w = (n) => n * weight;
  const dot = w(2.9);
  const secondHand2 = seconds ? `<g class="${extra} lp-sec ${classes.second}">
        <line x1="${cx}" y1="${f(cy + tail)}" x2="${cx}" y2="${f(cy - second + dot * 0.6)}" stroke-width="${f(w(0.6))}" />
        <circle cx="${cx}" cy="${f(cy - second)}" r="${f(dot)}" />
      </g>` : "";
  return `
    <g class="${extra} lp ${classes.hour}"><path class="lp-arm" d="${baton(cx, cy, hour, w(1.35), w(0.95))}" /></g>
    <g class="${extra} lp ${classes.minute}"><path class="lp-arm" d="${baton(cx, cy, minute, w(1.2), w(0.72))}" /></g>
    ${secondHand2}
    <circle class="lp-pivot" cx="${cx}" cy="${cy}" r="${f(w(2.05))}" />
    <circle class="lp-pin" cx="${cx}" cy="${cy}" r="${f(w(0.62))}" />`;
}
var HANDS_CSS = (
  /* css */
  `
  .lp-arm, .lp-pivot { fill: var(--_hand); }
  .lp-sec line { stroke: var(--_accent); stroke-linecap: round; }
  .lp-sec circle { fill: var(--_accent); }
  .lp-pin { fill: color-mix(in srgb, var(--_hand), #000 88%); }
`
);

// src/tiles/clock.js
var VARIANTS = /* @__PURE__ */ new Set(["numerals", "relief", "classic"]);
var SCRIPTS = /* @__PURE__ */ new Set(["western", "roman", "persian"]);
var DEFAULT_THEME = { numerals: "sage", relief: "blush", classic: "porcelain" };
var ROMAN = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
var PERSIAN_DIGITS = "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9";
function numeral(h, script = "western") {
  if (script === "roman") return ROMAN[h % 12];
  if (script === "persian") return String(h).replace(/\d/g, (d) => PERSIAN_DIGITS[d]);
  return String(h);
}
function zoneOffset(ms, from, to) {
  const wall = (tz) => {
    const z = zoned(ms, tz);
    return Date.UTC(z.year, z.month, z.day, z.hours, z.minutes);
  };
  const mins = Math.round((wall(to) - wall(from)) / 6e4);
  if (!mins) return "";
  const sign = mins > 0 ? "+" : "\u2212";
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  return `${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : "h"}`;
}
function cityName(timeZone) {
  return String(timeZone ?? "").split("/").pop().replace(/_/g, " ");
}
var C = 50;
function hand({ cls, stem, length, width, cx = C, cy = C }) {
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
var DEFS = (
  /* svg */
  `
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
</defs>`
);
var BIG = {
  western: { size: 52, items: [[12, 49, 45.5], [9, 19.5, 68.5], [3, 80.5, 68.5], [6, 50, 95]] },
  roman: { size: 37, items: [[12, 50, 41], [9, 22, 64.5], [3, 78, 64.5], [6, 50, 92]] },
  persian: { size: 50, items: [[12, 50, 44], [9, 20, 69], [3, 80, 69], [6, 50, 95]] }
};
var BezelClock = class _BezelClock extends BezelElement {
  static attributes = ["variant", "numerals", "hide-seconds", "hide-date", "sweep", "second-timezone", "second-label", "hands"];
  static themes = {
    sage: { surface: "#5C9268", ink: "#0A0C0A", hand: "#FFFFFF", accent: "#E3F4E6" },
    cobalt: { surface: "#2D4BD2", ink: "#F3F5FF", hand: "#FFFFFF", accent: "#FFD43B" },
    ember: { surface: "#E25A2C", ink: "#1A0E09", hand: "#FFF6EF", accent: "#FFF6EF" },
    graphite: { surface: "#121315", ink: "#F2F2F0", hand: "#F2F2F0", accent: "#FF6B35" },
    blush: { surface: "#E7C8C2", ink: "#5A2A26", hand: "#6E2B27", accent: "#E8409E" },
    stone: { surface: "#D9DADC", ink: "#2B2D31", hand: "#25272B", accent: "#FF5A1F" },
    midnight: { surface: "#1B1F27", ink: "#E9E3D6", hand: "#E9E3D6", accent: "#FFB547" },
    porcelain: { surface: "#F4F4F2", ink: "#17181A", hand: "#17181A", accent: "#FF5A1F" }
  };
  static styles = (
    /* css */
    `
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
    /* Second time zone: a recessed sub-dial with hairline ticks and slim tapered hands. */
    .sub .plate { fill: color-mix(in srgb, var(--_surface), var(--_ink) 5%); }
    .sub .rim { fill: none; stroke: color-mix(in srgb, var(--_ink), transparent 82%); stroke-width: 0.22; }
    .sub .well { fill: none; stroke: color-mix(in srgb, #000, transparent 88%); stroke-width: 0.5; }
    .sub .t { stroke: var(--_ink); stroke-width: 0.18; stroke-linecap: round; opacity: .5; }
    .sub .t.M { stroke-width: 0.32; opacity: .85; }
    .sub .arm { fill: var(--_hand); }
    .sub .pin { fill: var(--_hand); }
    .sub .pin-dot { fill: var(--_accent); }
    .sub .city { font-family: var(--_font); font-size: 2.3px; font-weight: 650; letter-spacing: 0.12em; fill: var(--_ink); opacity: .8; }
    .sub .off { font-weight: 550; letter-spacing: 0.04em; opacity: .6; }

    .screen { background:
      radial-gradient(120% 90% at 30% 10%, color-mix(in srgb, var(--_surface), #fff 7%) 0%, var(--_surface) 55%, color-mix(in srgb, var(--_surface), #000 8%) 100%); }
  `
  );
  #reliefSecond = -1;
  #dateMinute = -1;
  get variant() {
    const v = this.getAttribute("variant");
    return VARIANTS.has(v) ? v : "numerals";
  }
  get script() {
    const s = this.getAttribute("numerals");
    return SCRIPTS.has(s) ? s : "western";
  }
  get themeName() {
    const t = this.getAttribute("theme");
    return t && _BezelClock.themes[t] ? t : DEFAULT_THEME[this.variant];
  }
  get secondZone() {
    const tz = this.getAttribute("second-timezone");
    return this.variant === "classic" && tz && isValidTimeZone(tz) ? tz : null;
  }
  get hands() {
    return handStyle(this.getAttribute("hands"));
  }
  get showSeconds() {
    return !this.flag("hide-seconds");
  }
  get tickRate() {
    if (!this.showSeconds) return "second";
    return this.getAttribute("sweep") === "tick" ? "second" : "frame";
  }
  template() {
    const v = this.variant;
    const script = this.script;
    let dial = "";
    if (v === "numerals") {
      const { size, items } = BIG[script];
      dial = `
        <g class="numerals">${items.map(([h, x, y]) => `<text class="numeral" x="${x}" y="${y}" font-size="${size}" text-anchor="middle">${numeral(h, script)}</text>`).join("")}</g>
`;
    } else if (v === "relief") {
      dial = `<g class="ring">${Array.from({ length: 12 }, (_, i) => {
        const h = i || 12;
        const deg = i * 30;
        const rad = deg * Math.PI / 180;
        const x = (C + Math.sin(rad) * 35).toFixed(2);
        const y = (C - Math.cos(rad) * 35).toFixed(2);
        const turn = deg > 90 && deg < 270 ? deg - 180 : deg;
        const text = numeral(h, script);
        const scale = script === "roman" ? Math.min(1, 2 / Math.max(2, text.length)) * 0.95 : 1;
        return `<text class="numeral" data-h="${h}" data-scale="${scale.toFixed(3)}" text-anchor="middle" dominant-baseline="central" font-size="${(15 * scale).toFixed(2)}" transform="rotate(${turn} ${x} ${y})" x="${x}" y="${y}">${text}</text>`;
      }).join("")}</g>`;
    } else {
      const ticks = Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        const r1 = major ? 41 : 43;
        return `<line class="tick ${major ? "major" : "minor"}" x1="${C}" y1="${C - r1}" x2="${C}" y2="${C - 45.2}" transform="rotate(${i * 6} ${C} ${C})" />`;
      }).join("");
      const roman = script === "roman";
      const zone = this.secondZone;
      const nums = Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        if (zone && h === 6) return "";
        const a = h * 30 * Math.PI / 180;
        const r = roman ? 32.5 : 33.5;
        const text = numeral(h, script);
        const size = roman ? Math.min(7.4, 15 / Math.max(2, text.length)) : 8.2;
        return `<text class="numeral" x="${(C + Math.sin(a) * r).toFixed(2)}" y="${(C - Math.cos(a) * r).toFixed(2)}" font-size="${size.toFixed(2)}" text-anchor="middle" dominant-baseline="central">${text}</text>`;
      }).join("");
      let sub = "";
      if (zone) {
        const sx = C;
        const sy = 68;
        const subTicks = Array.from({ length: 12 }, (_, i) => {
          const major = i % 3 === 0;
          return `<line class="t${major ? " M" : ""}" x1="${sx}" y1="${sy - 7.5}" x2="${sx}" y2="${sy - (major ? 6.1 : 6.75)}" transform="rotate(${i * 30} ${sx} ${sy})" />`;
        }).join("");
        const label = this.getAttribute("second-label") || cityName(zone);
        const arm = (cls, length, base, tip) => `<g class="${cls}"><path class="arm" d="${baton(sx, sy + 1.1, length + 1.1, base, tip)}" /></g>`;
        sub = `<g class="sub">
          <circle class="plate" cx="${sx}" cy="${sy}" r="8.6" />
          <circle class="well" cx="${sx}" cy="${sy}" r="8.35" />
          <circle class="rim" cx="${sx}" cy="${sy}" r="8.6" />
          ${subTicks}
          ${arm("sub-hour", 4.3, 0.42, 0.3)}
          ${arm("sub-minute", 6.5, 0.34, 0.22)}
          <circle class="pin" cx="${sx}" cy="${sy}" r="0.75" />
          <circle class="pin-dot" cx="${sx}" cy="${sy}" r="0.32" />
          <text class="city" x="${sx}" y="${sy + 13}" text-anchor="middle">${esc(label.toLocaleUpperCase(this.locale))}<tspan class="off" dx="1.2"></tspan></text>
        </g>`;
      }
      dial = `${ticks}${nums}${sub}<text class="date" x="${C}" y="${zone ? C - 15 : C + 16}" text-anchor="middle"></text>`;
    }
    const heavy = v === "classic" ? 2.2 : 3.1;
    const classic = v === "classic";
    const hands = this.hands === "lollipop" ? `<g class="hands">${lollipopHands({
      hour: classic ? 21 : 26,
      minute: classic ? 33.5 : 39,
      second: classic ? 31.5 : 37,
      tail: classic ? 7 : 8,
      weight: classic ? 1 : 1.12,
      seconds: this.showSeconds,
      extra: "hand"
    })}</g>` : `
      <g class="hands">
        ${hand({ cls: "hour", stem: 6, length: v === "classic" ? 22 : 27, width: heavy })}
        ${hand({ cls: "minute", stem: 6, length: v === "classic" ? 36 : 40, width: heavy })}
        ${this.showSeconds ? secondHand(v === "classic" ? 42 : 46, 8) : ""}
        <circle class="hub" cx="${C}" cy="${C}" r="1.7" />
        ${this.showSeconds ? `<circle class="hub-ring" cx="${C}" cy="${C}" r="1.15" />` : ""}
        <circle class="hub-pin" cx="${C}" cy="${C}" r="0.55" />
      </g>`;
    const dir = script === "persian" ? ' direction="ltr"' : "";
    const corner = v === "numerals" ? '<span class="date corner-date" aria-hidden="true"></span>' : "";
    return `${corner}<svg class="face v-${v} s-${script}" viewBox="0 0 100 100" aria-hidden="true"${dir}>${DEFS}${dial}${hands}</svg>`;
  }
  update(z, first) {
    const smooth = this.tickRate === "frame";
    const a = handAngles(z, { smooth });
    this.$(".hour")?.setAttribute("transform", `rotate(${a.hour.toFixed(3)} ${C} ${C})`);
    this.$(".minute")?.setAttribute("transform", `rotate(${a.minute.toFixed(3)} ${C} ${C})`);
    this.$(".second")?.setAttribute("transform", `rotate(${a.second.toFixed(3)} ${C} ${C})`);
    if (first || z.minutes !== this.#dateMinute) {
      this.#dateMinute = z.minutes;
      const date = this.$(".date");
      if (date && !this.flag("hide-date")) {
        const wd = names(this.locale).weekdayShort[z.weekday].replace(".", "").toLocaleUpperCase(this.locale);
        const day = this.script === "persian" ? numeral(z.day, "persian") : z.day;
        date.textContent = `${wd} ${day}`;
      }
      const zone = this.secondZone;
      if (zone) {
        const s = handAngles(zoned(z.ms, zone), { smooth: false });
        this.$(".sub-hour")?.setAttribute("transform", `rotate(${s.hour.toFixed(2)} ${C} 68)`);
        this.$(".sub-minute")?.setAttribute("transform", `rotate(${s.minute.toFixed(2)} ${C} 68)`);
        const off = this.$(".sub .off");
        if (off) off.textContent = zoneOffset(z.ms, this.timeZone, zone);
      }
    }
    if (this.variant === "relief" && (first || z.seconds !== this.#reliefSecond)) {
      this.#reliefSecond = z.seconds;
      this.#relief(a.minute);
    }
  }
  /** Numerals near the minute hand rise to full size; the rest recede into the surface. */
  #relief(minuteAngle) {
    const pos = minuteAngle / 30;
    for (const el of this.$$(".numeral")) {
      const h = Number(el.dataset.h) % 12;
      const scale = Number(el.dataset.scale) || 1;
      let d = Math.abs(h - pos);
      d = Math.min(d, 12 - d);
      const t = Math.min(1, Math.max(0, (d - 1.2) / 2.6));
      const ease = t * t * (3 - 2 * t);
      el.style.opacity = (1 - ease).toFixed(3);
      el.setAttribute("font-size", ((16.5 - ease * 5) * scale).toFixed(2));
    }
  }
  describe(z) {
    const fmt = (tz) => new Intl.DateTimeFormat(this.locale, { hour: "numeric", minute: "2-digit", hour12: this.hour12, timeZone: tz }).format(z.ms);
    const zone = this.secondZone;
    const second = zone ? `, ${fmt(zone)} in ${this.getAttribute("second-label") || cityName(zone)}` : "";
    return `Clock showing ${fmt(this.timeZone)}${second}`;
  }
};
define("bezel-clock", BezelClock);

// src/core/calendar.js
var calendar_exports = {};
__export(calendar_exports, {
  daysInMonth: () => daysInMonth,
  monthGrid: () => monthGrid,
  parseMonth: () => parseMonth,
  weekdayOrder: () => weekdayOrder
});
function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}
function monthGrid(year, month, { weekStart = 1, fixedRows = false, fillAdjacent = true } = {}) {
  const firstDow = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const lead = (firstDow - weekStart + 7) % 7;
  const total = daysInMonth(year, month);
  const rows = fixedRows ? 6 : Math.ceil((lead + total) / 7);
  const weeks = [];
  for (let r = 0; r < rows; r++) {
    const week = [];
    for (let c = 0; c < 7; c++) {
      const offset = r * 7 + c - lead;
      const d = new Date(Date.UTC(year, month, 1 + offset));
      const inMonth = offset >= 0 && offset < total;
      week.push(
        inMonth || fillAdjacent ? { year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate(), inMonth } : null
      );
    }
    weeks.push(week);
  }
  return weeks;
}
function weekdayOrder(weekStart = 1) {
  return Array.from({ length: 7 }, (_, i) => (weekStart + i) % 7);
}
function parseMonth(value) {
  const m = /^(\d{4})-(\d{1,2})$/.exec(String(value ?? "").trim());
  if (!m) return null;
  const month = Number(m[2]) - 1;
  if (month < 0 || month > 11) return null;
  return { year: Number(m[1]), month };
}

// src/tiles/calendar.js
var BezelCalendar = class extends BezelElement {
  static attributes = ["week-start", "month", "hide-time", "hide-backdrop"];
  static defaultTheme = "snow";
  static themes = {
    snow: { surface: "#FBFBFD", ink: "#1F3E8C", accent: "#E5484D", today: "#121A33", muted: "#B9C0D2" },
    ink: { surface: "#101216", ink: "#E8ECF4", accent: "#FF5F57", today: "#FFFFFF", muted: "#4A5160" },
    sorbet: { surface: "#FFE8D6", ink: "#5B2A86", accent: "#FF7A45", today: "#2A1240", muted: "#D9B8C4" },
    forest: { surface: "#E7EFE6", ink: "#21412F", accent: "#2F9E5B", today: "#0F2419", muted: "#A9BCAD" }
  };
  static styles = (
    /* css */
    `
    .cal {
      position: absolute; inset: 0;
      display: grid;
      grid-template-rows: auto auto 1fr;
      padding: calc(8.5cqw + var(--_safe)) calc(7.5cqw + var(--_safe)) calc(7cqw + var(--_safe));
      gap: 2.6cqw;
    }
    .head { display: flex; justify-content: space-between; align-items: baseline; font-size: 6.4cqw; font-weight: 640; letter-spacing: -0.01em; color: var(--_accent); position: relative; z-index: 1; }
    .time { font-variant-numeric: tabular-nums; }
    .row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; position: relative; z-index: 1; }
    .dow { font-size: 5.4cqw; font-weight: 680; color: var(--_ink); }
    .dow .wkend { color: var(--_ink); }
    .grid { display: grid; grid-template-rows: repeat(6, 1fr); align-items: center; position: relative; z-index: 1; }
    .d { display: grid; place-items: center; font-size: 5.7cqw; font-weight: 640; color: var(--_ink); font-variant-numeric: tabular-nums; }
    .d span { display: grid; place-items: center; inline-size: 9.4cqw; aspect-ratio: 1; border-radius: 50%; }
    .d.out { color: var(--_muted); }
    .d.today span { background: var(--_today); color: var(--_surface); box-shadow: 0 0.6cqw 1.6cqw -0.4cqw color-mix(in srgb, var(--_today), transparent 40%); }
    .backdrop {
      position: absolute; inset: 0; z-index: 0;
      display: grid; place-items: center;
      padding-block-start: 12cqh;
      font-size: var(--bd-size, 82cqh); line-height: 1; font-weight: 760; letter-spacing: -0.07em;
      color: var(--_accent);
      opacity: var(--bd-opacity, .2);
      font-variant-numeric: lining-nums;
      -webkit-mask-image: linear-gradient(180deg, #000 40%, rgba(0,0,0,.35) 78%, transparent 100%);
              mask-image: linear-gradient(180deg, #000 40%, rgba(0,0,0,.35) 78%, transparent 100%);
    }
  `
  );
  get tickRate() {
    return this.flag("hide-time") ? "minute" : "second";
  }
  template(z) {
    const pinned = parseMonth(this.getAttribute("month"));
    const year = pinned?.year ?? z.year;
    const month = pinned?.month ?? z.month;
    const weekStart = parseWeekStart(this.getAttribute("week-start"), this.locale);
    const n = names(this.locale);
    const isCurrent = year === z.year && month === z.month;
    const dows = weekdayOrder(weekStart).map((d) => `<div class="dow">${esc(n.weekdayNarrow[d])}</div>`).join("");
    const weeks = monthGrid(year, month, { weekStart, fixedRows: true }).map(
      (w) => w.map((c) => {
        const today = c.inMonth && isCurrent && c.day === z.day;
        return `<div class="d${c.inMonth ? "" : " out"}${today ? " today" : ""}"><span>${c.day}</span></div>`;
      }).join("")
    ).map((r) => `<div class="row">${r}</div>`).join("");
    const monthLabel = new Intl.DateTimeFormat(this.locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
      Date.UTC(year, month, 15)
    );
    return `
      ${this.flag("hide-backdrop") || !isCurrent ? "" : `<div class="backdrop" aria-hidden="true"${z.day > 9 ? ' style="--bd-size:66cqw;--bd-opacity:.16"' : ""}>${z.day}</div>`}
      <div class="cal" aria-hidden="true">
        <div class="head"><span>${esc(monthLabel)}</span>${this.flag("hide-time") ? "" : '<span class="time"></span>'}</div>
        <div class="row">${dows}</div>
        <div class="grid">${weeks}</div>
      </div>`;
  }
  update(z) {
    const t = this.$(".time");
    if (t) {
      const text = formatClock(z.hours, z.minutes, this.hour12);
      if (t.textContent !== text) t.textContent = text;
    }
  }
  describe(z) {
    const date = new Intl.DateTimeFormat(this.locale, { dateStyle: "full", timeZone: "UTC" }).format(Date.UTC(z.year, z.month, z.day));
    return `Calendar. Today is ${date}`;
  }
};
define("bezel-calendar", BezelCalendar);

// src/core/icons.js
var wrap = (body, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
var sunCore = '<circle cx="12" cy="12" r="4.2"/>';
var rays = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="12" y1="2.6" x2="12" y2="4.6" transform="rotate(${a} 12 12)"/>`).join("");
var cloud = "M7.2 18.5h9.6a3.9 3.9 0 0 0 .5-7.77A5.4 5.4 0 0 0 6.9 10.2 4.2 4.2 0 0 0 7.2 18.5Z";
var smallCloud = "M8.4 19h8.2a3.3 3.3 0 0 0 .4-6.58 4.6 4.6 0 0 0-8.9-1.1A3.85 3.85 0 0 0 8.4 19Z";
var icons = {
  sun: () => wrap(sunCore + rays),
  moon: () => wrap('<path d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a7.6 7.6 0 1 0 9.8 9.8Z"/>'),
  partly: (isDay = true) => wrap(
    (isDay ? '<circle cx="8.6" cy="8.4" r="3.2"/><line x1="8.6" y1="2.4" x2="8.6" y2="3.4"/><line x1="2.6" y1="8.4" x2="3.6" y2="8.4"/><line x1="4.4" y1="4.2" x2="5.1" y2="4.9"/><line x1="12.8" y1="4.2" x2="12.1" y2="4.9"/>' : '<path d="M11.6 9.6A4.4 4.4 0 0 1 6 4a4.4 4.4 0 1 0 5.6 5.6Z"/>') + `<path d="${smallCloud}"/>`
  ),
  cloudy: () => wrap(`<path d="${cloud}"/>`),
  fog: () => wrap('<line x1="4" y1="9" x2="20" y2="9"/><line x1="6" y1="13" x2="18" y2="13"/><line x1="4" y1="17" x2="20" y2="17"/>'),
  drizzle: () => wrap(`<path d="${cloud}" transform="translate(0 -3)"/><line x1="9" y1="19" x2="8.5" y2="20.5"/><line x1="15" y1="19" x2="14.5" y2="20.5"/>`),
  rain: () => wrap(`<path d="${cloud}" transform="translate(0 -3)"/><line x1="8" y1="18.5" x2="7" y2="21"/><line x1="12" y1="18.5" x2="11" y2="21"/><line x1="16" y1="18.5" x2="15" y2="21"/>`),
  snow: () => wrap(`<path d="${cloud}" transform="translate(0 -3)"/><circle cx="8" cy="19.6" r=".5" fill="currentColor"/><circle cx="12" cy="20.6" r=".5" fill="currentColor"/><circle cx="16" cy="19.6" r=".5" fill="currentColor"/>`),
  storm: () => wrap(`<path d="${cloud}" transform="translate(0 -3)"/><path d="M12.6 15.4 10.6 18.6h3l-2 3"/>`),
  sunrise: () => wrap('<path d="M6.5 16a5.5 5.5 0 0 1 11 0"/><line x1="3" y1="19" x2="21" y2="19"/><path d="M12 3v6M9.5 5.5 12 3l2.5 2.5"/><line x1="4.2" y1="11.2" x2="5.4" y2="12"/><line x1="19.8" y1="11.2" x2="18.6" y2="12"/>'),
  sunset: () => wrap('<path d="M6.5 16a5.5 5.5 0 0 1 11 0"/><line x1="3" y1="19" x2="21" y2="19"/><path d="M12 3v6M9.5 6.5 12 9l2.5-2.5"/><line x1="4.2" y1="11.2" x2="5.4" y2="12"/><line x1="19.8" y1="11.2" x2="18.6" y2="12"/>'),
  wind: () => wrap('<path d="M3 9h11.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 13h15.5a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 17h7"/>'),
  humidity: () => wrap('<path d="M12 3.2s-6 6.6-6 10.8a6 6 0 0 0 12 0c0-4.2-6-10.8-6-10.8Z"/><path d="M9.2 14.6a2.9 2.9 0 0 0 2.4 2.6"/>'),
  air: () => wrap(
    [
      [6, 7],
      [12, 7],
      [18, 7],
      [9, 12],
      [15, 12],
      [6, 17],
      [12, 17],
      [18, 17]
    ].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.15" fill="currentColor" stroke="none"/>`).join("")
  ),
  arrow: () => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5 3.8 10.6l7.4 2.2 2.2 7.4Z" fill="currentColor"/></svg>'
};
function skyIcon(sky, isDay = true) {
  switch (sky) {
    case "clear":
      return isDay ? icons.sun() : icons.moon();
    case "partly":
      return icons.partly(isDay);
    case "fog":
      return icons.fog();
    case "drizzle":
      return icons.drizzle();
    case "rain":
      return icons.rain();
    case "snow":
      return icons.snow();
    case "storm":
      return icons.storm();
    default:
      return icons.cloudy();
  }
}

// src/core/weather.js
var weather_exports = {};
__export(weather_exports, {
  DEFAULT_PLACE: () => DEFAULT_PLACE,
  _resetWeatherCache: () => _resetWeatherCache,
  aqiBand: () => aqiBand,
  defaultUnits: () => defaultUnits,
  describeCode: () => describeCode,
  geocode: () => geocode,
  getWeather: () => getWeather,
  isoClock: () => isoClock,
  nextSunEvent: () => nextSunEvent,
  normalise: () => normalise,
  resolveAndFetch: () => resolveAndFetch,
  sampleWeather: () => sampleWeather
});
var FORECAST = "https://api.open-meteo.com/v1/forecast";
var AIR = "https://air-quality-api.open-meteo.com/v1/air-quality";
var GEOCODE = "https://geocoding-api.open-meteo.com/v1/search";
var DEFAULT_PLACE = { name: "London", latitude: 51.5072, longitude: -0.1276 };
var TTL = 15 * 6e4;
var cache = /* @__PURE__ */ new Map();
var geoCache = /* @__PURE__ */ new Map();
var WMO = {
  0: ["Clear", "clear"],
  1: ["Mostly Clear", "clear"],
  2: ["Partly Cloudy", "partly"],
  3: ["Overcast", "cloudy"],
  45: ["Fog", "fog"],
  48: ["Freezing Fog", "fog"],
  51: ["Light Drizzle", "drizzle"],
  53: ["Drizzle", "drizzle"],
  55: ["Heavy Drizzle", "drizzle"],
  56: ["Freezing Drizzle", "drizzle"],
  57: ["Freezing Drizzle", "drizzle"],
  61: ["Light Rain", "rain"],
  63: ["Rain", "rain"],
  65: ["Heavy Rain", "rain"],
  66: ["Freezing Rain", "rain"],
  67: ["Freezing Rain", "rain"],
  71: ["Light Snow", "snow"],
  73: ["Snow", "snow"],
  75: ["Heavy Snow", "snow"],
  77: ["Snow Grains", "snow"],
  80: ["Showers", "rain"],
  81: ["Showers", "rain"],
  82: ["Heavy Showers", "rain"],
  85: ["Snow Showers", "snow"],
  86: ["Snow Showers", "snow"],
  95: ["Thunderstorm", "storm"],
  96: ["Thunderstorm", "storm"],
  99: ["Thunderstorm", "storm"]
};
function describeCode(code) {
  const [label, sky] = WMO[code] ?? ["Unknown", "cloudy"];
  return { label, sky };
}
var IMPERIAL_REGIONS = /* @__PURE__ */ new Set(["US", "LR", "MM", "BS", "BZ", "KY", "PW", "FM", "MH"]);
function defaultUnits(locale = "en-GB") {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    return IMPERIAL_REGIONS.has(region) ? "imperial" : "metric";
  } catch {
    return "metric";
  }
}
function aqiBand(value, scale = "eu") {
  if (value == null || Number.isNaN(value)) return "";
  const bands = scale === "us" ? [[50, "Good"], [100, "Moderate"], [150, "Unhealthy for some"], [200, "Unhealthy"], [300, "Very unhealthy"], [Infinity, "Hazardous"]] : [[20, "Good"], [40, "Fair"], [60, "Moderate"], [80, "Poor"], [100, "Very poor"], [Infinity, "Extremely poor"]];
  return bands.find(([max]) => value <= max)[1];
}
function normalise(forecast, air, { units = "metric", place = "" } = {}) {
  const c = forecast.current ?? {};
  const daily = forecast.daily ?? {};
  const { label, sky } = describeCode(c.weather_code);
  const scale = units === "imperial" ? "us" : "eu";
  const aqi = air?.current ? air.current[scale === "us" ? "us_aqi" : "european_aqi"] : null;
  return {
    sample: false,
    place,
    units,
    time: c.time ?? null,
    // location-local ISO, e.g. "2026-10-22T13:00"
    temperature: c.temperature_2m,
    apparent: c.apparent_temperature ?? null,
    humidity: c.relative_humidity_2m,
    wind: c.wind_speed_10m,
    windDirection: c.wind_direction_10m ?? null,
    code: c.weather_code,
    condition: label,
    sky,
    isDay: c.is_day !== 0,
    high: daily.temperature_2m_max?.[0],
    low: daily.temperature_2m_min?.[0],
    sunrise: daily.sunrise ?? [],
    sunset: daily.sunset ?? [],
    aqi: aqi == null ? null : Math.round(aqi),
    aqiScale: scale,
    utcOffsetSeconds: forecast.utc_offset_seconds ?? 0,
    timezone: forecast.timezone ?? null
  };
}
function sampleWeather({ units = "metric", place = DEFAULT_PLACE.name } = {}) {
  const f2 = (cDeg) => units === "imperial" ? Math.round(cDeg * 1.8 + 32) : cDeg;
  const today = /* @__PURE__ */ new Date();
  const iso = (h, m) => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return {
    sample: true,
    place,
    units,
    time: null,
    temperature: f2(14),
    apparent: f2(12),
    humidity: 76,
    wind: units === "imperial" ? 7 : 11,
    windDirection: 240,
    code: 2,
    condition: "Partly Cloudy",
    sky: "partly",
    isDay: true,
    high: f2(16),
    low: f2(9),
    sunrise: [iso(7, 31)],
    sunset: [iso(17, 52)],
    aqi: units === "imperial" ? 21 : 18,
    aqiScale: units === "imperial" ? "us" : "eu",
    utcOffsetSeconds: 0,
    timezone: null
  };
}
async function getJSON(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
function geocode(name) {
  const key = name.trim().toLowerCase();
  if (!geoCache.has(key)) {
    const url = `${GEOCODE}?name=${encodeURIComponent(name.trim())}&count=1&format=json`;
    geoCache.set(
      key,
      getJSON(url).then((json) => {
        const r = json.results?.[0];
        if (!r) throw new Error(`No place called "${name}"`);
        return { name: r.name, latitude: r.latitude, longitude: r.longitude, timezone: r.timezone };
      }).catch((err) => {
        geoCache.delete(key);
        throw err;
      })
    );
  }
  return geoCache.get(key);
}
function getWeather({ latitude, longitude, units = "metric", place = "" }) {
  const key = `${latitude.toFixed(3)},${longitude.toFixed(3)},${units}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.promise;
  const imperial = units === "imperial";
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day",
    daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: "2",
    temperature_unit: imperial ? "fahrenheit" : "celsius",
    wind_speed_unit: imperial ? "mph" : "kmh"
  });
  const airParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "european_aqi,us_aqi"
  });
  const promise = Promise.all([
    getJSON(`${FORECAST}?${params}`),
    getJSON(`${AIR}?${airParams}`).catch(() => null)
  ]).then(([forecast, air]) => normalise(forecast, air, { units, place })).catch((err) => {
    cache.delete(key);
    console.warn(`[bezel] Weather unavailable (${err.message}). Showing sample data.`);
    return sampleWeather({ units, place });
  });
  cache.set(key, { at: Date.now(), promise });
  return promise;
}
async function resolveAndFetch({ latitude, longitude, location, units }) {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return getWeather({ latitude: lat, longitude: lon, units, place: location || "" });
  }
  if (location) {
    try {
      const p = await geocode(location);
      return getWeather({ latitude: p.latitude, longitude: p.longitude, units, place: p.name });
    } catch (err) {
      console.warn(`[bezel] ${err.message}. Showing sample data.`);
      return sampleWeather({ units, place: location });
    }
  }
  return getWeather({ ...DEFAULT_PLACE, units, place: DEFAULT_PLACE.name });
}
function nextSunEvent(w, nowIso) {
  const now = nowIso ?? w.time ?? "";
  const events = [
    ...w.sunrise.map((t) => ({ kind: "sunrise", time: t })),
    ...w.sunset.map((t) => ({ kind: "sunset", time: t }))
  ].sort((a, b) => a.time.localeCompare(b.time));
  return events.find((e) => e.time > now) ?? events.find((e) => e.kind === "sunset") ?? null;
}
function isoClock(iso, hour12) {
  const m = /T(\d{2}):(\d{2})/.exec(iso ?? "");
  if (!m) return "--:--";
  const h = Number(m[1]);
  return hour12 ? `${h % 12 || 12}:${m[2]}` : `${m[1]}:${m[2]}`;
}
function _resetWeatherCache() {
  cache.clear();
  geoCache.clear();
}

// src/core/weather-source.js
var WEATHER_ATTRIBUTES = ["latitude", "longitude", "location", "units", "refresh"];
var WeatherSource = class {
  data = null;
  #host;
  #timer = 0;
  #request = 0;
  #manual = false;
  constructor(host) {
    this.#host = host;
  }
  get units() {
    const u = this.#host.getAttribute("units");
    return u === "imperial" || u === "metric" ? u : defaultUnits(this.#host.locale);
  }
  start() {
    if (this.#manual) return;
    this.load();
  }
  stop() {
    clearTimeout(this.#timer);
    this.#timer = 0;
  }
  /** Supply data directly (for custom sources or offline use). */
  set(data) {
    this.#manual = data != null;
    this.stop();
    this.data = data;
    this.#host.invalidate();
  }
  async load() {
    this.stop();
    const id = ++this.#request;
    const h = this.#host;
    const data = await resolveAndFetch({
      latitude: h.getAttribute("latitude"),
      longitude: h.getAttribute("longitude"),
      location: h.getAttribute("location"),
      units: this.units
    });
    if (id !== this.#request || this.#manual) return;
    this.data = data;
    h.invalidate();
    h.dispatchEvent(new CustomEvent("bezel-weather", { detail: data, bubbles: true, composed: true }));
    const minutes = Math.max(5, parseFloat(h.getAttribute("refresh")) || 15);
    this.#timer = setTimeout(() => this.load(), data.sample ? 6e4 : minutes * 6e4);
  }
};

// src/core/i18n.js
var EN = {
  sunrise: "Sunrise",
  sunset: "Sunset",
  wind: "Wind",
  humidity: "Humidity",
  aqi: "AQI",
  sample: "Sample",
  weather: "Weather",
  high: "H",
  low: "L",
  week: "Week {n}",
  dayOf: "Day {d} of {n}",
  weekOfYear: "Week of the year",
  nothingElse: "Nothing else today",
  allDay: "All day",
  nowUntil: "Now \xB7 until {t}"
};
var T = {
  fr: {
    sunrise: "Lever",
    sunset: "Coucher",
    wind: "Vent",
    humidity: "Humidit\xE9",
    aqi: "IQA",
    sample: "Exemple",
    weather: "M\xE9t\xE9o",
    high: "H",
    low: "B",
    week: "Semaine {n}",
    dayOf: "Jour {d} sur {n}",
    weekOfYear: "Semaine de l\u2019ann\xE9e",
    nothingElse: "Rien d\u2019autre aujourd\u2019hui",
    allDay: "Toute la journ\xE9e",
    nowUntil: "En cours \xB7 jusqu\u2019\xE0 {t}",
    cond: {
      "Clear": "D\xE9gag\xE9",
      "Mostly Clear": "Plut\xF4t d\xE9gag\xE9",
      "Partly Cloudy": "Partiellement nuageux",
      "Overcast": "Couvert",
      "Fog": "Brouillard",
      "Freezing Fog": "Brouillard givrant",
      "Light Drizzle": "Bruine l\xE9g\xE8re",
      "Drizzle": "Bruine",
      "Heavy Drizzle": "Forte bruine",
      "Freezing Drizzle": "Bruine vergla\xE7ante",
      "Light Rain": "Pluie faible",
      "Rain": "Pluie",
      "Heavy Rain": "Forte pluie",
      "Freezing Rain": "Pluie vergla\xE7ante",
      "Light Snow": "Neige faible",
      "Snow": "Neige",
      "Heavy Snow": "Forte neige",
      "Snow Grains": "Neige en grains",
      "Showers": "Averses",
      "Heavy Showers": "Fortes averses",
      "Snow Showers": "Averses de neige",
      "Thunderstorm": "Orage",
      "Unknown": "Inconnu"
    }
  },
  de: {
    sunrise: "Aufgang",
    sunset: "Untergang",
    wind: "Wind",
    humidity: "Feuchte",
    aqi: "LQI",
    sample: "Beispiel",
    weather: "Wetter",
    high: "H",
    low: "T",
    week: "Woche {n}",
    dayOf: "Tag {d} von {n}",
    weekOfYear: "Kalenderwoche",
    nothingElse: "Heute nichts mehr",
    allDay: "Ganzt\xE4gig",
    nowUntil: "Jetzt \xB7 bis {t}",
    cond: {
      "Clear": "Klar",
      "Mostly Clear": "\xDCberwiegend klar",
      "Partly Cloudy": "Teilweise bew\xF6lkt",
      "Overcast": "Bedeckt",
      "Fog": "Nebel",
      "Freezing Fog": "Gefrierender Nebel",
      "Light Drizzle": "Leichter Nieselregen",
      "Drizzle": "Nieselregen",
      "Heavy Drizzle": "Starker Nieselregen",
      "Freezing Drizzle": "Gefrierender Nieselregen",
      "Light Rain": "Leichter Regen",
      "Rain": "Regen",
      "Heavy Rain": "Starker Regen",
      "Freezing Rain": "Gefrierender Regen",
      "Light Snow": "Leichter Schneefall",
      "Snow": "Schnee",
      "Heavy Snow": "Starker Schneefall",
      "Snow Grains": "Schneegriesel",
      "Showers": "Schauer",
      "Heavy Showers": "Starke Schauer",
      "Snow Showers": "Schneeschauer",
      "Thunderstorm": "Gewitter",
      "Unknown": "Unbekannt"
    }
  },
  es: {
    sunrise: "Amanecer",
    sunset: "Atardecer",
    wind: "Viento",
    humidity: "Humedad",
    aqi: "ICA",
    sample: "Ejemplo",
    weather: "Tiempo",
    high: "M\xE1x.",
    low: "M\xEDn.",
    week: "Semana {n}",
    dayOf: "D\xEDa {d} de {n}",
    weekOfYear: "Semana del a\xF1o",
    nothingElse: "Nada m\xE1s hoy",
    allDay: "Todo el d\xEDa",
    nowUntil: "Ahora \xB7 hasta las {t}",
    cond: {
      "Clear": "Despejado",
      "Mostly Clear": "Mayormente despejado",
      "Partly Cloudy": "Parcialmente nublado",
      "Overcast": "Cubierto",
      "Fog": "Niebla",
      "Freezing Fog": "Niebla helada",
      "Light Drizzle": "Llovizna ligera",
      "Drizzle": "Llovizna",
      "Heavy Drizzle": "Llovizna intensa",
      "Freezing Drizzle": "Llovizna helada",
      "Light Rain": "Lluvia ligera",
      "Rain": "Lluvia",
      "Heavy Rain": "Lluvia intensa",
      "Freezing Rain": "Lluvia helada",
      "Light Snow": "Nieve ligera",
      "Snow": "Nieve",
      "Heavy Snow": "Nevada intensa",
      "Snow Grains": "Granos de nieve",
      "Showers": "Chubascos",
      "Heavy Showers": "Chubascos fuertes",
      "Snow Showers": "Chubascos de nieve",
      "Thunderstorm": "Tormenta",
      "Unknown": "Desconocido"
    }
  },
  it: {
    sunrise: "Alba",
    sunset: "Tramonto",
    wind: "Vento",
    humidity: "Umidit\xE0",
    aqi: "IQA",
    sample: "Esempio",
    weather: "Meteo",
    high: "Max",
    low: "Min",
    week: "Settimana {n}",
    dayOf: "Giorno {d} di {n}",
    weekOfYear: "Settimana dell\u2019anno",
    nothingElse: "Nient\u2019altro oggi",
    allDay: "Tutto il giorno",
    nowUntil: "Ora \xB7 fino alle {t}",
    cond: {
      "Clear": "Sereno",
      "Mostly Clear": "Prevalentemente sereno",
      "Partly Cloudy": "Parzialmente nuvoloso",
      "Overcast": "Coperto",
      "Fog": "Nebbia",
      "Freezing Fog": "Nebbia gelata",
      "Light Drizzle": "Pioviggine leggera",
      "Drizzle": "Pioviggine",
      "Heavy Drizzle": "Pioviggine intensa",
      "Freezing Drizzle": "Pioviggine gelata",
      "Light Rain": "Pioggia leggera",
      "Rain": "Pioggia",
      "Heavy Rain": "Pioggia forte",
      "Freezing Rain": "Pioggia gelata",
      "Light Snow": "Neve leggera",
      "Snow": "Neve",
      "Heavy Snow": "Neve forte",
      "Snow Grains": "Neve granulosa",
      "Showers": "Rovesci",
      "Heavy Showers": "Forti rovesci",
      "Snow Showers": "Rovesci di neve",
      "Thunderstorm": "Temporale",
      "Unknown": "Sconosciuto"
    }
  },
  ja: {
    sunrise: "\u65E5\u306E\u51FA",
    sunset: "\u65E5\u306E\u5165\u308A",
    wind: "\u98A8",
    humidity: "\u6E7F\u5EA6",
    aqi: "AQI",
    sample: "\u30B5\u30F3\u30D7\u30EB",
    weather: "\u5929\u6C17",
    high: "\u6700\u9AD8",
    low: "\u6700\u4F4E",
    week: "\u7B2C{n}\u9031",
    dayOf: "{n}\u65E5\u4E2D{d}\u65E5\u76EE",
    weekOfYear: "\u9031\u756A\u53F7",
    nothingElse: "\u4ECA\u65E5\u306E\u4E88\u5B9A\u306F\u3082\u3046\u3042\u308A\u307E\u305B\u3093",
    allDay: "\u7D42\u65E5",
    nowUntil: "\u9032\u884C\u4E2D \xB7 {t}\u307E\u3067",
    cond: {
      "Clear": "\u5FEB\u6674",
      "Mostly Clear": "\u6674\u308C",
      "Partly Cloudy": "\u6674\u308C\u6642\u3005\u66C7\u308A",
      "Overcast": "\u66C7\u308A",
      "Fog": "\u9727",
      "Freezing Fog": "\u7740\u6C37\u6027\u306E\u9727",
      "Light Drizzle": "\u5F31\u3044\u9727\u96E8",
      "Drizzle": "\u9727\u96E8",
      "Heavy Drizzle": "\u5F37\u3044\u9727\u96E8",
      "Freezing Drizzle": "\u7740\u6C37\u6027\u306E\u9727\u96E8",
      "Light Rain": "\u5C0F\u96E8",
      "Rain": "\u96E8",
      "Heavy Rain": "\u5927\u96E8",
      "Freezing Rain": "\u7740\u6C37\u6027\u306E\u96E8",
      "Light Snow": "\u5C0F\u96EA",
      "Snow": "\u96EA",
      "Heavy Snow": "\u5927\u96EA",
      "Snow Grains": "\u9727\u96EA",
      "Showers": "\u306B\u308F\u304B\u96E8",
      "Heavy Showers": "\u5F37\u3044\u306B\u308F\u304B\u96E8",
      "Snow Showers": "\u306B\u308F\u304B\u96EA",
      "Thunderstorm": "\u96F7\u96E8",
      "Unknown": "\u4E0D\u660E"
    }
  },
  fa: {
    sunrise: "\u0637\u0644\u0648\u0639",
    sunset: "\u063A\u0631\u0648\u0628",
    wind: "\u0628\u0627\u062F",
    humidity: "\u0631\u0637\u0648\u0628\u062A",
    aqi: "AQI",
    sample: "\u0646\u0645\u0648\u0646\u0647",
    weather: "\u0647\u0648\u0627",
    high: "\u0628\u06CC\u0634\u06CC\u0646\u0647",
    low: "\u06A9\u0645\u06CC\u0646\u0647",
    week: "\u0647\u0641\u062A\u0647 {n}",
    dayOf: "\u0631\u0648\u0632 {d} \u0627\u0632 {n}",
    weekOfYear: "\u0647\u0641\u062A\u0647\u200C\u06CC \u0633\u0627\u0644",
    nothingElse: "\u0627\u0645\u0631\u0648\u0632 \u0628\u0631\u0646\u0627\u0645\u0647\u200C\u06CC \u062F\u06CC\u06AF\u0631\u06CC \u0646\u06CC\u0633\u062A",
    allDay: "\u062A\u0645\u0627\u0645 \u0631\u0648\u0632",
    nowUntil: "\u0627\u06A9\u0646\u0648\u0646 \xB7 \u062A\u0627 {t}",
    cond: {
      "Clear": "\u0635\u0627\u0641",
      "Mostly Clear": "\u0639\u0645\u062F\u062A\u0627\u064B \u0635\u0627\u0641",
      "Partly Cloudy": "\u0646\u06CC\u0645\u0647\u200C\u0627\u0628\u0631\u06CC",
      "Overcast": "\u0627\u0628\u0631\u06CC",
      "Fog": "\u0645\u0647",
      "Freezing Fog": "\u0645\u0647 \u06CC\u062E\u200C\u0632\u062F\u0647",
      "Light Drizzle": "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646 \u0633\u0628\u06A9",
      "Drizzle": "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646",
      "Heavy Drizzle": "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646 \u0634\u062F\u06CC\u062F",
      "Freezing Drizzle": "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646 \u06CC\u062E\u200C\u0632\u062F\u0647",
      "Light Rain": "\u0628\u0627\u0631\u0627\u0646 \u0633\u0628\u06A9",
      "Rain": "\u0628\u0627\u0631\u0627\u0646",
      "Heavy Rain": "\u0628\u0627\u0631\u0627\u0646 \u0634\u062F\u06CC\u062F",
      "Freezing Rain": "\u0628\u0627\u0631\u0627\u0646 \u06CC\u062E\u200C\u0632\u062F\u0647",
      "Light Snow": "\u0628\u0631\u0641 \u0633\u0628\u06A9",
      "Snow": "\u0628\u0631\u0641",
      "Heavy Snow": "\u0628\u0631\u0641 \u0633\u0646\u06AF\u06CC\u0646",
      "Snow Grains": "\u062F\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u0628\u0631\u0641",
      "Showers": "\u0631\u06AF\u0628\u0627\u0631",
      "Heavy Showers": "\u0631\u06AF\u0628\u0627\u0631 \u0634\u062F\u06CC\u062F",
      "Snow Showers": "\u0631\u06AF\u0628\u0627\u0631 \u0628\u0631\u0641",
      "Thunderstorm": "\u062A\u0648\u0641\u0627\u0646 \u062A\u0646\u062F\u0631\u06CC",
      "Unknown": "\u0646\u0627\u0645\u0634\u062E\u0635"
    }
  }
};
function tr(locale, key, vars = {}) {
  const lang = String(locale ?? "").split("-")[0].toLowerCase();
  const text = T[lang]?.[key] ?? EN[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
function condition(locale, label) {
  const lang = String(locale ?? "").split("-")[0].toLowerCase();
  return T[lang]?.cond?.[label] ?? label ?? "";
}
function highLow(locale, high, low) {
  return `${tr(locale, "high")}:${high} ${tr(locale, "low")}:${low}`;
}

// src/tiles/weather.js
var SKIES = {
  "clear-day": ["#1F6FCF", "#4F9BE6", "#A9D3F5"],
  "clear-night": ["#070D22", "#14224A", "#2B3F73"],
  "partly-day": ["#3779C8", "#6EA6DF", "#B8D6F0"],
  "partly-night": ["#0E1630", "#1E2C52", "#37466E"],
  "cloudy-day": ["#5D7186", "#8A9CAE", "#B9C5D0"],
  "cloudy-night": ["#141A24", "#262F3D", "#3C4657"],
  "fog-day": ["#7F8A95", "#A6AFB7", "#CDD2D6"],
  "fog-night": ["#1C2129", "#323843", "#4A515C"],
  "drizzle-day": ["#4C6175", "#72879B", "#9AAABA"],
  "drizzle-night": ["#121922", "#222D3A", "#344152"],
  "rain-day": ["#3E5166", "#5E7389", "#8597A9"],
  "rain-night": ["#0D131B", "#1C2633", "#2C3848"],
  "snow-day": ["#7E93AA", "#AEBFCF", "#DCE5ED"],
  "snow-night": ["#1D2636", "#36435A", "#56647C"],
  "storm-day": ["#262B38", "#3E4456", "#5B6276"],
  "storm-night": ["#0B0D13", "#1A1E29", "#2C3141"]
};
var CLOUDS = { clear: 0, partly: 3, cloudy: 6, fog: 0, drizzle: 6, rain: 6, snow: 5, storm: 6 };
var CLOUD_SEEDS = [
  [56, 25, 48, 0.96, 52],
  [-18, 10, 58, 0.7, 64],
  [26, 48, 52, 0.5, 58],
  [62, 58, 50, 0.46, 72],
  [-12, 66, 58, 0.4, 60],
  [32, 78, 62, 0.32, 80]
];
var CLOUD_TONES = {
  day: ["#FFFFFF", "#D9E3EF"],
  grey: ["#F1F4F8", "#B4BFCC"],
  storm: ["#C6CDD8", "#7C8695"],
  night: ["#8A96AC", "#4A566C"]
};
var f1 = (n) => Number(n.toFixed(2));
function cloud2([x, y, w, o, dur], i, dim) {
  const k = w / 48;
  const puffs = '<circle cx="13" cy="14" r="8"/><circle cx="23" cy="9.5" r="10"/><circle cx="34" cy="12" r="8.5"/><circle cx="41.5" cy="15.5" r="6"/><ellipse cx="25" cy="17" rx="19" ry="5"/>';
  return `<g class="drift" style="--d:${dur}s;--delay:${-i * 7}s"><g transform="translate(${x} ${y}) scale(${f1(k)})" opacity="${f1(o * (dim ? 0.6 : 1))}">
      <g class="cloud-shade" transform="translate(0.8 1.6)">${puffs}</g>
      <g class="cloud-body">${puffs}</g>
    </g></g>`;
}
var STARS = [[12, 18, 0.35], [28, 9, 0.28], [47, 22, 0.32], [66, 12, 0.26], [84, 26, 0.36], [74, 40, 0.24], [18, 44, 0.3], [92, 8, 0.24], [38, 34, 0.22], [57, 5, 0.3], [6, 30, 0.22], [90, 46, 0.2]];
function skyArt(sky, isDay) {
  const tone = !isDay ? CLOUD_TONES.night : sky === "storm" ? CLOUD_TONES.storm : sky === "rain" || sky === "drizzle" || sky === "snow" ? CLOUD_TONES.grey : CLOUD_TONES.day;
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
  if (isDay && (sky === "clear" || sky === "partly")) {
    parts.push(`<g class="sun"${sky === "partly" ? ' opacity=".85"' : ""}><circle class="glow" cx="77" cy="32" r="34" fill="url(#sun-halo)"/><circle cx="77" cy="32" r="9.5" fill="url(#sun-disc)"/></g>`);
  }
  if (!isDay && (sky === "clear" || sky === "partly")) {
    parts.push(`<g class="stars">${STARS.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" style="--delay:${-i * 0.7}s"/>`).join("")}</g>`);
    parts.push(`<g class="moon"><circle cx="77" cy="32" r="20" fill="url(#moon-halo)"/><circle cx="77" cy="32" r="6.5" fill="#EEF1F8" mask="url(#moon-cut)"/></g>`);
  }
  const count = CLOUDS[sky] ?? 3;
  if (count) parts.push(`<g class="clouds">${CLOUD_SEEDS.slice(0, count).map((seed, i) => cloud2(seed, i, !isDay)).join("")}</g>`);
  if (sky === "fog") {
    parts.push(`<g class="fog">${[22, 50, 74].map((y, i) => `<g class="drift" style="--d:40s;--delay:${-i * 12}s"><ellipse cx="${[40, 62, 36][i]}" cy="${y}" rx="78" ry="9" fill="url(#fog-fill)"/></g>`).join("")}</g>`);
  }
  if (sky === "drizzle" || sky === "rain" || sky === "storm") {
    parts.push(`<g class="rain${sky === "drizzle" ? " light" : ""}"><rect class="fall" x="-20" y="-30" width="140" height="160" fill="url(#rain-p)"/></g>`);
  }
  if (sky === "snow") {
    parts.push(`<g class="snowfall"><rect class="fall" x="-20" y="-40" width="140" height="180" fill="url(#snow-p)"/><rect class="fall slow" x="-20" y="-40" width="140" height="180" fill="url(#snow-p)" transform="translate(9 5) scale(1.4)" opacity=".55"/></g>`);
  }
  return `<svg class="art" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${parts.join("")}</svg>`;
}
var BezelWeather = class extends BezelElement {
  static attributes = [...WEATHER_ATTRIBUTES, "hide-time", "still"];
  static defaultTheme = "sky";
  static themes = { sky: { surface: "#4F9BE6", ink: "#FFFFFF", accent: "#FFFFFF" } };
  static styles = (
    /* css */
    `
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
  `
  );
  #source = new WeatherSource(this);
  connected() {
    this.#source.start();
  }
  disconnected() {
    this.#source.stop();
  }
  attributeChanged(name) {
    if (WEATHER_ATTRIBUTES.includes(name) && name !== "refresh") this.#source.start();
  }
  /** The current weather object, or assign one to drive the tile yourself. */
  get weather() {
    return this.#source.data;
  }
  set weather(data) {
    this.#source.set(data);
  }
  get tickRate() {
    return this.flag("hide-time") ? null : "second";
  }
  template() {
    const w = this.#source.data;
    const lang = this.locale;
    const sky = w ? w.sky : "partly";
    const isDay = w ? w.isDay : true;
    const [s0, s1, s2] = SKIES[`${sky}-${isDay ? "day" : "night"}`] ?? SKIES["partly-day"];
    const layers = [skyArt(sky, isDay)];
    if (sky === "storm") layers.push('<i class="flash"></i>');
    layers.push('<i class="tint"></i>');
    const deg = (v) => v == null || Number.isNaN(v) ? "--" : `${Math.round(v)}\xB0`;
    const place = w?.place || this.getAttribute("location") || "";
    let stats = Array.from({ length: 4 }, () => '<div class="stat"><span class="shim i"></span><span class="shim s"></span></div>').join("");
    if (w) {
      const sun = nextSunEvent(w);
      const windUnit = w.units === "imperial" ? "mph" : "km/h";
      stats = `
        <div class="stat">${sun?.kind === "sunrise" ? icons.sunrise() : icons.sunset()}<b class="num">${isoClock(sun?.time, this.hour12)}</b><span>${tr(lang, sun?.kind === "sunrise" ? "sunrise" : "sunset")}</span></div>
        <div class="stat">${icons.wind()}<b class="num">${Math.round(w.wind ?? 0)}<small>${windUnit}</small></b><span>${tr(lang, "wind")}</span></div>
        <div class="stat">${icons.humidity()}<b class="num">${Math.round(w.humidity ?? 0)}%</b><span>${tr(lang, "humidity")}</span></div>
        <div class="stat">${icons.air()}<b class="num">${w.aqi ?? "--"}</b><span>${tr(lang, "aqi")}</span></div>`;
    }
    return `
      <div class="sky" aria-hidden="true" style="--s0:${s0};--s1:${s1};--s2:${s2}">${layers.join("")}</div>
      <div class="content${w ? "" : " loading"}" aria-hidden="true">
        <div class="top">
          <div class="meta">
            <div class="place">${esc(place || (w ? "" : tr(lang, "weather")))}${w?.sample ? `<span class="sample">${esc(tr(lang, "sample"))}</span>` : ""}</div>
            ${w ? `<div class="cond">${skyIcon(sky, isDay)}<span>${esc(condition(lang, w.condition))}</span></div><div class="hl">${esc(highLow(lang, deg(w.high), deg(w.low)))}</div>` : '<span class="shim l"></span><span class="shim s"></span>'}
          </div>
          ${this.flag("hide-time") ? "" : '<div class="time"></div>'}
        </div>
        <div class="temp">${w ? deg(w.temperature) : '<span class="shim t"></span>'}</div>
        <div class="stats">${stats}</div>
      </div>`;
  }
  update(z) {
    const t = this.$(".time");
    if (!t) return;
    const text = formatClock(z.hours, z.minutes, this.hour12);
    if (t.textContent !== text) t.textContent = text;
  }
  describe() {
    const w = this.#source.data;
    if (!w) return "Weather, loading";
    const aqi = w.aqi != null ? `, air quality ${aqiBand(w.aqi, w.aqiScale).toLowerCase()}` : "";
    return `Weather${w.place ? ` in ${w.place}` : ""}: ${Math.round(w.temperature)} degrees, ${w.condition.toLowerCase()}, high ${Math.round(w.high)}, low ${Math.round(w.low)}${aqi}${w.sample ? " (sample data)" : ""}`;
  }
};
define("bezel-weather", BezelWeather);

// src/core/ics.js
var ics_exports = {};
__export(ics_exports, {
  expandEvents: () => expandEvents,
  normaliseEvents: () => normaliseEvents,
  parseICS: () => parseICS,
  parseICSDate: () => parseICSDate
});
var DAY = 864e5;
var BYDAY = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };
function unfold(text) {
  return text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}
function unescapeText(value) {
  return value.replace(/\\n/gi, "\n").replace(/\\([,;\\])/g, "$1");
}
function parseLine(line) {
  const colon = line.search(/:(?=(?:[^"]*"[^"]*")*[^"]*$)/);
  if (colon < 0) return null;
  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const [name, ...paramParts] = head.split(";");
  const params = {};
  for (const p of paramParts) {
    const eq = p.indexOf("=");
    if (eq > 0) params[p.slice(0, eq).toUpperCase()] = p.slice(eq + 1).replace(/^"|"$/g, "");
  }
  return { name: name.toUpperCase(), params, value };
}
function parseICSDate(value, params = {}, fallbackZone) {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d, h, mi, s, z] = m;
  if (h === void 0 || params.VALUE === "DATE") {
    return { ms: zonedToUtc(+y, +mo - 1, +d, 0, 0, 0, fallbackZone), allDay: true, ymd: [+y, +mo - 1, +d] };
  }
  const parts = [+y, +mo - 1, +d, +h, +mi, +(s ?? 0)];
  if (z) return { ms: Date.UTC(...parts), allDay: false };
  const zone = params.TZID && !params.TZID.startsWith("/") ? params.TZID : fallbackZone;
  let ms;
  try {
    ms = zonedToUtc(...parts, zone);
  } catch {
    ms = zonedToUtc(...parts, fallbackZone);
  }
  return { ms, allDay: false };
}
function parseRRule(value) {
  const rule = {};
  for (const part of value.split(";")) {
    const [k, v] = part.split("=");
    if (k && v) rule[k.toUpperCase()] = v;
  }
  return rule;
}
function parseICS(text, { timeZone } = {}) {
  const events = [];
  let current = null;
  for (const raw of unfold(String(text ?? "")).split("\n")) {
    const line = raw.trimEnd();
    if (line === "BEGIN:VEVENT") {
      current = { uid: "", title: "", location: "", start: null, end: null, allDay: false, rrule: null, exdates: /* @__PURE__ */ new Set(), recurrenceId: null, cancelled: false };
      continue;
    }
    if (line === "END:VEVENT") {
      if (current && current.start != null && !current.cancelled) {
        if (current.end == null || current.end < current.start) {
          current.end = current.start + (current.allDay ? DAY : 0);
        }
        events.push(current);
      }
      current = null;
      continue;
    }
    if (!current) continue;
    const prop = parseLine(line);
    if (!prop) continue;
    switch (prop.name) {
      case "UID":
        current.uid = prop.value;
        break;
      case "SUMMARY":
        current.title = unescapeText(prop.value);
        break;
      case "LOCATION":
        current.location = unescapeText(prop.value);
        break;
      case "STATUS":
        current.cancelled = prop.value.toUpperCase() === "CANCELLED";
        break;
      case "DTSTART": {
        const d = parseICSDate(prop.value, prop.params, timeZone);
        if (d) {
          current.start = d.ms;
          current.allDay = d.allDay;
        }
        break;
      }
      case "DTEND": {
        const d = parseICSDate(prop.value, prop.params, timeZone);
        if (d) current.end = d.ms;
        break;
      }
      case "DURATION": {
        const m = /P(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/.exec(prop.value);
        if (m && current.start != null) {
          const [, w = 0, d = 0, h = 0, mi = 0, s = 0] = m.map((x) => x === void 0 ? 0 : +x);
          current.end = current.start + (((+w * 7 + +d) * 24 + +h) * 60 + +mi) * 6e4 + +s * 1e3;
        }
        break;
      }
      case "RRULE":
        current.rrule = parseRRule(prop.value);
        break;
      case "EXDATE":
        for (const v of prop.value.split(",")) {
          const d = parseICSDate(v, prop.params, timeZone);
          if (d) current.exdates.add(d.ms);
        }
        break;
      case "RECURRENCE-ID": {
        const d = parseICSDate(prop.value, prop.params, timeZone);
        if (d) current.recurrenceId = d.ms;
        break;
      }
    }
  }
  return events;
}
function addMonthsUTC(ms, n) {
  const d = new Date(ms);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + n);
  const max = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  if (day > max) return null;
  d.setUTCDate(day);
  return d.getTime();
}
function* occurrences(ev, until) {
  const r = ev.rrule;
  const freq = r.FREQ;
  const interval = Math.max(1, parseInt(r.INTERVAL ?? "1", 10) || 1);
  const count = r.COUNT ? parseInt(r.COUNT, 10) : Infinity;
  const ruleUntil = r.UNTIL ? parseICSDate(r.UNTIL)?.ms ?? Infinity : Infinity;
  const stop = Math.min(until, ruleUntil);
  let emitted = 0;
  const cap = 5e3;
  if (freq === "WEEKLY" && r.BYDAY) {
    const days = r.BYDAY.split(",").map((d) => BYDAY[d.slice(-2)]).filter((d) => d != null).sort();
    const startDow = new Date(ev.start).getUTCDay();
    const weekAnchor = ev.start - startDow * DAY;
    for (let week = 0; week < cap && emitted < count; week += interval) {
      for (const dow of days) {
        const t = weekAnchor + week * 7 * DAY + dow * DAY;
        if (t < ev.start) continue;
        if (t > stop || emitted >= count) return;
        emitted++;
        yield t;
      }
    }
    return;
  }
  for (let i = 0; i < cap && emitted < count; i++) {
    let t;
    if (freq === "DAILY") t = ev.start + i * interval * DAY;
    else if (freq === "WEEKLY") t = ev.start + i * interval * 7 * DAY;
    else if (freq === "MONTHLY") t = addMonthsUTC(ev.start, i * interval);
    else if (freq === "YEARLY") t = addMonthsUTC(ev.start, i * interval * 12);
    else return;
    if (t == null) continue;
    if (t > stop) return;
    emitted++;
    yield t;
  }
}
function expandEvents(events, from, to) {
  const overrides = /* @__PURE__ */ new Map();
  for (const ev of events) {
    if (ev.recurrenceId != null) overrides.set(`${ev.uid}@${ev.recurrenceId}`, ev);
  }
  const out = [];
  for (const ev of events) {
    if (ev.recurrenceId != null) {
      if (ev.end > from && ev.start < to) out.push(ev);
      continue;
    }
    const duration = ev.end - ev.start;
    if (!ev.rrule) {
      if (ev.end > from && ev.start < to) out.push(ev);
      continue;
    }
    for (const start of occurrences(ev, to)) {
      if (ev.exdates.has(start) || overrides.has(`${ev.uid}@${start}`)) continue;
      const end = start + duration;
      if (end > from && start < to) out.push({ ...ev, start, end, rrule: null });
    }
  }
  return out.sort((a, b) => a.start - b.start || a.title.localeCompare(b.title));
}
function normaliseEvents(list) {
  if (!Array.isArray(list)) return [];
  return list.map((e) => {
    const start = new Date(e.start).getTime();
    if (!Number.isFinite(start)) return null;
    const end = e.end != null ? new Date(e.end).getTime() : start;
    return {
      uid: e.id ?? "",
      title: String(e.title ?? e.summary ?? "Untitled"),
      location: String(e.location ?? ""),
      start,
      end: Number.isFinite(end) ? end : start,
      allDay: Boolean(e.allDay),
      rrule: null,
      exdates: /* @__PURE__ */ new Set(),
      recurrenceId: null
    };
  }).filter(Boolean);
}

// src/tiles/glance.js
var C2 = 50;
function miniDial(style) {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const major = i % 5 === 0;
    return `<line class="t${major ? " M" : ""}" x1="${C2}" y1="${major ? 7.5 : 8.6}" x2="${C2}" y2="${4.6}" transform="rotate(${i * 6} ${C2} ${C2})"/>`;
  }).join("");
  const nums = Array.from({ length: 12 }, (_, i) => {
    const h = i + 1;
    const a = h * Math.PI / 6;
    return `<text x="${(C2 + Math.sin(a) * 33).toFixed(2)}" y="${(C2 - Math.cos(a) * 33).toFixed(2)}" text-anchor="middle" dominant-baseline="central">${h}</text>`;
  }).join("");
  return `<svg class="dial" viewBox="0 0 100 100" aria-hidden="true">
    <circle class="plate" cx="50" cy="50" r="48"/>
    ${ticks}${nums}
    ${style === "lollipop" ? lollipopHands({ hour: 24, minute: 36, second: 34, tail: 8, weight: 1.45, classes: { hour: "hr", minute: "mn", second: "sc" } }) : `<g class="h hr"><line x1="50" y1="50" x2="50" y2="44"/><line class="w" x1="50" y1="44" x2="50" y2="27"/></g>
    <g class="h mn"><line x1="50" y1="50" x2="50" y2="44"/><line class="w" x1="50" y1="44" x2="50" y2="13"/></g>
    <g class="h sc"><line x1="50" y1="58" x2="50" y2="8"/></g>
    <circle class="hub" cx="50" cy="50" r="2.4"/><circle class="pin" cx="50" cy="50" r="0.9"/>`}
  </svg>`;
}
var BezelGlance = class extends BezelElement {
  static attributes = [...WEATHER_ATTRIBUTES, "events", "ics", "max-events", "hide-weather", "hands"];
  static defaultTheme = "mist";
  static themes = {
    mist: { surface: "#B9C6CE", ink: "#0F1316", accent: "#FFFFFF", soft: "#DCE3E8", hand: "#0F1316" },
    orchid: { surface: "#D98CF2", ink: "#160F1A", accent: "#4A35D4", soft: "#EBC4F8", hand: "#160F1A" },
    sand: { surface: "#E9DCC6", ink: "#1E1913", accent: "#C2410C", soft: "#F5EDE0", hand: "#1E1913" },
    slate: { surface: "#1C2127", ink: "#EEF1F4", accent: "#7CC4FF", soft: "#2B323A", hand: "#EEF1F4" }
  };
  static styles = (
    /* css */
    `
    .screen { background: radial-gradient(120% 100% at 20% 0%, color-mix(in srgb, var(--_surface), #fff 10%), var(--_surface) 60%); }
    .g { position: absolute; inset: 0; display: grid; grid-template: 1fr auto / 1fr 1fr; gap: 3cqw 5cqw; padding: calc(8cqw + var(--_safe)); }
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
  `
  );
  #weather = new WeatherSource(this);
  #rawEvents = null;
  #icsTimer = 0;
  #icsRequest = 0;
  connected() {
    if (!this.flag("hide-weather")) this.#weather.start();
    this.#loadEvents();
  }
  disconnected() {
    this.#weather.stop();
    clearTimeout(this.#icsTimer);
  }
  attributeChanged(name) {
    if (WEATHER_ATTRIBUTES.includes(name) && name !== "refresh") this.#weather.start();
    if (name === "hide-weather") this.flag("hide-weather") ? this.#weather.stop() : this.#weather.start();
    if (name === "events" || name === "ics") this.#loadEvents();
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
    const json = this.getAttribute("events");
    if (json) {
      try {
        this.#rawEvents = normaliseEvents(JSON.parse(json));
      } catch {
        console.warn("[bezel] The events attribute is not valid JSON.");
        this.#rawEvents = [];
      }
      this.invalidate();
      return;
    }
    const url = this.getAttribute("ics");
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
    this.#icsTimer = setTimeout(() => this.#loadEvents(), 15 * 6e4);
  }
  get tickRate() {
    return this.reducedMotion ? "second" : "frame";
  }
  #todaysEvents(z) {
    if (!this.#rawEvents) return null;
    const dayStart = zonedToUtc(z.year, z.month, z.day, 0, 0, 0, this.timeZone);
    const dayEnd = zonedToUtc(z.year, z.month, z.day + 1, 0, 0, 0, this.timeZone);
    const max = Math.max(1, parseInt(this.getAttribute("max-events"), 10) || 3);
    return expandEvents(this.#rawEvents, dayStart, dayEnd).filter((e) => e.end > z.ms || e.allDay && e.end > dayStart).slice(0, max);
  }
  /** Short, never-clipped label: the start time, or "Now · until 11:30" while it runs. */
  #when(e, z) {
    if (e.allDay) return tr(this.locale, "allDay");
    const opts = { hour: "numeric", minute: "2-digit", hour12: this.hour12, timeZone: this.timeZone };
    let f2;
    try {
      f2 = new Intl.DateTimeFormat(this.locale, opts);
    } catch {
      f2 = new Intl.DateTimeFormat("en-GB", opts);
    }
    if (e.start <= z.ms && e.end > z.ms) return tr(this.locale, "nowUntil", { t: f2.format(e.end) });
    return f2.format(e.start);
  }
  template(z) {
    const n = names(this.locale);
    const events = this.#todaysEvents(z);
    let lower;
    if (events) {
      lower = events.length ? `<div class="agenda">${events.map((e) => `<div class="ev${e.start <= z.ms && e.end > z.ms && !e.allDay ? " now" : ""}"><span class="when">${esc(this.#when(e, z))}</span><span class="what">${esc(e.title)}</span></div>`).join("")}</div>` : `<div class="agenda"><span class="none">${esc(tr(this.locale, "nothingElse"))}</span></div>`;
    } else {
      const doy = dayOfYear(z.year, z.month, z.day);
      const total = daysInYear(z.year);
      const pct = Math.round(doy / total * 100);
      lower = `<div class="year">
        <span class="wk">${esc(tr(this.locale, "week", { n: isoWeek(z.year, z.month, z.day) }))}</span>
        <span class="big num">${pct}%</span>
        <div class="bar"><i style="inline-size:${(doy / total * 100).toFixed(2)}%"></i></div>
        <span class="lbl">${esc(tr(this.locale, "dayOf", { d: doy, n: total }))}</span>
      </div>`;
    }
    let wx;
    if (this.flag("hide-weather")) {
      wx = `<div class="wx"><span class="place"><span>${esc(n.monthLong[z.month])}</span></span><span class="temp num">${isoWeek(z.year, z.month, z.day)}</span><span class="cond">${esc(tr(this.locale, "weekOfYear"))}</span></div>`;
    } else {
      const w = this.#weather.data;
      const deg = (v) => v == null ? "--" : `${Math.round(v)}\xB0`;
      const place = w?.place || this.getAttribute("location") || "";
      wx = `<div class="wx">
        <span class="place">${icons.arrow()}<span>${esc(place)}</span>${w?.sample ? `<span class="sample">${esc(tr(this.locale, "sample"))}</span>` : ""}</span>
        ${w ? `<span class="temp num">${deg(w.temperature)}</span>
             <span class="cond">${skyIcon(w.sky, w.isDay)}<span>${esc(condition(this.locale, w.condition))}</span></span>
             <span class="hl">${esc(highLow(this.locale, deg(w.high), deg(w.low)))}</span>` : '<span class="shim big"></span><span class="shim"></span><span class="shim short"></span>'}
      </div>`;
    }
    return `<div class="g" aria-hidden="true">
      <div class="date"><span class="md"><b>${esc(n.weekdayShort[z.weekday].replace(".", ""))}</b> ${esc(n.monthShort[z.month].replace(".", ""))}</span><span class="dd">${z.day}</span></div>
      <div class="clock">${miniDial(handStyle(this.getAttribute("hands")))}</div>
      ${lower}
      ${wx}
    </div>`;
  }
  #lastMinute = -1;
  update(z, first) {
    const a = handAngles(z, { smooth: this.tickRate === "frame" });
    this.$(".hr")?.setAttribute("transform", `rotate(${a.hour.toFixed(3)} 50 50)`);
    this.$(".mn")?.setAttribute("transform", `rotate(${a.minute.toFixed(3)} 50 50)`);
    this.$(".sc")?.setAttribute("transform", `rotate(${a.second.toFixed(3)} 50 50)`);
    if (!first && z.minutes !== this.#lastMinute && this.#rawEvents) this.invalidate();
    this.#lastMinute = z.minutes;
  }
  describe(z) {
    const date = new Intl.DateTimeFormat(this.locale, { dateStyle: "full", timeZone: "UTC" }).format(Date.UTC(z.year, z.month, z.day));
    const w = this.#weather.data;
    return `${date}${w ? `. ${Math.round(w.temperature)} degrees and ${w.condition.toLowerCase()}${w.place ? ` in ${w.place}` : ""}` : ""}`;
  }
};
define("bezel-glance", BezelGlance);

// src/tiles/poster.js
var BezelPoster = class extends BezelElement {
  static attributes = ["week-start", "month", "no-highlight"];
  static defaultFrame = "none";
  static defaultTheme = "noir";
  static themes = {
    noir: { surface: "#000000", ink: "#FFFFFF", accent: "#FF4D2E", rule: "rgba(255,255,255,.22)" },
    paper: { surface: "#F7F7F5", ink: "#0B0B0B", accent: "#E5322D", rule: "rgba(0,0,0,.16)" },
    signal: { surface: "#E5322D", ink: "#FFFFFF", accent: "#111111", rule: "rgba(255,255,255,.3)" },
    bone: { surface: "#E8E4DA", ink: "#1C1B19", accent: "#2346D8", rule: "rgba(0,0,0,.16)" }
  };
  static styles = (
    /* css */
    `
    /* Bezel thickness is a share of the tile's width, and the poster is wider than it is tall.
       Three quarters of the usual width share gives the same bezel as a square tile of the same height. */
    :host { aspect-ratio: var(--bezel-aspect, 4 / 3); --_rim-r: var(--bezel-radius, 4cqw); --_bezel-pad: var(--bezel-thickness, 1.275cqw); }
    .frame--none .screen { border-radius: var(--_rim-r); }
    .p { position: absolute; inset: 0; display: grid; grid-template-rows: auto minmax(0, 1fr); padding: 4.2cqw 2.4cqw 2.4cqw; overflow: hidden; }
    .title { justify-self: end; font-size: 4cqw; font-weight: 700; letter-spacing: -0.02em; padding-inline-end: 6cqw; margin-block-end: 2cqh; font-variant-numeric: lining-nums; }
    .cols { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); min-block-size: 0; container-type: size; }
    .col { display: grid; grid-template-rows: repeat(var(--rows), minmax(0, 1fr)); border-inline-start: max(1px, 0.14cqw) solid var(--_rule); padding-inline-start: 0.5cqw; min-inline-size: 0; }
    .col:first-child { border-inline-start-color: transparent; }
    .c { font-size: var(--fs); font-weight: 700; line-height: .84; letter-spacing: -0.05em; align-self: end; white-space: nowrap;
         font-variant-numeric: lining-nums proportional-nums; font-feature-settings: "lnum" 1, "pnum" 1; }
    .c.h { letter-spacing: -0.02em; }
    .c.today { color: var(--_accent); }
  `
  );
  get tickRate() {
    return "minute";
  }
  template(z) {
    const pinned = parseMonth(this.getAttribute("month"));
    const year = pinned?.year ?? z.year;
    const month = pinned?.month ?? z.month;
    const weekStart = parseWeekStart(this.getAttribute("week-start"), this.locale);
    const n = names(this.locale);
    const weeks = monthGrid(year, month, { weekStart, fillAdjacent: false });
    const rows = weeks.length + 1;
    const highlight = !this.flag("no-highlight") && year === z.year && month === z.month;
    const fs = `min(calc(100cqh / ${rows} * 1.08), 12cqw)`;
    const cols = weekdayOrder(weekStart).map((dow, ci) => {
      const head = `<span class="c h">${esc(n.weekdayNarrow[dow])}</span>`;
      const cells = weeks.map((w) => {
        const c = w[ci];
        if (!c) return '<span class="c"></span>';
        return `<span class="c${highlight && c.day === z.day ? " today" : ""}">${c.day}</span>`;
      }).join("");
      return `<div class="col">${head}${cells}</div>`;
    }).join("");
    return `<div class="p" style="--rows:${rows};--fs:${fs}" aria-hidden="true">
      <div class="title">${year} ${esc(n.monthLong[month])}</div>
      <div class="cols">${cols}</div>
    </div>`;
  }
  describe(z) {
    const pinned = parseMonth(this.getAttribute("month"));
    const label = new Intl.DateTimeFormat(this.locale, { month: "long", year: "numeric", timeZone: "UTC" }).format(
      Date.UTC(pinned?.year ?? z.year, pinned?.month ?? z.month, 15)
    );
    return `Calendar for ${label}`;
  }
};
define("bezel-poster", BezelPoster);

// src/index.js
var version = "2.0.0";
export {
  BezelCalendar,
  BezelClock,
  BezelElement,
  BezelGlance,
  BezelPoster,
  BezelWeather,
  calendar_exports as calendar,
  define,
  ics_exports as ics,
  safeLocale,
  time_exports as time,
  version,
  weather_exports as weather
};
