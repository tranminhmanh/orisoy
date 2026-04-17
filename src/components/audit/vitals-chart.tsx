"use client";

import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Vitals {
  lcp: number;
  inp: number;
  cls: number;
}

interface HistoryEntry {
  date: string;
  lcp: number;
  inp: number;
  cls: number;
}

interface VitalsChartProps {
  vitals: Vitals;
  history: HistoryEntry[];
}

function getLcpRating(value: number): { label: string; color: string; bg: string } {
  if (value <= 2.5) return { label: "Good", color: "text-green-700", bg: "bg-green-100" };
  if (value <= 4) return { label: "Needs Improvement", color: "text-yellow-700", bg: "bg-yellow-100" };
  return { label: "Poor", color: "text-red-700", bg: "bg-red-100" };
}

function getInpRating(value: number): { label: string; color: string; bg: string } {
  if (value <= 200) return { label: "Good", color: "text-green-700", bg: "bg-green-100" };
  if (value <= 500) return { label: "Needs Improvement", color: "text-yellow-700", bg: "bg-yellow-100" };
  return { label: "Poor", color: "text-red-700", bg: "bg-red-100" };
}

function getClsRating(value: number): { label: string; color: string; bg: string } {
  if (value <= 0.1) return { label: "Good", color: "text-green-700", bg: "bg-green-100" };
  if (value <= 0.25) return { label: "Needs Improvement", color: "text-yellow-700", bg: "bg-yellow-100" };
  return { label: "Poor", color: "text-red-700", bg: "bg-red-100" };
}

function MetricCard({
  label,
  value,
  unit,
  rating,
}: {
  label: string;
  value: number;
  unit: string;
  rating: { label: string; color: string; bg: string };
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500">{label}</span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs font-medium",
            rating.bg,
            rating.color
          )}
        >
          {rating.label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold", rating.color)}>
          {value}
        </span>
        <span className="text-xs text-zinc-400">{unit}</span>
      </div>
    </div>
  );
}

export function VitalsChart({ vitals, history }: VitalsChartProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-zinc-700">
          Core Web Vitals
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="LCP"
          value={vitals.lcp}
          unit="s"
          rating={getLcpRating(vitals.lcp)}
        />
        <MetricCard
          label="INP"
          value={vitals.inp}
          unit="ms"
          rating={getInpRating(vitals.inp)}
        />
        <MetricCard
          label="CLS"
          value={vitals.cls}
          unit=""
          rating={getClsRating(vitals.cls)}
        />
      </div>

      {history.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h4 className="mb-3 text-xs font-medium text-zinc-500">
            History
          </h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#71717a" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e4e4e7",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="lcp"
                name="LCP (s)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="inp"
                name="INP (ms)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="cls"
                name="CLS"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
