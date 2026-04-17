import { AtSign } from "lucide-react";

export default function BrandMentionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <AtSign className="h-6 w-6" />
          Brand Mentions
        </h1>
        <p className="text-zinc-500 mt-1">
          Monitor brand mentions across web and AI platforms
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <AtSign className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Brand mention monitoring coming soon. Track where your brand is
          mentioned across the web and AI search platforms.
        </p>
      </div>
    </div>
  );
}
