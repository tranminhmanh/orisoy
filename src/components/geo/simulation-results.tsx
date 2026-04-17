"use client";

import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Check,
  X,
  ExternalLink,
  Bot,
  Search,
  Sparkles,
  Globe,
} from "lucide-react";

interface SimulationResult {
  platform: string;
  response: string;
  isCited: boolean;
  citationType: string;
  citedUrl?: string;
}

interface SimulationResultsProps {
  results: SimulationResult[];
}

const platformIcons: Record<string, typeof Bot> = {
  ChatGPT: MessageSquare,
  Perplexity: Search,
  Gemini: Sparkles,
  "Google AIO": Globe,
};

const citationTypeConfig: Record<string, { bg: string; text: string }> = {
  direct: { bg: "bg-green-100", text: "text-green-700" },
  indirect: { bg: "bg-blue-100", text: "text-blue-700" },
  paraphrase: { bg: "bg-purple-100", text: "text-purple-700" },
  none: { bg: "bg-zinc-100", text: "text-zinc-500" },
};

export function SimulationResults({ results }: SimulationResultsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {results.map((result, i) => {
        const Icon = platformIcons[result.platform] || Bot;
        const ctConfig = citationTypeConfig[result.citationType] || citationTypeConfig.none;
        const truncatedResponse =
          result.response.length > 200
            ? result.response.slice(0, 200) + "..."
            : result.response;

        return (
          <div
            key={i}
            className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-zinc-600" />
              <h4 className="text-sm font-semibold text-zinc-900">
                {result.platform}
              </h4>
              <div className="ml-auto">
                {result.isCited ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    <Check className="h-3 w-3" />
                    Cited
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    <X className="h-3 w-3" />
                    Not Cited
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed">
              {truncatedResponse}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                  ctConfig.bg,
                  ctConfig.text
                )}
              >
                {result.citationType}
              </span>

              {result.citedUrl && (
                <a
                  href={result.citedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {result.citedUrl}
                </a>
              )}
            </div>
          </div>
        );
      })}
      {results.length === 0 && (
        <div className="col-span-2 py-8 text-center text-sm text-zinc-400">
          No simulation results
        </div>
      )}
    </div>
  );
}
