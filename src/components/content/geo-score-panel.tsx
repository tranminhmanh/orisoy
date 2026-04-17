"use client";

import { cn, getScoreColor } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface GeoScore {
  total: number;
  directAnswer: number;
  factDensity: number;
  sourceAuthority: number;
  structuralClarity: number;
  entityRichness: number;
  crossPlatform: number;
  suggestions: string[];
}

interface GeoScorePanelProps {
  score: GeoScore;
}

function CircularScore({ value }: { value: number }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? "#06b6d4" : value >= 60 ? "#8b5cf6" : value >= 40 ? "#f97316" : "#ef4444";
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
  const color = pct >= 80 ? "bg-cyan-500" : pct >= 60 ? "bg-purple-500" : pct >= 40 ? "bg-orange-500" : "bg-red-500";
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

export function GeoScorePanel({ score }: GeoScorePanelProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-4">
      <h3 className="text-sm font-semibold text-zinc-700">GEO Citability Score</h3>
      <div className="flex justify-center"><CircularScore value={score.total} /></div>
      <div className="space-y-3">
        <CategoryBar label="Direct Answer Placement" score={score.directAnswer} max={20} />
        <CategoryBar label="Fact Density" score={score.factDensity} max={20} />
        <CategoryBar label="Source Authority" score={score.sourceAuthority} max={15} />
        <CategoryBar label="Structural Clarity" score={score.structuralClarity} max={15} />
        <CategoryBar label="Entity Richness" score={score.entityRichness} max={15} />
        <CategoryBar label="Cross-Platform" score={score.crossPlatform} max={15} />
      </div>
      {score.suggestions.length > 0 && (
        <div className="space-y-1 border-t border-zinc-100 pt-3">
          <h4 className="text-xs font-medium text-zinc-500">GEO Suggestions</h4>
          {score.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-zinc-600">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-cyan-500" />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
