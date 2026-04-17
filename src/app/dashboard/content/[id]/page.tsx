import { FileEdit } from "lucide-react";

export default function ContentEditorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileEdit className="h-6 w-6" />
          Content Editor
        </h1>
        <p className="text-zinc-500 mt-1">
          Rich text editor with dual SEO+GEO scoring
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <FileEdit className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Content editor coming soon. Write and optimize content with real-time
          SEO and GEO scoring side by side.
        </p>
      </div>
    </div>
  );
}
