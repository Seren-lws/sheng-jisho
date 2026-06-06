"use client";

import { useState, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import WordCard from "@/components/WordCard";
import type { SearchResult } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSet, setSavedSet] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "查询失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(word: SearchResult) {
    try {
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(word),
      });
      if (!res.ok) throw new Error("保存失败");
      setSavedSet((prev) => new Set(prev).add(word.original));
    } catch {
      setError("收藏失败，请重试");
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-12 pb-24">
      <h1 className="text-2xl font-light text-slate-800 mb-8 tracking-wide">
        極簡辭書
      </h1>

      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入日语或中文..."
          className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-stone-200 text-slate-800 text-sm placeholder:text-stone-300 focus:outline-none focus:border-stone-400 transition-colors"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-1.5 top-1.5 p-2 rounded-lg text-stone-400 hover:text-slate-600 transition-colors"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
      )}

      <div className="space-y-3">
        {results.map((word) => (
          <WordCard
            key={word.original}
            word={word}
            saved={savedSet.has(word.original)}
            onSave={() => handleSave(word)}
          />
        ))}
      </div>

      {!loading && results.length === 0 && !error && (
        <p className="text-center text-stone-300 text-sm mt-20">
          中日双向，AI 即查即答
        </p>
      )}
    </div>
  );
}
