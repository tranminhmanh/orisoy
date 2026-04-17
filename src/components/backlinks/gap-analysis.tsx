"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Target } from "lucide-react";

interface GapEntry {
  domain: string;
  dr: number;
  competitorLinks: Record<string, number>;
  pitch: string;
}

interface GapAnalysisProps {
  gaps: GapEntry[];
}

export function GapAnalysis({ gaps }: GapAnalysisProps) {
  const [sortAsc, setSortAsc] = useState(false);

  const competitors =
    gaps.length > 0 ? Object.keys(gaps[0].competitorLinks) : [];

  const sorted = [...gaps].sort((a, b) =>
    sortAsc ? a.dr - b.dr : b.dr - a.dr
  );

  const toggleSort = () => setSortAsc(!sortAsc);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Target className="h-5 w-5 text-purple-600" />
        <h3 className="text-sm font-semibold text-zinc-700">
          Link Gap Analysis
        </h3>
        <span className="ml-auto text-xs text-zinc-400">
          {gaps.length} opportunities
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Domain
              </th>
              <th
                onClick={toggleSort}
                className="cursor-pointer px-4 py-3 text-left font-medium text-zinc-600 hover:text-zinc-900"
              >
                <span className="inline-flex items-center gap-1">
                  DR
                  <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              {competitors.map((comp) => (
                <th
                  key={comp}
                  className="px-4 py-3 text-left font-medium text-zinc-600"
                >
                  {comp}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Pitch
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((gap, i) => (
              <tr
                key={i}
                className="border-b border-zinc-100 hover:bg-zinc-50"
              >
                <td className="px-4 py-3 font-medium text-zinc-900">
                  {gap.domain}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-10 rounded-full bg-zinc-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${gap.dr}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-zinc-600">
                      {gap.dr}
                    </span>
                  </div>
                </td>
                {competitors.map((comp) => {
                  const count = gap.competitorLinks[comp] ?? 0;
                  return (
                    <td key={comp} className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          count > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        {count > 0 ? count : "—"}
                      </span>
                    </td>
                  );
                })}
                <td className="max-w-[250px] truncate px-4 py-3 text-xs text-zinc-600">
                  {gap.pitch}
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={3 + competitors.length}
                  className="px-4 py-8 text-center text-zinc-400"
                >
                  No gap opportunities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
