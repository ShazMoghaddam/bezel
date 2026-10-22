/**
 * Live weather from Open-Meteo (https://open-meteo.com): free, no API key.
 *
 * Requests are shared: ten tiles showing London make one network call.
 * If the network fails, tiles fall back to clearly labelled sample data
 * so the layout never collapses.
 */

const FORECAST = 'https://api.open-meteo.com/v1/forecast';
const AIR = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODE = 'https://geocoding-api.open-meteo.com/v1/search';

export const DEFAULT_PLACE = { name: 'London', latitude: 51.5072, longitude: -0.1276 };
const TTL = 15 * 60_000;
const cache = new Map();
const geoCache = new Map();

/** WMO weather codes grouped into the skies the tiles know how to paint. */
const WMO = {
  0: ['Clear', 'clear'],
  1: ['Mostly Clear', 'clear'],
  2: ['Partly Cloudy', 'partly'],
  3: ['Overcast', 'cloudy'],
  45: ['Fog', 'fog'],
  48: ['Freezing Fog', 'fog'],
  51: ['Light Drizzle', 'drizzle'],
  53: ['Drizzle', 'drizzle'],
  55: ['Heavy Drizzle', 'drizzle'],
  56: ['Freezing Drizzle', 'drizzle'],
  57: ['Freezing Drizzle', 'drizzle'],
  61: ['Light Rain', 'rain'],
  63: ['Rain', 'rain'],
  65: ['Heavy Rain', 'rain'],
  66: ['Freezing Rain', 'rain'],
  67: ['Freezing Rain', 'rain'],
  71: ['Light Snow', 'snow'],
  73: ['Snow', 'snow'],
  75: ['Heavy Snow', 'snow'],
  77: ['Snow Grains', 'snow'],
  80: ['Showers', 'rain'],
  81: ['Showers', 'rain'],
  82: ['Heavy Showers', 'rain'],
  85: ['Snow Showers', 'snow'],
  86: ['Snow Showers', 'snow'],
  95: ['Thunderstorm', 'storm'],
  96: ['Thunderstorm', 'storm'],
  99: ['Thunderstorm', 'storm'],
};

/** @returns {{label:string, sky:'clear'|'partly'|'cloudy'|'fog'|'drizzle'|'rain'|'snow'|'storm'}} */
export function describeCode(code) {
  const [label, sky] = WMO[code] ?? ['Unknown', 'cloudy'];
  return { label, sky };
}

/** Regions that use Fahrenheit and mph by default. */
const IMPERIAL_REGIONS = new Set(['US', 'LR', 'MM', 'BS', 'BZ', 'KY', 'PW', 'FM', 'MH']);

export function defaultUnits(locale = 'en-GB') {
  try {
    const region = new Intl.Locale(locale).maximize().region;
    return IMPERIAL_REGIONS.has(region) ? 'imperial' : 'metric';
  } catch {
    return 'metric';
  }
}

/** European AQI for metric users, US AQI for imperial users. */
export function aqiBand(value, scale = 'eu') {
  if (value == null || Number.isNaN(value)) return '';
  const bands =
    scale === 'us'
      ? [[50, 'Good'], [100, 'Moderate'], [150, 'Unhealthy for some'], [200, 'Unhealthy'], [300, 'Very unhealthy'], [Infinity, 'Hazardous']]
      : [[20, 'Good'], [40, 'Fair'], [60, 'Moderate'], [80, 'Poor'], [100, 'Very poor'], [Infinity, 'Extremely poor']];
  return bands.find(([max]) => value <= max)[1];
}

/** Turns Open-Meteo responses into the flat shape every tile reads. */
export function normalise(forecast, air, { units = 'metric', place = '' } = {}) {
  const c = forecast.current ?? {};
  const daily = forecast.daily ?? {};
  const { label, sky } = describeCode(c.weather_code);
  const scale = units === 'imperial' ? 'us' : 'eu';
  const aqi = air?.current ? air.current[scale === 'us' ? 'us_aqi' : 'european_aqi'] : null;
  return {
    sample: false,
    place,
    units,
    time: c.time ?? null, // location-local ISO, e.g. "2026-10-22T13:00"
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
    timezone: forecast.timezone ?? null,
  };
}

