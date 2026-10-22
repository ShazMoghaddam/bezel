/**
 * A compact stroke icon set drawn on a 24-unit grid, coloured with currentColor.
 * Drawn for this project so the tiles carry no third-party assets.
 */

const wrap = (body, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const sunCore = '<circle cx="12" cy="12" r="4.2"/>';
const rays = [0, 45, 90, 135, 180, 225, 270, 315]
  .map((a) => `<line x1="12" y1="2.6" x2="12" y2="4.6" transform="rotate(${a} 12 12)"/>`)
  .join('');
const cloud = 'M7.2 18.5h9.6a3.9 3.9 0 0 0 .5-7.77A5.4 5.4 0 0 0 6.9 10.2 4.2 4.2 0 0 0 7.2 18.5Z';
const smallCloud = 'M8.4 19h8.2a3.3 3.3 0 0 0 .4-6.58 4.6 4.6 0 0 0-8.9-1.1A3.85 3.85 0 0 0 8.4 19Z';

export const icons = {
  sun: () => wrap(sunCore + rays),
  moon: () => wrap('<path d="M19.2 14.6A7.6 7.6 0 0 1 9.4 4.8a7.6 7.6 0 1 0 9.8 9.8Z"/>'),
  partly: (isDay = true) =>
    wrap(
      (isDay
        ? '<circle cx="8.6" cy="8.4" r="3.2"/><line x1="8.6" y1="2.4" x2="8.6" y2="3.4"/><line x1="2.6" y1="8.4" x2="3.6" y2="8.4"/><line x1="4.4" y1="4.2" x2="5.1" y2="4.9"/><line x1="12.8" y1="4.2" x2="12.1" y2="4.9"/>'
        : '<path d="M11.6 9.6A4.4 4.4 0 0 1 6 4a4.4 4.4 0 1 0 5.6 5.6Z"/>') + `<path d="${smallCloud}"/>`,
    ),
  cloudy: () => wrap(`<path d="${cloud}"/>`),
  fog: () => wrap('<line x1="4" y1="9" x2="20" y2="9"/><line x1="6" y1="13" x2="18" y2="13"/><line x1="4" y1="17" x2="20" y2="17"/>'),
  drizzle: () => wrap(`<path d="${cloud}" transform="translate(0 -3)"/><line x1="9" y1="19" x2="8.5" y2="20.5"/><line x1="15" y1="19" x2="14.5" y2="20.5"/>`),
  rain: () =>
    wrap(`<path d="${cloud}" transform="translate(0 -3)"/><line x1="8" y1="18.5" x2="7" y2="21"/><line x1="12" y1="18.5" x2="11" y2="21"/><line x1="16" y1="18.5" x2="15" y2="21"/>`),
  snow: () =>
    wrap(`<path d="${cloud}" transform="translate(0 -3)"/><circle cx="8" cy="19.6" r=".5" fill="currentColor"/><circle cx="12" cy="20.6" r=".5" fill="currentColor"/><circle cx="16" cy="19.6" r=".5" fill="currentColor"/>`),
  storm: () => wrap(`<path d="${cloud}" transform="translate(0 -3)"/><path d="M12.6 15.4 10.6 18.6h3l-2 3"/>`),
  sunrise: () =>
    wrap('<path d="M6.5 16a5.5 5.5 0 0 1 11 0"/><line x1="3" y1="19" x2="21" y2="19"/><path d="M12 3v6M9.5 5.5 12 3l2.5 2.5"/><line x1="4.2" y1="11.2" x2="5.4" y2="12"/><line x1="19.8" y1="11.2" x2="18.6" y2="12"/>'),
  sunset: () =>
    wrap('<path d="M6.5 16a5.5 5.5 0 0 1 11 0"/><line x1="3" y1="19" x2="21" y2="19"/><path d="M12 3v6M9.5 6.5 12 9l2.5-2.5"/><line x1="4.2" y1="11.2" x2="5.4" y2="12"/><line x1="19.8" y1="11.2" x2="18.6" y2="12"/>'),
  wind: () => wrap('<path d="M3 9h11.5a2.5 2.5 0 1 0-2.5-2.5"/><path d="M3 13h15.5a2.5 2.5 0 1 1-2.5 2.5"/><path d="M3 17h7"/>'),
  humidity: () => wrap('<path d="M12 3.2s-6 6.6-6 10.8a6 6 0 0 0 12 0c0-4.2-6-10.8-6-10.8Z"/><path d="M9.2 14.6a2.9 2.9 0 0 0 2.4 2.6"/>'),
  air: () =>
    wrap(
      [
        [6, 7], [12, 7], [18, 7], [9, 12], [15, 12], [6, 17], [12, 17], [18, 17],
      ]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.15" fill="currentColor" stroke="none"/>`)
        .join(''),
    ),
  arrow: () => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5 3.8 10.6l7.4 2.2 2.2 7.4Z" fill="currentColor"/></svg>',
};

/** Icon for a sky type from the weather module. */
export function skyIcon(sky, isDay = true) {
  switch (sky) {
    case 'clear':
      return isDay ? icons.sun() : icons.moon();
    case 'partly':
      return icons.partly(isDay);
    case 'fog':
      return icons.fog();
    case 'drizzle':
      return icons.drizzle();
    case 'rain':
      return icons.rain();
    case 'snow':
      return icons.snow();
    case 'storm':
      return icons.storm();
    default:
      return icons.cloudy();
  }
}
