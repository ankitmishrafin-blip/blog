import type { ImageMetadata } from 'astro';

/**
 * A hero/cover image reference. Astro's `image()` schema yields an
 * `ImageMetadata` for local (relative-path) images, which the build optimizes.
 * A plain string is a served path — used for covers uploaded through the CMS
 * (e.g. `/images/uploads/cover.jpg`) — and renders as a normal <img>.
 */
export type HeroImage = ImageMetadata | string | undefined | null;

/** True when the reference points at a build-time-optimized local image. */
export function isLocalImage(image: HeroImage): image is ImageMetadata {
  return typeof image === 'object' && image !== null && 'src' in image;
}

/** The `src` to use for either an optimized local image or a served path. */
export function heroSrc(image: HeroImage): string {
  if (!image) return '';
  return isLocalImage(image) ? image.src : (image as string);
}

/**
 * Blur-up placeholder for local images only. A string reference is served
 * as-is and doesn't need (and can't get) a low-quality placeholder.
 */
export function heroPlaceholderSrc(image: HeroImage): string | undefined {
  if (!isLocalImage(image)) return undefined;
  return image.src.startsWith('/') ? `${image.src}` : image.src;
}
