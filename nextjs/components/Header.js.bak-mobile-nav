import FadeImg from "./FadeImg";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import NavDropdown from "./NavDropdown";
import HeaderSearch from "./HeaderSearch";

export default function Header({ data, tone }) {
  return (
    <header className="header">
      {/*<header className={`header${tone ? ` header--${tone}` : ""}`}>*/}
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
          {data.nav.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} />
            ) : (
              <a key={item.href} className="nav__link" href={item.href}>
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="header__actions">
          {data.credential && (
            <span className="header__credential" title={data.credential.caption}>
              <FadeImg
                className="header__credential-img"
                src={data.credential.image.src}
                alt={data.credential.image.alt}
                removeOnError
              />
            </span>
          )}
          <LanguageSwitcher />
          <HeaderSearch label={data.searchAriaLabel} />
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
