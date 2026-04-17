import { GitCompareArrows } from "lucide-react";

export default function BacklinkGapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GitCompareArrows className="h-6 w-6" />
          Backlink Gap
        </h1>
        <p className="text-zinc-500 mt-1">
          Find link building opportunities from competitors
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <GitCompareArrows className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Backlink gap analysis coming soon. Compare your backlink profile
          against competitors to find untapped link opportunities.
        </p>
      </div>
    </div>
  );
}
