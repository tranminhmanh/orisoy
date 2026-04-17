import { Search } from "lucide-react";

export default function KeywordResearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Search className="h-6 w-6" />
          Keyword Research
        </h1>
        <p className="text-zinc-500 mt-1">
          Discovery and analysis of keywords from 7 sources
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Search className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Keyword research tools coming soon. You will be able to discover
          keywords from Google, Coc Coc, YouTube, Amazon, and more.
        </p>
      </div>
    </div>
  );
}
