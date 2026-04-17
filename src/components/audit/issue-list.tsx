"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

interface Issue {
  id: string;
  severity: "critical" | "warning" | "info";
  category: string;
  title: string;
  description: string;
  affectedUrls: string[];
  fix: string;
  isResolved: boolean;
}

interface IssueListProps {
  issues: Issue[];
}

type FilterTab = "all" | "critical" | "warning" | "info";

const severityConfig = {
  critical: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    label: "Critical",
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    label: "Warning",
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "Info",
  },
};

function IssueCard({ issue }: { issue: Issue }) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[issue.severity];

  return (
    <div
      className={cn(
        "rounded-lg border bg-white transition-shadow hover:shadow-sm",
        issue.isResolved ? "border-green-200 opacity-60" : "border-zinc-200"
      )}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <div className="mt-0.5">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                config.bg,
                config.text
              )}
            >
              {config.label}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
              {issue.category}
            </span>
            {issue.isResolved && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                Resolved
              </span>
            )}
          </div>
          <h4 className="text-sm font-medium text-zinc-900">{issue.title}</h4>
          <p className="text-xs text-zinc-500">{issue.description}</p>
          <span className="text-xs text-zinc-400">
            {issue.affectedUrls.length} affected URL
            {issue.affectedUrls.length !== 1 ? "s" : ""}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-zinc-100 px-4 py-3 space-y-3">
          <div>
            <h5 className="text-xs font-medium text-zinc-500 mb-1">
              How to Fix
            </h5>
            <p className="text-sm text-zinc-700">{issue.fix}</p>
          </div>
          {issue.affectedUrls.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-zinc-500 mb-1">
                Affected URLs
              </h5>
              <ul className="space-y-1">
                {issue.affectedUrls.map((url, i) => (
                  <li key={i} className="flex items-center gap-1 text-xs text-blue-600">
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{url}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function IssueList({ issues }: IssueListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered =
    activeTab === "all"
      ? issues
      : issues.filter((i) => i.severity === activeTab);

  const counts = {
    all: issues.length,
    critical: issues.filter((i) => i.severity === "critical").length,
    warning: issues.filter((i) => i.severity === "warning").length,
    info: issues.filter((i) => i.severity === "info").length,
  };

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "critical", label: "Critical" },
    { key: "warning", label: "Warning" },
    { key: "info", label: "Info" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === tab.key
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-400">
            No issues found
          </p>
        )}
      </div>
    </div>
  );
}
