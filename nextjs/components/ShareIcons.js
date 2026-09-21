"use client";

import { useState } from "react";

// API: share.url, share.title — see getArticle(). Native SVGs are reused
// from Footer.js's SOCIAL_ICONS where the network overlaps; WhatsApp and
// the copy-link action are article-specific additions.
const NETWORKS = [
  {
    name: "Facebook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12z" /></svg>
    ),
    href: (url, title) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: "X (Twitter)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 1.5h3.68l-8.04 9.19L24 22.5h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.5h7.59l5.24 6.93 6.07-6.93zm-1.29 18.81h2.04L6.5 3.58H4.31l13.3 16.73z" /></svg>
    ),
    href: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "LinkedIn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.84v2.05h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.66 1.8-2.66 3.65V23h-4V8z" /></svg>
    ),
    href: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "WhatsApp",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.3-.75.95-.92 1.14-.17.2-.34.22-.63.07-.3-.15-1.24-.46-2.37-1.47-.87-.78-1.46-1.74-1.63-2.03-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.5.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.5-.17-.01-.37-.01-.56-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.73-.7 1.98-1.39.24-.68.24-1.26.17-1.38-.07-.13-.27-.2-.56-.35z" /><path d="M12.04 2C6.5 2 2 6.48 2 12c0 1.83.5 3.6 1.42 5.15L2 22l4.98-1.31A10 10 0 0 0 12.04 22C17.57 22 22 17.52 22 12S17.57 2 12.04 2zm0 18.16c-1.6 0-3.16-.43-4.52-1.24l-.32-.19-3.02.79.81-2.94-.21-.3A8.14 8.14 0 0 1 3.84 12c0-4.5 3.68-8.16 8.2-8.16 4.5 0 8.16 3.66 8.16 8.16 0 4.5-3.66 8.16-8.16 8.16z" /></svg>
    ),
    href: (url, title) => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

const LINK_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07l-1.5 1.5" /><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.5-1.5" /></svg>
);

export default function ShareIcons({ share, label = "Share" }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(share.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently, link is still visible in the URL bar.
    }
  }

  return (
    <div className="share-icons">
      {label && <span className="share-icons__label">{label}</span>}
      <div className="share-icons__row">
        {NETWORKS.map((network) => (
          <a
            key={network.name}
            className="share-icons__btn"
            href={network.href(share.url, share.title)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${network.name}`}
          >
            {network.icon}
          </a>
        ))}
        <button
          type="button"
          className="share-icons__btn share-icons__btn--copy"
          onClick={copyLink}
          aria-label="Copy article link"
        >
          {LINK_ICON}
        </button>
        {copied && <span className="share-icons__copied" role="status">Link copied</span>}
      </div>
    </div>
  );
}
