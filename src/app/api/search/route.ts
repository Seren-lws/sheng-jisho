import { NextRequest, NextResponse } from "next/server";
import { searchWord } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return NextResponse.json({ error: "查询不能为空" }, { status: 400 });
  }

  try {
    const results = await searchWord(query.trim());
    return NextResponse.json({ results });
  } catch (e) {
    console.error("Search error:", e);
    return NextResponse.json({ error: "查询失败，请重试" }, { status: 500 });
  }
}
