"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface IndexRequest {
  id: string;
  url: string;
  method: string;
  status: string;
  submittedAt: Date;
  crawledAt?: Date;
  indexedAt?: Date;
}

interface IndexStatusTableProps {
  requests: IndexRequest[];
}

const steps = ["pending", "submitted", "crawled", "indexed"] as const;

const methodColors: Record<string, string> = {
  URL_UPDATED: "bg-blue-50 text-blue-700 border-blue-200",
  URL_DELETED: "bg-red-50 text-red-700 border-red-200",
  SITEMAP: "bg-purple-50 text-purple-700 border-purple-200",
};

const statusDotColors: Record<string, string> = {
  pending: "bg-zinc-400",
  submitted: "bg-blue-500",
  crawled: "bg-yellow-500",
  indexed: "bg-green-500",
  error: "bg-red-500",
};

function StepIndicator({ current }: { current: string }) {
  const currentIdx = steps.indexOf(current as (typeof steps)[number]);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const isActive = i <= currentIdx && currentIdx >= 0;
        const isCurrent = step === current;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium",
                isCurrent
                  ? "bg-blue-600 text-white"
                  : isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-zinc-100 text-zinc-400"
              )}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-3",
                  isActive && i < currentIdx ? "bg-blue-400" : "bg-zinc-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function formatDate(date?: Date) {
  if (!date) return <span className="text-zinc-300">&mdash;</span>;
  return (
    <span className="text-xs text-zinc-600">
      {format(new Date(date), "MMM d, HH:mm")}
    </span>
  );
}

export function IndexStatusTable({ requests }: IndexStatusTableProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-zinc-700">
          Index Status
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 text-xs text-zinc-500">
              <th className="px-4 py-2.5 font-medium">URL</th>
              <th className="px-4 py-2.5 font-medium">Method</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Progress</th>
              <th className="px-4 py-2.5 font-medium">Submitted</th>
              <th className="px-4 py-2.5 font-medium">Crawled</th>
              <th className="px-4 py-2.5 font-medium">Indexed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="max-w-[240px] truncate block text-sm text-zinc-800">
                    {req.url}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-block rounded-full border px-2 py-0.5 text-xs font-medium",
                      methodColors[req.method] ?? "bg-zinc-50 text-zinc-600 border-zinc-200"
                    )}
                  >
                    {req.method}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        statusDotColors[req.status] ?? "bg-zinc-400"
                      )}
                    />
                    <span className="text-xs font-medium capitalize text-zinc-700">
                      {req.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StepIndicator current={req.status} />
                </td>
                <td className="px-4 py-3">
                  {formatDate(req.submittedAt)}
                </td>
                <td className="px-4 py-3">
                  {formatDate(req.crawledAt)}
                </td>
                <td className="px-4 py-3">
                  {formatDate(req.indexedAt)}
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-zinc-400"
                >
                  No index requests
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
