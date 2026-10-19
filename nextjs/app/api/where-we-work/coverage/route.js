import { NextResponse } from "next/server";
import { getWhereWeWorkCoverage } from "@/lib/content";

// Map coverage for the Where We Work explorer when the reader switches issue
// in place (2026-10-19, see components/WhereWeWorkList.js): the per-country
// counts/severity/latest headlines, scoped to ?category=<slug> (or all
// issues without it). Cached like every WordPress call (lib/wp.js).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get("category") || undefined;
  try {
    const coverage = await getWhereWeWorkCoverage({ categorySlug });
    return NextResponse.json({ coverage });
  } catch {
    return NextResponse.json({ error: "Failed to load coverage" }, { status: 502 });
  }
}
