import { Bot } from "lucide-react";

export default function GEOSimulationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6" />
          GEO Simulation
        </h1>
        <p className="text-zinc-500 mt-1">
          Simulate how AI engines respond to your queries
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Bot className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          GEO simulation coming soon. Preview how ChatGPT, Gemini, Perplexity,
          and other AI engines respond to queries about your content.
        </p>
      </div>
    </div>
  );
}
