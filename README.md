# Bezel

**High-definition clock, calendar and weather tiles as zero-dependency web components.**
Drop one line of HTML into any website, turn a spare iPad into a desk clock, or put them on your Mac desktop.

![Seven Bezel tiles: a numerals clock, an embossed relief clock, a month calendar, a weather tile, a dashboard tile, a classic clock and a poster calendar](docs/bezel-tiles.png)

**[Open the studio](https://shazmoghaddam.github.io/bezel/site/)** to customise a tile and copy its code.

- **Sharp at any size.** Every face is vector SVG and CSS sized in container units, so a tile is equally crisp at 120 px or across a 4K monitor.
- **Customisable.** Built-in themes, any colour you like through CSS variables, three frame styles, your own typeface, 12 or 24 hour time, any time zone and language.
- **Live data, no keys.** Weather and air quality come from [Open-Meteo](https://open-meteo.com), which is free and needs no API key. Agendas read standard `.ics` calendar feeds.
- **Light.** About 21 kB gzipped, no dependencies, no build step needed. All tiles on a page share one timer and pause when off screen.
- **Accessible.** Each tile is labelled for screen readers with the current time, date or conditions, and honours reduced-motion settings.

## Contents

- [Quick start](#quick-start)
- [The tiles](#the-tiles)
- [Shared options](#shared-options)
- [Theming](#theming)
- [Weather and calendar data](#weather-and-calendar-data)
- [Desk display](#desk-display)
- [macOS desktop (Übersicht)](#macos-desktop-übersicht)
- [Frameworks](#frameworks)
- [Development](#development)

## Quick start

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/ShazMoghaddam/bezel@v1.0.0/dist/bezel.min.js"></script>

<bezel-clock variant="relief"></bezel-clock>
<bezel-weather location="Lisbon"></bezel-weather>
```

That's all. Tiles are 320 px wide by default; set `--bezel-size` to change that:

```html
<bezel-clock style="--bezel-size: 480px"></bezel-clock>
```

Prefer a classic script tag? `dist/bezel.iife.js` registers the same elements and exposes a `Bezel` global.

With npm, straight from GitHub:

```sh
npm install github:ShazMoghaddam/bezel
```

```js
import 'bezel-tiles';                 // registers every element
import { time, weather } from 'bezel-tiles'; // helpers, if you want them
```

## The tiles

### `<bezel-clock>`

An analog clock with three faces.

| Attribute      | Values                                   | Default          |
| -------------- | ---------------------------------------- | ---------------- |
| `variant`      | `numerals`, `relief`, `classic`          | `numerals`       |
| `numerals`     | `western`, `roman`, `persian`            | `western`        |
| `theme`        | `sage`, `cobalt`, `ember`, `graphite`, `blush`, `stone`, `midnight`, `porcelain` | depends on variant |
| `sweep`        | `smooth`, `tick`                         | `smooth`         |
| `hands`        | `modern`, `lollipop`                     | `modern`         |
| `hide-seconds` | boolean                                  | off              |
| `hide-date`    | boolean                                  | off              |
| `second-timezone` | classic face: a small dial for another city, e.g. `Asia/Tokyo` |  |
| `second-label` | name under that dial                     | the city name    |

Roman numerals write four as IIII, as most clock dials do. Persian numerals use the Persian digits ۱ to ۱۲. On the classic face, a second time zone replaces the 6 with a small dial, as on a watch.

`hands="lollipop"` swaps the slim original hands for tapered batons, a pivot cap with a dark pin, and a fine seconds hand that ends in a round dot. Both designs take their colour from `--bezel-hand` (hour and minute hands) and `--bezel-accent` (seconds hand).

`numerals` sets four huge overlapping numerals behind the hands. `relief` presses the numerals into the surface; the ones near the minute hand rise up as it passes. `classic` is a clean railway dial.

### `<bezel-calendar>`

A month at a glance, with today's date set huge behind the grid.

| Attribute       | Values                             | Default        |
| --------------- | ---------------------------------- | -------------- |
| `theme`         | `snow`, `ink`, `sorbet`, `forest`  | `snow`         |
| `week-start`    | `mon`, `sun`, or `0` to `6`        | from `locale`  |
| `month`         | `YYYY-MM` to pin a month           | current month  |
| `hide-time`     | boolean                            | off            |
| `hide-backdrop` | boolean                            | off            |

### `<bezel-weather>`

Current conditions over a sky that changes with the weather and the time of day: sun, drifting cloud, rain, snow, fog, storms and stars.

| Attribute               | Values                                  | Default           |
| ----------------------- | --------------------------------------- | ----------------- |
| `location`              | a place name, e.g. `Kyoto`              | London            |
| `latitude`, `longitude` | decimal degrees (skips the name lookup) |                   |
| `units`                 | `metric`, `imperial`                    | from `locale`     |
| `refresh`               | minutes between updates, minimum 5      | `15`              |
| `hide-time`             | boolean                                 | off               |
| `still`                 | boolean, stops the sky animation        | off               |

Shows temperature, today's high and low, the next sunrise or sunset, wind, humidity and air quality (European AQI for metric, US AQI for imperial).

### `<bezel-glance>`

A dashboard: date, analog clock, agenda and weather in one tile.

| Attribute      | Values                                         | Default |
| -------------- | ---------------------------------------------- | ------- |
| `theme`        | `mist`, `orchid`, `sand`, `slate`              | `mist`  |
| `events`       | JSON array of `{ title, start, end, location }` |        |
| `ics`          | URL of an `.ics` feed                          |         |
| `max-events`   | number                                         | `3`     |
| `hide-weather` | boolean, shows the week number instead         | off     |
| `hands`        | `modern`, `lollipop`, as on `<bezel-clock>`    | `modern` |
| plus `location`, `latitude`, `longitude`, `units`, `refresh` from `<bezel-weather>` | | |

Without an events source, the lower-left corner shows the week number and how far through the year you are. Events that have finished drop off as the day goes on.

### `<bezel-poster>`

A month in oversized type, in the tradition of the big wall calendars. Landscape, 4:3, no frame by default.

| Attribute      | Values                             | Default        |
| -------------- | ---------------------------------- | -------------- |
| `theme`        | `noir`, `paper`, `signal`, `bone`  | `noir`         |
| `week-start`   | `mon`, `sun`, or `0` to `6`        | from `locale`  |
| `month`        | `YYYY-MM`                          | current month  |
| `no-highlight` | boolean, don't colour today        | off            |

Pin a month and it makes a good print or poster export at any resolution.

## Shared options

Every tile accepts these:

| Attribute    | Values                                   | Default                     |
| ------------ | ---------------------------------------- | --------------------------- |
| `frame`      | `device`, `bezel`, `none`                | `device` (`none` on poster) |
| `timezone`   | any IANA zone, e.g. `America/New_York`   | the viewer's device         |
| `locale`     | a language tag, e.g. `fr-FR`             | the viewer's browser        |
| `hour-cycle` | `12`, `24`                               | from `locale`               |
| `night-theme` | a theme to switch to at night           | off                         |
| `night-hours` | the night window, e.g. `21-6`           | `19-7`                      |

Night hours use the tile's own time zone, so a desk clock dims itself in the evening without any script.

`device` draws a thin black bezel of even width with a camera dot and a soft shadow. `bezel` keeps just the black border. `none` is the bare screen, for when the tile sits inside your own design.

## Theming

Pick a theme with the `theme` attribute, then override any colour with CSS variables. Your values always win over the theme.

```css
bezel-clock.brand {
  --bezel-surface: #0f3d3e;
  --bezel-ink: #f1ede4;
  --bezel-hand: #f1ede4;
  --bezel-accent: #ff7a59;
}
```

| Variable           | What it sets                                         |
| ------------------ | ---------------------------------------------------- |
| `--bezel-size`     | width of the tile (height follows)                    |
| `--bezel-aspect`   | aspect ratio, e.g. `16 / 9`                           |
| `--bezel-radius`   | outer corner radius, in `cqw` units (`22cqw` default) |
| `--bezel-thickness`| width of the black bezel (`1.7cqw` default)           |
| `--bezel-font`     | font stack for every tile                             |
| `--bezel-surface`  | screen background                                     |
| `--bezel-ink`      | text and numerals                                     |
| `--bezel-accent`   | highlights, second hand, today                        |
| `--bezel-hand`     | clock hands, on the clock and the glance dial          |
| `--bezel-today`, `--bezel-muted` | calendar today circle and other-month days |
| `--bezel-soft`     | glance clock plate                                    |
| `--bezel-rule`     | poster column rules                                   |
| `--bezel-tint`     | weather sky tint; recolours the sky but keeps the clouds and light |
| `--bezel-numeral-weight` | weight of the big numerals on the numerals face |

The library doesn't download fonts. On Apple devices it uses SF Pro, the system font. Elsewhere it uses [Geist](https://fonts.google.com/specimen/Geist) if your page loads it, which gives Windows and Android the same clean look:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..800&display=swap">
```

To use any other face, load it and set `--bezel-font`.

For deeper changes, the frame is exposed as CSS parts: `bezel-clock::part(screen)`, `::part(bezel)` and `::part(frame)`.

## Weather and calendar data

**Weather** comes from Open-Meteo's forecast and air-quality APIs. Requests for the same place are shared between tiles and cached for 15 minutes. If the network fails, the tile shows plausible sample values and marks itself **Sample** so nobody mistakes them for real readings. Open-Meteo's free tier is for non-commercial use; see [their terms](https://open-meteo.com/en/terms) if you're building a product.

To supply your own data instead, assign it in JavaScript:

```js
document.querySelector('bezel-weather').weather = {
  place: 'Oslo', units: 'metric', temperature: -3, high: -1, low: -6,
  condition: 'Snow', sky: 'snow', isDay: false, humidity: 88, wind: 9,
  sunrise: ['2026-12-01T08:58'], sunset: ['2026-12-01T15:17'], aqi: 12, aqiScale: 'eu',
};
```

`sky` is one of `clear`, `partly`, `cloudy`, `fog`, `drizzle`, `rain`, `snow`, `storm`.

**Calendars.** `<bezel-glance>` reads events from the `events` attribute, the `events` property, the `ics` attribute, or raw text assigned to the `icsText` property. The `.ics` reader handles time zones, all-day events, cancellations, and daily, weekly (including specific weekdays), monthly and yearly repeats with exceptions.

Most private calendar feeds (Google, iCloud, Outlook) don't allow browsers to fetch them directly. Three ways round that:

1. On a Mac desktop, use the Übersicht widget: it downloads feeds with `curl`, which isn't restricted.
2. Fetch the feed on your own server and pass the text to `tile.icsText`.
3. Serve the feed through a proxy that adds an `Access-Control-Allow-Origin` header.

## Desk display

`site/display.html` shows a single tile full screen on a black background. It keeps the screen awake where the browser allows, hides the cursor when idle, goes full screen on tap, and shifts the tile by a few pixels each minute to prevent burn-in on OLED screens.

Every query parameter becomes an attribute, and parameters starting with `--` become CSS variables:

```
https://shazmoghaddam.github.io/bezel/site/display.html?tile=clock&variant=relief&theme=midnight&--accent=%23ff3366
```

On an iPad, open the link in Safari and choose **Share › Add to Home Screen** for a full-screen clock with no browser chrome. The studio's **Copy display link** button builds these URLs for you.

## macOS desktop (Übersicht)

The `ubersicht/bezel.widget` folder is a ready-made [Übersicht](https://tracesof.net/uebersicht/) widget. Copy it into Übersicht's widgets folder and edit the `TILES` list to choose tiles and positions. See [`ubersicht/README.md`](ubersicht/README.md).

## Frameworks

Bezel elements are standard custom elements, so they work anywhere HTML does.

**React 19** passes attributes and properties to custom elements directly:

```jsx
import 'bezel-tiles';

export function DeskClock() {
  return <bezel-clock variant="numerals" theme="cobalt" style={{ '--bezel-size': '280px' }} />;
}
```

**Vue** needs to be told the `bezel-` prefix is a custom element: set `compilerOptions.isCustomElement = (tag) => tag.startsWith('bezel-')`.

## Browser support

Current Safari, Chrome, Edge and Firefox (Safari 16.4 or later). Bezel uses container query units, `color-mix()` and Shadow DOM.

## Development

```sh
git clone https://github.com/ShazMoghaddam/bezel.git
cd bezel
npm install
npm run serve        # http://localhost:4173/site/
npm test             # unit and element tests
npm run build        # writes dist/ and updates the Übersicht widget
```

```
src/
  core/        time zones, calendar maths, weather, .ics parsing, the base element
  tiles/       one file per element
site/          the demo site, studio and desk display
ubersicht/     the macOS desktop widget
test/          node:test suites
```

Each tile extends `BezelElement`, which handles the frame, theming, shadow DOM, the shared ticker and visibility. A new tile needs a `template()` that returns its markup and an `update()` that moves whatever changes each tick. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

Weather data by [Open-Meteo](https://open-meteo.com), licensed CC BY 4.0. Designed and built by [Shaz Moghaddam](https://shazmoghaddam.github.io).

## Licence

[MIT](LICENSE)
