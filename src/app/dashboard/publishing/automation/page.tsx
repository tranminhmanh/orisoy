import { Workflow } from "lucide-react";

export default function AutomationWorkflowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Workflow className="h-6 w-6" />
          Automation Workflows
        </h1>
        <p className="text-zinc-500 mt-1">
          n8n workflow management and triggers
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Workflow className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Automation workflows coming soon. Create and manage n8n workflows to
          automate your SEO processes.
        </p>
      </div>
    </div>
  );
}
