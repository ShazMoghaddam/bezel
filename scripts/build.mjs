// Builds the distributable bundles and syncs the Übersicht widget's copy.
import { build } from 'esbuild';
import { copyFile, mkdir, stat } from 'node:fs/promises';

const banner = { js: `/*! Bezel v${process.env.npm_package_version ?? '2.0.0'} | MIT | github.com/ShazMoghaddam/bezel */` };
const common = { entryPoints: ['src/index.js'], bundle: true, target: ['es2022', 'safari16.4'], banner, legalComments: 'none' };

await mkdir('dist', { recursive: true });
await Promise.all([
  build({ ...common, format: 'esm', outfile: 'dist/bezel.js' }),
  build({ ...common, format: 'esm', minify: true, outfile: 'dist/bezel.min.js' }),
  build({ ...common, format: 'iife', globalName: 'Bezel', minify: true, outfile: 'dist/bezel.iife.js' }),
]);

await mkdir('ubersicht/bezel.widget/lib', { recursive: true });
await copyFile('dist/bezel.iife.js', 'ubersicht/bezel.widget/lib/bezel.js');

for (const f of ['dist/bezel.js', 'dist/bezel.min.js', 'dist/bezel.iife.js']) {
  const { size } = await stat(f);
  console.log(`${f.padEnd(22)} ${(size / 1024).toFixed(1)} kB`);
}
