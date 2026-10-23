# Changelog

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
