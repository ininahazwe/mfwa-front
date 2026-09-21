import { NextResponse } from "next/server";
import { getWpCategoryBySlug, getWpCategoryPosts } from "@/lib/wp";

// Server-side proxy for the category page's "load more" pagination.
// Kept as a route (rather than calling lib/wp.js straight from the
// client) so the WordPress API base URL and query shape stay server-side.
export async function GET(request, { params }) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("perPage")) || 10));

  try {
    const category = await getWpCategoryBySlug(slug);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const { items, totalPages, total } = await getWpCategoryPosts(category.id, { page, perPage });
    return NextResponse.json({ items, page, totalPages, total });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load stories" }, { status: 502 });
  }
}
