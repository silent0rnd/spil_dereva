/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * One-off image pipeline.
 *
 * The source photos ship as ~1.3 MB JPEGs (16 MB for the page). This produces
 * WebP variants next to them plus a manifest with the real output dimensions,
 * so components can emit honest srcSet and width/height attributes.
 *
 * Run locally with `npm run images` and commit the results — the GitHub Pages
 * workflow only runs `npm install && npm run build`, so sharp never has to be
 * installed in CI.
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_DIR = path.join(here, '..', 'src', 'assets', 'images');
const MANIFEST = path.join(IMAGE_DIR, 'manifest.json');
// 480 keeps phones off the 960px variant — decoding the larger file was a
// ~900ms stall on a throttled mobile CPU.
const TARGET_WIDTHS = [480, 960, 1920];
const QUALITY = 78;

const formatKb = (bytes) => `${Math.round(bytes / 1024)} КБ`;

async function main() {
  const entries = await readdir(IMAGE_DIR);
  const sources = entries.filter((name) => /\.(jpe?g|png)$/i.test(name)).sort();

  if (sources.length === 0) {
    console.log('Исходных изображений не найдено.');
    return;
  }

  const manifest = {};
  let originalBytes = 0;
  let optimizedBytes = 0;

  for (const fileName of sources) {
    const base = path.parse(fileName).name;
    const sourcePath = path.join(IMAGE_DIR, fileName);
    const buffer = await readFile(sourcePath);
    originalBytes += buffer.length;

    const image = sharp(buffer);
    const { width: sourceWidth, height: sourceHeight } = await image.metadata();

    if (!sourceWidth || !sourceHeight) {
      console.warn(`! Пропускаю ${fileName}: не удалось прочитать размеры`);
      continue;
    }

    const variants = [];
    const emitted = new Set();

    for (const targetWidth of TARGET_WIDTHS) {
      // Never upscale: a 1400px source stays 1400px wide.
      const width = Math.min(targetWidth, sourceWidth);
      if (emitted.has(width)) continue;
      emitted.add(width);

      const outputName = `${base}-${targetWidth}.webp`;
      const outputPath = path.join(IMAGE_DIR, outputName);

      const output = await sharp(buffer)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toBuffer();

      await writeFile(outputPath, output);
      optimizedBytes += output.length;

      variants.push({
        file: outputName,
        width,
        height: Math.round((sourceHeight / sourceWidth) * width)
      });

      console.log(`  ${outputName.padEnd(48)} ${String(width).padStart(5)}px  ${formatKb(output.length)}`);
    }

    manifest[base] = {
      width: sourceWidth,
      height: sourceHeight,
      variants: variants.sort((a, b) => a.width - b.width)
    };
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  const saved = 100 - Math.round((optimizedBytes / originalBytes) * 100);
  console.log(`\nИсходники: ${formatKb(originalBytes)}`);
  console.log(`WebP:      ${formatKb(optimizedBytes)}  (−${saved}%)`);
  console.log(`Манифест:  ${path.relative(path.join(here, '..'), MANIFEST)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
