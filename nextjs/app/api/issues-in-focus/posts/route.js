import { NextResponse } from "next/server";
import { getIssuesInFocusPosts } from "@/lib/wp";

// "Load more" for the Issues in Focus archive (app/issues-in-focus/page.js).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(50, Math.max(1, Number(searchParams.get("perPage")) || 12));
  try {
    const res = await getIssuesInFocusPosts({ page, perPage });
    if (!res) return NextResponse.json({ error: "Issues in Focus not found" }, { status: 404 });
    return NextResponse.json({ items: res.items, page, totalPages: res.totalPages, total: res.total });
  } catch {
    return NextResponse.json({ error: "Failed to load stories" }, { status: 502 });
  }
}
