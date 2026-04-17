"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn, formatNumber, getScoreColor } from "@/lib/utils";

interface ClusterData {
  id: string;
  name: string;
  contentType: string;
  totalVolume: number;
  priorityScore: number;
  keywords: Array<{ term: string; searchVolume: number }>;
}

interface ClusterViewProps {
  clusters: ClusterData[];
}

function ClusterCard({ cluster }: { cluster: ClusterData }) {
  const [expanded, setExpanded] = useState(false);
  const primary = cluster.keywords[0];
  const secondary = cluster.keywords.slice(1);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center justify-between p-4 text-left hover:bg-zinc-50">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-900">{cluster.name}</h3>
            <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">{cluster.contentType}</span>
          </div>
          {primary && <p className="mt-1 text-sm font-medium text-blue-600">{primary.term} ({formatNumber(primary.searchVolume)})</p>}
          <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
            <span>Total: {formatNumber(cluster.totalVolume)}</span>
            <span className={cn("font-semibold", getScoreColor(cluster.priorityScore))}>Priority: {cluster.priorityScore}</span>
            <span>{cluster.keywords.length} keywords</span>
          </div>
        </div>
        {expanded ? <ChevronDown className="h-5 w-5 text-zinc-400" /> : <ChevronRight className="h-5 w-5 text-zinc-400" />}
      </button>
      {expanded && secondary.length > 0 && (
        <div className="border-t border-zinc-100 px-4 py-3">
          <div className="space-y-1">
            {secondary.map((kw, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-zinc-600">{kw.term}</span>
                <span className="text-xs text-zinc-400">{formatNumber(kw.searchVolume)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ClusterView({ clusters }: ClusterViewProps) {
  return (
    <div className="space-y-3">
      {clusters.map((c) => (<ClusterCard key={c.id} cluster={c} />))}
      {clusters.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-zinc-400">No clusters yet</div>
      )}
    </div>
  );
}
