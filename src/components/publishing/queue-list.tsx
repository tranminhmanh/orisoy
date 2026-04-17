"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { X, RotateCw, Clock, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface QueueJob {
  id: string;
  articleTitle: string;
  platform: string;
  scheduledAt: Date;
  status: string;
  error?: string;
}

interface QueueListProps {
  jobs: QueueJob[];
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pending: {
    label: "Pending",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    icon: Loader2,
  },
  published: {
    label: "Published",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
};

export function QueueList({ jobs, onCancel, onRetry }: QueueListProps) {
  const counts = {
    pending: jobs.filter((j) => j.status === "pending").length,
    processing: jobs.filter((j) => j.status === "processing").length,
    published: jobs.filter((j) => j.status === "published").length,
    failed: jobs.filter((j) => j.status === "failed").length,
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 p-4">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">
          Publishing Queue
        </h3>
        <div className="flex gap-3">
          {(
            [
              { key: "pending", label: "Pending", color: "bg-blue-100 text-blue-700" },
              { key: "processing", label: "Processing", color: "bg-yellow-100 text-yellow-700" },
              { key: "published", label: "Published", color: "bg-green-100 text-green-700" },
              { key: "failed", label: "Failed", color: "bg-red-100 text-red-700" },
            ] as const
          ).map((s) => (
            <div
              key={s.key}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                s.color
              )}
            >
              <span>{counts[s.key]}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-zinc-50">
        {jobs.length === 0 && (
          <div className="p-6 text-center text-sm text-zinc-400">
            No jobs in the queue
          </div>
        )}
        {jobs.map((job) => {
          const config = statusConfig[job.status] ?? statusConfig.pending;
          const StatusIcon = config.icon;
          return (
            <div
              key={job.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <StatusIcon
                  className={cn(
                    "h-4 w-4",
                    config.color,
                    job.status === "processing" && "animate-spin"
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-zinc-800">
                    {job.articleTitle}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {job.platform}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {format(new Date(job.scheduledAt), "MMM d, HH:mm")}
                    </span>
                  </div>
                  {job.error && (
                    <p className="mt-1 text-xs text-red-500">{job.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    config.bg,
                    config.color
                  )}
                >
                  {config.label}
                </span>
                {job.status === "pending" && (
                  <button
                    onClick={() => onCancel(job.id)}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                    title="Cancel"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                {job.status === "failed" && (
                  <button
                    onClick={() => onRetry(job.id)}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                    title="Retry"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
