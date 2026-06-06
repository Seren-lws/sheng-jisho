"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Trash2 } from "lucide-react";
import WordCard from "@/components/WordCard";
import type { Word } from "@/lib/types";

const TAGS = ["全部", "N5", "N4", "N3", "N2", "N1", "日常", "口语", "正式"];
const RANKS = ["全部", "新手", "熟练", "精通", "已毕业"];

export default function VocabularyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("全部");
  const [activeRank, setActiveRank] = useState("全部");

  const fetchWords = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTag !== "全部") params.set("tag", activeTag);
    if (activeRank !== "全部") params.set("rank", activeRank);

    try {
      const res = await fetch(`/api/words?${params}`);
      const data = await res.json();
      setWords(data.words || []);
    } catch {
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, [activeTag, activeRank]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  async function handleDelete(id: string) {
    try {
      await fetch("/api/words", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setWords((prev) => prev.filter((w) => w.id !== id));
    } catch {
      // silent
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-12 pb-24">
      <h1 className="text-2xl font-light text-slate-800 mb-6 tracking-wide">
        生词本
      </h1>

      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeTag === tag
                ? "border-slate-600 bg-slate-700 text-white"
                : "border-stone-200 text-stone-400 hover:border-stone-300"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {RANKS.map((rank) => (
          <button
            key={rank}
            onClick={() => setActiveRank(rank)}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeRank === rank
                ? "border-slate-600 bg-slate-700 text-white"
                : "border-stone-200 text-stone-400 hover:border-stone-300"
            }`}
          >
            {rank}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <Loader2 size={24} className="animate-spin text-stone-300" />
        </div>
      ) : words.length === 0 ? (
        <p className="text-center text-stone-300 text-sm mt-20">
          还没有收藏的词
        </p>
      ) : (
        <div className="space-y-3">
          {words.map((word) => (
            <div key={word.id} className="relative group">
              <WordCard word={word} saved rank={word.srs_rank} />
              <button
                onClick={() => handleDelete(word.id)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-stone-300 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-50 transition-all"
                title="删除"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <p className="text-center text-stone-300 text-xs pt-4">
            共 {words.length} 词
          </p>
        </div>
      )}
    </div>
  );
}
