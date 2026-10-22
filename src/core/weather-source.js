import { resolveAndFetch, defaultUnits } from './weather.js';

export const WEATHER_ATTRIBUTES = ['latitude', 'longitude', 'location', 'units', 'refresh'];

/**
 * Keeps one tile's weather fresh. Used by <bezel-weather> and <bezel-glance>.
 * Tiles can bypass the network entirely by assigning `tile.weather = {...}`.
 */
export class WeatherSource {
  data = null;
  #host;
  #timer = 0;
  #request = 0;
  #manual = false;

  constructor(host) {
    this.#host = host;
  }

  get units() {
    const u = this.#host.getAttribute('units');
    return u === 'imperial' || u === 'metric' ? u : defaultUnits(this.#host.locale);
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
      latitude: h.getAttribute('latitude'),
      longitude: h.getAttribute('longitude'),
      location: h.getAttribute('location'),
      units: this.units,
    });
    if (id !== this.#request || this.#manual) return; // a newer request or manual data won
    this.data = data;
    h.invalidate();
    h.dispatchEvent(new CustomEvent('bezel-weather', { detail: data, bubbles: true, composed: true }));

    const minutes = Math.max(5, parseFloat(h.getAttribute('refresh')) || 15);
    this.#timer = setTimeout(() => this.load(), data.sample ? 60_000 : minutes * 60_000);
  }
}
