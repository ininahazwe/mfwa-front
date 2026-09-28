import { chromium } from "playwright-core";

const results = [];
function check(label, cond) {
  results.push({ label, ok: !!cond });
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// -- Nav ---------------------------------------------------------------
await page.goto("http://localhost:3311/", { waitUntil: "networkidle" });
const reportsLink = page.locator(".nav__link", { hasText: "Reports" }).first();
check("home: 'Reports' nav link present", (await reportsLink.count()) === 1);
check("home: 'Reports' link points to /reports", (await reportsLink.getAttribute("href")) === "/reports");

// -- /reports page -------------------------------------------------------
await reportsLink.click();
await page.waitForURL("**/reports");
await page.waitForLoadState("networkidle");
check("reports: title is 'Reports'", (await page.locator("h1.category__title").innerText()) === "Reports");

// Sidebar
check("reports: sidebar present", (await page.locator(".reports-filters").count()) === 1);
const filterLabels = await page.locator(".reports-filters__btn").allTextContents();
check("reports: 'All' is the first filter button", filterLabels[0] === "All");
check(
  "reports: only non-empty mock types appear (Annual/Policy Briefs/Research), nothing else",
  JSON.stringify(filterLabels) === JSON.stringify(["All", "Annual Reports", "Policy Briefs\/Papers", "Research Reports"])
);
check("reports: 'All' starts active", await page.locator(".reports-filters__btn", { hasText: "All" }).first().evaluate((el) => el.classList.contains("is-active")));

// Grid must actually be visible, not just present in the DOM — this is
// the exact bug found 2026-09-28 (opacity:0 forever on a Reveal-wrapped
// grid too tall to cross the scroll-reveal's 15% intersection threshold,
// see the note atop ReportsGrid.js): count() alone missed it earlier.
check("reports: grid is visible (opacity 1), not stuck at 0", (await page.locator(".reports-grid").evaluate((el) => getComputedStyle(el).opacity)) === "1");

// -- hasMore / "Load more" pagination (2026-09-28) ------------------------
// 45 mock reports, page size 12: first page shows 12, "Load more" is
// present, and clicking it grows the grid without re-fetching (all 45
// were already fetched server-side — this just reveals more of what's
// already in memory).
check("reports: first page shows 12 of 45 under 'All'", (await page.locator(".reports-grid .story").count()) === 12);
check("reports: 'Load more' button present (45 > 12)", (await page.locator(".category__loadmore .btn--loadmore").count()) === 1);

await page.locator(".category__loadmore .btn--loadmore").click();
await page.waitForTimeout(150);
check("reports: 'Load more' grows the grid to 24", (await page.locator(".reports-grid .story").count()) === 24);

await page.locator(".category__loadmore .btn--loadmore").click();
await page.waitForTimeout(150);
await page.locator(".category__loadmore .btn--loadmore").click();
await page.waitForTimeout(150);
const allCount = await page.locator(".reports-grid .story").count();
check("reports: clicking through exhausts to all 45 and hides the button", allCount === 45 && (await page.locator(".category__loadmore .btn--loadmore").count()) === 0);

// Click a filter and confirm the grid narrows AND resets to page 1 (not
// stuck at whatever page "All" had reached).
await page.locator(".reports-filters__btn", { hasText: "Annual Reports" }).click();
await page.waitForTimeout(200);
const filteredCount = await page.locator(".reports-grid .story").count();
check("reports: clicking 'Annual Reports' narrows the grid and resets to its own first page", filteredCount > 0 && filteredCount <= 12);
check(
  "reports: 'Annual Reports' button is now active, 'All' isn't",
  (await page.locator(".reports-filters__btn", { hasText: "Annual Reports" }).first().evaluate((el) => el.classList.contains("is-active"))) &&
    !(await page.locator(".reports-filters__btn", { hasText: "All" }).first().evaluate((el) => el.classList.contains("is-active")))
);

// Back to All — also resets to the first page, not wherever "Annual
// Reports" left off.
await page.locator(".reports-filters__btn", { hasText: "All" }).click();
await page.waitForTimeout(200);
check("reports: clicking 'All' restores the first page (12 of 45)", (await page.locator(".reports-grid .story").count()) === 12);

check(
  "reports: no horizontal overflow",
  await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)
);

await page.screenshot({ path: "/tmp/mfwa-build/shot-reports.png", fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 900 } });

// Click a filter again for a "filtered" screenshot
await page.locator(".reports-filters__btn", { hasText: "Policy Briefs/Papers" }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: "/tmp/mfwa-build/shot-reports-filtered.png", fullPage: false, clip: { x: 0, y: 0, width: 1440, height: 900 } });

await browser.close();

let fails = 0;
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"} ${r.label}`);
  if (!r.ok) fails++;
}
console.log(`\n${results.length - fails}/${results.length} passed`);
process.exit(fails > 0 ? 1 : 0);
