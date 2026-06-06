import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");
  const rank = url.searchParams.get("rank");

  const supabase = createSupabaseServer();
  let query = supabase.from("words").select("*").order("created_at", { ascending: false });

  if (tag) {
    query = query.contains("tags", [tag]);
  }
  if (rank) {
    query = query.eq("srs_rank", rank);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "获取失败" }, { status: 500 });
  }

  return NextResponse.json({ words: data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "缺少 id" }, { status: 400 });
  }

  const supabase = createSupabaseServer();
  const { error } = await supabase.from("words").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
