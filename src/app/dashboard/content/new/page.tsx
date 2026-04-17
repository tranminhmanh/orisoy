import { FilePlus } from "lucide-react";

export default function CreateContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FilePlus className="h-6 w-6" />
          Create Content
        </h1>
        <p className="text-zinc-500 mt-1">
          AI-powered content brief and article generator
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <FilePlus className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Content creation coming soon. Generate SEO-optimized content briefs
          and full articles powered by AI.
        </p>
      </div>
    </div>
  );
}
