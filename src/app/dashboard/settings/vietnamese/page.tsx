import { Languages } from "lucide-react";

export default function VietnameseNLPPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Languages className="h-6 w-6" />
          Vietnamese NLP
        </h1>
        <p className="text-zinc-500 mt-1">
          Word segmentation, diacritics, dialect mapping settings
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Languages className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Vietnamese NLP settings coming soon. Configure word segmentation,
          diacritics restoration, and regional dialect mapping.
        </p>
      </div>
    </div>
  );
}
