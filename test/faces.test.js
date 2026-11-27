// The 2.3 clock faces (Scatter, Dots, Circles, Square, Perimeter, Grammar) and the shared palettes.
import { test, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';

let palettes;
let grammar;
let perimeter;
let shared;

before(async () => {
  const { window } = parseHTML('<!doctype html><html><body></body></html>');
  for (const key of ['window', 'document', 'customElements', 'HTMLElement', 'CustomEvent', 'Node']) {
    globalThis[key] = window[key];
  }
  globalThis.navigator ??= { language: 'en-GB' };
  console.warn = () => {};
  await import('../src/index.js');
  palettes = await import('../src/core/palettes.js');
  grammar = await import('../src/faces/grammar.js');
  perimeter = await import('../src/faces/perimeter.js');
  shared = await import('../src/faces/shared.js');
});

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

const FACES = ['scatter', 'dots', 'circles', 'square', 'perimeter', 'grammar'];

test('every new face renders, labels itself and takes its own default theme', async () => {
  const themes = { scatter: 'moss', dots: 'porcelain', circles: 'porcelain', square: 'rose', perimeter: 'phosphor', grammar: 'graphite' };
  for (const variant of FACES) {
    const el = mount(`<bezel-clock variant="${variant}" timezone="Europe/London" locale="en-GB"></bezel-clock>`);
    await flush();
    assert.ok(el.shadowRoot.querySelector(`.v-${variant}`), variant);
    assert.match(el.getAttribute('aria-label'), /^Clock showing/, variant);
    assert.equal(el.themeName, themes[variant], variant);
    el.remove();
  }
});

test('analog faces turn their hands, in every hand style', async () => {
  for (const variant of ['dots', 'circles', 'square']) {
    for (const hands of ['modern', 'lollipop', 'slender']) {
      const el = mount(`<bezel-clock variant="${variant}" hands="${hands}"></bezel-clock>`);
      await flush();
      const hour = el.shadowRoot.querySelector('.hour');
      assert.ok(hour, `${variant} ${hands}`);
      assert.match(hour.getAttribute('transform'), /^rotate\(/);
      el.remove();
    }
  }
});

test('palettes: twelve colours each, own colours win, and bad values are ignored', () => {
  assert.deepEqual(palettes.PALETTE_NAMES, ['vibrant', 'neon', 'pastel', 'subtle', 'spring', 'summer', 'autumn', 'winter']);
  for (const [name, list] of Object.entries(palettes.PALETTES)) {
    assert.equal(list.length, 12, name);
    assert.equal(new Set(list).size, 12, `${name}: no repeats`);
  }
  assert.deepEqual(palettes.parseColors('#f00, rebeccapurple, rgb(1, 2, 3), url(x), red;}'), ['#f00', 'rebeccapurple', 'rgb(1, 2, 3)']);
  assert.equal(palettes.inkFor('#FFF3B0'), '#111111');
  assert.equal(palettes.inkFor('#2F4B7C'), '#FFFFFF');
  assert.equal(palettes.inkFor('red', 'fallback'), 'fallback');
});

test('circles: nine colours from the palette, numbers at 12, 3, 6 and 9, or none', async () => {
  const el = mount('<bezel-clock variant="circles" palette="autumn"></bezel-clock>');
  await flush();
  const discs = [...el.shadowRoot.querySelectorAll('.disc')];
  assert.equal(discs.length, 9);
  for (const d of discs) assert.ok(palettes.PALETTES.autumn.some((c) => d.getAttribute('style').includes(c)));
  assert.deepEqual([...el.shadowRoot.querySelectorAll('.numeral')].map((n) => n.textContent), ['12', '9', '3', '6']);

  el.setAttribute('numerals', 'roman');
  el.setAttribute('colors', '#111111, #fafafa');
  await flush();
  assert.deepEqual([...el.shadowRoot.querySelectorAll('.numeral')].map((n) => n.textContent), ['XII', 'IX', 'III', 'VI']);
  assert.match(el.shadowRoot.querySelector('.disc').getAttribute('style'), /#111111/);
  // Numbers flip between black and white to suit their circle.
  assert.match(el.shadowRoot.querySelector('.numeral').getAttribute('style'), /#111111/); // 12 sits on #fafafa

  el.setAttribute('numerals', 'none');
  await flush();
  assert.equal(el.shadowRoot.querySelectorAll('.numeral').length, 0);
  el.remove();
});

test('dots: a 5 by 5 grid with eight coloured accents; numerals swap in at 12, 3, 6 and 9', async () => {
  const el = mount('<bezel-clock variant="dots"></bezel-clock>');
  await flush();
  const dots = [...el.shadowRoot.querySelectorAll('.dot')];
  assert.equal(dots.length, 24); // 25 minus the hub
  assert.equal(dots.filter((d) => d.getAttribute('style')).length, 8);
  assert.equal(el.shadowRoot.querySelectorAll('.numeral').length, 0);
  el.setAttribute('numerals', 'western');
  await flush();
  assert.equal(el.shadowRoot.querySelectorAll('.dot').length, 20);
  assert.deepEqual([...el.shadowRoot.querySelectorAll('.numeral')].map((n) => n.textContent).sort(), ['12', '3', '6', '9']);
  el.remove();
});

test('scatter: the time in digits, and a seeded tumble that holds still', async () => {
  const el = mount('<bezel-clock variant="scatter" hour-cycle="24" seed="5"></bezel-clock>');
  await flush();
  const z = el.now();
  const now = el.shadowRoot.querySelector('.now').textContent;
  assert.equal(now, `${String(z.hours).padStart(2, '0')}${String(z.minutes).padStart(2, '0')}`);
  const layout = el.shadowRoot.querySelector('.n').getAttribute('transform');
  assert.equal(el.shadowRoot.querySelectorAll('.n').length, 26);
  el.setAttribute('theme', 'onyx'); // re-renders with the same seed
  await flush();
  assert.equal(el.shadowRoot.querySelector('.n').getAttribute('transform'), layout);
  el.setAttribute('seed', '6');
  await flush();
  assert.notEqual(el.shadowRoot.querySelector('.n').getAttribute('transform'), layout);
  // Plain by default; a palette colours every number.
  assert.equal(el.shadowRoot.querySelector('.n').getAttribute('style'), null);
  el.setAttribute('palette', 'neon');
  await flush();
  assert.match(el.shadowRoot.querySelector('.n').getAttribute('style'), /fill:#/);
  el.remove();
});

test('square: 24 hours and 60 minutes, with the time now picked out', async () => {
  const el = mount('<bezel-clock variant="square"></bezel-clock>');
  await flush();
  const z = el.now();
  assert.equal(el.shadowRoot.querySelectorAll('.hr').length, 24);
  assert.equal(el.shadowRoot.querySelectorAll('.md').length, 60);
  assert.equal(el.shadowRoot.querySelectorAll('.mn').length, 12);
  assert.equal(el.shadowRoot.querySelector('.hr.is-now').dataset.n, String(z.hours));
  assert.equal(el.shadowRoot.querySelector('.md.is-now').dataset.n, String(z.minutes));
  el.remove();
});

test('square geometry: points run evenly round the edge, clockwise from the top', () => {
  const p = (t) => shared.squarePoint(t, 50, 50, 40);
  assert.deepEqual(p(0), { x: 50, y: 10 });
  assert.deepEqual(p(1 / 8), { x: 90, y: 10 });
  assert.deepEqual(p(1 / 4), { x: 90, y: 50 });
  assert.deepEqual(p(1 / 2), { x: 50, y: 90 });
  assert.deepEqual(p(3 / 4), { x: 10, y: 50 });
  assert.equal(Math.round(shared.angleTo(p(1 / 4), 50, 50)), 90);
  assert.equal(Math.round(shared.angleTo(p(1 / 8), 50, 50)), 45);
});

test('perimeter: time in words, the date round the edge and a marker', async () => {
  assert.equal(perimeter.timeInWords(13, 11), 'one eleven');
  assert.equal(perimeter.timeInWords(22, 5), 'ten oh five');
  assert.equal(perimeter.timeInWords(0, 0), "twelve o'clock");
  assert.equal(perimeter.timeInWords(23, 59), 'eleven fifty-nine');

  const el = mount('<bezel-clock variant="perimeter" locale="en-GB"></bezel-clock>');
  await flush();
  const root = el.shadowRoot;
  assert.ok(root.querySelector('.top').textContent.length > 3);
  assert.match(root.querySelector('.left').textContent, /WK \d+ · DAY \d+/);
  assert.equal(root.querySelector('.bottom').textContent, String(el.now().year));
  assert.match(root.querySelector('.marker').getAttribute('transform'), /^translate\(/);
  assert.equal(root.querySelectorAll('.mark').length, 12);
  el.remove();
});

test('grammar: tagged words for any time, and the right number of weeks', () => {
  const words = (h, m) => grammar.timeWords(h, m).map(([w]) => w).join(' ');
  assert.equal(words(11, 10), 'It is ten minutes past eleven');
  assert.equal(words(12, 45), 'It is quarter to one');
  assert.equal(words(9, 30), 'It is half past nine');
  assert.equal(words(23, 59), 'It is one minute to twelve');
  assert.equal(words(0, 0), "It is twelve o'clock");
  assert.equal(words(16, 29), 'It is twenty-nine minutes past four');
  for (const [, pos] of grammar.timeWords(7, 17)) assert.ok(pos);

  // 27 November 2026, a Friday: ISO week 48 of 53 (2026 started on a Thursday), day 331 of 365.
  const lines = grammar.grammarLines({ year: 2026, month: 10, day: 27, weekday: 5, hours: 11, minutes: 10 });
  assert.deepEqual(lines.date.map(([w]) => w), ['Friday', 'the', '27th', 'of', 'November', '2026']);
  assert.deepEqual(lines.date.map(([, p]) => p).slice(0, 3), ['proper noun', 'determiner', 'ordinal']);
  assert.deepEqual(lines.week.map(([w]) => w), ['week', '48', 'of', '53']);
  assert.deepEqual(lines.day.map(([w]) => w), ['day', '331', 'of', '365']);
  assert.equal(grammar.grammarLines({ year: 2027, month: 0, day: 1, weekday: 5, hours: 0, minutes: 0 }).week[3][0], '52');
});

test('grammar face: lines, tags, colour modes and a steady layout', async () => {
  const el = mount('<bezel-clock variant="grammar" seed="3"></bezel-clock>');
  await flush();
  const root = el.shadowRoot;
  assert.equal(root.querySelectorAll('.row').length, 4);
  const tags = [...root.querySelectorAll('.tag:not(.blank)')];
  assert.ok(tags.length >= 4, 'at least one tag per line');
  assert.ok(tags.length < root.querySelectorAll('.w').length, 'only some words are tagged');
  const before = root.querySelector('.v-grammar').innerHTML;
  el.setAttribute('theme', 'onyx');
  await flush();
  assert.equal(root.querySelector('.v-grammar').innerHTML, before, 'same seed, same layout');

  el.setAttribute('lines', 'time week');
  await flush();
  assert.equal(root.querySelectorAll('.row').length, 2);

  // By part of speech, every tagged noun shares one colour.
  el.setAttribute('lines', 'time date week day');
  el.setAttribute('color-by', 'pos');
  await flush();
  const colours = new Set([...root.querySelectorAll('.tag:not(.blank)')].filter((t) => t.textContent === 'number').map((t) => t.getAttribute('style')));
  assert.ok(colours.size <= 1);
  el.remove();
});

test('the new faces drop settings they do not use', async () => {
  const el = mount('<bezel-clock variant="grammar" lume="green" hands="slender"></bezel-clock>');
  await flush();
  assert.equal(el.lume, null);
  assert.equal(el.shadowRoot.querySelector('.sl'), null);
  assert.equal(el.tickRate, 'minute');
  el.remove();
});
