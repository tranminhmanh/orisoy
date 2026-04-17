"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface VisibilityTimelineProps {
  data: Array<{
    date: string;
    chatgpt: number;
    perplexity: number;
    gemini: number;
    googleAio: number;
  }>;
}

export function VisibilityTimeline({ data }: VisibilityTimelineProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700">AI Visibility Over Time</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
          <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
          <YAxis stroke="#71717a" fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "12px" }}
            formatter={(value: number) => [`${value}%`]}
          />
          <Legend />
          <Line type="monotone" dataKey="chatgpt" name="ChatGPT" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="perplexity" name="Perplexity" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="gemini" name="Gemini" stroke="#8b5cf6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="googleAio" name="Google AIO" stroke="#f97316" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
