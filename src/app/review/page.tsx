"use client";

import { useEffect, useState } from "react";
import { Loader2, ChevronRight, Flame } from "lucide-react";
import ReviewCard from "@/components/ReviewCard";
import type { ReviewCard as ReviewCardType } from "@/lib/types";

export default function ReviewPage() {
  const [cards, setCards] = useState<ReviewCardType[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    setLoading(true);
    try {
      const res = await fetch("/api/review");
      const data = await res.json();
      setCards(data.cards || []);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAnswer(correct: boolean) {
    setAnswered(true);
    const card = cards[current];
    const rating = correct ? 3 : 1;

    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId: card.word.id, rating }),
    });
  }

  function handleNext() {
    setAnswered(false);
    setCurrent((prev) => prev + 1);
  }

  const finished = !loading && (cards.length === 0 || current >= cards.length);
  const currentCard = cards[current];

  return (
    <div className="max-w-lg mx-auto px-4 pt-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-slate-800 tracking-wide">
          复习
        </h1>
        {cards.length > 0 && !finished && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400">
              {current + 1} / {cards.length}
            </span>
            <div className="flex items-center gap-1 text-stone-400">
              <Flame size={14} />
              <span className="text-xs">
                {score.correct}/{score.total}
              </span>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 size={24} className="animate-spin text-stone-300" />
        </div>
      ) : finished ? (
        <div className="text-center mt-20">
          {score.total > 0 ? (
            <>
              <p className="text-lg text-slate-700 mb-2">复习完毕</p>
              <p className="text-sm text-stone-400">
                {score.correct} / {score.total} 正确
              </p>
              <button
                onClick={() => {
                  setCurrent(0);
                  setScore({ correct: 0, total: 0 });
                  fetchCards();
                }}
                className="mt-6 px-6 py-2 rounded-lg border border-stone-200 text-sm text-stone-500 hover:border-stone-300 transition-colors"
              >
                再来一轮
              </button>
            </>
          ) : (
            <p className="text-stone-300 text-sm">
              现在没有待复习的词，去查几个新词吧
            </p>
          )}
        </div>
      ) : currentCard ? (
        <div>
          <ReviewCard
            question={currentCard.question}
            answer={currentCard.answer}
            options={currentCard.options || []}
            quizType={currentCard.quizType}
            wordOriginal={currentCard.word.original}
            onAnswer={handleAnswer}
          />
          {answered && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-5 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-800 transition-colors"
              >
                下一个
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
