"use client";

import { cn, formatNumber } from "@/lib/utils";
import { DollarSign, TrendingUp, MousePointerClick, BadgeCent } from "lucide-react";

interface ROISummaryProps {
  trafficValue: number;
  adEquivalent: number;
  organicClicks: number;
  avgCpc: number;
}

function formatVND(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B VND`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M VND`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K VND`;
  return `${value} VND`;
}

export function ROISummary({
  trafficValue,
  adEquivalent,
  organicClicks,
  avgCpc,
}: ROISummaryProps) {
  const metrics = [
    {
      label: "Traffic Value",
      value: formatVND(trafficValue),
      icon: DollarSign,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Ad Equivalent",
      value: formatVND(adEquivalent),
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Organic Clicks",
      value: formatNumber(organicClicks),
      icon: MousePointerClick,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Avg CPC",
      value: formatVND(avgCpc),
      icon: BadgeCent,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="h-4 w-4 text-zinc-500" />
        <h3 className="text-sm font-semibold text-zinc-700">ROI Summary</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-md",
                    metric.iconBg
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5", metric.iconColor)} />
                </div>
                <span className="text-xs text-zinc-500">{metric.label}</span>
              </div>
              <p className="text-lg font-bold text-zinc-900">{metric.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
