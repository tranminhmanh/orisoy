"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Play, Zap, Clock, Webhook } from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  description: string;
  lastRun?: Date;
  isActive: boolean;
  triggerType: string;
}

interface WorkflowCardProps {
  workflow: Workflow;
  onToggle: () => void;
  onRun: () => void;
}

const triggerIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  manual: Play,
  scheduled: Clock,
  event: Zap,
  webhook: Webhook,
};

const triggerColors: Record<string, string> = {
  manual: "bg-zinc-50 text-zinc-600 border-zinc-200",
  scheduled: "bg-purple-50 text-purple-700 border-purple-200",
  event: "bg-yellow-50 text-yellow-700 border-yellow-200",
  webhook: "bg-blue-50 text-blue-700 border-blue-200",
};

export function WorkflowCard({ workflow, onToggle, onRun }: WorkflowCardProps) {
  const TriggerIcon = triggerIcons[workflow.triggerType] ?? Zap;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-zinc-900">
            {workflow.name}
          </h3>
          <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
            {workflow.description}
          </p>
        </div>

        <button
          onClick={onToggle}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors",
            workflow.isActive ? "bg-blue-600" : "bg-zinc-300"
          )}
          role="switch"
          aria-checked={workflow.isActive}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
              workflow.isActive ? "translate-x-4" : "translate-x-0.5",
              "mt-0.5"
            )}
          />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div
          className={cn(
            "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
            triggerColors[workflow.triggerType] ?? triggerColors.manual
          )}
        >
          <TriggerIcon className="h-3 w-3" />
          <span className="capitalize">{workflow.triggerType}</span>
        </div>
        {workflow.lastRun && (
          <span className="text-xs text-zinc-400">
            Last run: {format(new Date(workflow.lastRun), "MMM d, HH:mm")}
          </span>
        )}
      </div>

      <button
        onClick={onRun}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
      >
        <Play className="h-3.5 w-3.5" />
        Run Now
      </button>
    </div>
  );
}
