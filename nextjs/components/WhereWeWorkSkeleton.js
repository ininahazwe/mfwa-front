// Placeholder for the Where We Work explorer (2026-10-18), shown by
// app/where-we-work/page.js inside <Suspense> while the WordPress data
// (map coverage, issue filters, story grid) loads. Everything that is
// known without WordPress is real already: section heading, intro and the
// 16 country links (usable right away); only the data-driven parts are
// shimmering placeholders, laid out with the same classes as
// WhereWeWorkList so nothing jumps when the real content streams in.
// `error` turns the same layout into a "couldn't load, retry" state.

export default function WhereWeWorkSkeleton({ data, error = false, retryHref = "/where-we-work" }) {
  const col1 = data.countries.slice(0, 8);
  const col2 = data.countries.slice(8, 16);
  const col = (list) => (
    <ul className="reach__col">
      {list.map((c) => (
        <li key={c.slug} className={c.slug === data.activeCountrySlug ? "is-selected" : undefined}>
          <a href={c.href}>
            <span className="ww-sev-dot ww-skel__dot" aria-hidden="true" />
            {c.name}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`ab-section ww-skel${error ? " ww-skel--error" : ""}`} id="countries" aria-busy={!error}>
      <div className="ab-wrap">
        {/* Same markup as SectionHead, minus its scroll-reveal: the skeleton is
            on screen before the page's JS has run, so a fade-in would leave
            the heading invisible until then. */}
        <header className="ab-head ab-head--center">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 className="ab-h2">{data.title}</h2>
          {(Array.isArray(data.text) ? data.text : [data.text]).filter(Boolean).map((para) => (
            <p className="ab-head__text" key={para.slice(0, 40)}>
              {para}
            </p>
          ))}
        </header>

        {error ? (
          <p className="ww-skel__error" role="alert">
            The coverage data for the map and the stories could not be loaded right now.{" "}
            <a href={retryHref}>Try again</a>
          </p>
        ) : (
          <p className="visually-hidden" role="status">
            Loading coverage data…
          </p>
        )}

        <div className="reach__inner ww-countries-row">
          <div className="reach__list ww-list">
            {col(col1)}
            {col(col2)}
          </div>
          <div className="reach__map">
            <div className="skel ww-skel__map" />
          </div>
          <div className="ww-map-panel" aria-hidden="true">
            <div className="skel ww-skel__legend" />
            <div className="ww-map-detail">
              <div className="skel ww-skel__line" style={{ width: "60%" }} />
              <div className="skel ww-skel__line" style={{ width: "85%" }} />
              <div className="skel ww-skel__line" style={{ width: "70%" }} />
            </div>
          </div>
        </div>

        {!error && (
          <>
            <div className="ftabs ww-ftabs ww-skel__tabs" aria-hidden="true">
              {[92, 150, 110, 170, 140, 120, 160, 100].map((w, i) => (
                <span key={i} className="skel ww-skel__tab" style={{ width: w }} />
              ))}
            </div>
            <div className="ww-results" aria-hidden="true">
              <div className="category__grid">
                {Array.from({ length: 6 }, (_, i) => (
                  <div className="story ww-skel__card" key={i}>
                    <div className="skel ww-skel__media" />
                    <div className="skel ww-skel__line" style={{ width: "35%", marginTop: 18 }} />
                    <div className="skel ww-skel__line ww-skel__line--lg" style={{ width: "90%" }} />
                    <div className="skel ww-skel__line ww-skel__line--lg" style={{ width: "65%" }} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
