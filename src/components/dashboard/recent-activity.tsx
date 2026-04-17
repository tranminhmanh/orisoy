"use client";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { FileText, TrendingUp, Shield, Link, Brain } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
}

interface RecentActivityProps {
  activities: Activity[];
}

const typeConfig: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  content_published: {
    icon: FileText,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  rank_change: {
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  audit_complete: {
    icon: Shield,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  backlink_found: {
    icon: Link,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  ai_citation: {
    icon: Brain,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
};

const defaultConfig = {
  icon: FileText,
  color: "text-zinc-600",
  bg: "bg-zinc-50",
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700">
        Recent Activity
      </h3>

      <div className="relative">
        <div className="absolute left-[15px] top-0 h-full w-px bg-zinc-100" />

        <div className="space-y-4">
          {activities.map((activity, idx) => {
            const config = typeConfig[activity.type] ?? defaultConfig;
            const ActivityIcon = config.icon;
            const isLast = idx === activities.length - 1;

            return (
              <div key={activity.id} className="relative flex gap-3">
                <div
                  className={cn(
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    config.bg
                  )}
                >
                  <ActivityIcon className={cn("h-3.5 w-3.5", config.color)} />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-zinc-700">
                    {activity.description}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          {activities.length === 0 && (
            <p className="py-4 text-center text-sm text-zinc-400">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
