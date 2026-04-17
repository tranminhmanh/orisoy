import { Mail } from "lucide-react";

export default function AIOutreachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="h-6 w-6" />
          AI Outreach
        </h1>
        <p className="text-zinc-500 mt-1">
          AI-powered email outreach campaign composer
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Mail className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          AI outreach coming soon. Compose personalized link building outreach
          emails powered by AI.
        </p>
      </div>
    </div>
  );
}
