"use client";

import { cn, getScoreColor } from "@/lib/utils";

interface ArticleCard {
  id: string;
  title: string;
  status: string;
  seoScore: number;
  geoScore: number;
  targetKeyword?: string;
  updatedAt: string;
}

interface ContentKanbanProps {
  articles: ArticleCard[];
}

const columns = [
  { key: "idea", label: "Idea", color: "border-t-zinc-400" },
  { key: "briefed", label: "Briefed", color: "border-t-blue-400" },
  { key: "writing", label: "Writing", color: "border-t-purple-400" },
  { key: "review", label: "Review", color: "border-t-yellow-400" },
  { key: "published", label: "Published", color: "border-t-green-400" },
  { key: "tracking", label: "Tracking", color: "border-t-cyan-400" },
];

export function ContentKanban({ articles }: ContentKanbanProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col) => {
        const items = articles.filter((a) => a.status === col.key);
        return (
          <div key={col.key} className="min-w-[250px] flex-shrink-0">
            <div className={cn("mb-3 flex items-center justify-between rounded-t-lg border-t-4 bg-zinc-50 px-3 py-2", col.color)}>
              <span className="text-sm font-semibold text-zinc-700">{col.label}</span>
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((a) => (
                <div key={a.id} className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-sm font-medium text-zinc-900 line-clamp-2">{a.title}</h4>
                  {a.targetKeyword && <p className="mt-1 text-xs text-blue-600">{a.targetKeyword}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <span className={cn("text-xs font-medium", getScoreColor(a.seoScore))}>SEO: {a.seoScore}</span>
                    <span className={cn("text-xs font-medium", getScoreColor(a.geoScore))}>GEO: {a.geoScore}</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{new Date(a.updatedAt).toLocaleDateString()}</p>
                </div>
              ))}
              {items.length === 0 && <div className="rounded-lg border border-dashed border-zinc-200 p-4 text-center text-xs text-zinc-400">Empty</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
