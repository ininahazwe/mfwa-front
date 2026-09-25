import { NextResponse } from "next/server";
import { getWpCountryBySlug, getWpCountryPosts } from "@/lib/wp";

// Currently unused: /where-we-work/[slug] redirects to the merged Where
// We Work × Issues explorer (/api/where-we-work/posts) instead. Left in
// place rather than deleted (no file-delete access this session).
export async function GET(request, { params }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("perPage")) || 10));

  try {
    const country = await getWpCountryBySlug(slug);
    if (!country) {
      return NextResponse.json({ error: "Country not found" }, { status: 404 });
    }
    const { items, totalPages, total } = await getWpCountryPosts(country.id, { page, perPage });
    return NextResponse.json({ items, page, totalPages, total });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load stories" }, { status: 502 });
  }
}
