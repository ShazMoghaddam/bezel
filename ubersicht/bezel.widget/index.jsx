// Bezel for Übersicht: puts Bezel tiles on your macOS desktop.
//
// 1. Install Übersicht: https://tracesof.net/uebersicht/
// 2. Copy this whole bezel.widget folder into
//    ~/Library/Application Support/Übersicht/widgets/
// 3. Edit TILES below. Übersicht reloads the widget when you save.
//
// Each tile takes the same attributes as on the web; see the README for the full list.
// An optional `style` object sets the CSS variables the studio uses, without the
// --bezel- prefix, e.g. style: { hand: '#E6E1D8', accent: '#66F05A', radius: 18 }.

import { run } from 'uebersicht';

const TILES = [
  {
    tag: 'bezel-clock',
    attrs: { variant: 'numerals', theme: 'sage' },
    size: 220,
    top: 48,
    left: 48,
  },
  {
    tag: 'bezel-weather',
    attrs: { location: 'London' },
    size: 220,
    top: 48,
    left: 292,
  },
  {
    tag: 'bezel-glance',
    attrs: { theme: 'mist', location: 'London' },
    size: 220,
    top: 292,
    left: 48,
    // Optional: a calendar feed. Übersicht downloads it with curl, so feeds
    // that browsers can't read (Google, iCloud, Outlook) work here.
    // In Google Calendar: Settings > your calendar > "Secret address in iCal format".
    ics: '',
  },
];

// Übersicht serves the widgets folder, so the library loads from this widget's lib/ folder.
const LIBRARY = 'bezel.widget/lib/bezel.js';

export const refreshFrequency = false;

export const className = `
  top: 0;
  left: 0;
  pointer-events: none;
`;

function ensureLibrary() {
  if (document.querySelector('script[data-bezel]')) return;
  const s = document.createElement('script');
  s.src = LIBRARY;
  s.dataset.bezel = '';
  document.head.appendChild(s);
}

function cssVars(style = {}) {
  return Object.entries(style)
    .filter(([k, v]) => /^[a-z-]+$/.test(k) && v !== '' && v != null)
    .map(([k, v]) => `;--bezel-${k}:${k === 'radius' ? `${parseFloat(v)}cqw` : String(v).replace(/[";]/g, '')}`)
    .join('');
}

function attributes(attrs) {
  return Object.entries(attrs)
    .filter(([, v]) => v !== false && v != null)
    .map(([k, v]) => (v === true ? k : `${k}="${String(v).replace(/"/g, '&quot;')}"`))
    .join(' ');
}

async function loadFeeds() {
  await customElements.whenDefined('bezel-glance');
  for (const [i, tile] of TILES.entries()) {
    if (!tile.ics) continue;
    const el = document.querySelector(`[data-bezel-tile="${i}"]`);
    if (!el) continue;
    const fetchFeed = async () => {
      try {
        const url = tile.ics.replace(/^webcal:/, 'https:');
        el.icsText = await run(`curl -fsSL --max-time 20 "${url.replace(/"/g, '')}"`);
      } catch (err) {
        console.warn('[bezel] Could not download the calendar feed', err);
      }
    };
    fetchFeed();
    setInterval(fetchFeed, 15 * 60_000);
  }
}

export const init = () => {
  ensureLibrary();
  loadFeeds();
};

export const render = () => {
  const html = TILES.map(
    (t, i) =>
      `<${t.tag} data-bezel-tile="${i}" ${attributes(t.attrs)} style="position:absolute;top:${t.top}px;left:${t.left}px;--bezel-size:${t.size}px${cssVars(t.style)}"></${t.tag}>`,
  ).join('');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
