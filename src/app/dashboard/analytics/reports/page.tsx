import { FileBarChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileBarChart className="h-6 w-6" />
          Reports
        </h1>
        <p className="text-zinc-500 mt-1">
          Automated weekly, monthly, quarterly SEO reports
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <FileBarChart className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Automated reports coming soon. Generate branded SEO reports on a
          weekly, monthly, or quarterly schedule.
        </p>
      </div>
    </div>
  );
}
