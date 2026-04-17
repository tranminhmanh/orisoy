import { ShieldAlert } from "lucide-react";

export default function ToxicLinksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldAlert className="h-6 w-6" />
          Toxic Links
        </h1>
        <p className="text-zinc-500 mt-1">
          Detect harmful backlinks and generate disavow file
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <ShieldAlert className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Toxic link detection coming soon. Identify harmful backlinks and
          generate Google disavow files automatically.
        </p>
      </div>
    </div>
  );
}
