import { Eye } from "lucide-react";

export default function AIVisibilityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Eye className="h-6 w-6" />
          AI Visibility
        </h1>
        <p className="text-zinc-500 mt-1">
          Track your brand visibility across AI search platforms
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Eye className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          AI visibility tracking coming soon. Monitor how often and where your
          brand appears in AI-generated search results.
        </p>
      </div>
    </div>
  );
}
