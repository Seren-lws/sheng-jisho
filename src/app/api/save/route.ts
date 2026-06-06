import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { newCard, cardToFields, rankFromCard } from "@/lib/fsrs";
import type { SearchResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  const word: SearchResult = await req.json();
  if (!word.original) {
    return NextResponse.json({ error: "缺少词条数据" }, { status: 400 });
  }

  const supabase = createSupabaseServer();
  const card = newCard();
  const srsFields = cardToFields(card);

  const { data, error } = await supabase
    .from("words")
    .upsert(
      {
        original: word.original,
        kana: word.kana,
        pitch: word.pitch,
        pos: word.pos,
        meaning: word.meaning,
        tags: word.tags,
        srs_rank: rankFromCard(card),
        ...srsFields,
      },
      { onConflict: "original" }
    )
    .select()
    .single();

  if (error) {
    console.error("Save error:", error);
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }

  return NextResponse.json({ word: data });
}
