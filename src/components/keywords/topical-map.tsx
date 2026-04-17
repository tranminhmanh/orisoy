"use client";

import { Network } from "lucide-react";

interface TopicalMapProps {
  pillar: string;
  clusters: Array<{ name: string; keywords: string[] }>;
}

export function TopicalMap({ pillar, clusters }: TopicalMapProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex items-center gap-2 text-lg font-bold text-zinc-900">
        <Network className="h-5 w-5 text-blue-600" />
        {pillar}
      </div>
      <div className="mt-4 ml-4 space-y-3 border-l-2 border-blue-200 pl-6">
        {clusters.map((cluster, i) => (
          <div key={i}>
            <div className="relative">
              <div className="absolute -left-[29px] top-2 h-0.5 w-5 bg-blue-200" />
              <h3 className="font-semibold text-zinc-800">{cluster.name}</h3>
            </div>
            <div className="mt-1 ml-4 space-y-0.5 border-l border-zinc-200 pl-4">
              {cluster.keywords.map((kw, j) => (
                <div key={j} className="relative text-sm text-zinc-500">
                  <div className="absolute -left-[17px] top-2 h-0.5 w-3 bg-zinc-200" />
                  {kw}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
