"use client";

import { cn } from "@/lib/utils";
import { Link2, AlertTriangle, ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface Page {
  url: string;
  incomingLinks: number;
  outgoingLinks: number;
  isOrphan: boolean;
}

interface InternalLinkMapProps {
  pages: Page[];
}

export function InternalLinkMap({ pages }: InternalLinkMapProps) {
  const totalPages = pages.length;
  const orphanCount = pages.filter((p) => p.isOrphan).length;
  const avgIncoming =
    totalPages > 0
      ? (pages.reduce((sum, p) => sum + p.incomingLinks, 0) / totalPages).toFixed(1)
      : "0";
  const avgOutgoing =
    totalPages > 0
      ? (pages.reduce((sum, p) => sum + p.outgoingLinks, 0) / totalPages).toFixed(1)
      : "0";

  const stats = [
    {
      label: "Total Pages",
      value: totalPages,
      icon: Link2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg Incoming",
      value: avgIncoming,
      icon: ArrowDownLeft,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Avg Outgoing",
      value: avgOutgoing,
      icon: ArrowUpRight,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Orphan Pages",
      value: orphanCount,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border border-zinc-200 p-3",
              s.bg
            )}
          >
            <s.icon className={cn("h-4 w-4", s.color)} />
            <span className={cn("text-xl font-bold", s.color)}>{s.value}</span>
            <span className="text-xs text-zinc-500">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                URL
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Incoming
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Outgoing
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-zinc-100",
                  page.isOrphan ? "bg-red-50" : "hover:bg-zinc-50"
                )}
              >
                <td className="px-4 py-3 font-medium text-zinc-900 truncate max-w-xs">
                  {page.url}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-zinc-600">
                    <ArrowDownLeft className="h-3 w-3 text-green-500" />
                    {page.incomingLinks}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-zinc-600">
                    <ArrowUpRight className="h-3 w-3 text-purple-500" />
                    {page.outgoingLinks}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {page.isOrphan ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <AlertTriangle className="h-3 w-3" />
                      Orphan
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Linked
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {pages.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-zinc-400"
                >
                  No pages found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
