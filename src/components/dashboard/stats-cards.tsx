"use client";

import { cn, formatNumber } from "@/lib/utils";
import { TrendingUp, BarChart3, Shield, Brain, ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardsProps {
  traffic: { value: number; change: number };
  rankings: { up: number; down: number; stable: number };
  healthScore: number;
  aiVisibility: { citations: number; change: number };
}

export function StatsCards({
  traffic,
  rankings,
  healthScore,
  aiVisibility,
}: StatsCardsProps) {
  const cards = [
    {
      label: "Organic Traffic",
      value: formatNumber(traffic.value),
      change: traffic.change,
      icon: TrendingUp,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Keyword Rankings",
      value: `${rankings.up + rankings.down + rankings.stable}`,
      change: rankings.up - rankings.down,
      subtitle: (
        <span className="text-xs text-zinc-500">
          <span className="text-green-600">{rankings.up} up</span>
          {" / "}
          <span className="text-red-600">{rankings.down} down</span>
          {" / "}
          <span className="text-zinc-400">{rankings.stable} stable</span>
        </span>
      ),
      icon: BarChart3,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Health Score",
      value: `${healthScore}`,
      change: null,
      icon: Shield,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "AI Visibility",
      value: formatNumber(aiVisibility.citations),
      change: aiVisibility.change,
      icon: Brain,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-lg border border-zinc-200 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">
                {card.label}
              </span>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  card.iconBg
                )}
              >
                <Icon className={cn("h-4 w-4", card.iconColor)} />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-zinc-900">
                {card.value}
              </span>
            </div>
            {"subtitle" in card && card.subtitle ? (
              <div className="mt-1">{card.subtitle}</div>
            ) : card.change !== null ? (
              <div className="mt-1 flex items-center gap-1">
                {card.change >= 0 ? (
                  <ArrowUp className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5 text-red-600" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    card.change >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {Math.abs(card.change)}%
                </span>
              </div>
            ) : (
              <div className="mt-1">
                <span
                  className={cn(
                    "text-xs font-medium",
                    healthScore >= 80
                      ? "text-green-600"
                      : healthScore >= 60
                        ? "text-yellow-600"
                        : "text-red-600"
                  )}
                >
                  {healthScore >= 80
                    ? "Good"
                    : healthScore >= 60
                      ? "Fair"
                      : "Needs work"}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
