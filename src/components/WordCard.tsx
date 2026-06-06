"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import type { SearchResult, Word } from "@/lib/types";

interface Props {
  word: SearchResult;
  saved?: boolean;
  rank?: Word["srs_rank"];
  onSave?: () => void;
  compact?: boolean;
}

const RANK_COLORS: Record<string, string> = {
  新手: "bg-stone-200 text-stone-600",
  熟练: "bg-slate-200 text-slate-700",
  精通: "bg-slate-300 text-slate-800",
  已毕业: "bg-slate-700 text-white",
};

export default function WordCard({ word, saved, rank, onSave, compact }: Props) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-semibold text-slate-900">
              {word.original}
            </span>
            {word.original !== word.kana && (
              <span className="text-sm text-stone-500">{word.kana}</span>
            )}
            <span className="text-xs text-stone-400 font-mono">
              [{word.pitch}]
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
              {word.pos}
            </span>
            {rank && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${RANK_COLORS[rank] || ""}`}
              >
                {rank}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-700 mt-2 leading-relaxed">
            {word.meaning}
          </p>

          {!compact && word.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {word.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-1.5 py-0.5 rounded-full border border-stone-200 text-stone-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {onSave && (
          <button
            onClick={onSave}
            disabled={saved}
            className={`shrink-0 p-2 rounded-lg transition-colors ${
              saved
                ? "text-slate-700 cursor-default"
                : "text-stone-300 hover:text-slate-600 hover:bg-stone-50 active:scale-95"
            }`}
            title={saved ? "已收藏" : "收藏"}
          >
            {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
