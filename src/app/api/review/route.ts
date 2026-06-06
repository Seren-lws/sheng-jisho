import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { cardFromWord, scheduleReview, cardToFields, rankFromCard, Rating } from "@/lib/fsrs";
import { generateQuiz } from "@/lib/ai";
import type { QuizType, Word } from "@/lib/types";
import type { Grade } from "ts-fsrs";

const QUIZ_TYPES: QuizType[] = ["ja_to_zh", "zh_to_ja", "cloze"];

export async function GET() {
  const supabase = createSupabaseServer();

  const { data: words, error } = await supabase
    .from("words")
    .select("*")
    .neq("srs_rank", "已毕业")
    .lte("srs_due", new Date().toISOString())
    .order("srs_due", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json({ error: "获取复习列表失败" }, { status: 500 });
  }

  if (!words || words.length === 0) {
    return NextResponse.json({ cards: [], message: "没有待复习的词" });
  }

  const cards = await Promise.all(
    words.map(async (word: Word) => {
      const quizType = QUIZ_TYPES[Math.floor(Math.random() * QUIZ_TYPES.length)];
      const quiz = await generateQuiz(word, quizType);
      return { word, quizType, ...quiz };
    })
  );

  return NextResponse.json({ cards });
}

export async function POST(req: NextRequest) {
  const { wordId, rating } = await req.json();
  if (!wordId || !rating) {
    return NextResponse.json({ error: "缺少参数" }, { status: 400 });
  }

  const supabase = createSupabaseServer();
  const { data: word, error: fetchErr } = await supabase
    .from("words")
    .select("*")
    .eq("id", wordId)
    .single();

  if (fetchErr || !word) {
    return NextResponse.json({ error: "词条不存在" }, { status: 404 });
  }

  const card = cardFromWord(word as Word);
  const gradeMap: Record<number, Grade> = {
    1: Rating.Again,
    2: Rating.Hard,
    3: Rating.Good,
    4: Rating.Easy,
  };
  const updated = scheduleReview(card, gradeMap[rating] || Rating.Good);
  const srsFields = cardToFields(updated);
  const newRank = rankFromCard(updated);

  const { error: updateErr } = await supabase
    .from("words")
    .update({ ...srsFields, srs_rank: newRank })
    .eq("id", wordId);

  if (updateErr) {
    console.error("Review update error:", updateErr);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, rank: newRank });
}
