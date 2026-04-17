import { ShieldCheck } from "lucide-react";

export default function SiteAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6" />
          Site Audit
        </h1>
        <p className="text-zinc-500 mt-1">
          Technical SEO health check with 200+ checks across 9 categories
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <ShieldCheck className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Site audit coming soon. Run comprehensive technical SEO audits
          covering crawlability, indexability, performance, and more.
        </p>
      </div>
    </div>
  );
}
