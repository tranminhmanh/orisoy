import { Activity } from "lucide-react";

export default function CoreWebVitalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6" />
          Core Web Vitals
        </h1>
        <p className="text-zinc-500 mt-1">
          LCP, INP, CLS monitoring and optimization
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Activity className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Core Web Vitals monitoring coming soon. Track LCP, INP, and CLS
          metrics with actionable optimization recommendations.
        </p>
      </div>
    </div>
  );
}
