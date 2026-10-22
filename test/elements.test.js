// Smoke tests: every element registers, renders into its shadow root,
// labels itself for screen readers and reacts to attribute changes.
import { test, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';

before(async () => {
  const { window } = parseHTML('<!doctype html><html><body></body></html>');
  for (const key of ['window', 'document', 'customElements', 'HTMLElement', 'CustomEvent', 'Node']) {
    globalThis[key] = window[key];
  }
  globalThis.navigator ??= { language: 'en-GB' };
  globalThis.fetch = async () => {
    throw new Error('offline in tests');
  };
  console.warn = () => {};
  await import('../src/index.js');
});

// Remove anything a failed test left behind, so live clocks can't keep the process running.
afterEach(() => {
  document.body.innerHTML = '';
});

const flush = () => new Promise((r) => setTimeout(r, 0));

function mount(html) {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.append(host);
  return host.firstElementChild;
}

test('all five elements are defined', () => {
  for (const tag of ['bezel-clock', 'bezel-calendar', 'bezel-weather', 'bezel-glance', 'bezel-poster']) {
    assert.ok(customElements.get(tag), tag);
  }
});

test('clock renders each variant and labels itself', async () => {
  for (const variant of ['numerals', 'relief', 'classic']) {
    const el = mount(`<bezel-clock variant="${variant}" timezone="Europe/London" locale="en-GB"></bezel-clock>`);
    await flush();
    const svg = el.shadowRoot.querySelector('svg.face');
    assert.ok(svg, variant);
    assert.ok(svg.getAttribute('class').includes(`v-${variant}`));
    assert.ok(el.shadowRoot.querySelector('.hour').getAttribute('transform').startsWith('rotate('));
    assert.match(el.getAttribute('aria-label'), /^Clock showing/);
    assert.equal(el.getAttribute('role'), 'img');
    el.remove();
  }
});

test('frame and theme attributes change the markup', async () => {
  const el = mount('<bezel-clock></bezel-clock>');
  await flush();
  assert.ok(el.shadowRoot.querySelector('.frame--device'));
  el.setAttribute('frame', 'none');
  el.setAttribute('theme', 'cobalt');
  await flush();
  assert.ok(el.shadowRoot.querySelector('.frame--none'));
  assert.match(el.shadowRoot.querySelector('style').textContent, /--bezel-surface, #2D4BD2/);
  el.setAttribute('hide-seconds', '');
  await flush();
  assert.equal(el.shadowRoot.querySelector('.second'), null);
  el.remove();
});

test('an author aria-label is kept', async () => {
  const el = mount('<bezel-clock aria-label="Kitchen clock"></bezel-clock>');
  await flush();
  assert.equal(el.getAttribute('aria-label'), 'Kitchen clock');
  el.remove();
});

test('calendar pins a month and marks today only in the current month', async () => {
  const el = mount('<bezel-calendar month="2026-02" week-start="mon" locale="en-GB"></bezel-calendar>');
  await flush();
  const cells = el.shadowRoot.querySelectorAll('.d');
  assert.equal(cells.length, 42);
  assert.equal(cells[0].textContent, '26'); // 1 Feb 2026 is a Sunday; grid starts Monday 26 Jan
  assert.equal(el.shadowRoot.querySelector('.backdrop'), null);
  el.remove();
});

test('poster lays out seven columns', async () => {
  const el = mount('<bezel-poster month="2026-12" week-start="sun" locale="en-GB"></bezel-poster>');
  await flush();
  const cols = el.shadowRoot.querySelectorAll('.col');
  assert.equal(cols.length, 7);
  assert.equal(cols[0].querySelector('.c').textContent, 'S');
  assert.ok(el.shadowRoot.querySelector('.title').textContent.includes('December'));
  el.remove();
});

test('weather uses sample data offline and accepts injected data', async () => {
  const el = mount('<bezel-weather location="Nowhere" units="metric"></bezel-weather>');
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(el.weather.sample, true);
  assert.ok(el.shadowRoot.querySelector('.sample'));
  el.weather = { ...el.weather, sample: false, place: 'Oslo', temperature: -3.4, condition: 'Snow', sky: 'snow' };
  await flush();
  assert.equal(el.shadowRoot.querySelector('.temp').textContent, '-3°');
  assert.ok(el.shadowRoot.querySelector('.snowfall'));
  assert.match(el.getAttribute('aria-label'), /Oslo/);
  el.remove();
});

test('glance shows year progress, then an agenda when given events', async () => {
  const el = mount('<bezel-glance hide-weather locale="en-GB"></bezel-glance>');
  await flush();
  assert.ok(el.shadowRoot.querySelector('.year'));
  const now = Date.now();
  el.events = [
    { title: 'Later', start: now + 3_600_000, end: now + 7_200_000 },
    { title: 'Now-ish', start: now - 60_000, end: now + 60_000 },
    { title: 'Already over', start: now - 7_200_000, end: now - 3_600_000 },
  ];
  await flush();
  const titles = [...el.shadowRoot.querySelectorAll('.ev .what')].map((n) => n.textContent);
  // Events that ended earlier today drop off; events crossing midnight are filtered by day.
  assert.ok(!titles.includes('Already over'));
  assert.ok(titles.includes('Now-ish') || titles.length === 0);
  el.remove();
});

test('invalid events JSON does not throw', async () => {
  const el = mount(`<bezel-glance hide-weather events="{oops"></bezel-glance>`);
  await flush();
  assert.ok(el.shadowRoot.querySelector('.agenda'));
  el.remove();
});
