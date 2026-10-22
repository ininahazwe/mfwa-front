"use client";

// Logo of one of the "Our other websites" (Cta). Sits inside the site's card,
// after the name/host, in a fixed 32px-high white tile so the card keeps the
// height it has without a logo. The file is optional: when it is missing (or
// `src` is empty) the tile removes itself and the card looks as before.
// Files live in public/images/sites/ — see `logo` in getCta() (lib/content.js).
import { useEffect, useRef, useState } from "react";

export default function SiteLogo({ src, name }) {
  const [failed, setFailed] = useState(!src);
  const ref = useRef(null);

  // The 404 can happen before React hydrates (onError would be missed), so
  // also check the image once mounted.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return null;
  return (
    <span className="cta__site-logo">
      <img ref={ref} src={src} alt={`${name} logo`} loading="lazy" onError={() => setFailed(true)} />
    </span>
  );
}
