"use client";

// Section thread ("fil d'Ariane", 2026-11-04, at Yv's call): a thin vertical
// line in the homepage's left gutter, from the first section after the Hero
// down to the call to action. Each section gets a node level with its
// heading (the first line of its h2), joined to it by a
// short red dotted link that ends at the title. As the page
// scrolls, the line fills in red and each node fills once its section
// reaches mid-screen — it tells the reader where they are in the page.
//
// Purely decorative (aria-hidden), built from the real DOM after render so
// it follows whatever sections the page has: grey on light grounds, white
// on navy ones. Rebuilt on resize and whenever the page's height changes
// (images, WordPress content). Hidden under 1100px, where the gutter is too
// narrow, and static under prefers-reduced-motion (no fill transition).
// No numbering: sections are told apart by their headings, not by 01/02/03.
// Remove: delete <SectionThread /> in app/page.js and the .sthread block at
// the end of app/globals.css.
import { useEffect, useRef } from "react";

const MIN_WIDTH = 1100;

function isDark(el) {
  let node = el;
  while (node && node !== document.body) {
    const m = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
    if (m && (m[3] === undefined || +m[3] > 0.5)) {
      return (0.3 * m[0] + 0.59 * m[1] + 0.11 * m[2]) / 255 < 0.4;
    }
    node = node.parentElement;
  }
  return false;
}

export default function SectionThread({ containerId = "main" }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    const main = document.getElementById(containerId);
    if (!root || !main) return undefined;

    let nodes = [];
    let first = 0;
    let last = 0;
    let fill = null;
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!fill) return;
      const mainTop = main.getBoundingClientRect().top + window.scrollY;
      const y = window.scrollY + window.innerHeight * 0.5 - mainTop;
      const p = last > first ? Math.min(1, Math.max(0, (y - first) / (last - first))) : 0;
      fill.style.transform = `scaleY(${p})`;
      nodes.forEach(([n, ny]) => n.classList.toggle("is-on", ny <= y));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const build = () => {
      root.replaceChildren();
      nodes = [];
      fill = null;
      if (window.innerWidth < MIN_WIDTH) return;

      // Every section of <main> after the Hero that carries a heading.
      const sections = [...main.children]
        .filter((el) => el !== root && !el.classList.contains("hero"))
        .map((el) => ({ el, anchor: el.querySelector("h2") }))
        .filter((s) => s.anchor);
      if (sections.length < 2) return;

      const mainBox = main.getBoundingClientRect();
      // Fixed offset (28px) left of the title column, so the thread keeps the same
      // relation to the content on medium and wide screens alike.
      const x = Math.max(16, Math.round(sections[0].anchor.getBoundingClientRect().left - mainBox.left) - 28);
      root.style.setProperty("--sthread-x", `${x}px`);
      const top = (r) => r.top - mainBox.top;
      // Mid-height of the title's first line (titles can run on two lines).
      const midY = (anchor) => {
        const r = anchor.getBoundingClientRect();
        const cs = getComputedStyle(anchor);
        const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.1;
        return top(r) + Math.min(lh, r.height) / 2;
      };

      const frag = document.createDocumentFragment();
      const add = (cls, style) => {
        const d = document.createElement("span");
        d.className = cls;
        Object.assign(d.style, style);
        frag.appendChild(d);
        return d;
      };

      sections.forEach(({ el, anchor }, i) => {
        const box = el.getBoundingClientRect();
        const a = anchor.getBoundingClientRect();
        const y = midY(anchor);
        const dark = isDark(el);
        if (i === 0) first = y;
        last = y;
        // Line segment: from this node to the next one (or to the section's end).
        const next = sections[i + 1];
        const end = next
          ? midY(next.anchor)
          : top(box) + box.height;
        // Split the segment where the section ends, so each part takes its own ground colour.
        const secEnd = Math.min(end, top(box) + box.height);
        add(`sthread__seg${dark ? " is-dark" : ""}`, { top: `${y}px`, height: `${Math.max(0, secEnd - y)}px` });
        if (next && end > secEnd) {
          add(`sthread__seg${isDark(next.el) ? " is-dark" : ""}`, { top: `${secEnd}px`, height: `${end - secEnd}px` });
        }
        add(`sthread__link${dark ? " is-dark" : ""}`, {
          top: `${y}px`,
          left: `${x + 9}px`,
          width: `${Math.max(0, a.left - mainBox.left - x - 15)}px`,
        });
        const node = add(`sthread__node${dark ? " is-dark" : ""}`, { top: `${y}px` });
        nodes.push([node, y]);
      });
      fill = add("sthread__fill", { top: `${first}px`, height: `${last - first}px` });
      root.appendChild(frag);
      update();
    };

    let t = 0;
    const rebuild = () => {
      clearTimeout(t);
      t = setTimeout(build, 150);
    };
    build();
    const ro = new ResizeObserver(rebuild);
    ro.observe(main);
    window.addEventListener("resize", rebuild);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("scroll", onScroll);
    };
  }, [containerId]);

  return <div ref={ref} className="sthread" aria-hidden="true" />;
}
