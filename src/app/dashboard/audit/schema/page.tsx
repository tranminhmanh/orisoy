import { Braces } from "lucide-react";

export default function SchemaMarkupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Braces className="h-6 w-6" />
          Schema Markup
        </h1>
        <p className="text-zinc-500 mt-1">
          JSON-LD structured data generator and validator
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Braces className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Schema markup tools coming soon. Generate and validate JSON-LD
          structured data for rich search results.
        </p>
      </div>
    </div>
  );
}