/** Plausible weather used when the network is unavailable. Always flagged as sample. */
export function sampleWeather({ units = 'metric', place = DEFAULT_PLACE.name } = {}) {
  const f = (cDeg) => (units === 'imperial' ? Math.round(cDeg * 1.8 + 32) : cDeg);
  const today = new Date();
  const iso = (h, m) =>
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return {
    sample: true,
    place,
    units,
    time: null,
    temperature: f(14),
    apparent: f(12),
    humidity: 76,
    wind: units === 'imperial' ? 7 : 11,
    windDirection: 240,
    code: 2,
    condition: 'Partly Cloudy',
    sky: 'partly',
    isDay: true,
    high: f(16),
    low: f(9),
    sunrise: [iso(7, 31)],
    sunset: [iso(17, 52)],
    aqi: units === 'imperial' ? 21 : 18,
    aqiScale: units === 'imperial' ? 'us' : 'eu',
    utcOffsetSeconds: 0,
    timezone: null,
  };
}

async function getJSON(url, signal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Looks up coordinates for a place name. Cached for the page's lifetime. */
export function geocode(name) {
  const key = name.trim().toLowerCase();
  if (!geoCache.has(key)) {
    const url = `${GEOCODE}?name=${encodeURIComponent(name.trim())}&count=1&format=json`;
    geoCache.set(
      key,
      getJSON(url)
        .then((json) => {
          const r = json.results?.[0];
          if (!r) throw new Error(`No place called "${name}"`);
          return { name: r.name, latitude: r.latitude, longitude: r.longitude, timezone: r.timezone };
        })
        .catch((err) => {
          geoCache.delete(key);
          throw err;
        }),
    );
  }
  return geoCache.get(key);
}

/**
 * Fetches current conditions for a place.
 * @param {{latitude:number, longitude:number, units?:'metric'|'imperial', place?:string}} opts
 */
export function getWeather({ latitude, longitude, units = 'metric', place = '' }) {
  const key = `${latitude.toFixed(3)},${longitude.toFixed(3)},${units}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < TTL) return hit.promise;

  const imperial = units === 'imperial';
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
    timezone: 'auto',
    forecast_days: '2',
    temperature_unit: imperial ? 'fahrenheit' : 'celsius',
    wind_speed_unit: imperial ? 'mph' : 'kmh',
  });
  const airParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'european_aqi,us_aqi',
  });

  const promise = Promise.all([
    getJSON(`${FORECAST}?${params}`),
    getJSON(`${AIR}?${airParams}`).catch(() => null),
  ])
    .then(([forecast, air]) => normalise(forecast, air, { units, place }))
    .catch((err) => {
      cache.delete(key);
      console.warn(`[bezel] Weather unavailable (${err.message}). Showing sample data.`);
      return sampleWeather({ units, place });
    });

  cache.set(key, { at: Date.now(), promise });
  return promise;
}

/**
 * Resolves a tile's attributes into a weather request.
 * Accepts latitude/longitude, a place name to geocode, or neither (London).
 */
export async function resolveAndFetch({ latitude, longitude, location, units }) {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return getWeather({ latitude: lat, longitude: lon, units, place: location || '' });
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

/** The next sunrise or sunset after the location's current time. */
export function nextSunEvent(w, nowIso) {
  const now = nowIso ?? w.time ?? '';
  const events = [
    ...w.sunrise.map((t) => ({ kind: 'sunrise', time: t })),
    ...w.sunset.map((t) => ({ kind: 'sunset', time: t })),
  ].sort((a, b) => a.time.localeCompare(b.time));
  return events.find((e) => e.time > now) ?? events.find((e) => e.kind === 'sunset') ?? null;
}

/** "17:52" or "5:52" from a location-local ISO string. */
export function isoClock(iso, hour12) {
  const m = /T(\d{2}):(\d{2})/.exec(iso ?? '');
  if (!m) return '--:--';
  const h = Number(m[1]);
  return hour12 ? `${h % 12 || 12}:${m[2]}` : `${m[1]}:${m[2]}`;
}

/** Test hook: clears the shared caches. */
export function _resetWeatherCache() {
  cache.clear();
  geoCache.clear();
}
