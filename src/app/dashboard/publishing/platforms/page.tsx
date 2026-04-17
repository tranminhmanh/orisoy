import { Plug } from "lucide-react";

export default function PlatformConnectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Plug className="h-6 w-6" />
          Platform Connections
        </h1>
        <p className="text-zinc-500 mt-1">
          Connect WordPress, Facebook, Instagram, Twitter
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Plug className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Platform connections coming soon. Link your CMS and social media
          accounts for one-click publishing.
        </p>
      </div>
    </div>
  );
}
