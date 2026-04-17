"use client";

import { cn, getScoreColor } from "@/lib/utils";

interface SEOHealthGaugeProps {
  score: number;
  label?: string;
}

export function SEOHealthGauge({ score, label }: SEOHealthGaugeProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  const strokeColor =
    score >= 80
      ? "#22c55e"
      : score >= 60
        ? "#eab308"
        : score >= 40
          ? "#f97316"
          : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg width="160" height="160" className="-rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#e4e4e7"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease",
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-4xl font-bold", getScoreColor(score))}>
            {clampedScore}
          </span>
        </div>
      </div>
      {label && (
        <span className="mt-2 text-sm text-zinc-500">{label}</span>
      )}
    </div>
  );
}
