import { LinkIcon } from "lucide-react";

export default function BacklinkProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LinkIcon className="h-6 w-6" />
          Backlink Profile
        </h1>
        <p className="text-zinc-500 mt-1">
          Analyze your backlink portfolio
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <LinkIcon className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Backlink analysis coming soon. Get a complete overview of your
          backlink portfolio with authority metrics.
        </p>
      </div>
    </div>
  );
}
