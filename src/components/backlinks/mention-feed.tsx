"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Globe, MessageSquare, Bot, Link2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Mention {
  id: string;
  sourceUrl: string;
  platform: "web" | "social" | "ai";
  snippet: string;
  hasLink: boolean;
  sentiment: "positive" | "neutral" | "negative";
  discoveredAt: string;
}

interface MentionFeedProps {
  mentions: Mention[];
}

type PlatformFilter = "all" | "web" | "social" | "ai";
type SentimentFilter = "all" | "positive" | "neutral" | "negative";

const platformConfig = {
  web: { icon: Globe, bg: "bg-blue-100", text: "text-blue-700", label: "Web" },
  social: { icon: MessageSquare, bg: "bg-purple-100", text: "text-purple-700", label: "Social" },
  ai: { icon: Bot, bg: "bg-emerald-100", text: "text-emerald-700", label: "AI" },
};

const sentimentConfig = {
  positive: { bg: "bg-green-100", text: "text-green-700" },
  neutral: { bg: "bg-zinc-100", text: "text-zinc-700" },
  negative: { bg: "bg-red-100", text: "text-red-700" },
};

export function MentionFeed({ mentions }: MentionFeedProps) {
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");

  const filtered = mentions.filter((m) => {
    if (platformFilter !== "all" && m.platform !== platformFilter) return false;
    if (sentimentFilter !== "all" && m.sentiment !== sentimentFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="mr-2 text-xs font-medium text-zinc-500">
            Platform
          </label>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as PlatformFilter)}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="web">Web</option>
            <option value="social">Social</option>
            <option value="ai">AI</option>
          </select>
        </div>

        <div>
          <label className="mr-2 text-xs font-medium text-zinc-500">
            Sentiment
          </label>
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value as SentimentFilter)}
            className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        <span className="ml-auto text-xs text-zinc-400">
          {filtered.length} mention{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">
        {filtered.map((mention) => {
          const platCfg = platformConfig[mention.platform];
          const sentCfg = sentimentConfig[mention.sentiment];
          const PlatIcon = platCfg.icon;

          return (
            <div
              key={mention.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2 hover:shadow-sm transition-shadow"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                    platCfg.bg,
                    platCfg.text
                  )}
                >
                  <PlatIcon className="h-3 w-3" />
                  {platCfg.label}
                </span>

                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                    sentCfg.bg,
                    sentCfg.text
                  )}
                >
                  {mention.sentiment}
                </span>

                {mention.hasLink ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    <Link2 className="h-3 w-3" />
                    Linked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                    No Link
                  </span>
                )}

                <span className="ml-auto text-xs text-zinc-400">
                  {formatDistanceToNow(new Date(mention.discoveredAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <p className="text-sm text-zinc-700">{mention.snippet}</p>

              <a
                href={mention.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                {mention.sourceUrl}
              </a>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-400">
            No mentions found
          </p>
        )}
      </div>
    </div>
  );
}
