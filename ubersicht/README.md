# Bezel for Übersicht

Put Bezel tiles on your macOS desktop with [Übersicht](https://tracesof.net/uebersicht/).

## Install

```sh
# from the root of this repository
npm install
npm run build          # copies the latest bundle into bezel.widget/lib/
cp -R ubersicht/bezel.widget ~/Library/Application\ Support/Übersicht/widgets/
```

The repository already includes a built copy in `bezel.widget/lib/`, so if you only want the widget you can skip the first two commands.

## Configure

Open `~/Library/Application Support/Übersicht/widgets/bezel.widget/index.jsx` and edit the `TILES` list. Each entry has:

| Key     | Meaning                                                          |
| ------- | ---------------------------------------------------------------- |
| `tag`   | `bezel-clock`, `bezel-calendar`, `bezel-weather`, `bezel-glance` or `bezel-poster` |
| `attrs` | Any attributes from the main README, e.g. `{ variant: 'relief', theme: 'midnight' }` |
| `size`  | Width in pixels                                                  |
| `style` | (optional) CSS variables without the `--bezel-` prefix, e.g. `{ hand: '#E6E1D8', radius: 18 }` |
| `top`, `left` | Position on the desktop in pixels                          |
| `ics`   | (glance only) a calendar feed URL                                |

Calendar feeds are downloaded with `curl` on your Mac, so private feeds from Google Calendar, iCloud or Outlook work even though browsers block them. Use the calendar's private iCal address.

Tiles pause their animation when you can't see them and share one timer, so a desktop full of clocks uses very little power.
