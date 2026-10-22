/**
 * Bezel: high-definition, customisable tiles as web components.
 *
 *   import 'bezel-tiles';
 *   <bezel-clock variant="numerals"></bezel-clock>
 *
 * Elements: <bezel-clock> <bezel-calendar> <bezel-weather> <bezel-glance> <bezel-poster>
 */
export { BezelElement, define, safeLocale } from './core/element.js';
export { BezelClock } from './tiles/clock.js';
export { BezelCalendar } from './tiles/calendar.js';
export { BezelWeather } from './tiles/weather.js';
export { BezelGlance } from './tiles/glance.js';
export { BezelPoster } from './tiles/poster.js';
export * as time from './core/time.js';
export * as calendar from './core/calendar.js';
export * as weather from './core/weather.js';
export * as ics from './core/ics.js';

export const version = '1.0.0';
