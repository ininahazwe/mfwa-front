import FadeImg from "./FadeImg";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ data }) {
  return (
    <header className="header">
      <div className="header__inner">
        <Link className="brand" href="/" aria-label={data.homeAriaLabel}>
          <FadeImg className="logo" src={data.logo.src} alt={data.logo.alt} />
          <span className="brand__name">
            {data.brandNameLines[0]}
            <br />
            {data.brandNameLines[1]}
          </span>
        </Link>

        <nav className="nav" aria-label="Navigation principale">
          {data.nav.map((item) => (
            <a key={item.href} className="nav__link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageSwitcher />
          <button className="icon-btn" type="button" aria-label={data.searchAriaLabel}>
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <circle cx="8.6" cy="8.6" r="6.2" />
              <path d="M13.2 13.2 18 18" />
            </svg>
          </button>
          <a className="btn btn--donate" href={data.donate.href}>
            {data.donate.label}
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0 4.5h13M9.4 1 13 4.5 9.4 8" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
