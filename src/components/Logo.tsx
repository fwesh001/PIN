import type { CSSProperties } from 'react';

type LogoProps = {
  /** Tailwind/utility classes applied to the rendered image (e.g. "h-10 w-auto"). */
  className?: string;
  /** Accessible label for the brand logo. */
  alt?: string;
  /** Optional inline style passthrough. */
  style?: CSSProperties;
};

/**
 * Responsive brand logo.
 *
 * Renders the compact `logo-mobile.png` on small screens (below `md`, i.e.
 * < 768px) and the full `logo.png` on larger screens. Implemented with a
 * `<picture>` element so only a single image exists in the accessibility tree.
 */
export default function Logo({
  className = 'h-10 w-auto',
  alt = 'NJPST — Polymer Institute of Nigeria',
  style,
}: LogoProps) {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet="/logo-mobile.png" />
      <img src="/logo.png" alt={alt} className={className} style={style} />
    </picture>
  );
}
