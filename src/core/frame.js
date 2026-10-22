/**
 * Shared styles for every tile: sizing, the three frame styles and the type stack.
 *
 * Geometry is in container units, so a tile is equally crisp at 120px or 2400px.
 * The host is the size container for the frame; the screen is the container for
 * tile content, so content scales with the visible screen, not the outer rim.
 *
 * Radii are concentric: each inner radius is the outer radius minus the padding
 * between them, which is what makes hardware corners look right.
 */
export const FRAME_CSS = /* css */ `
:host {
  --_font: var(--bezel-font, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI Variable Display", "Helvetica Neue", Roboto, Arial, sans-serif);
  --_rim-r: var(--bezel-radius, 22cqw);
  --_rim-pad: 1.15cqw;
  --_bezel-pad: 5cqw;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  inline-size: var(--bezel-size, 320px);
  max-inline-size: 100%;
  aspect-ratio: var(--bezel-aspect, 1);
  vertical-align: top;
  container-type: inline-size;
  font-family: var(--_font);
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: geometricPrecision;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
}
:host([hidden]) { display: none; }
*, *::before, *::after { box-sizing: border-box; }

.frame { position: absolute; inset: 0; }

/* Device: brushed aluminium rim, black glass bezel, screen. */
.frame--device {
  border-radius: var(--_rim-r);
  padding: var(--_rim-pad);
  background:
    linear-gradient(150deg, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 70%, rgba(255,255,255,.55) 100%),
    linear-gradient(160deg, #f2f3f5 0%, #c6c9ce 38%, #e9ebee 58%, #aeb2b8 100%);
  box-shadow:
    0 0.2cqw 0.4cqw rgba(0,0,0,.10),
    0 1.6cqw 3.2cqw -0.6cqw rgba(0,0,0,.20),
    0 6cqw 10cqw -3cqw rgba(0,0,0,.30),
    inset 0 0 0 0.12cqw rgba(255,255,255,.65),
    inset 0 -0.2cqw 0.3cqw rgba(0,0,0,.18);
}
.bezel {
  position: relative;
  block-size: 100%;
  border-radius: calc(var(--_rim-r) - var(--_rim-pad));
  padding: var(--_bezel-pad);
  background: radial-gradient(120% 90% at 30% 0%, #1b1c1f 0%, #050506 60%);
  box-shadow: inset 0 0 0 0.12cqw rgba(255,255,255,.06);
}
.frame--device .bezel::before {
  content: "";
  position: absolute;
  inset-block-start: calc(var(--_bezel-pad) * 0.42);
  inset-inline-start: 50%;
  inline-size: 1.15cqw;
  aspect-ratio: 1;
  translate: -50% 0;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #3c4a66 0%, #12151c 45%, #050608 75%);
  box-shadow: 0 0 0 0.25cqw #0c0d10;
}
.screen {
  position: relative;
  block-size: 100%;
  overflow: hidden;
  border-radius: calc(var(--_rim-r) - var(--_rim-pad) - var(--_bezel-pad));
  container-type: size;
  background: var(--_surface);
  color: var(--_ink);
  isolation: isolate;
}
.frame--device .screen::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 50;
  background: linear-gradient(155deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,0) 34%);
  box-shadow: inset 0 0 0 0.3cqw rgba(0,0,0,.18);
}

/* Bezel: black border, no rim. */
.frame--bezel .bezel {
  border-radius: var(--_rim-r);
  box-shadow: 0 1.2cqw 3cqw -1cqw rgba(0,0,0,.35);
}
.frame--bezel .screen { border-radius: calc(var(--_rim-r) - var(--_bezel-pad)); }

/* None: just the screen, for embedding inside your own UI. */
.frame--none .bezel { padding: 0; background: none; box-shadow: none; border-radius: var(--_rim-r); }
.frame--none .screen { border-radius: calc(var(--_rim-r) * 0.72); }

svg { display: block; overflow: visible; }
.num { font-variant-numeric: tabular-nums lining-nums; font-feature-settings: "tnum" 1, "lnum" 1; }
.sr { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
`;

/** Escapes text for safe use inside generated markup. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
