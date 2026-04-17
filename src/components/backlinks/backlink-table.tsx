"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

interface Backlink {
  id: string;
  sourceUrl: string;
  sourceDr: number;
  targetUrl: string;
  anchorText: string;
  linkType: "dofollow" | "nofollow" | "sponsored" | "ugc";
  toxicScore: number;
  status: "live" | "lost" | "broken";
}

interface BacklinkTableProps {
  backlinks: Backlink[];
}

type SortKey = keyof Backlink;

const linkTypeConfig = {
  dofollow: { bg: "bg-green-100", text: "text-green-700" },
  nofollow: { bg: "bg-zinc-100", text: "text-zinc-700" },
  sponsored: { bg: "bg-orange-100", text: "text-orange-700" },
  ugc: { bg: "bg-purple-100", text: "text-purple-700" },
};

const statusConfig = {
  live: { bg: "bg-green-100", text: "text-green-700" },
  lost: { bg: "bg-red-100", text: "text-red-700" },
  broken: { bg: "bg-yellow-100", text: "text-yellow-700" },
};

function DrBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-12 rounded-full bg-zinc-200">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium text-zinc-600">{value}</span>
    </div>
  );
}

function ToxicBar({ score }: { score: number }) {
  const color =
    score >= 60 ? "bg-red-500" : score >= 30 ? "bg-yellow-500" : "bg-green-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-zinc-200">
        <div
          className={cn("h-2 rounded-full", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={cn(
          "text-xs font-medium",
          score >= 60
            ? "text-red-600"
            : score >= 30
              ? "text-yellow-600"
              : "text-green-600"
        )}
      >
        {score}
      </span>
    </div>
  );
}

export function BacklinkTable({ backlinks }: BacklinkTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("sourceDr");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...backlinks].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number")
      return sortAsc ? av - bv : bv - av;
    return sortAsc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: "sourceUrl", label: "Source URL" },
    { key: "sourceDr", label: "DR" },
    { key: "targetUrl", label: "Target URL" },
    { key: "anchorText", label: "Anchor Text" },
    { key: "linkType", label: "Type" },
    { key: "toxicScore", label: "Toxic Score" },
    { key: "status", label: "Status" },
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
          {sorted.map((bl) => {
            const ltConfig = linkTypeConfig[bl.linkType];
            const stConfig = statusConfig[bl.status];
            return (
              <tr
                key={bl.id}
                className="border-b border-zinc-100 hover:bg-zinc-50"
              >
                <td className="max-w-[200px] truncate px-4 py-3 text-zinc-900">
                  {bl.sourceUrl}
                </td>
                <td className="px-4 py-3">
                  <DrBar value={bl.sourceDr} />
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-zinc-600">
                  {bl.targetUrl}
                </td>
                <td className="max-w-[150px] truncate px-4 py-3 text-zinc-600">
                  {bl.anchorText}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      ltConfig.bg,
                      ltConfig.text
                    )}
                  >
                    {bl.linkType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ToxicBar score={bl.toxicScore} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                      stConfig.bg,
                      stConfig.text
                    )}
                  >
                    {bl.status}
                  </span>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-8 text-center text-zinc-400"
              >
                No backlinks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
