import { BezelElement, define } from '../core/element.js';
import { names, parseWeekStart } from '../core/time.js';
import { monthGrid, weekdayOrder, parseMonth } from '../core/calendar.js';
import { esc } from '../core/frame.js';

/**
 * <bezel-poster>  A wall-calendar month in oversized type, landscape.
 *
 * Attributes
 *   theme           noir | paper | signal | bone
 *   week-start      mon | sun | 0-6   (default: from locale)
 *   month           YYYY-MM to pin a month (default: current)
 *   no-highlight    don't colour today's date
 *
 * Defaults to frame="none" and a 4:3 shape; set --bezel-aspect to change it.
 */
class BezelPoster extends BezelElement {
  static attributes = ['week-start', 'month', 'no-highlight'];
  static defaultFrame = 'none';
  static defaultTheme = 'noir';
  static themes = {
    noir: { surface: '#000000', ink: '#FFFFFF', accent: '#FF4D2E', rule: 'rgba(255,255,255,.22)' },
    paper: { surface: '#F7F7F5', ink: '#0B0B0B', accent: '#E5322D', rule: 'rgba(0,0,0,.16)' },
    signal: { surface: '#E5322D', ink: '#FFFFFF', accent: '#111111', rule: 'rgba(255,255,255,.3)' },
    bone: { surface: '#E8E4DA', ink: '#1C1B19', accent: '#2346D8', rule: 'rgba(0,0,0,.16)' },
  };

  static styles = /* css */ `
    :host { aspect-ratio: var(--bezel-aspect, 4 / 3); --_rim-r: var(--bezel-radius, 4cqw); }
    .frame--none .screen { border-radius: var(--_rim-r); }
    .p { position: absolute; inset: 0; display: grid; grid-template-rows: auto 1fr; padding: 4.2cqw 2.4cqw 2cqw; }
    .title { justify-self: end; font-size: 4cqw; font-weight: 700; letter-spacing: -0.02em; padding-inline-end: 6cqw; margin-block-end: 2cqh; font-variant-numeric: lining-nums; }
    .cols { display: grid; grid-template-columns: repeat(7, 1fr); min-block-size: 0; }
    .col { display: grid; grid-template-rows: repeat(var(--rows), 1fr); border-inline-start: max(1px, 0.14cqw) solid var(--_rule); padding-inline-start: 0.5cqw; min-inline-size: 0; }
    .col:first-child { border-inline-start-color: transparent; }
    .c { font-size: var(--fs); font-weight: 700; line-height: .84; letter-spacing: -0.05em; align-self: end; white-space: nowrap;
         font-variant-numeric: lining-nums proportional-nums; font-feature-settings: "lnum" 1, "pnum" 1; }
    .c.h { letter-spacing: -0.02em; }
    .c.today { color: var(--_accent); }
  `;

  get tickRate() {
    return 'minute';
  }

  template(z) {
    const pinned = parseMonth(this.getAttribute('month'));
    const year = pinned?.year ?? z.year;
    const month = pinned?.month ?? z.month;
    const weekStart = parseWeekStart(this.getAttribute('week-start'), this.locale);
    const n = names(this.locale);
    const weeks = monthGrid(year, month, { weekStart, fillAdjacent: false });
    const rows = weeks.length + 1;
    const highlight = !this.flag('no-highlight') && year === z.year && month === z.month;

    // Size digits by whichever runs out first: row height or column width.
    const fs = `min(calc((100cqh - 15cqh) / ${rows} * 1.14), 11cqw)`;

    const cols = weekdayOrder(weekStart)
      .map((dow, ci) => {
        const head = `<span class="c h">${esc(n.weekdayNarrow[dow])}</span>`;
        const cells = weeks
          .map((w) => {
            const c = w[ci];
            if (!c) return '<span class="c"></span>';
            return `<span class="c${highlight && c.day === z.day ? ' today' : ''}">${c.day}</span>`;
          })
          .join('');
        return `<div class="col">${head}${cells}</div>`;
      })
      .join('');

    return `<div class="p" style="--rows:${rows};--fs:${fs}" aria-hidden="true">
      <div class="title">${year} ${esc(n.monthLong[month])}</div>
      <div class="cols">${cols}</div>
    </div>`;
  }

  describe(z) {
    const pinned = parseMonth(this.getAttribute('month'));
    const label = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      Date.UTC(pinned?.year ?? z.year, pinned?.month ?? z.month, 15),
    );
    return `Calendar for ${label}`;
  }
}

define('bezel-poster', BezelPoster);
export { BezelPoster };
