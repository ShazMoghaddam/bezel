# Changelog

## 2.1.1 (2026-11-16)

- **Fix:** Lollipop hands now finish the centre with the same layered cap as Modern: a hub in the hand colour, a thin accent ring when the seconds hand is on, and a pin in the face colour. Before, the pin was near-black on every face, so it looked like a hole on light and coloured dials.
- Studio: the time zone picker now covers every time zone the browser knows (over 400), shown by city with its region and current offset, like "Seoul, Asia · GMT+9". Type part of a city and pick it, or clear the box to follow this device. The same picker sets the second time zone on the Classic and Dual faces. Older browsers without the full list keep the previous 13 cities. A few cities share a bigger neighbour's zone (Calgary runs on Edmonton time), as on most sites.
- Housekeeping: the bundle's gzip size budget rises from 27 kB to 28 kB. 2.1.0 landed just under the old limit, so this leaves room for small fixes without CI failing. The README now gives the current size, about 27 kB.

## 2.1.0 (2026-11-16)

- **Dual clock:** `<bezel-clock variant="dual">`, a 3:2 tile with round ends and two overlapping dials, Roman on the left and Arabic on the right. One dial shows local time; the other shows `second-timezone`, or UTC if none is set. `home="left|right"` picks the local side (right by default); that dial is drawn in full and the other's dots stop where it tucks behind. Small city names sit inside each dial, with the time difference on the second; `hide-labels` turns them off. Only the local dial has a seconds hand, and `hide-seconds` works as on every clock. Screen readers hear both times.
- **Metal frame:** `frame="metal"`, a brushed silver case lit from above with the face set slightly into it. It works on every tile and is the dual clock's default.
- **Slender hands:** `hands="slender"`, fine needles that run just past the pivot and a hairline seconds hand with a round counterweight. Works on every dial, including `<bezel-glance>`.
- **Glowing numerals:** `lume="green|blue"` on the Classic and Dual faces. Only the numerals glow. `--bezel-lume` sets a glow colour of your own.
- **Colours:** a new dark `onyx` clock theme, and `--bezel-zone` for the second time zone's hour hand (deep blue on `porcelain`, soft blue on `onyx`).
- Studio: a Dual face with Local time on, City names and Second time zone (UTC by default); Glowing numerals on Classic and Dual; a Metal frame; Slender hands; and a Second zone hand colour. Choosing Dual switches to its own palette and the metal frame unless you've already picked them.
- Site: the dual clock joins the hero, the classic example now shows slender hands and green lume, and the desk display page sizes the dual clock to fill the screen.
- README: a CI badge, sections for the new face, frame, hands and lume, and a refreshed showcase image and social preview.
- Site: on phones and small tablets, the Studio preview now stays pinned under the menu while the settings scroll beneath it, instead of sitting over the settings tabs. A CSS rule was in the wrong order.

## 2.0.0 (2026-10-23)

**Breaking:** `night-theme` and `night-hours` are removed. Tiles now follow the device's dark mode instead; use `dark-theme` in place of `night-theme`. Versions pinned to `@v1.x` are unaffected.

- Dark mode: `dark-theme`, `--bezel-dark-*` colours and `appearance="light|dark"` on every tile. With no dark settings a tile looks the same in both modes.
- Weather and glance words (conditions, Sunrise, Wind, "Week 43", "All day" and more) are translated into French, German, Spanish, Italian, Japanese and Persian, with English as the fallback.
- Studio: a dark mode colour set with a Light and Dark preview, shareable design links (the address bar always holds the current design, and Share copies it), Language back on the weather tile, and Fraunces and Nunito typefaces with the loading line included in the code.
- Site: a periwinkle and pink diagonal footer, social preview tags and image, zero axe accessibility violations, and the display page no longer accepts event-handler attributes from its link.
- Housekeeping: unused code removed, a 27 kB gzip size budget checked in CI, and a new README with a fresh showcase image.

## 1.2.0 (2026-10-23)

- Second time zone dial, refined: slim tapered hands with a short counterweight, hairline ticks, a recessed plate, and the time difference beside the city (for example "NEW YORK −5h").
- The poster's bezel now matches every other tile: it is measured against the poster's height, so a poster and a square tile of the same height have identical bezels.
- Studio: the preview bar is a single evenly spaced strip with "Live preview" centred; on the clock, Language only appears when a date is showing, since that is all it changes.

## 1.1.0 (2026-10-23)

- Weather skies are redrawn as SVG: sun, moon, stars, clouds, rain, snow and fog stay sharp at any size, with soft gradients instead of blur. Same animations, and `still` and reduced motion still turn them off.
- Rounder corners no longer clip content: every tile adds an inset that grows with `--bezel-radius` above the default. The Numerals clock's corner date is now HTML so it can move with it.
- Studio: corners range from 1 to 30; each colour lives in one place, under Colours; the Hours setting shows an example of each choice and only appears on tiles that show a digital time.

## 1.0.0 (2026-10-22)

First release.

- Five elements: `<bezel-clock>` (numerals, relief and classic faces, with Western, Roman or Persian numerals and an optional second time zone), `<bezel-calendar>`, `<bezel-weather>`, `<bezel-glance>` and `<bezel-poster>`.
- Three frame styles, 21 built-in themes, CSS variable overrides and CSS parts.
- Time zones, locales and 12/24 hour clocks through `Intl`.
- Night themes that switch automatically in the tile's own time zone.
- Live weather and air quality from Open-Meteo with shared requests, caching and a labelled offline fallback.
- `.ics` reader with time zones, all-day events and recurring events.
- Demo site with presets, a studio that generates code, desk mode and a full-screen display page.
- Übersicht widget for the macOS desktop.

### Also in 1.0.0

- New `hands` attribute on `<bezel-clock>` and `<bezel-glance>`: `modern` (the original, still the default) or `lollipop` (tapered batons with a round-tipped seconds hand). Both follow `--bezel-hand` and `--bezel-accent`.
- `<bezel-glance>` hands now read `--bezel-hand`, falling back to the theme's text colour as before.
- The `device` frame no longer draws a light aluminium rim outside the black bezel. The bezel is now a single, even black border.
- Übersicht widget: an optional `style` object per tile sets CSS variables.
- Studio: the frame choice is now Bezel or None; settings only appear when they change something (second time zone on the Classic face, date off the Relief face, seconds motion with seconds on, location with the weather corner on); the poster offers language without a time zone; the preview backdrop is labelled Light or Dark.
- Studio redesign: the preview and settings fit on one screen, with settings in tabs (Style, Colours, Hands, Options, Time) and only the options each tile supports. Themes leave the Studio in favour of colour pickers with a reset; the library's `theme` attribute is unchanged. Glance takes an optional calendar link in place of the sample agenda.
- Site: the poster calendar joins the showcase, the hero is trimmed to the headline, the project details move into a redesigned footer, and the code cards start closed with matching styles.
- Site: a larger showcase replaces the presets section, the studio controls are regrouped (Appearance, Colours, Clock hands, Layout and display, Time and language), and the code and install options are four expandable cards.
