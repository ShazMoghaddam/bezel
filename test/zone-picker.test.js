// The Studio's city picker: search, matching and the labels it hands to the clock.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CITIES } from '../site/cities.js';
import { search, resolve, findEntry, labelFor, entryText, fold, validZone } from '../site/zone-picker.js';

test('every hand-picked city has a real zone and appears once', () => {
  const seen = new Set();
  for (const [city, country, id] of CITIES) {
    assert.ok(validZone(id), `${city}: ${id}`);
    const key = `${city}|${country}`;
    assert.ok(!seen.has(key), `duplicate ${key}`);
    seen.add(key);
  }
});

test('Munich is found, and runs on Berlin time', () => {
  const [first] = search('mun');
  assert.equal(first.city, 'Munich');
  assert.equal(first.id, 'Europe/Berlin');
  assert.equal(entryText(first), 'Munich, Germany');
});

test('better-known cities come first when the match is equal', () => {
  assert.equal(search('par')[0].city, 'Paris');
  assert.equal(search('man')[0].city, 'Manchester');
});

test('search ignores accents and case, and knows other names', () => {
  assert.equal(search('sao paulo')[0].city, 'São Paulo');
  assert.equal(search('ZURICH')[0].city, 'Zürich');
  assert.equal(search('bombay')[0].city, 'Mumbai');
  assert.equal(search('münchen')[0].city, 'Munich');
});

test('a country lists its cities', () => {
  const cities = search('germany').map((e) => e.city);
  for (const c of ['Berlin', 'Munich', 'Hamburg', 'Frankfurt']) assert.ok(cities.includes(c), c);
  assert.ok(search('united kingdom').some((e) => e.city === 'Manchester'));
});

test('city and country together narrow the list', () => {
  const results = search('san jose costa');
  assert.equal(results[0].city, 'San José');
});

test('hand-picked cities win ties with the rest of the browser list', () => {
  // "Ber" starts Berlin, Bergen and Bern (hand-picked) and Bermuda (browser list only).
  const names = search('ber').map((e) => e.city);
  if (names.includes('Bermuda')) for (const c of ['Berlin', 'Bergen', 'Bern']) assert.ok(names.indexOf(c) < names.indexOf('Bermuda'), c);
  // An empty search lists only hand-picked cities.
  assert.ok(search('').every((e) => e.curated));
});

test('zones outside the hand-picked list can still be found', () => {
  if (typeof Intl.supportedValuesOf !== 'function') return;
  assert.ok(search('aqtobe').some((e) => e.id === 'Asia/Aqtobe'));
});

test('resolve: exact text, a zone id, or a single match', () => {
  assert.equal(resolve('Munich, Germany').city, 'Munich');
  assert.equal(resolve('munich').city, 'Munich');
  assert.equal(resolve('Asia/Tehran').id, 'Asia/Tehran');
  assert.equal(resolve(''), null);
  assert.equal(resolve('zzzz'), undefined);
});

test('findEntry uses the stored label to tell cities on one zone apart', () => {
  assert.equal(findEntry('Europe/Berlin', 'Munich').city, 'Munich');
  assert.equal(findEntry('Europe/Berlin').city, 'Berlin');
  assert.equal(findEntry('America/Sao_Paulo').city, 'São Paulo');
  assert.equal(findEntry(''), null);
});

test('labelFor: only when the zone name would say something else', () => {
  assert.equal(labelFor(findEntry('Europe/Berlin', 'Munich')), 'Munich');
  assert.equal(labelFor(findEntry('Europe/Berlin')), null);
  assert.equal(labelFor(findEntry('America/Sao_Paulo')), 'São Paulo');
  assert.equal(labelFor(null), null);
});

test('fold strips accents and punctuation', () => {
  assert.equal(fold('Port-au-Prince'), 'port au prince');
  assert.equal(fold('Nukuʻalofa'), 'nukualofa');
});
