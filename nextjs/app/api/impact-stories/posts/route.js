import { NextResponse } from "next/server";
import { getWpImpactStories } from "@/lib/wp";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("perPage")) || 12));

  try {
    const { items, totalPages, total } = await getWpImpactStories({ page, perPage });
    return NextResponse.json({ items, page, totalPages, total });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load stories" }, { status: 502 });
  }
}
