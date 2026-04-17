"use client";

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PriorityMatrixProps {
  keywords: Array<{ term: string; searchVolume: number; difficulty: number }>;
}

export function PriorityMatrix({ keywords }: PriorityMatrixProps) {
  const midVol = Math.max(...keywords.map((k) => k.searchVolume), 100) / 2;
  const midDiff = 50;

  const quickWins = keywords.filter((k) => k.searchVolume >= midVol && k.difficulty < midDiff);
  const highComp = keywords.filter((k) => k.searchVolume >= midVol && k.difficulty >= midDiff);
  const niche = keywords.filter((k) => k.searchVolume < midVol && k.difficulty < midDiff);
  const longTerm = keywords.filter((k) => k.searchVolume < midVol && k.difficulty >= midDiff);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-medium text-zinc-700">Priority Matrix</h3>
      <ResponsiveContainer width="100%" height={350}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis type="number" dataKey="searchVolume" name="Volume" stroke="#71717a" fontSize={12} />
          <YAxis type="number" dataKey="difficulty" name="KD" reversed stroke="#71717a" fontSize={12} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
            if (!payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="rounded bg-white p-2 text-xs shadow-lg border border-zinc-200">
                <p className="font-medium">{d.term}</p>
                <p>Volume: {d.searchVolume} | KD: {d.difficulty}</p>
              </div>
            );
          }} />
          <Legend />
          <Scatter name="Quick Wins" data={quickWins} fill="#22c55e" />
          <Scatter name="High Competition" data={highComp} fill="#ef4444" />
          <Scatter name="Niche" data={niche} fill="#3b82f6" />
          <Scatter name="Long-term" data={longTerm} fill="#f59e0b" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
