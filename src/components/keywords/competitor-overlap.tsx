"use client";

import { cn } from "@/lib/utils";

interface OverlapData {
  keyword: string;
  myPosition?: number;
  competitor1Position?: number;
  competitor2Position?: number;
}

interface CompetitorOverlapProps {
  data: OverlapData[];
  myDomain: string;
  competitors: string[];
}

function PositionCell({ position }: { position?: number }) {
  if (!position) return <td className="px-4 py-2 text-center text-zinc-300">—</td>;
  return (
    <td className={cn("px-4 py-2 text-center text-sm font-medium", position <= 10 ? "bg-green-50 text-green-700" : position <= 30 ? "bg-yellow-50 text-yellow-700" : "text-zinc-600")}>
      #{position}
    </td>
  );
}

export function CompetitorOverlap({ data, myDomain, competitors }: CompetitorOverlapProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            <th className="px-4 py-3 text-left font-medium text-zinc-600">Keyword</th>
            <th className="px-4 py-3 text-center font-medium text-blue-600">{myDomain}</th>
            {competitors.map((c, i) => (
              <th key={i} className="px-4 py-3 text-center font-medium text-zinc-600">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-zinc-100">
              <td className="px-4 py-2 font-medium">{row.keyword}</td>
              <PositionCell position={row.myPosition} />
              <PositionCell position={row.competitor1Position} />
              {competitors.length > 1 && <PositionCell position={row.competitor2Position} />}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
