"use client";

import { Check, X } from "lucide-react";

interface NlpEntityChecklistProps {
  entities: Array<{ name: string; found: boolean }>;
}

export function NlpEntityChecklist({ entities }: NlpEntityChecklistProps) {
  const foundCount = entities.filter((e) => e.found).length;
  const pct = entities.length > 0 ? (foundCount / entities.length) * 100 : 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700">NLP Entities</h3>
        <span className="text-sm font-medium text-zinc-500">{foundCount}/{entities.length} covered</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-200">
        <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {entities.map((e, i) => (
          <div key={i} className="flex items-center gap-1.5 text-sm">
            {e.found ? <Check className="h-3.5 w-3.5 text-green-500" /> : <X className="h-3.5 w-3.5 text-red-400" />}
            <span className={e.found ? "text-zinc-700" : "text-zinc-400"}>{e.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
