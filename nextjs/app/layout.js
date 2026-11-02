import "./globals.css";

// 2026-11-02 (finding 06): the homepage had no meta description; this one
// is the default for every page that doesn't set its own (the inner pages
// mostly do). openGraph gives shares a site name and a summary.
const SITE_DESCRIPTION =
  "The Media Foundation for West Africa (MFWA) strengthens media, freedom of expression and democratic participation across West Africa.";

export const metadata = {
  title: "Media Foundation for West Africa",
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Media Foundation for West Africa",
    title: "Media Foundation for West Africa",
    description: SITE_DESCRIPTION,
    locale: "en_GB",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..700;1,8..60,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
