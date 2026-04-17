"use client";

import { useState } from "react";
import { ArrowUpDown, Check, X } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { IntentBadge } from "./intent-badge";

interface KeywordRow {
  id: string;
  term: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  trend: number[];
  hasAiOverview: boolean;
  geoOpportunity: string;
}

interface KeywordTableProps {
  keywords: KeywordRow[];
}

type SortKey = keyof KeywordRow;

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const h = 20;
  const w = 60;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500" />
    </svg>
  );
}

function DifficultyBar({ value }: { value: number }) {
  const color = value >= 70 ? "bg-red-500" : value >= 40 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-zinc-200">
        <div className={cn("h-2 rounded-full", color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-zinc-500">{value}</span>
    </div>
  );
}

export function KeywordTable({ keywords }: KeywordTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("searchVolume");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...keywords].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
    return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: "term", label: "Keyword" },
    { key: "searchVolume", label: "Volume" },
    { key: "difficulty", label: "KD" },
    { key: "cpc", label: "CPC" },
    { key: "intent", label: "Intent" },
    { key: "trend" as SortKey, label: "Trend" },
    { key: "hasAiOverview" as SortKey, label: "AI Overview" },
    { key: "geoOpportunity", label: "GEO" },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            {headers.map((h) => (
              <th
                key={h.key}
                onClick={() => toggleSort(h.key)}
                className="cursor-pointer px-4 py-3 text-left font-medium text-zinc-600 hover:text-zinc-900"
              >
                <span className="inline-flex items-center gap-1">
                  {h.label}
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((kw) => (
            <tr key={kw.id} className="border-b border-zinc-100 hover:bg-zinc-50">
              <td className="px-4 py-3 font-medium">{kw.term}</td>
              <td className="px-4 py-3">{formatNumber(kw.searchVolume)}</td>
              <td className="px-4 py-3"><DifficultyBar value={kw.difficulty} /></td>
              <td className="px-4 py-3">${kw.cpc.toFixed(2)}</td>
              <td className="px-4 py-3"><IntentBadge intent={kw.intent} /></td>
              <td className="px-4 py-3"><Sparkline data={kw.trend} /></td>
              <td className="px-4 py-3 text-center">
                {kw.hasAiOverview ? <Check className="inline h-4 w-4 text-green-500" /> : <X className="inline h-4 w-4 text-zinc-300" />}
              </td>
              <td className="px-4 py-3">
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  kw.geoOpportunity === "high" ? "bg-green-100 text-green-700" :
                  kw.geoOpportunity === "medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-zinc-100 text-zinc-600"
                )}>
                  {kw.geoOpportunity}
                </span>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td colSpan={8} className="px-4 py-8 text-center text-zinc-400">No keywords found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
