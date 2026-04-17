import { Send } from "lucide-react";

export default function PublishingQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Send className="h-6 w-6" />
          Publishing Queue
        </h1>
        <p className="text-zinc-500 mt-1">
          Manage content publishing schedule and job queue
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Send className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Publishing queue coming soon. Schedule and manage content publishing
          across all connected platforms.
        </p>
      </div>
    </div>
  );
}
