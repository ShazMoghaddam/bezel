# Changelog

## 2.3.0 (2026-11-27)

Six new clock faces, and colour palettes to go with them.

- **Six new faces** on `<bezel-clock>`, set with `variant`. They all work with every frame (bezel, metal or none), theme, size and corner setting, and the analog ones with all three hand designs.
  - **Scatter:** the time in big bright digits above a tumble of clock numbers, as if tipped out of a dial. Plain by default, or a colour per number with a palette.
  - **Dots:** a five-by-five dot grid behind the hands, with the corners and edge middles in colour. `numerals` swaps the dots at 12, 3, 6 and 9 for coloured numbers.
  - **Circles:** nine solid circles with the hands over the middle one. 12, 3, 6 and 9 sit on the edge circles and turn black or white to suit them; `numerals="roman"` or `"none"` change them.
  - **Square:** a 24-hour dial on a square, with the hours outside and the minutes inside. The hour hand goes round once a day and points right at the hour, and the time now lights up.
  - **Perimeter:** the time in words, the digital time, week, day of the year, date and year running round the edge, with a marker that circles the middle once a minute (or once an hour with `hide-seconds`).
  - **Grammar:** the time, date, week and day of the year as a collage of words in mixed type, some tagged with their part of speech. `color-by`, `lines` and `hide-tags` change what it shows. The sentences are written by hand, so every tag is right.
- **Palettes:** `palette="vibrant|neon|pastel|subtle|spring|summer|autumn|winter"`, eight sets of twelve colours that each run round the whole colour wheel. `colors` takes your own. Text on a coloured shape picks black or white by itself to stay readable.
- **Seeds:** `seed` sets the arrangement of the Scatter and Grammar faces. The layout holds still from minute to minute; a new number gives a new one.
- **Themes:** `moss`, `rose` and `phosphor`, the starting colours of the Scatter, Square and Perimeter faces. They work on any clock face.
- **Week numbers** on the new faces follow the ISO standard, so years like 2026 have 53.
- Studio: the ten faces in two rows, a palette picker with colour strips, Shuffle for a new arrangement, the Grammar face's lines and tags, and settings that only appear on faces that use them (no Hands tab on faces without hands).
- Site: a row of the six new faces on the home page; each opens in the Studio.
- README: a section and image for the new faces and palettes, the Grammar face's typefaces, and refreshed showcase and social preview images.
- Housekeeping: the faces live in `src/faces/`, one file each. The gzip size budget rises from 28 kB to 35 kB: the bundle is now about 33 kB, which leaves room for small fixes. `numeral()` moved to `src/faces/shared.js` and is still exported from the clock.

### Site

- **Desk displays stay awake.** The display page and desk mode now ask again for the screen to stay on if the browser or the computer lets go (after sleep, on low battery), checking every 20 seconds. Before, they only asked when the page opened or the tab came back, so the screensaver could take over on a long run. Desk mode also asks again after you switch tabs and come back, and still lets go when you close it.

## 2.2.0 (2026-11-17)

- **City labels:** a new `label` attribute names the home dial on the Dual face, to match `second-label` on the second dial. Cities that share a time zone can now show their own name, for example `timezone="Europe/Berlin" label="Munich"`. Without it, the dial is named after its zone as before.
- Studio: a new time zone picker, replacing the browser's own suggestion list, which looked different in every browser and couldn't find cities like Munich. It now:
  - lists about 300 well-known cities, adapted from the split-flap world clock, so places that share a zone (Munich, Manchester, Rio) are there by name
  - searches by city, country or other names (Bombay, München, United Kingdom), ignoring accents
  - shows each city's local time and current offset, worked out live so summer time is always right
  - still finds every zone the browser knows, like Aqtobe or `Asia/Tehran`, below the hand-picked cities
  - matches the Studio's look in light and dark, and stays in view on phones
  - works with arrow keys, Page Up/Down, Enter and Esc, and announces results to screen readers
- Studio: picking a city on a clock sets `label` or `second-label` when the zone's own name would say something else. Copied code only includes them where the tile shows them.

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
