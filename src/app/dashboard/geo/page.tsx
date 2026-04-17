import { Brain } from "lucide-react";

export default function AICitabilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6" />
          AI Citability Score
        </h1>
        <p className="text-zinc-500 mt-1">
          7-dimension citability scoring for AI search engines
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Brain className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          AI citability scoring coming soon. Measure how likely AI engines are
          to cite your content across 7 key dimensions.
        </p>
      </div>
    </div>
  );
}
