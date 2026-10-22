# Changelog

## Unreleased

- New `hands` attribute on `<bezel-clock>` and `<bezel-glance>`: `modern` (the original, still the default) or `lollipop` (tapered batons with a round-tipped seconds hand). Both follow `--bezel-hand` and `--bezel-accent`.
- `<bezel-glance>` hands now read `--bezel-hand`, falling back to the theme's text colour as before.
- The `device` frame no longer draws a light aluminium rim outside the black bezel. The bezel is now a single, even black border.
- Übersicht widget: an optional `style` object per tile sets CSS variables.
- Site: the poster calendar joins the showcase, the hero is trimmed to the headline, the project details move into a redesigned footer, and the code cards start closed with matching styles.
- Site: a larger showcase replaces the presets section, the studio controls are regrouped (Appearance, Colours, Clock hands, Layout and display, Time and language), and the code and install options are four expandable cards.

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
