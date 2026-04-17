import { TrendingUp } from "lucide-react";

export default function RankTrackerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          Rank Tracker
        </h1>
        <p className="text-zinc-500 mt-1">
          Daily keyword position tracking on Google and Coc Coc
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <TrendingUp className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Rank tracking coming soon. Monitor your daily keyword positions on
          Google and Coc Coc with historical trends.
        </p>
      </div>
    </div>
  );
}
