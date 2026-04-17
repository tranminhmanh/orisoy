"use client";

import { cn } from "@/lib/utils";

const intentColors: Record<string, string> = {
  informational: "bg-blue-100 text-blue-700",
  navigational: "bg-purple-100 text-purple-700",
  commercial: "bg-orange-100 text-orange-700",
  transactional: "bg-green-100 text-green-700",
  local: "bg-red-100 text-red-700",
  generative: "bg-cyan-100 text-cyan-700",
};

interface IntentBadgeProps {
  intent: string;
  size?: "sm" | "md";
}

export function IntentBadge({ intent, size = "sm" }: IntentBadgeProps) {
  const colors = intentColors[intent] || "bg-zinc-100 text-zinc-700";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium capitalize",
        colors,
        size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      )}
    >
      {intent}
    </span>
  );
}
