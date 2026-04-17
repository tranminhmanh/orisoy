import { Swords } from "lucide-react";

export default function CompetitorIntelligencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Swords className="h-6 w-6" />
          Competitor Intelligence
        </h1>
        <p className="text-zinc-500 mt-1">
          Analyze competitor keyword strategies
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Swords className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Competitor analysis coming soon. Uncover the keywords your competitors
          rank for and find content gaps.
        </p>
      </div>
    </div>
  );
}
