// API: footer.nav[], footer.social[] { network, url }, footer.legal[]
import FadeImg from "./FadeImg";
import Link from "next/link";

const SOCIAL_ICONS = {
  "LinkedIn": (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.84v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.66 1.8-2.66 3.65V23h-4V8z" /></svg>
  ),
  "X (Twitter)": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.5h7.59l5.24 6.93 6.07-6.93zm-1.29 18.81h2.04L6.5 3.58H4.31l13.3 16.73z" /></svg>
  ),
  "YouTube": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c2 .6 9.4.6 9.4.6s7.4 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" /></svg>
  ),
  "Facebook": (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" /></svg>
  ),
  "Instagram": (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" /></svg>
  ),
};

export default function Footer({ data }) {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <div className="footer-brand">
          <Link className="footer-logo-crop" href="/" aria-label={data.homeAriaLabel}>
            <FadeImg src={data.logo.src} alt={data.logo.alt} />
          </Link>
          <span className="footer-brand__name">
            {data.brandNameLines[0]}
            <br />
            {data.brandNameLines[1]}
          </span>
        </div>

        <nav className="footer-nav" aria-label="Navigation du pied de page">
          {data.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer-social">
          <div className="footer-social__icons">
            {data.social.map((item) => (
              <a key={item.network} href={item.url} aria-label={item.network}>
                {SOCIAL_ICONS[item.network]}
              </a>
            ))}
          </div>
          <p className="footer-social__tagline">
            {data.taglineLines[0]}
            <br />
            {data.taglineLines[1]}
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">{data.copy}</p>
        <nav className="footer-legal" aria-label="Mentions légales">
          {data.legal.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
