import { Zap } from "lucide-react";

export default function IndexingAcceleratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6" />
          Indexing Accelerator
        </h1>
        <p className="text-zinc-500 mt-1">
          Submit URLs for Google indexing via API, GSC, IndexNow
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Zap className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Indexing accelerator coming soon. Fast-track your pages into Google's
          index using the Indexing API, Search Console, and IndexNow.
        </p>
      </div>
    </div>
  );
}
