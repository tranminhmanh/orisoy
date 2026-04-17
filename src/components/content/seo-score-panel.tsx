"use client";

import { cn, getScoreColor } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface SeoScore {
  total: number;
  keywordOptimization: number;
  nlpCoverage: number;
  structure: number;
  technical: number;
  originality: number;
  suggestions: string[];
}

interface SeoScorePanelProps {
  score: SeoScore;
}

function CircularScore({ value }: { value: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? "#22c55e" : value >= 60 ? "#eab308" : value >= 40 ? "#f97316" : "#ef4444";
  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e4e4e7" strokeWidth="8" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-500" />
      </svg>
      <span className={cn("absolute text-2xl font-bold", getScoreColor(value))}>{value}</span>
    </div>
  );
}

function CategoryBar({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : pct >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-zinc-600">{label}</span>
        <span className="font-medium">{score}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-200">
        <div className={cn("h-2 rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function SeoScorePanel({ score }: SeoScorePanelProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
      <h3 className="text-sm font-semibold text-zinc-700">SEO Score</h3>
      <div className="flex justify-center"><CircularScore value={score.total} /></div>
      <div className="space-y-3">
        <CategoryBar label="Keyword Optimization" score={score.keywordOptimization} max={30} />
        <CategoryBar label="NLP Coverage" score={score.nlpCoverage} max={25} />
        <CategoryBar label="Structure & Readability" score={score.structure} max={20} />
        <CategoryBar label="Technical Elements" score={score.technical} max={15} />
        <CategoryBar label="Originality" score={score.originality} max={10} />
      </div>
      {score.suggestions.length > 0 && (
        <div className="space-y-1 border-t border-zinc-100 pt-3">
          <h4 className="text-xs font-medium text-zinc-500">Suggestions</h4>
          {score.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-zinc-600">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-yellow-500" />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
