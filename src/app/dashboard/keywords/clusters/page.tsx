import { Network } from "lucide-react";

export default function KeywordClustersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Network className="h-6 w-6" />
          Keyword Clusters
        </h1>
        <p className="text-zinc-500 mt-1">
          SERP-based keyword grouping and topical mapping
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Network className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Keyword clustering coming soon. Group keywords by SERP overlap and
          build topical authority maps.
        </p>
      </div>
    </div>
  );
}
