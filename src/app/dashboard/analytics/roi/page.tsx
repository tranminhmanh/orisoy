import { DollarSign } from "lucide-react";

export default function SEOROIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          SEO ROI
        </h1>
        <p className="text-zinc-500 mt-1">
          Traffic value estimation and attribution analysis
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <DollarSign className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          SEO ROI analysis coming soon. Calculate the monetary value of your
          organic traffic and attribute revenue to SEO efforts.
        </p>
      </div>
    </div>
  );
}
