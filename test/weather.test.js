import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalise, describeCode, defaultUnits, aqiBand, nextSunEvent, isoClock,
  getWeather, resolveAndFetch, sampleWeather, _resetWeatherCache,
} from '../src/core/weather.js';

// Shaped like real Open-Meteo responses.
const FORECAST = {
  latitude: 51.5,
  longitude: -0.12,
  utc_offset_seconds: 3600,
  timezone: 'Europe/London',
  current: {
    time: '2026-10-22T13:00',
    interval: 900,
    temperature_2m: 14.2,
    apparent_temperature: 12.8,
    relative_humidity_2m: 76,
    weather_code: 61,
    wind_speed_10m: 18.4,
    wind_direction_10m: 230,
    is_day: 1,
  },
  daily: {
    time: ['2026-10-22', '2026-10-23'],
    temperature_2m_max: [15.6, 13.1],
    temperature_2m_min: [9.4, 8.2],
    sunrise: ['2026-10-22T07:31', '2026-10-23T07:33'],
    sunset: ['2026-10-22T17:52', '2026-10-23T17:50'],
  },
};
const AIR = { current: { time: '2026-10-22T13:00', european_aqi: 24, us_aqi: 31 } };

let realFetch;
let calls;
beforeEach(() => {
  _resetWeatherCache();
  realFetch = globalThis.fetch;
  calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    const body = String(url).includes('air-quality') ? AIR : String(url).includes('geocoding') ? { results: [{ name: 'Lisbon', latitude: 38.72, longitude: -9.14 }] } : FORECAST;
    return { ok: true, json: async () => body };
  };
});
afterEach(() => {
  globalThis.fetch = realFetch;
  console.warn = console.constructor.prototype.warn ?? console.warn;
});

test('normalise flattens a forecast', () => {
  const w = normalise(FORECAST, AIR, { units: 'metric', place: 'London' });
  assert.equal(w.temperature, 14.2);
  assert.equal(w.condition, 'Light Rain');
  assert.equal(w.sky, 'rain');
  assert.equal(w.isDay, true);
  assert.equal(w.high, 15.6);
  assert.equal(w.aqi, 24);
  assert.equal(w.aqiScale, 'eu');
  assert.equal(normalise(FORECAST, AIR, { units: 'imperial' }).aqi, 31);
  assert.equal(normalise(FORECAST, null).aqi, null);
});

test('weather codes, units and AQI bands', () => {
  assert.equal(describeCode(0).sky, 'clear');
  assert.equal(describeCode(95).sky, 'storm');
  assert.equal(describeCode(1234).label, 'Unknown');
  assert.equal(defaultUnits('en-US'), 'imperial');
  assert.equal(defaultUnits('en-GB'), 'metric');
  assert.equal(aqiBand(24, 'eu'), 'Fair');
  assert.equal(aqiBand(31, 'us'), 'Good');
});

test('next sun event and clock text', () => {
  const w = normalise(FORECAST, AIR);
  assert.deepEqual(nextSunEvent(w), { kind: 'sunset', time: '2026-10-22T17:52' });
  assert.equal(nextSunEvent(w, '2026-10-22T19:00').kind, 'sunrise');
  assert.equal(isoClock('2026-10-22T17:52', true), '5:52');
  assert.equal(isoClock('2026-10-22T07:31', false), '07:31');
});

test('requests for the same place are shared', async () => {
  await Promise.all([
    getWeather({ latitude: 51.5, longitude: -0.12 }),
    getWeather({ latitude: 51.5, longitude: -0.12 }),
    getWeather({ latitude: 51.5001, longitude: -0.1201 }),
  ]);
  assert.equal(calls.filter((u) => u.includes('/forecast')).length, 1);
  assert.match(calls[0], /timezone=auto/);
});

test('imperial requests ask for Fahrenheit and mph', async () => {
  await getWeather({ latitude: 40.7, longitude: -74, units: 'imperial' });
  assert.match(calls[0], /temperature_unit=fahrenheit/);
  assert.match(calls[0], /wind_speed_unit=mph/);
});

test('place names are geocoded', async () => {
  const w = await resolveAndFetch({ location: 'Lisbon', units: 'metric' });
  assert.equal(w.place, 'Lisbon');
  assert.ok(calls.some((u) => u.includes('geocoding') && u.includes('Lisbon')));
  assert.ok(calls.some((u) => u.includes('latitude=38.72')));
});

test('network failure falls back to labelled sample data', async () => {
  const warn = console.warn;
  console.warn = () => {};
  globalThis.fetch = async () => {
    throw new Error('offline');
  };
  const w = await getWeather({ latitude: 1, longitude: 2, place: 'Nowhere' });
  console.warn = warn;
  assert.equal(w.sample, true);
  assert.equal(w.place, 'Nowhere');
  assert.equal(sampleWeather({ units: 'imperial' }).temperature, 57);
});
