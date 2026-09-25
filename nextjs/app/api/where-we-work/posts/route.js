import { NextResponse } from "next/server";
import { getWpCategoryBySlug, getWpCountryBySlug, getWpFilteredPosts } from "@/lib/wp";

// Server-side proxy for the merged Where We Work × Issues explorer's
// "load more" pagination (see components/WhereWeWorkList.js and
// getWhereWeWorkPage() in lib/content.js). Unlike /api/category/[slug]
// and /api/country/[slug], this takes both filters as query params
// (country, category) rather than one required slug in the path, since
// either or both can be set — or neither, for the unfiltered archive.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("perPage")) || 12));
  const countrySlug = searchParams.get("country");
  const categorySlug = searchParams.get("category");

  try {
    const [country, category] = await Promise.all([
      countrySlug ? getWpCountryBySlug(countrySlug) : null,
      categorySlug ? getWpCategoryBySlug(categorySlug) : null,
    ]);

    const { items, totalPages, total } = await getWpFilteredPosts({
      countryId: country?.id,
      categoryId: category?.id,
      page,
      perPage,
    });
    return NextResponse.json({ items, page, totalPages, total });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load stories" }, { status: 502 });
  }
}
