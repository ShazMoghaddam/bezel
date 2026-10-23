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

test('clock numerals: Roman uses IIII, Persian uses Persian digits', async () => {
  const roman = mount('<bezel-clock variant="classic" numerals="roman"></bezel-clock>');
  await flush();
  const texts = [...roman.shadowRoot.querySelectorAll('.numeral')].map((n) => n.textContent);
  assert.ok(texts.includes('IIII') && texts.includes('XII'));
  roman.remove();
  const fa = mount('<bezel-clock variant="numerals" numerals="persian"></bezel-clock>');
  await flush();
  assert.equal(fa.shadowRoot.querySelector('.numeral').textContent, '۱۲');
  fa.remove();
});

test('classic clock shows a second time zone dial in place of the 6', async () => {
  const el = mount('<bezel-clock variant="classic" second-timezone="Asia/Tokyo" timezone="Europe/London"></bezel-clock>');
  await flush();
  const city = el.shadowRoot.querySelector('.city');
  assert.ok(city.textContent.startsWith('TOKYO'));
  // Tokyo is always ahead of London, by 8 or 9 hours depending on British Summer Time.
  assert.match(city.querySelector('.off').textContent, /^\+(8|9)h$/);
  assert.ok(el.shadowRoot.querySelector('.sub .arm'), 'slim tapered hands');
  const nums = [...el.shadowRoot.querySelectorAll('.numeral')].map((n) => n.textContent);
  assert.ok(!nums.includes('6'));
  assert.match(el.getAttribute('aria-label'), /in Tokyo/);
  el.remove();
});

test('night-theme applies during night hours', async () => {
  const el = mount('<bezel-clock theme="porcelain" night-theme="midnight" night-hours="0-24"></bezel-clock>');
  await flush();
  assert.equal(el.themeName, 'midnight');
  el.setAttribute('night-hours', '0-0');
  await flush();
  assert.equal(el.themeName, 'porcelain');
  el.remove();
});

test('clock hands: lollipop design keeps time, colours and seconds settings', async () => {
  const el = mount('<bezel-clock variant="classic" timezone="Europe/London"></bezel-clock>');
  await flush();
  // The original design is still the default.
  assert.equal(el.shadowRoot.querySelector('.lp'), null);
  assert.ok(el.shadowRoot.querySelector('.hub'));
  el.setAttribute('hands', 'lollipop');
  el.setAttribute('theme', 'midnight');
  await flush();
  const root = el.shadowRoot;
  for (const cls of ['.hour', '.minute', '.second']) {
    assert.match(root.querySelector(cls).getAttribute('transform'), /^rotate\(/, cls);
  }
  assert.ok(root.querySelector('.second circle'), 'seconds hand ends in a dot');
  assert.ok(root.querySelector('.lp-pivot') && root.querySelector('.lp-pin'));
  // Theme is untouched by the switch, and the hands read the shared --_hand variable.
  assert.equal(el.themeName, 'midnight');
  assert.match(root.querySelector('style').textContent, /\.lp-arm, \.lp-pivot \{ fill: var\(--_hand\)/);
  el.setAttribute('hide-seconds', '');
  await flush();
  assert.equal(root.querySelector('.second'), null);
  assert.ok(root.querySelector('.lp-pivot'));
  el.setAttribute('hands', 'nonsense');
  await flush();
  assert.equal(root.querySelector('.lp'), null, 'unknown values fall back to the original hands');
  el.remove();
});

test('glance mini dial supports both hand designs and a hand colour', async () => {
  const el = mount('<bezel-glance hide-weather hands="lollipop"></bezel-glance>');
  await flush();
  const root = el.shadowRoot;
  assert.ok(root.querySelector('.hr.lp') && root.querySelector('.mn.lp') && root.querySelector('.sc.lp-sec'));
  assert.match(root.querySelector('.hr').getAttribute('transform'), /^rotate\(/);
  assert.match(root.querySelector('style').textContent, /--_hand: var\(--bezel-hand, #0F1316\)/);
  el.removeAttribute('hands');
  await flush();
  assert.ok(root.querySelector('.hr.h'));
  el.remove();
});

test('device frame has no light rim outside the black bezel', async () => {
  const el = mount('<bezel-clock></bezel-clock>');
  await flush();
  const css = el.shadowRoot.querySelector('style').textContent;
  const device = /\.frame--device \{([^}]*)\}/.exec(css)[1];
  assert.doesNotMatch(device, /padding|background|inset/);
  assert.match(css, /--_rim-pad: 0px/);
  el.remove();
});

test('weather sky is drawn as SVG for every condition, day and night', async () => {
  const el = mount('<bezel-weather location="Nowhere" units="metric" still></bezel-weather>');
  await new Promise((r) => setTimeout(r, 20));
  const base = { ...el.weather, sample: false, place: 'Oslo', temperature: 4, condition: 'x' };
  const expect = { clear: '.sun', partly: '.clouds', cloudy: '.clouds', fog: '.fog', drizzle: '.rain.light', rain: '.rain', snow: '.snowfall', storm: '.rain' };
  for (const [sky, sel] of Object.entries(expect)) {
    el.weather = { ...base, sky, isDay: true };
    await flush();
    assert.ok(el.shadowRoot.querySelector('svg.art'), `${sky} has svg art`);
    assert.ok(el.shadowRoot.querySelector(`.art ${sel}`), `${sky} draws ${sel}`);
  }
  el.weather = { ...base, sky: 'clear', isDay: false };
  await flush();
  assert.ok(el.shadowRoot.querySelector('.art .moon') && el.shadowRoot.querySelector('.art .stars'));
  assert.equal(el.shadowRoot.querySelector('.art .sun'), null);
  el.remove();
});

test('rounder corners add a safe inset, and the numerals date can follow it', async () => {
  const el = mount('<bezel-clock variant="numerals"></bezel-clock>');
  await flush();
  const css = el.shadowRoot.querySelector('style').textContent;
  assert.match(css, /--_safe: max\(0cqw, calc\(\(var\(--_rim-r\) - 22cqw\)/);
  const date = el.shadowRoot.querySelector('.corner-date');
  assert.ok(date, 'corner date is HTML');
  assert.match(date.textContent, /\d/);
  el.setAttribute('variant', 'classic');
  await flush();
  assert.equal(el.shadowRoot.querySelector('.corner-date'), null);
  el.remove();
});
