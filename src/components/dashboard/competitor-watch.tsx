"use client";

import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, Globe, FileText, Key } from "lucide-react";

interface Competitor {
  domain: string;
  drChange: number;
  newContent: number;
  keywordChanges: { gained: number; lost: number };
}

interface CompetitorWatchProps {
  competitors: Competitor[];
}

export function CompetitorWatch({ competitors }: CompetitorWatchProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700">
        Competitor Watch
      </h3>

      <div className="space-y-3">
        {competitors.map((comp) => (
          <div
            key={comp.domain}
            className="rounded-lg border border-zinc-100 p-3"
          >
            <div className="flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-900">
                {comp.domain}
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-3">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {comp.drChange >= 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      comp.drChange >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {comp.drChange > 0 ? "+" : ""}
                    {comp.drChange}
                  </span>
                </div>
                <span className="text-xs text-zinc-400">DR</span>
              </div>

              <div className="flex items-center gap-1.5">
                <FileText className="h-3 w-3 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-700">
                  {comp.newContent}
                </span>
                <span className="text-xs text-zinc-400">new</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Key className="h-3 w-3 text-zinc-400" />
                <span className="text-xs font-medium text-green-600">
                  +{comp.keywordChanges.gained}
                </span>
                <span className="text-xs font-medium text-red-600">
                  -{comp.keywordChanges.lost}
                </span>
              </div>
            </div>
          </div>
        ))}

        {competitors.length === 0 && (
          <div className="py-6 text-center text-sm text-zinc-400">
            No competitors tracked
          </div>
        )}
      </div>
    </div>
  );
}
