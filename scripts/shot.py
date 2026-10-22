"""Dev helper: screenshot a local page with headless Chromium.
Usage: python3 scripts/shot.py <url> <out.png> [width] [height] [dark]"""
import sys
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
w = int(sys.argv[3]) if len(sys.argv) > 3 else 1400
h = int(sys.argv[4]) if len(sys.argv) > 4 else 900
dark = len(sys.argv) > 5 and sys.argv[5] == 'dark'
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': w, 'height': h}, device_scale_factor=2, color_scheme='dark' if dark else 'light')
    logs = []
    pg.on('console', lambda m: logs.append(f'{m.type}: {m.text}'))
    pg.on('pageerror', lambda e: logs.append(f'pageerror: {e}'))
    pg.goto(url)
    import os
    if os.environ.get('FONTFIX'):
        pg.add_style_tag(content=':root{--f-display:"Inter Display",sans-serif;--f-body:"Inter",sans-serif;--f-mono:"DejaVu Sans Mono",monospace} bezel-clock,bezel-calendar,bezel-weather,bezel-glance,bezel-poster{--bezel-font:"Inter Display",sans-serif}')
    pg.wait_for_timeout(1200)
    pg.screenshot(path=out, full_page=True)
    for l in logs: print(l)
    b.close()
