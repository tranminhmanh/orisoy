"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface ResearchFormProps {
  onSubmit: (data: { seed: string; country: string; language: string; sources: string[] }) => void;
  isLoading?: boolean;
}

const SOURCES = [
  { id: "autocomplete", label: "Autocomplete" },
  { id: "related", label: "Related Searches" },
  { id: "paa", label: "People Also Ask" },
  { id: "questions", label: "Questions" },
  { id: "longtail", label: "Long-tail" },
  { id: "competitor", label: "Competitor" },
  { id: "ai", label: "AI Suggestions" },
];

export function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [seed, setSeed] = useState("");
  const [country, setCountry] = useState("vn");
  const [language, setLanguage] = useState("vi");
  const [sources, setSources] = useState<string[]>(SOURCES.map((s) => s.id));

  const toggleSource = (id: string) => {
    setSources((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed.trim()) return;
    onSubmit({ seed: seed.trim(), country, language, sources });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">Seed Keyword</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Enter seed keyword..."
            className="w-full rounded-lg border border-zinc-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
            <option value="vn">Vietnam</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
            <option value="vi">Vietnamese</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700">Sources</label>
        <div className="flex flex-wrap gap-2">
          {SOURCES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => toggleSource(s.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                sources.includes(s.id) ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !seed.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        {isLoading ? "Discovering..." : "Discover Keywords"}
      </button>
    </form>
  );
}
