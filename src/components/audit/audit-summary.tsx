"use client";

import { cn, getScoreColor } from "@/lib/utils";
import { FileSearch, AlertTriangle, AlertCircle, Info } from "lucide-react";

interface AuditSummaryProps {
  healthScore: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  crawledPages: number;
}

function HealthGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "#22c55e"
      : score >= 60
        ? "#eab308"
        : score >= 40
          ? "#f97316"
          : "#ef4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-3xl font-bold", getScoreColor(score))}>
          {score}
        </span>
        <span className="text-xs text-zinc-400">Health</span>
      </div>
    </div>
  );
}

export function AuditSummary({
  healthScore,
  criticalCount,
  warningCount,
  infoCount,
  crawledPages,
}: AuditSummaryProps) {
  const stats = [
    {
      label: "Critical",
      count: criticalCount,
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    {
      label: "Warnings",
      count: warningCount,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200",
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
    },
    {
      label: "Info",
      count: infoCount,
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      icon: Info,
      iconColor: "text-blue-500",
    },
  ];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700">Audit Summary</h3>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <FileSearch className="h-3.5 w-3.5" />
          <span>{crawledPages} pages crawled</span>
        </div>
      </div>

      <div className="flex justify-center">
        <HealthGauge score={healthScore} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border p-3",
              s.bg,
              s.border
            )}
          >
            <s.icon className={cn("h-4 w-4", s.iconColor)} />
            <span className={cn("text-2xl font-bold", s.text)}>{s.count}</span>
            <span className="text-xs text-zinc-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
