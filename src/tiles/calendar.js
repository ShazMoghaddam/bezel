import { BezelElement, define } from '../core/element.js';
import { names, parseWeekStart, formatClock } from '../core/time.js';
import { monthGrid, weekdayOrder, parseMonth } from '../core/calendar.js';
import { esc } from '../core/frame.js';

/**
 * <bezel-calendar>
 *
 * Attributes
 *   theme          snow | ink | sorbet | forest
 *   week-start     mon | sun | 0-6   (default: from locale)
 *   month          YYYY-MM to pin a month (default: current)
 *   hide-time      hide the time in the header
 *   hide-backdrop  hide the giant day numeral behind the grid
 */
class BezelCalendar extends BezelElement {
  static attributes = ['week-start', 'month', 'hide-time', 'hide-backdrop'];
  static defaultTheme = 'snow';
  static themes = {
    snow: { surface: '#FBFBFD', ink: '#1F3E8C', accent: '#E5484D', today: '#121A33', muted: '#B9C0D2' },
    ink: { surface: '#101216', ink: '#E8ECF4', accent: '#FF5F57', today: '#FFFFFF', muted: '#4A5160' },
    sorbet: { surface: '#FFE8D6', ink: '#5B2A86', accent: '#FF7A45', today: '#2A1240', muted: '#D9B8C4' },
    forest: { surface: '#E7EFE6', ink: '#21412F', accent: '#2F9E5B', today: '#0F2419', muted: '#A9BCAD' },
  };

  static styles = /* css */ `
    .cal {
      position: absolute; inset: 0;
      display: grid;
      grid-template-rows: auto auto 1fr;
      padding: calc(8.5cqw + var(--_safe)) calc(7.5cqw + var(--_safe)) calc(7cqw + var(--_safe));
      gap: 2.6cqw;
    }
    .head { display: flex; justify-content: space-between; align-items: baseline; font-size: 6.4cqw; font-weight: 640; letter-spacing: -0.01em; color: var(--_accent); position: relative; z-index: 1; }
    .time { font-variant-numeric: tabular-nums; }
    .row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; position: relative; z-index: 1; }
    .dow { font-size: 5.4cqw; font-weight: 680; color: var(--_ink); }
    .dow .wkend { color: var(--_ink); }
    .grid { display: grid; grid-template-rows: repeat(6, 1fr); align-items: center; position: relative; z-index: 1; }
    .d { display: grid; place-items: center; font-size: 5.7cqw; font-weight: 640; color: var(--_ink); font-variant-numeric: tabular-nums; }
    .d span { display: grid; place-items: center; inline-size: 9.4cqw; aspect-ratio: 1; border-radius: 50%; }
    .d.out { color: var(--_muted); }
    .d.today span { background: var(--_today); color: var(--_surface); box-shadow: 0 0.6cqw 1.6cqw -0.4cqw color-mix(in srgb, var(--_today), transparent 40%); }
    .backdrop {
      position: absolute; inset: 0; z-index: 0;
      display: grid; place-items: center;
      padding-block-start: 12cqh;
      font-size: var(--bd-size, 82cqh); line-height: 1; font-weight: 760; letter-spacing: -0.07em;
      color: var(--_accent);
      opacity: var(--bd-opacity, .2);
      font-variant-numeric: lining-nums;
      -webkit-mask-image: linear-gradient(180deg, #000 40%, rgba(0,0,0,.35) 78%, transparent 100%);
              mask-image: linear-gradient(180deg, #000 40%, rgba(0,0,0,.35) 78%, transparent 100%);
    }
  `;

  get tickRate() {
    return this.flag('hide-time') ? 'minute' : 'second';
  }

  template(z) {
    const pinned = parseMonth(this.getAttribute('month'));
    const year = pinned?.year ?? z.year;
    const month = pinned?.month ?? z.month;
    const weekStart = parseWeekStart(this.getAttribute('week-start'), this.locale);
    const n = names(this.locale);
    const isCurrent = year === z.year && month === z.month;

    const dows = weekdayOrder(weekStart)
      .map((d) => `<div class="dow">${esc(n.weekdayNarrow[d])}</div>`)
      .join('');

    const weeks = monthGrid(year, month, { weekStart, fixedRows: true })
      .map((w) =>
        w
          .map((c) => {
            const today = c.inMonth && isCurrent && c.day === z.day;
            return `<div class="d${c.inMonth ? '' : ' out'}${today ? ' today' : ''}"><span>${c.day}</span></div>`;
          })
          .join(''),
      )
      .map((r) => `<div class="row">${r}</div>`)
      .join('');

    const monthLabel = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
      Date.UTC(year, month, 15),
    );

    return `
      ${this.flag('hide-backdrop') || !isCurrent ? '' : `<div class="backdrop" aria-hidden="true"${z.day > 9 ? ' style="--bd-size:66cqw;--bd-opacity:.16"' : ''}>${z.day}</div>`}
      <div class="cal" aria-hidden="true">
        <div class="head"><span>${esc(monthLabel)}</span>${this.flag('hide-time') ? '' : '<span class="time"></span>'}</div>
        <div class="row">${dows}</div>
        <div class="grid">${weeks}</div>
      </div>`;
  }

  update(z) {
    const t = this.$('.time');
    if (t) {
      const text = formatClock(z.hours, z.minutes, this.hour12);
      if (t.textContent !== text) t.textContent = text;
    }
  }

  describe(z) {
    const date = new Intl.DateTimeFormat(this.locale, { dateStyle: 'full', timeZone: 'UTC' }).format(Date.UTC(z.year, z.month, z.day));
    return `Calendar. Today is ${date}`;
  }
}

define('bezel-calendar', BezelCalendar);
export { BezelCalendar };
