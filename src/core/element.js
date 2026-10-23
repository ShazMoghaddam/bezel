import { FRAME_CSS } from './frame.js';
import { subscribe, prefersReducedMotion } from './ticker.js';
import { zoned, prefers12h, isValidTimeZone } from './time.js';

const localeCache = new Map();

/** Returns a locale Intl accepts. Browsers sometimes report tags such as "en-US@posix". */
export function safeLocale(tag) {
  if (!tag) return 'en-GB';
  if (localeCache.has(tag)) return localeCache.get(tag);
  let ok = 'en-GB';
  for (const candidate of [tag, String(tag).split(/[@.]/)[0].replace('_', '-')]) {
    try {
      ok = Intl.getCanonicalLocales(candidate)[0];
      break;
    } catch {}
  }
  localeCache.set(tag, ok);
  return ok;
}

const COMMON_ATTRIBUTES = ['frame', 'theme', 'dark-theme', 'appearance', 'timezone', 'locale', 'hour-cycle'];
const FRAMES = new Set(['device', 'bezel', 'none']);

/**
 * Base class for every Bezel tile.
 *
 * Subclasses provide:
 *   static attributes      extra observed attributes
 *   static styles          CSS for the tile's content
 *   static themes          { name: { surface, ink, accent, ... } } presets
 *   template(z)            markup for the screen, given zoned time `z`
 *   update(z, firstPaint)  cheap per-tick changes (hands, digits)
 *   get tickRate()         'frame' | 'second' | 'minute' | null
 */
export class BezelElement extends HTMLElement {
  static attributes = [];
  static styles = '';
  static themes = {};
  static defaultTheme = '';
  static defaultFrame = 'device';

  static get observedAttributes() {
    return [...COMMON_ATTRIBUTES, ...this.attributes];
  }

  #queued = false;
  #unsubscribe = null;
  #observer = null;
  #visible = true;
  #connected = false;
  #lastDayKey = '';
  #authorLabel = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.#connected = true;
    if (!this.hasAttribute('role')) this.setAttribute('role', 'img');
    this.#authorLabel = this.hasAttribute('aria-label') && this.dataset.bezelLabel === undefined;
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
    const f = this.getAttribute('frame');
    return FRAMES.has(f) ? f : this.constructor.defaultFrame;
  }

  get timeZone() {
    const tz = this.getAttribute('timezone');
    return tz && isValidTimeZone(tz) ? tz : undefined;
  }

  get locale() {
    return safeLocale(this.getAttribute('locale') || (typeof navigator !== 'undefined' && navigator.language));
  }

  get hour12() {
    const hc = this.getAttribute('hour-cycle');
    if (hc === '12') return true;
    if (hc === '24') return false;
    return prefers12h(this.locale);
  }

  /** The theme chosen with the `theme` attribute, or the tile's default. */
  get themeName() {
    const t = this.getAttribute('theme');
    return t && this.constructor.themes[t] ? t : this.constructor.defaultTheme;
  }

  /** The theme for dark mode, from the `dark-theme` attribute, if it names one. */
  get darkThemeName() {
    const t = this.getAttribute('dark-theme');
    return t && this.constructor.themes[t] ? t : null;
  }

  /** Boolean attribute helper: present and not "false". */
  flag(name) {
    const v = this.getAttribute(name);
    return v !== null && v !== 'false';
  }

  now() {
    return zoned(Date.now(), this.timeZone);
  }

  get tickRate() {
    return 'minute';
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
    const lightDecl = keys.map((k) => `--_${k}: var(--bezel-${k}, ${light[k] ?? dark[k]});`).join('');
    const darkDecl = keys
      .map((k) => `--_${k}: var(--bezel-dark-${k}, ${dark ? dark[k] ?? light[k] : `var(--bezel-${k}, ${light[k]})`});`)
      .join('');
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
    return '';
  }

  update() {}

  /** Accessible description. Subclasses return a sentence. */
  describe() {
    return '';
  }

  #label(z) {
    const text = this.describe(z);
    if (!text || this.#authorLabel || this.getAttribute('aria-label') === text) return;
    this.setAttribute('aria-label', text);
    this.dataset.bezelLabel = '';
  }

  #tick = (ms) => {
    const z = zoned(ms, this.timeZone);
    if (this.#key(z) !== this.#lastDayKey) {
      // Midnight: rebuild for the new day.
      this.render();
      return;
    }
    this.update(z, false);
    if (z.seconds === 0 && z.millis < 1000) this.#label(z);
  };

  #key(z) {
    return `${z.year}-${z.month}-${z.day}`;
  }

  #resubscribe() {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    let rate = this.tickRate;
    if (!rate || !this.#visible) return;
    if (rate === 'frame' && this.reducedMotion) rate = 'second';
    this.#unsubscribe = subscribe(rate, this.#tick);
  }

  #watchVisibility() {
    if (this.#observer || typeof IntersectionObserver === 'undefined') return;
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
}

/** Defines a custom element once, so the library can be loaded twice safely. */
export function define(tag, ctor) {
  if (typeof customElements !== 'undefined' && !customElements.get(tag)) customElements.define(tag, ctor);
}
