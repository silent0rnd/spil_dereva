/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import manifest from '../assets/images/manifest.json';

/**
 * Resolves the WebP variants produced by `npm run images` into everything an
 * <img> needs: a fallback src, an honest srcSet built from the real output
 * widths, and intrinsic dimensions so the browser reserves space (no CLS).
 *
 * Images are referenced by base name — see IMAGES below — so data.ts does not
 * need a dozen import statements.
 */

const WEBP_URLS = import.meta.glob('../assets/images/*.webp', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

interface Variant {
  file: string;
  width: number;
  height: number;
}

interface ManifestEntry {
  width: number;
  height: number;
  variants: Variant[];
}

export interface ResponsiveImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

const MANIFEST = manifest as Record<string, ManifestEntry>;

function urlFor(file: string): string | undefined {
  const key = Object.keys(WEBP_URLS).find((candidate) => candidate.endsWith(`/${file}`));
  return key ? WEBP_URLS[key] : undefined;
}

export function getImage(base: string): ResponsiveImage {
  const entry = MANIFEST[base];

  if (!entry) {
    throw new Error(
      `Изображение "${base}" отсутствует в манифесте. Запустите "npm run images" после добавления файла.`
    );
  }

  const resolved = entry.variants
    .map((variant) => ({ ...variant, url: urlFor(variant.file) }))
    .filter((variant): variant is Variant & { url: string } => Boolean(variant.url));

  const widest = resolved[resolved.length - 1];

  return {
    src: widest?.url ?? '',
    srcSet: resolved.map((variant) => `${variant.url} ${variant.width}w`).join(', '),
    width: entry.width,
    height: entry.height
  };
}

/** Base names of the photos used across the site. */
export const IMAGES = {
  hero: 'arborist_hero_bg_1784384176446'
} as const;
