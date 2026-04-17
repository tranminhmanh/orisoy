import { Link2 } from "lucide-react";

export default function InternalLinksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Link2 className="h-6 w-6" />
          Internal Links
        </h1>
        <p className="text-zinc-500 mt-1">
          Semantic internal linking analysis and suggestions
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Link2 className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Internal linking tools coming soon. Analyze your site structure and
          get AI-powered internal link suggestions.
        </p>
      </div>
    </div>
  );
}
