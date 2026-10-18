"use client";

import { useEffect, useRef, useState } from "react";

// Staff/board portraits (2026-10-18). The photos are hotlinked from the live
// mfwa.org media library. Two safeguards:
// - referrerPolicy="no-referrer": hotlink protection (e.g. Cloudflare's)
//   blocks image requests whose Referer is another site such as
//   localhost or the new domain, but lets requests with no Referer through;
// - if the image still fails, the person's initials show in its place
//   instead of an empty/broken frame (the initials sit underneath the
//   image and are simply covered when it loads).
// The parent must be position:relative (.st-card__media / .st-sheet__photo).
function initials(name = "") {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default function Portrait({ src, name, alt = "", lazy = true }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    // an image that already failed before React hydrated never fires onError
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);
  return (
    <>
      <span className="portrait__initials" aria-hidden="true">
        {initials(name)}
      </span>
      {!failed && (
        <img
          ref={ref}
          className="portrait__img"
          src={src}
          alt={alt}
          loading={lazy ? "lazy" : undefined}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      )}
    </>
  );
}
