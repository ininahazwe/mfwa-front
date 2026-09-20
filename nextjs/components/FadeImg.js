"use client";

import { useImageFade } from "../lib/hooks";

// Thin client wrapper around useImageFade(). `removeOnError` mirrors the
// static mockup's onerror="this.remove()" attribute, which is present on
// most content images but not on the header/footer logo images — pass it
// only where the source markup had it.
export default function FadeImg({ src, alt, className, removeOnError = false, ...rest }) {
  const ref = useImageFade();
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      onError={removeOnError ? (e) => e.currentTarget.remove() : undefined}
      {...rest}
    />
  );
}
