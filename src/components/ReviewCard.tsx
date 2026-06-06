"use client";

import { useState } from "react";

interface Props {
  question: string;
  answer: string;
  options: string[];
  quizType: string;
  wordOriginal: string;
  onAnswer: (correct: boolean) => void;
}

const TYPE_LABELS: Record<string, string> = {
  ja_to_zh: "看日说中",
  zh_to_ja: "看中说日",
  cloze: "例句填空",
};

export default function ReviewCard({
  question,
  answer,
  options,
  quizType,
  wordOriginal,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const answered = selected !== null;
  const correct = selected === answer;

  function handleSelect(opt: string) {
    if (answered) return;
    setSelected(opt);
    onAnswer(opt === answer);
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-stone-400">
          {TYPE_LABELS[quizType] || quizType}
        </span>
        <span className="text-xs text-stone-400">{wordOriginal}</span>
      </div>

      <p className="text-lg text-slate-800 text-center mb-6 leading-relaxed">
        {question}
      </p>

      <div className="grid gap-2">
        {options.map((opt) => {
          let style = "border-stone-200 text-slate-700 hover:border-stone-300 hover:bg-stone-50";
          if (answered) {
            if (opt === answer) {
              style = "border-slate-600 bg-slate-50 text-slate-800 font-medium";
            } else if (opt === selected) {
              style = "border-red-300 bg-red-50 text-red-600";
            } else {
              style = "border-stone-100 text-stone-300";
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <p
          className={`text-center text-sm mt-4 ${
            correct ? "text-slate-600" : "text-red-500"
          }`}
        >
          {correct ? "正确" : `答案：${answer}`}
        </p>
      )}
    </div>
  );
}
