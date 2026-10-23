# Contributing to Bezel

Thanks for helping. Bug reports, new themes and new tiles are all welcome.

## Setup

```sh
npm install
npm run serve   # then open http://localhost:4173/site/
npm run check   # build, tests and the size budget
```

There's no build step for development: the site loads `src/` directly as ES modules. Run `npm run build` before a release to refresh `dist/` and the Übersicht widget.

## Adding a theme

Each tile has a static `themes` object. Add an entry with every key the other themes in that file use. Try it with the `theme` and `dark-theme` attributes in `docs/showcase.html`, at small (160 px) and large (600 px) sizes, in light and dark mode.

## Adding a language

Fixed words on the weather and glance tiles live in `src/core/i18n.js`. Add a language code with every key the others have, including the weather conditions. Add it to `LOCALES` in `site/site.js` so the Studio offers it.

## Adding a tile

1. Create `src/tiles/your-tile.js` extending `BezelElement`.
2. Set `static attributes`, `static themes`, `static defaultTheme` and `static styles`.
3. Implement `template(z)` to return markup, `update(z, firstPaint)` for per-tick changes, `describe(z)` for the screen-reader label, and `get tickRate()` (`'frame'`, `'second'`, `'minute'` or `null`).
4. Size everything in `cqw` / `cqh` units so it scales.
5. Export it from `src/index.js`, add it to the Studio's `TYPES` in `site/site.js` (listing only the settings that change something), and add a test in `test/elements.test.js`.

## Guidelines

- No runtime dependencies.
- Keep per-tick work small: move hands with `transform`, don't rebuild markup.
- Escape any text that comes from attributes or data with `esc()`.
- Respect `prefers-reduced-motion`.
- Keep the gzipped bundle within the budget in `scripts/size.mjs`.
- Run `npm run check` before opening a pull request.
