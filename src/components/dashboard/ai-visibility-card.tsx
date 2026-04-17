"use client";

import { cn, formatNumber } from "@/lib/utils";
import { Brain, ArrowUp, ArrowDown, Bot, Search, Sparkles, MessageSquare } from "lucide-react";

interface AIPlatform {
  name: string;
  citations: number;
  trend: number;
}

interface AIVisibilityCardProps {
  platforms: AIPlatform[];
  total: number;
}

const platformConfig: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  ChatGPT: { icon: MessageSquare, color: "text-green-600" },
  Perplexity: { icon: Search, color: "text-blue-600" },
  "Google AIO": { icon: Sparkles, color: "text-yellow-600" },
  Gemini: { icon: Bot, color: "text-purple-600" },
};

export function AIVisibilityCard({ platforms, total }: AIVisibilityCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700">AI Visibility</h3>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
          <Brain className="h-4 w-4 text-orange-600" />
        </div>
      </div>

      <div className="mt-3">
        <span className="text-3xl font-bold text-zinc-900">
          {formatNumber(total)}
        </span>
        <span className="ml-1.5 text-sm text-zinc-500">total citations</span>
      </div>

      <div className="mt-4 space-y-3">
        {platforms.map((platform) => {
          const config = platformConfig[platform.name] ?? {
            icon: Brain,
            color: "text-zinc-600",
          };
          const PlatformIcon = config.icon;
          return (
            <div
              key={platform.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <PlatformIcon className={cn("h-4 w-4", config.color)} />
                <span className="text-sm text-zinc-700">{platform.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-900">
                  {formatNumber(platform.citations)}
                </span>
                <div className="flex items-center gap-0.5">
                  {platform.trend >= 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      platform.trend >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {Math.abs(platform.trend)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
