"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateFormProps {
  clusters: Array<{ id: string; name: string }>;
  onGenerate: (data: { clusterId: string; model: string; tone: string; wordCount: number; language: string }) => void;
  isLoading?: boolean;
}

export function GenerateForm({ clusters, onGenerate, isLoading }: GenerateFormProps) {
  const [clusterId, setClusterId] = useState("");
  const [model, setModel] = useState("claude-sonnet");
  const [tone, setTone] = useState("professional");
  const [wordCount, setWordCount] = useState(1500);
  const [language, setLanguage] = useState("vi");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clusterId) return;
    onGenerate({ clusterId, model, tone, wordCount, language });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-zinc-700">AI Content Generator</h3>

      <div>
        <label className="mb-1 block text-sm text-zinc-600">Target Cluster</label>
        <select value={clusterId} onChange={(e) => setClusterId(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
          <option value="">Select cluster...</option>
          {clusters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-600">AI Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
            <option value="claude-sonnet">Claude Sonnet</option>
            <option value="gpt-4o-mini">GPT-4o-mini</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-600">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="sales">Sales</option>
            <option value="consulting">Consulting</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-600">Word Count</label>
          <input type="number" min={800} max={5000} step={100} value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-600">Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
            <option value="vi">Vietnamese</option>
            <option value="vi-en">Bilingual (Vi-En)</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !clusterId}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {isLoading ? "Generating..." : "Generate Article"}
      </button>
    </form>
  );
}
