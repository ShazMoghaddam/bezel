/**
 * One shared clock for every tile on the page.
 *
 * Subscribers pick a rate: "frame" (smooth second hands), "second" or "minute".
 * When nothing needs frames, the ticker sleeps until the next whole second,
 * so an idle page of tiles costs almost nothing.
 */

const subscribers = { frame: new Set(), second: new Set(), minute: new Set() };
let rafId = 0;
let timeoutId = 0;
let lastSecond = -1;
let lastMinute = -1;

const hasWindow = typeof window !== 'undefined';
const raf = hasWindow && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : null;
const caf = hasWindow && window.cancelAnimationFrame ? window.cancelAnimationFrame.bind(window) : null;

export function prefersReducedMotion() {
  return hasWindow && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

function emit(set, now) {
  for (const fn of set) {
    try {
      fn(now);
    } catch (err) {
      console.error('[bezel]', err);
    }
  }
}

function step() {
  rafId = 0;
  timeoutId = 0;
  const now = Date.now();
  emit(subscribers.frame, now);

  const second = Math.floor(now / 1000);
  if (second !== lastSecond) {
    lastSecond = second;
    emit(subscribers.second, now);
    const minute = Math.floor(second / 60);
    if (minute !== lastMinute) {
      lastMinute = minute;
      emit(subscribers.minute, now);
    }
  }
  schedule();
}

function schedule() {
  if (rafId || timeoutId) return;
  const total = subscribers.frame.size + subscribers.second.size + subscribers.minute.size;
  if (!total) return;

  const pageVisible = !hasWindow || typeof document === 'undefined' || document.visibilityState !== 'hidden';
  if (subscribers.frame.size && raf && pageVisible) {
    rafId = raf(step);
  } else {
    timeoutId = setTimeout(step, 1000 - (Date.now() % 1000) + 2);
  }
}

if (hasWindow && typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (rafId && caf) caf(rafId);
    if (timeoutId) clearTimeout(timeoutId);
    rafId = 0;
    timeoutId = 0;
    lastSecond = -1;
    lastMinute = -1;
    schedule();
  });
}

/**
 * @param {'frame'|'second'|'minute'} rate
 * @param {(now:number) => void} fn
 * @returns {() => void} unsubscribe
 */
export function subscribe(rate, fn) {
  const set = subscribers[rate];
  if (!set) throw new Error(`[bezel] Unknown tick rate "${rate}"`);
  set.add(fn);
  schedule();
  return () => set.delete(fn);
}
