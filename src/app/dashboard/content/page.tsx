import { Kanban } from "lucide-react";

export default function ContentPipelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Kanban className="h-6 w-6" />
          Content Pipeline
        </h1>
        <p className="text-zinc-500 mt-1">
          Kanban board for content management workflow
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Kanban className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Content pipeline coming soon. Manage your content from ideation to
          publication with a drag-and-drop Kanban board.
        </p>
      </div>
    </div>
  );
}
